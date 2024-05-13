let currentPage = 1, search = '', order = '', sortBy = '';

$(document).ready(function () {
    getOrganizationsData(sortBy, order);
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    getOrganizationsData(sortBy, order);
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    getOrganizationsData(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    getOrganizationsData(sortBy, order);
});

// SORT BY ORGANIZATION NAME
$(document).on("click", '.dropdown-org', function () {
    $('.dropdown-org').addClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'name'
    getOrganizationsData(sortBy, order);
});

// SORT BY ORGANIZATION ID
$(document).on("click", '.dropdown-id', function () {
    $('.dropdown-org').removeClass('active');
    $('.dropdown-id').addClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'organization_id'
    getOrganizationsData(sortBy, order);
});

// SORT BY ORGANIZATION CREATED DATE
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-org').removeClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').addClass('active');
    sortBy = 'created_at'
    getOrganizationsData(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    getOrganizationsData(sortBy, order);
});

// ADD ORGANIZATION
$(document).on('click', '.btn-add', function (e) {
    window.location.href = "admin.organization.create.html";
});

// VIEW ORGANIZATION
$(document).on('click', '.btn-view', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.view.html?id=" + id;
});

// EDIT ORGANIZATION
$(document).on('click', '.btn-edit', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.update.html?id=" + id;
});

// DELETE ORGANIZATION
$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.delete.html?id=" + id;
});

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
    return str.toLowerCase();
}

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
    const filter = search ? data.filter(item =>
        lowerCase(item.name).includes(lowerCase(search)) ||
        item.organization_id == search
    ) : data;

    return filter;
}

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "organization_id")
                return data.sort((a, b) => a[property] - b[property])
            else if (property === "created_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "name")
                return data.sort((a, b) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((a, b) => a.name.localeCompare(b.name));
        case "desc":
            if (property === "organization_id")
                return data.sort((b, a) => a[property] - b[property])
            else if (property === "created_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "name")
                return data.sort((b, a) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((b, a) => a.name.localeCompare(b.name));
        default:
            return data;
    }
}

// UPDATE THE PAGE NUMBERS IN PAGE BUTTONS
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

// GET THE DATA
function getOrganizationsData(sortBy, order) {
    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    let html = "";

    $.getJSON("../Cdn/js/data/organization.json", function (response) {
        const org = response.data;
        const sortedData = sortData(isSearchQuery(org), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);
        
        for (let i = 0; i < slicedData.length; i++) {
            let data = slicedData[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.organization_id +
                "</td>";
            html +=
                "<td class='align-middle text-center' style='max-width: 50px'><img src='" +
                data.logo +
                "' style='width:10em;' /></td>";
            html += "<td class='align-middle'>" + data.name + "</td>";
            html +=
                "<td class='align-middle truncate-text' style='max-width: 500px'><p>" +
                data.description +
                "</p></td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.created_at) +
                "</td>";
            html += displayActionButtons(data.organization_id);
            html += "</tr>";
        }

        $(".organizations .data-container").html(html);
    });
}