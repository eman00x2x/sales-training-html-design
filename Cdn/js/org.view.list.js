let currentPage = 1, search = '', order = '', sortBy = '',
    filterData = [{ 
        "account_type": [

            { displayed: "Super Administrator", value: "super-administrator" },
            { displayed: "Administrator", value: "administrator" },
            { displayed: "Subscriber", value: "subscriber" },
        ] }],
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
    window.location.href = "organization.user.create.html";
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

//FILTER
$(document).on('change', '.checklist-filter', function (e) {
    let checkboxes = $(".checklist-filter:checkbox");
    let checkedValues = [];


    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            if (!checkedValues.includes(checkboxes[i])) { // Check if value already exists
                 checkedValues.push(checkboxes[i].value);
            }
        }
        else {
            const index = checkedValues.indexOf(checkboxes[i]); // Find the index of the value
            if (index > -1) {
                checkedValues.splice(index, 1); // Remove the value from the array
            }
        }
    }
    filterBy = checkedValues;
    getAccountsData(sortBy, order);
});

function lowerCase(str) {
    return str.toLowerCase();
}

function isSearchQuery(data) {
    const filterBySearch = search ? data.filter(item =>
        lowerCase(`${item.name.prefix} ${item.name.firstname} ${item.name.lastname} ${item.name.suffix}`).includes(lowerCase(search)) ||
        item.account_id == search ||
        lowerCase(item.email).includes(lowerCase(search))
    ) : data;


    const filter = filterBy.length > 0 ? filterBySearch.filter(item => {
        // const {account_type } = item;
        console.log(filterBy)
        
        return filterBy.some(selectedType =>   item.account_type.toLowerCase() === selectedType.toLowerCase());
        
    }) : filterBySearch;

    return filter;
}

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
                        <input class="checklist-filter form-check-input" name=${key} value="${data.value}" type="checkbox">
                        <label class="checklist-filter form-check-label" name=${key}>
                            ${data.displayed}
                        </label>
                    </div>`
        }
        html += `</div>`;
    }

    $(".filter-list").html(html)
}

// FUNCTION TO LOWERCASE ALL STRINGS


// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON


// SORT BY ORDER AND ITS PROPERTY




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
    
    let params = new URL(document.location.toString()).searchParams;
    let id = params.get("id");
    console.log(id)


    $.when(
        $.getJSON("../Cdn/js/data/profiles.json"),
        $.getJSON("../Cdn/js/data/accounts.json"),
        $.getJSON("../Cdn/js/data/organization.json")
    ).done(function (data1, data2, data3) {
        // MERGE PROFILE AND ACCOUNTS
        let response = (data1[0].data).map(a => Object.assign(a, (data2[0].data).find(b => b.account_id == a.account_id)));
        organizationData = data3[0].data;

        // MERGE RESPONSE AND ORGANIZATION
        let response1 = response.map(a => ({ ...a, "organization": (data3[0].data).find(b => b.organization_id == a.organization_id) }));
        let orgData = organizationData.find((item) => item.organization_id == id);
        let orgId = orgData.organization_id;
        console.log(orgData)
        let filteredData = response.filter(item => item.organization_id == orgId);
        console.log(filteredData)
        console.log(response1)



        const sortedData = sortData(isSearchQuery(filteredData), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);

        for (let i = 0; i < slicedData.length; i++) {
            let data = slicedData[i];
            let fullName = `${data.name.prefix} ${data.name.firstname} ${data.name.lastname} ${data.name.suffix}`;
            let permanentAddress = data.address[0].permanent;
            let fullAddress = `${permanentAddress.region}, ${permanentAddress.province}, ${permanentAddress.municipality}, ${permanentAddress.barangay}`;
            html += "<tr>";
            html += "<td class='text-center'>" + data.profile_id + "</td>";
            html += "<td>" + fullName + "</td>";
            html += "<td>" + data.email + "</td>";
            html += "<td class='text-capitalize'>" + data.account_type + "</td>";
            html += "<td>" + convertDate(data.registered_at) + "</td>";
            html += "<td>";
            html += "<div class='btn-group'>";
            html += "<a class='btn border-primary bg-body text-primary' href='organization.user.view.html?id=" + data.profile_id + "'> <i class='bi bi-eye pe-1'></i> View</a>";
            html += "<a class='btn border-danger bg-body text-danger' href='organization.user.delete.html?id=" + data.profile_id + "'> <i class='bi bi-trash'></i> Delete</a>";
            html += "</div>";
            html += "</td>";
            html += "</tr>";
            
        }
        $(".accounts .data-container").html(html);
    })
}