let currentPageEbook = 1, searchEbook = '', orderEbook = '', sortByEbook = '',
    filterDataEbook = [{ "status": ["Pending", "In Progress", "Completed"] }],
    filterByEbook = [];


$(document).ready(function () {
    id = getParams('id');
    getOrgEBookGroupData();
    printFilters();
});

// SEARCH
$(document).on("keyup", '.search', function () {
    searchEbook = $(this).val().toLowerCase();
    currentPageEbook = 1;
    getOrgEBookGroupData();
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    orderEbook = 'asc';
    getOrgEBookGroupData();
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    orderEbook = 'desc';
    getOrgEBookGroupData();
});

// SORT BY EBOOK GROUPS NAME
$(document).on("click", '.dropdown-name', function () {
    $('.dropdown-name').addClass('active');
    $('.dropdown-id').removeClass('active');
    $('.dropdown-transact-id').removeClass('active');
    sortByEbook = 'name';
    getOrgEBookGroupData();
});

// SORT BY ORGANIZATION ID
$(document).on("click", '.dropdown-id', function () {
    $('.dropdown-name').removeClass('active');
    $('.dropdown-id').addClass('active');
    $('.dropdown-transact-id').removeClass('active');
    sortByEbook = 'ebook_group_id';
    getOrgEBookGroupData();
});

// SORT BY ORGANIZATION CREATED DATE
$(document).on("click", '.dropdown-transact-id', function () {
    $('.dropdown-name').removeClass('active');
    $('.dropdown-id').removeClass('active');
    $('.dropdown-transact-id').addClass('active');
    sortByEbook = 'transaction_id';
    getOrgEBookGroupData();
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPageEbook = $(this).data('num');
    getOrgEBookGroupData();
});

$(document).on('change', '.checklist-filter', function (e) {
    let checkboxes = $(".checklist-filter:checkbox");

    filterByEbook = [];

    checkboxes.each(function () {
        if ($(this).is(':checked')) {
            filterByEbook.push($(this).val());
        }
    });

    getOrgEBookGroupData();
});

function printFilters() {
    let html = '';

    for (const item of filterDataEbook) {
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
                    </div>`;
        }
        html += `</div>`;
    }

    $(".filter-list").html(html);
}

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
    return str.toLowerCase();
}

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
    const filterBySearch = searchEbook ? data.filter(item =>
        lowerCase(item.name).includes(lowerCase(searchEbook)) ||
        item.transaction_id == searchEbook ||
        item.ebook_group_id == searchEbook
    ) : data;

    const filter = filterByEbook.length > 0 ? filterBySearch.filter(item =>
        filterByEbook.includes(item.status)
    ) : filterBySearch;

    return filter;
}

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, orderEbook, property) {
    switch (orderEbook) {
        case "asc":
            if (property === "ebook_group_id" || property === "transaction_id")
                return data.sort((a, b) => a[property] - b[property]);
            else if (property === "name")
                return data.sort((a, b) => lowerCase(a.name).localeCompare(lowerCase(b.name)));
            else
                return data;
        case "desc":
            if (property === "ebook_group_id" || property === "transaction_id")
                return data.sort((b, a) => a[property] - b[property]);
            else if (property === "name")
                return data.sort((b, a) => lowerCase(a.name).localeCompare(lowerCase(b.name)));
            else
                return data;
        default:
            return data;
    }
}

// UPDATE THE PAGE NUMBERS IN PAGE BUTTONS
function updatePagination(totalPages) {
    let paginationButtons = '';

    if (totalPages > 0) {
        paginationButtons += `
        <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPageEbook === 1 ? 'disabled' : ''}" data-num="${currentPageEbook - 1}">
            <span class="d-none d-md-block">Previous</span>
            <i class="bi bi-chevron-double-left d-block d-md-none"></i>
        </button>`;

        let startPage = Math.max(1, currentPageEbook - 1);
        let endPage = Math.min(startPage + 2, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPageEbook ? 'active' : '';
            paginationButtons += `<button type="button" class="btn-page btn btn-outline-primary ${activeClass}" data-num="${i}">${i}</button>`;
        }

        paginationButtons += `
        <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPageEbook === totalPages ? 'disabled' : ''}" data-num="${currentPageEbook + 1}">
            <span class="d-none d-md-block">Next</span>
            <i class="bi bi-chevron-double-right d-block d-md-none"></i>
        </button>`;
    } else
        paginationButtons = '';

    $('#page-numbers').html(totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages');
    $('.page-buttons').html(paginationButtons);
}

function getStatusClass(status) {
    switch (status) {
        case 'In Progress':
            return 'text-azure';
        case 'Pending':
            return 'text-warning';
        case 'Completed':
            return 'text-success';
        default:
            return 'text-dark';
    }
}

function getOrgEBookGroupData() {
    let html = "";

    const limit = 10;
    const startIndex = (currentPageEbook - 1) * limit;
    const endIndex = startIndex + limit;

    $.when(
        $.getJSON("../Cdn/js/data/organization.ebooks.json"),
        $.getJSON("../Cdn/js/data/ebook.groups.json")
    ).done(function (data1, data2) {
        // Merge multiple JSON with the same ID
        let filterByID = returnFilteredData(data1[0].data, data2[0].data, "ebook_group_id", "organization_id");

        const sortedData = sortData(isSearchQuery(filterByID), orderEbook, sortByEbook);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);

        for (let i = 0; i < slicedData.length; i++) {
            let data = slicedData[i];
            let statusClass = getStatusClass(data.status);

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                (startIndex + i + 1) +
                "</td>";
            html +=
                "<td class='align-middle text-center'>" +
                data.transaction_id +
                "</td>";
            html += "<td class='align-middle'>" + data.name + "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.started_at) +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.end_at) +
                "</td>";
            html +=
                "<td class='align-middle'><span class='badge badge-outline " +
                statusClass +
                "'>" +
                data.status +
                "</span></td>";
            html += "</tr>";
        }
        $(".ebook-group .data-container").html(html);
    });
}

