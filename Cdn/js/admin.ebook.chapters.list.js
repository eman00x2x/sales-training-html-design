const id = getParams('id');
const title = getParams('title');

let currentPage = 1, search = '', order = '', sortBy = '';

$(document).ready(function () {
    // Get initial data
    getChapterData(sortBy, order);
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1;
    getChapterData(sortBy, order);
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc';
    getChapterData(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc';
    getChapterData(sortBy, order);
});

// SORT BY CHAPTER
$(document).on("click", '.dropdown-chapter', function () {
    $('.dropdown-chapter').addClass('active');
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'chapter';
    getChapterData(sortBy, order);
});

// SORT BY CHAPTER CREATED DATE
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-chapter').removeClass('active');
    $('.dropdown-created-date').addClass('active');
    sortBy = 'created_at';
    getChapterData(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    getChapterData(sortBy, order);
});

$(document).on("click", ".btn-add", function (e) {
    window.location.href = "admin.ebook.chapters.create.html?id=" + id + "&title=" + title;
});

$(document).on("click", ".btn-edit", function () {
    let btn_id = $(this).data('id');
    window.location.href = "admin.ebook.chapters.update.html?ebook_id=" + id + "&ebook_chapter_id=" + btn_id + "&title=" + title;
});

$(document).on('click', '.btn-delete', function (e) {
    let btn_id = $(this).data('id');
    window.location.href = "admin.ebook.chapters.delete.html?ebook_id=" + id + "&ebook_chapter_id=" + btn_id + "&title=" + title;
});

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
    return str.toLowerCase();
}

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
    const filter = search ? data.filter(item =>
        lowerCase(item.chapter).includes(lowerCase(search))
    ) : data;

    return filter;
}

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "created_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "chapter")
                return data.sort((a, b) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((a, b) => a.name.localeCompare(b.name));
        case "desc":
            if (property === "created_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "chapter")
                return data.sort((b, a) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((b, a) => a.name.localeCompare(b.name));
        default:
            return data;
    }
}

function displayActionButton(id) {
    return `<td class='align-middle text-start'>
    <div class="btn-group" role="group" aria-label="Basic outlined example ">
                <button type="button" data-id='${id}' class="btn btn-md btn-edit btn-outline-primary"><i class="bi bi-pencil-square"></i><span class='ms-2 montserrat-regular'>Edit</span></button>
                <button type="button" data-id='${id}' class="btn btn-md btn-delete btn-outline-danger"><i class="bi bi-trash"></i><span class='ms-2 montserrat-regular'>Delete</span></button>
    </div>
    </td>`;
}

function updatePagination(totalPages) {
    let paginationButtons = '';

    if (totalPages > 0) {
        paginationButtons += `
        <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPage === 1 ? 'disabled' : ''}" data-num="${currentPage - 1}"">
            <span class="d-none d-md-block">Previous</span>
            <i class="bi bi-chevron-double-left d-block d-md-none"></i>
        </button>`;

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(startPage + 2, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationButtons += `<button type="button" class="btn-page btn btn-outline-primary ${activeClass}" data-num="${i}"">${i}</button>`;
        }

        paginationButtons += `
        <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPage === totalPages ? 'disabled' : ''}" data-num="${currentPage + 1}">
            <span class="d-none d-md-block">Next</span>
            <i class="bi bi-chevron-double-right d-block d-md-none"></i>
        </button>`;
    } else
        paginationButtons = '';

    $('#page-numbers').html(totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages');
    $('.page-buttons').html(paginationButtons);
}

function getChapterData(sortBy, order) {

    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    var html = "";

    $('.book-title').text(title);

    $.getJSON('../Cdn/js/data/ebooks.chapters.json', function (response) {
        var chapters = response.data.filter(function (item) {
            return item.ebook_id == id;
        });

        if (chapters.length > 0) {
            const sortedData = sortData(isSearchQuery(chapters), order, sortBy);
            const totalItems = sortedData.length;
            const totalPages = Math.ceil(totalItems / limit);
            updatePagination(totalPages);
            const slicedData = sortedData.slice(startIndex, endIndex);
            slicedData.forEach(function (chapter) {
                html += "<tr>";
                html += "<td class='align-middle montserrat-regular'>" + chapter.chapter + "</td>";
                html += "<td class='align-middle truncate-text'style='max-width: 30em' data-sort-key='name'>" + "<p>" + chapter.content + "</p>" + "</td>";
                html += "<td class='align-middle montserrat-regular'>" + convertDate(chapter.created_at) + "</td>";
                html += displayActionButton(chapter.ebook_chapter_id);
                html += "</tr>";
            });
        } else {
            console.log("No chapters found for the book with ID: " + id);
        }
        $(".chapter .data-container").html(html);
    });
}
