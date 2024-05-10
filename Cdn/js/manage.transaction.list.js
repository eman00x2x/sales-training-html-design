const acc_id = getParams('id');
$(document).ready(function () {

    $('.nav-link').click(function () {
        const status = $(this).data('status');
        filterTransactions(status);
    });


    getTransactionsData()
    
});

$(document).on("keyup", '.search', function () {
    var value = $(this).val().toLowerCase();
    $(".transaction .data-container tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

$(document).on("click", ".btn-view", function () {
    let transactionId = $(this).data('id');
    console.log(acc_id);
    console.log(transactionId);
    window.location.href = "manage.transaction.view.html?id=" + acc_id + "&transaction_id=" + transactionId;
});

function displayActionButton(transactionId) {
    return `<td class='align-middle text-start'>
    <div class="btn-group" role="group" aria-label="Basic outlined example ">
        <button type="button" data-id='${transactionId}' class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View Transaction</span></button>
    </div>
    </td>`;
}

function getTransactionsData() {
    let html = '';

    $.getJSON('../Cdn/js/data/transactions.json', function (response) {

        var data = response.data.filter(function (item) {
            return item.account_id == acc_id;
        });

for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let statusClass = getStatusClass(item.status);
            html += `<tr class="transaction-row" data-status="${item.status}">
                        <td class='align-middle montserrat-regular'>${item.transaction_id}</td>
                        <td class='align-middle montserrat-regular truncate-text' style='width: 30em'><p class='my-0'>${item.details}</p></td>
                        <td class='align-middle montserrat-regular'>${item.duration.toString()}</td>
                        <td class='align-middle montserrat-regular'>₱${item.price}</td>
                        <td class='align-middle montserrat-regular'><span class='badge badge-outline ${statusClass}'>${item.status}</span></td>
                        <td class='align-middle text-start'><div class="btn-group" role="group" aria-label="Basic outlined example "><button type="button" data-id='${item.transaction_id}' class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View Transaction</span></button></div></td>
                    </tr>`;
        }
        $('.data-container').html(html);
    });
}


function filterTransactions(status) {
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
