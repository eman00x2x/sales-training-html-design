const acc_id = getParams('id');
let currentPage = 1, search = '', order = '', sortBy = '', statusFilter = 'all'; // Add statusFilter variable

$(document).ready(function () {

    $('.nav-link').click(function () {
        const status = $(this).data('status');
        filterTransactions(status);
    });
    getTransactionsData(sortBy, order)
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    getTransactionsData(sortBy, order);
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    getTransactionsData(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    getTransactionsData(sortBy, order);
});

// SORT BY TRANSACTION ID
$(document).on("click", '.dropdown-id', function () {
    $('.dropdown-id').addClass('active');
    $('.dropdown-price').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'transaction_id'
    getTransactionsData(sortBy, order);
});

// SORT BY PRICE
$(document).on("click", '.dropdown-price', function () {
    $('.dropdown-price').addClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'price'
    getTransactionsData(sortBy, order);
});

// SORT BY DATE
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-created-date').addClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-price').removeClass('active');
    sortBy = 'created_at'
    getTransactionsData(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    getTransactionsData(sortBy, order);
});


$(document).on("click", ".btn-view", function () {
    let transactionId = $(this).data('id');
    console.log(acc_id);
    console.log(transactionId);
    window.location.href = "manage.transaction.view.html?id=" + acc_id + "&transaction_id=" + transactionId;
});

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
    return str.toLowerCase();
}

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
    const filter = search ? data.filter(item =>
        lowerCase(item.details).includes(lowerCase(search)) ||
        item.transaction_id == search
    ) : data;

    return filter;
}

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "transaction_id")
                return data.sort((a, b) => a[property] - b[property]);
            else if (property === "created_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "price")
                return data.sort((a, b) => parseFloat(a[property]) - parseFloat(b[property]));
            else
                return data.sort((a, b) => a.name.localeCompare(b.name));
        case "desc":
            if (property === "transaction_id")
                return data.sort((a, b) => b[property] - a[property]);
            else if (property === "created_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "price")
                return data.sort((a, b) => parseFloat(b[property]) - parseFloat(a[property]));
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


function displayActionButton(transactionId) {
    return `<td class='align-middle text-start'>
    <div class="btn-group" role="group" aria-label="Basic outlined example ">
        <button type="button" data-id='${transactionId}' class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View Transaction</span></button>
    </div>
    </td>`;
}

function getTransactionsData() {
    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    
    let html = '';

    $.getJSON('../Cdn/js/data/transactions.json', function (response) {
        const data = response.data.filter(item => item.account_id == acc_id);
        const filteredData = isSearchQuery(data);
        const sortedData = sortData(filteredData, order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);

        for (let i = 0; i < slicedData.length; i++) {
            let item = slicedData[i];
            let statusClass = getStatusClass(item.status);
            html += `<tr class="transaction-row" data-status="${item.status}">
                        <td class='align-middle montserrat-regular'>${item.transaction_id}</td>
                        <td class='align-middle montserrat-regular truncate-text' style='width: 30em'><p class='my-0'>${item.details}</p></td>
                        <td class='align-middle montserrat-regular'>${item.duration.toString()}</td>
                        <td class='align-middle montserrat-regular'>${convertDate(item.created_at)}</td>
                        <td class='align-middle montserrat-regular'>₱${item.price}</td>
                        <td class='align-middle montserrat-regular'><span class='badge badge-outline ${statusClass}'>${item.status}</span></td>
                        <td class='align-middle text-start'><div class="btn-group" role="group" aria-label="Basic outlined example "><button type="button" data-id='${item.transaction_id}' class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View Transaction</span></button></div></td>
                    </tr>`;
        }
        $('.data-container').html(html);
        // Filter transactions again after updating the data
        filterTransactions(statusFilter);
    });
}

// Function to filter transactions by status
function filterTransactions(status) {
    statusFilter = status; // Update statusFilter variable
    $('.nav-link').removeClass('active');
    $(`.nav-link[data-status="${status}"]`).addClass('active');

    $('.transaction-row').hide();

    if (status === 'all') {
        $('.transaction-row').show();
    } else {
        $(`.transaction-row[data-status="${status}"]`).show();
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'Success':
            return 'text-success';
        case 'Processing':
            return 'text-warning';
        case 'Cancelled':
            return 'text-danger';
        default:
            return 'text-dark';
    }
}
