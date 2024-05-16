let id, currentPage = 1, search = '', order = '', sortBy = ''
filterData = [{ "category": ["selling", "buying", "real-estate", "earning"]}],
filterBy = [];

//Getting the data of Ebook-Group Name and Ebook-Group Description
$(document).ready(function () {
    let params = new URL(document.location.toString()).searchParams;
    id = params.get("id");

    $.getJSON('../Cdn/js/data/ebook.groups.json', function (data) {
        let response = data.data;
        f = Object.keys(response).find(key => response[key].ebook_group_id == id);

        $('.ebookName').text(response[f].name);
        $('.ebookDesc').text(response[f].description);
    });
    printFilters();
    getEBookGroupData(sortBy, order)
});

//BACK BUTTON
$(document).on("click", "#back", function (e) {
    window.location.href = "admin.ebook.groups.list.html"
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    getEBookGroupData(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    getEBookGroupData(sortBy, order);
});

// SORT BY EBOOK TITLE
$(document).on("click", '.dropdown-title', function () {
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    $('.dropdown-title').addClass('active');
    sortBy = 'title'
    getEBookGroupData(sortBy, order);
});

// SORT BY EBOOK ID
$(document).on("click", '.dropdown-id', function () {
    $('.dropdown-title').removeClass('active');
    $('.dropdown-created-date').removeClass('active');
    $('.dropdown-id').addClass('active')
    sortBy = 'ebook_id'
    getEBookGroupData(sortBy, order);
});

// SORT BY EBOOK CREATED DATE
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-title').removeClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').addClass('active');
    sortBy = 'created_at'
    getEBookGroupData(sortBy, order);
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    getEBookGroupData(sortBy, order);
});

$(document).on('change', '.checklist-filter', function (e) {
    filterBy = $(".checklist-filter:checkbox:checked").map(function() {
        return $(this).val().toLowerCase();
    }).get();

    getEBookGroupData(sortBy, order);
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
                        <label class="checklist-filter text-capitalize form-check-label" name=${key}>
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
    const filteredData = data.filter(item =>
        lowerCase(item.title).includes(lowerCase(search)) ||
        item.ebook_id.toString() === search ||
        lowerCase(item.author).includes(lowerCase(search))
    );

    if (filterBy.length > 0) {
        return filteredData.filter(item =>
            filterBy.includes(lowerCase(item.category))
        );
    }

    return filteredData;
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
                return data.sort((a, b) => a.title.localeCompare(b.title));
        case "desc":
            if (property === "ebook_id")
                return data.sort((b, a) => a[property] - b[property])
            else if (property === "created_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "title")
                return data.sort((b, a) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((b, a) => a.title.localeCompare(b.title));
        default:
            return data;
    }
}

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    getEBookGroupData(sortBy, order);
});

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

function getEBookGroupData() {
    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    let html = "";

    $.when(
        $.getJSON("../Cdn/js/data/ebook.groups.json"),
        $.getJSON("../Cdn/js/data/ebooks.json"),
    ).done(function (response1, response2) { 
        const ebookGroups = response1[0].data; // Response 1 is the ebook groups data
        const ebooks = response2[0].data; // Response 2 is the ebooks data

        
        let filteredEbooks = ebooks.filter(ebook => ebook.ebook_group_id == id);
        const sortedData = sortData(isSearchQuery(filteredEbooks), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);

        for (let i = 0; i < slicedData.length; i++) {
            let data = slicedData[i];
            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.ebook_id +
                "</td>";
            html += "<td class='align-middle'>" + data.isbn + "</td>";
            html += "<td class='align-middle'><img src='" + data.thumbnail_image + "' style='width:10em;' /></td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px' data-sort-key='name'>" +
                data.title +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.sub_title +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.author +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.description +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.category +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.code +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.created_at) +
                "</td>";
            html += "</tr>";
        }

        $(".ebook-group .data-container").html(html);
    });
}
