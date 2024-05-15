let currentPage = 1, search = '', order = '', sortBy = '',
filterData = [{ "type": ["Bronze", "Silver", "Gold"] }, { "category": ["Individual", "Package"] }],
filterBy = [];

//getting the data in json
 $(document).ready(function () {
    getPremiumsData(sortBy, order);
    printFilters()
});
//Edit button in table
$(document).on('click', '.btn-edit', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.premiums.update.html?id=" + id;
});
//delete button in table
$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.premiums.delete.html?id=" + id;
});
//add button
$(document).on('click', '.btn-add', function (e) {
    window.location.href = "admin.premiums.create.html";
});
//view Button
$(document).on('click', '.btn-view', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.premiums.view.html?id=" + id;
});

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
    return str.toLowerCase();
}

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    getPremiumsData(sortBy, order);
});

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
    const filterBySearch = search ? data.filter(item =>
        lowerCase(item.name).includes(lowerCase(search)) ||
        item.premium_id == search
    ) : data;

    const filter = filterBy.length > 0 ? filterBySearch.filter(item => {
        const { category, type } = item;
        
        return filterBy.some(filterItem => 
            (type && lowerCase(type) === lowerCase(filterItem.value)) || 
            (category && lowerCase(category) === lowerCase(filterItem.value))
        );
    }) : filterBySearch;

    return filter;
}


// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    getPremiumsData(sortBy, order);
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    getPremiumsData(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    getPremiumsData(sortBy, order);
});

// SORT BY ORGANIZATION NAME
$(document).on("click", '.dropdown-prem', function () {
    $('.dropdown-prem').addClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'name'
    getPremiumsData(sortBy, order);
});

// SORT BY ORGANIZATION ID
$(document).on("click", '.dropdown-id', function () {
    $('.dropdown-prem').removeClass('active');
    $('.dropdown-id').addClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'premium_id'
    getPremiumsData(sortBy, order);
});

// SORT BY ORGANIZATION CREATED DATE
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-prem').removeClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').addClass('active');
    sortBy = 'created_at'
    getPremiumsData(sortBy, order);
});

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "premium_id")
                return data.sort((a, b) => a[property] - b[property])
            else if (property === "created_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "name")
                return data.sort((a, b) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((a, b) => a.name.localeCompare(b.name));
        case "desc":
            if (property === "premium_id")
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

    getPremiumsData(sortBy, order);
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

function getPremiumsData() {
    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    let html = "";

    $.getJSON("../Cdn/js/data/premiums.json", function (response) {
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
                data.premium_id +
                "</td>";
            html += "<td class='align-middle'>" + data.category + "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.type +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' data-sort-key='name' style='max-width: 150px'>" +
                data.name +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.description +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.script +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.duration +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.cost +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.created_at) +
                "</td>";
            html += displayActionButtons(data.premium_id);
            html += "</tr>";
        }
        $(".premiums .data-container").html(html);
        console.log("done")
    });
}