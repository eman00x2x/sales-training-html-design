let currentPage = 1, search = '', order = '', sortBy = '',
    filterData = [{ "status": ["Pending", "In Progress", "Completed"] }],
    filterBy = [];

$(document).ready(function () {
    getOrgVideoGroupData();
    printFilters()
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    getOrgVideoGroupData();
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    getOrgVideoGroupData();
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    getOrgVideoGroupData();
});

// SORT BY EBOOK GROUPS NAME
$(document).on("click", '.dropdown-name', function () {
    $('.dropdown-name').addClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-transact-id').removeClass('active');
    sortBy = 'name'
    getOrgVideoGroupData();
});

// SORT BY ORGANIZATION ID
$(document).on("click", '.dropdown-id', function () {
    $('.dropdown-name').removeClass('active');
    $('.dropdown-id').addClass('active')
    $('.dropdown-transact-id').removeClass('active');
    sortBy = 'vid_group_id'
    getOrgVideoGroupData();
});

// SORT BY ORGANIZATION CREATED DATE
$(document).on("click", '.dropdown-transact-id', function () {
    $('.dropdown-name').removeClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-transact-id').addClass('active');
    sortBy = 'transaction_id'
    getOrgVideoGroupData();
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    getOrgVideoGroupData();
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

    getOrgVideoGroupData();
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

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
    const filterBySearch = search ? data.filter(item =>
        lowerCase(item.name).includes(lowerCase(search)) ||
        item.transaction_id == search ||
        item.vid_group_id == search
        // || lowerCase(item.email).includes(lowerCase(search))
    ) : data;

    const filter = filterBy.length > 0 ? filterBySearch.filter(item => {
        const { status } = item;
        // const { name } = organization;
        
        return filterBy.some(filterItem => lowerCase(status).includes(lowerCase(filterItem.value)));
    }) : filterBySearch;

    return filter;
}

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "vid_group_id" || property === "transaction_id")
                return data.sort((a, b) => a[property] - b[property])
            // else if (property === "registered_at")
            //     return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "name")
                return data.sort((a, b) => lowerCase(a.name).localeCompare(lowerCase(b.name)));
            else
                return data.sort((a, b) => lowerCase(a.name).localeCompare(lowerCase(b.name)));
        case "desc":
            if (property === "vid_group_id" || property === "transaction_id")
                return data.sort((b, a) => a[property] - b[property])
            // else if (property === "registered_at")
            //     return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "name")
                return data.sort((b, a) => lowerCase(a.name).localeCompare(lowerCase(b.name)));
            else
                return data.sort((b, a) => lowerCase(a.name).localeCompare(lowerCase(b.name)));
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

function getOrgVideoGroupData() {
    let html = "";

    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    $.when(
        $.getJSON("../Cdn/js/data/organization.video.json"),
        $.getJSON("../Cdn/js/data/video.groups.json")
    ).done(function (data1, data2) {
        // https://stackoverflow.com/questions/47749932/merge-multiple-json-with-the-same-id
        let filterByID = returnFilteredData(data1[0].data, data2[0].data, "vid_group_id", "organization_id");

        const sortedData = sortData(isSearchQuery(filterByID), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);

        console.log(slicedData)
        for (let i = 0; i < slicedData.length; i++) {
            let data = slicedData[i];
            let statusClass = getStatusClass(data.status);

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.vid_group_id +
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
                "<td class='align-middle'>" + "<span class='badge badge-outline " + statusClass + "'>" + data.status + "</span>" + "</td>";
            html += "</tr>";
        }
        $(".video-group .data-container").html(html);
    });
}