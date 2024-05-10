let currentPage = 1, search = '', order = '', sortBy = '',
    filterData = [{ "account_type": ["Super Administrator", "Administrator", "Subscriber"] }, { "organization": ["Super Organization", "Regular Organization", "User Organization"] }],
    filterBy = [];

$(document).ready(function () {
    getAccountsData(sortBy, order);
    printFilters()
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    getAccountsData(sortBy, order);
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    getAccountsData(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    getAccountsData(sortBy, order);
});

// SORT BY ORGANIZATION NAME
$(document).on("click", '.dropdown-name', function () {
    $('.dropdown-name').addClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'name'
    getAccountsData(sortBy, order);
});

// SORT BY ORGANIZATION ID
$(document).on("click", '.dropdown-id', function () {
    $('.dropdown-name').removeClass('active');
    $('.dropdown-id').addClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'account_id'
    getAccountsData(sortBy, order);
});

// SORT BY ORGANIZATION CREATED DATE
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-name').removeClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').addClass('active');
    sortBy = 'registered_at'
    getAccountsData(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    getAccountsData(sortBy, order);
});

$(document).on('click', '.btn-add', function (e) {
    window.location.href = "admin.accounts.create.html";
});

$(document).on('click', '.btn-view', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.accounts.view.html?id=" + id;
});

$(document).on('click', '.btn-edit', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.accounts.update.html?id=" + id;
});

$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.accounts.delete.html?id=" + id;
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

    getAccountsData(sortBy, order);
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
        lowerCase(`${item.name.prefix} ${item.name.firstname} ${item.name.lastname} ${item.name.suffix}`).includes(lowerCase(search)) ||
        item.account_id == search ||
        lowerCase(item.email).includes(lowerCase(search))
    ) : data;

    const filter = filterBy.length > 0 ? filterBySearch.filter(item => {
        const { organization, account_type } = item;
        const { name } = organization;
        
        return filterBy.every(filterItem => lowerCase(account_type) === lowerCase(filterItem.value) || lowerCase(name) === lowerCase(filterItem.value));
    }) : filterBySearch;

    return filter;
}

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "account_id")
                return data.sort((a, b) => a[property] - b[property])
            else if (property === "registered_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "name")
                return data.sort((a, b) => lowerCase(`${a[property].firstname} ${a[property].lastname} ${a[property].suffix}`).localeCompare(lowerCase(`${b[property].firstname} ${b[property].lastname} ${b[property].suffix}`)));
            else
                return data.sort((a, b) => lowerCase(`${a.name.firstname} ${a.name.lastname} ${a.name.suffix}`).localeCompare(lowerCase(`${b.name.firstname} ${b.name.lastname} ${b.name.suffix}`)));
        case "desc":
            if (property === "account_id")
                return data.sort((b, a) => a[property] - b[property])
            else if (property === "registered_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "name")
                return data.sort((b, a) => lowerCase(`${a[property].firstname} ${a[property].lastname} ${a[property].suffix}`).localeCompare(lowerCase(`${b[property].firstname} ${b[property].lastname} ${b[property].suffix}`)));
            else
                return data.sort((b, a) => lowerCase(`${a.name.firstname} ${a.name.lastname} ${a.name.suffix}`).localeCompare(lowerCase(`${b.name.firstname} ${b.name.lastname} ${b.name.suffix}`)));
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

        for (let i = 1; i <= totalPages; i++) {
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

const displayAccActionButtons = (id, name) => {
    return `<td class='align-middle'>
              <div class="btn-group" role="group" aria-label="Basic outlined example ">
                  <button type="button" data-id='${id}' class="btn btn-md btn-view btn-outline-primary montserrat-semibold"><i class="bi bi-eye"></i><span class="ms-2">View</span></button>
                  <button type="button" data-id='${id}' data-name='${name}' class="btn btn-md btn-delete btn-outline-danger montserrat-semibold"><i class="bi bi-trash"></i><span class="ms-2">Delete</span></button>
              </div>
          </td>`;
};

function getAccountsData() {
    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    let html = "";

    $.when(
        $.getJSON("../Cdn/js/data/profiles.json"),
        $.getJSON("../Cdn/js/data/accounts.json"),
        $.getJSON("../Cdn/js/data/organization.json")
    ).done(function (data1, data2, data3) {
        // MERGE PROFILE AND ACCOUNTS
        let response = (data1[0].data).map(a => Object.assign(a, (data2[0].data).find(b => b.account_id == a.account_id)));
        // MERGE RESPONSE AND ORGANIZATION
        let response1 = response.map(a => ({ ...a, "organization": (data3[0].data).find(b => b.organization_id == a.organization_id) }));

        const sortedData = sortData(isSearchQuery(response1), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);

        for (let i = 0; i < slicedData.length; i++) {
            let data = slicedData[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.account_id +
                "</td>";
            html += "<td class='align-middle'>" + `${data.name.prefix} ${data.name.firstname} ${data.name.lastname} ${data.name.suffix}` + "</td>";
            html += "<td class='align-middle'>" + data.email + "</td>";
            html +=
                "<td class='align-middle text-truncate text-capitalize'>" +
                data.account_type +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                data.organization.name + "</td>";
            "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.registered_at) +
                "</td>";
            html += displayAccActionButtons(data.account_id, `${data.name.prefix} ${data.name.firstname} ${data.name.lastname} ${data.name.suffix}`);
            html += "</tr>";
        }
        $(".accounts .data-container").html(html);
    })
}