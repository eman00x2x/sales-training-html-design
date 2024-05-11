let currentPage = 1, search = '', order = '', sortBy = ''
    filterData = [{ "category": ["selling", "buying", "real-estate", "earning"]}],
    filterBy = [];

    $(document).ready(function () {
        printFilters();
        getEbooksData(sortBy, order);
    });

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    getEbooksData(sortBy, order);
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    getEbooksData(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    getEbooksData(sortBy, order);
});

// SORT BY EBOOK TITLE
$(document).on("click", '.dropdown-title', function () {
    $('.dropdown-category').removeClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    $('.dropdown-title').addClass('active');
    sortBy = 'title'
    getEbooksData(sortBy, order);
});

// SORT BY EBOOK ID
$(document).on("click", '.dropdown-id', function () {
    $('.dropdown-title').removeClass('active');
    $('.dropdown-category').removeClass('active');
    $('.dropdown-created-date').removeClass('active');
    $('.dropdown-id').addClass('active')
    sortBy = 'ebook_id'
    getEbooksData(sortBy, order);
});

// SORT BY EBOOK CREATED DATE
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-title').removeClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-category').removeClass('active');
    $('.dropdown-created-date').addClass('active');
    sortBy = 'created_at'
    getEbooksData(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    getEbooksData(sortBy, order);
});

$(document).on("click", ".btn-add", function () {
    window.location.href = "admin.ebooks.create.html";
});

$(document).on("click", ".btn-view", function () {
    let id = $(this).data('id');
    let title = $(this).data('ebook-title');
    window.location.href = "admin.ebook.chapters.list.html?id=" + id + "&title=" + title;
});

$(document).on("click", ".btn-edit", function () {
    let id = $(this).data('id');
    window.location.href = "admin.ebooks.update.html?id=" + id;
});

$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.ebooks.delete.html?id=" + id;
});

$(document).on('change', '.checklist-filter', function (e) {
    let checkboxes = $(".checklist-filter:checkbox");

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            if (!filterBy.includes(checkboxes[i])) { // Check if value already exists
                filterBy.push(checkboxes[i]);
            }
        }
        else {
            const index = filterBy.indexOf(checkboxes[i]); // Find the index of the value
            if (index > -1) {
                filterBy.splice(index, 1); // Remove the value from the array
            }
        }
    }

    getEbooksData(sortBy, order);
});

function printFilters() {
    let html = '';

    for (const item of filterData) {
        const regex = /[-_]/g;
        const key = Object.keys(item)[0];
        const replacedKey = Object.keys(item)[0].replace(regex, " ");
        const value = item[key];

        html += `<div class="px-3">
                    <span class="form-check-label montserrat-medium py-2 text-uppercase">${replacedKey}</span>`;

        for (const data of value) {
            html += `<div class="form-check ">
                        <input class="checklist-filter form-check-input" name=${key} value="${data}" type="checkbox">
                        <label class="checklist-filter form-check-label" name=${key}>
                            ${data}
                        </label>
                    </div>`
        }
        html += `</div>`;
    }

    $(".filter-list").html(html)
}

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
    return str.toLowerCase();
}

function isSearchQuery(data) {
    const filterBySearch = search ? data.filter(item =>
        lowerCase(item.title).includes(lowerCase(search)) ||
        item.ebook_id == search ||
        lowerCase(item.isbn).includes(lowerCase(search)) ||
        lowerCase(item.author).includes(lowerCase(search))
    ) : data;

    const filter = filterBy.length > 0 ? filterBySearch.filter(item => {
        const { category } = item;

        return filterBy.some(filterItem => lowerCase(category).includes(lowerCase(filterItem.value)));
    }) : filterBySearch;

    return filter;
}

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "ebook_id")
                return data.sort((a, b) => a[property] - b[property])
            else if (property === "created_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "title")
                return data.sort((a, b) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((a, b) => a.name.localeCompare(b.name));
        case "desc":
            if (property === "ebook_id")
                return data.sort((b, a) => a[property] - b[property])
            else if (property === "created_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "title")
                return data.sort((b, a) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((b, a) => a.name.localeCompare(b.name));
        default:
            return data;
    }
}

function displayActionButton(id, title) {
    return `<td class='align-middle text-start'>
    <div class="btn-group" role="group" aria-label="Basic outlined example ">
        <button type="button" data-id='${id}' data-ebook-title="${title}" class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View</span></button>
        <button type="button" data-id='${id}' class="btn btn-md btn-edit btn-outline-primary"><i class="bi bi-pencil-square"></i><span class="ms-2 montserrat-regular">Edit</span></button>
        <button type="button" data-id='${id}' class="btn btn-md btn-delete btn-outline-danger"><i class="bi bi-trash"></i><span class="ms-2 montserrat-regular">Delete</span></button>
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


function getCategoryClass(category) {
    switch (category) {
        case 'buying':
            return 'text-azure';
        case 'selling':
            return 'text-teal';
        case 'real-estate':
            return 'text-warning';
        case 'earning':
            return 'text-pink';
        default:
            return 'text-dark';
    }
}

function getEbooksData() {
    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    let html = '';

    $.getJSON('../Cdn/js/data/ebooks.json', function (response) {
        const ebook = response.data;
        const sortedData = sortData(isSearchQuery(ebook), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);
        for (let i = 0; i < slicedData.length; i++) {
            let data = slicedData[i];
            let categoryClass = getCategoryClass(data.category);
            html += "<tr>";
            html += "<td class='align-middle text-center'>" + data.ebook_id + "</td>";
            html += "<td class='align-middle text-center'><img src='" + data.thumbnail_image + "' style='width:10em;' /></td>";
            html += "<td class='align-middle montserrat-regular' data-sort-key='name'>" + data.title + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + data.sub_title + "</td>";
            html += "<td class='align-middle montserrat-regular text-capitalize'>" + data.author + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + data.isbn + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + convertDate(data.created_at) + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + "<span class='badge badge-outline " + categoryClass + "'>" + data.category + "</span>" + "</td>";
            html += displayActionButton(data.ebook_id, data.title);
            html += "</tr>";
        }
        $('.ebooks .data-container').html(html);
    });
}