let currentPageAccounts = 1, searchAccount = '', orderAccount = '', sortByAccount = '',
    filterDataAccount = [{ "status": ["Pending", "In Progress", "Completed"] }],
    filterByAccount = [];

$(document).ready(function () {
    id = getParams('id');
    printFilters();
    getOrgUserData();
});


// SEARCH
$(document).on("keyup", '.search', function () {
    searchAccount = $(this).val().toLowerCase();
    currentPageAccounts = 1;
    getOrgUserData();
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    orderAccount = 'asc';
    getOrgUserData();
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    orderAccount = 'desc';
    getOrgUserData();
});

// SORT BY ACCOUNT NAME
$(document).on("click", '.dropdown-name', function () {
    $('.dropdown-name').addClass('active');
    $('.dropdown-id').removeClass('active');
    sortByAccount = 'name';
    getOrgUserData();
});

// SORT BY REGISTERED DATE
$(document).on("click", '.dropdown-date', function () {
    $('.dropdown-name').removeClass('active');
    $('.dropdown-id').addClass('active');
    sortByAccount = 'registered_at';
    getOrgUserData();
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPageAccounts = $(this).data('num');
    getOrgUserData();
});

$(document).on('change', '.checklist-filter', function (e) {
    let checkboxes = $(".checklist-filter:checkbox");

    filterByAccount = [];
    checkboxes.each(function () {
        if (this.checked) {
            filterByAccount.push({ name: this.name, value: this.value });
        }
    });

    getOrgUserData();
});

function printFilters() {
    let html = '';

    for (const item of filterDataAccount) {
        const regex = /[-_]/g;
        const key = Object.keys(item)[0];
        const replacedKey = key.replace(regex, " ");
        const value = item[key];

        html += `<div class="px-3">
                    <span class="form-check-label montserrat-medium py-2 text-uppercase">${replacedKey}</span>`;

        for (const data of value) {
            html += `<div class="form-check">
                        <input class="checklist-filter form-check-input" name="${key}" value="${data}" type="checkbox">
                        <label class="checklist-filter form-check-label" name="${key}">
                            ${data}
                        </label>
                    </div>`;
        }
        html += `</div>`;
    }

    $(".filter-list").html(html);
}

function lowerCase(str) {
    return typeof str === 'string' ? str.toLowerCase() : str;
}

function isSearchQuery(data) {
    const filterBySearch = searchAccount ? data.filter(item =>
        lowerCase(`${item.name.firstname} ${item.name.lastname}`).includes(lowerCase(searchAccount)) ||
        item.account_id == searchAccount
    ) : data;

    const filter = filterByAccount.length > 0 ? filterBySearch.filter(item =>
        filterByAccount.includes(item.account_type)) : filterBySearch;

    return filter;
}

function sortData(data, orderAccount, property) {
    switch (orderAccount) {
        case "asc":
            if (property === "registered_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "name")
                return data.sort((a, b) => lowerCase(a.name.firstname).localeCompare(lowerCase(b.name.firstname)));
            else
                return data.sort((a, b) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
        case "desc":
            if (property === "registered_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "name")
                return data.sort((b, a) => lowerCase(a.name.firstname).localeCompare(lowerCase(b.name.firstname)));
            else
                return data.sort((b, a) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
        default:
            return data;
    }
}

function updatePagination(totalPages) {
    let paginationButtons = '';

    if (totalPages > 0) {
        paginationButtons += `
        <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPageAccounts === 1 ? 'disabled' : ''}" data-num="${currentPageAccounts - 1}">
            <span class="d-none d-md-block">Previous</span>
            <i class="bi bi-chevron-double-left d-block d-md-none"></i>
        </button>`;

        let startPage = Math.max(1, currentPageAccounts - 1);
        let endPage = Math.min(startPage + 2, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPageAccounts ? 'active' : '';
            paginationButtons += `<button type="button" class="btn-page btn btn-outline-primary ${activeClass}" data-num="${i}">${i}</button>`;
        }

        paginationButtons += `
        <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPageAccounts === totalPages ? 'disabled' : ''}" data-num="${currentPageAccounts + 1}">
            <span class="d-none d-md-block">Next</span>
            <i class="bi bi-chevron-double-right d-block d-md-none"></i>
        </button>`;
    } else {
        paginationButtons = '';
    }

    $('#page-numbers').html(totalPages > 0 ? `Showing ${currentPageAccounts} out of ${totalPages} pages` : 'Showing 0 out of 0 pages');
    $('.page-buttons').html(paginationButtons);
}

function getOrgUserData() {
    let html = "";

    const limit = 10;
    const startIndex = (currentPageAccounts - 1) * limit;
    const endIndex = startIndex + limit;

    $.when(
        $.getJSON("../Cdn/js/data/accounts.json"),
        $.getJSON("../Cdn/js/data/profiles.json")
    ).done(function (data1, data2) {
        let filterByID = returnFilteredData(data1[0].data, data2[0].data, "account_id", "organization_id");

        const sortedData = sortData(isSearchQuery(filterByID), orderAccount, sortByAccount);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);

        for (let i = 0; i < slicedData.length; i++) {
            let data = slicedData[i];

            html += "<tr>";
            html += "<td class='align-middle text-center'>" + (i + 1) + "</td>";
            html += "<td class='align-middle text-center'>" + data.account_id + "</td>";
            html += "<td class='align-middle'>" + `${data.name.prefix} ${data.name.firstname} ${data.name.lastname} ${data.name.suffix}` + "</td>";
            html += "<td class='align-middle'>" + data.email + "</td>";
            html += "<td class='align-middle'>" + data.username + "</td>";
            html += "<td class='align-middle'>" + convertDate(data.registered_at) + "</td>";
            html += "<td class='align-middle text-capitalize'>" + data.account_type + "</td>";
            html += "</tr>";
        }
        $(".users .data-container").html(html);
    });
}