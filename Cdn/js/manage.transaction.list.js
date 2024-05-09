const acc_id = getParams('id');
$(document).ready(function () {
    getTransactionsData();
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
            html += "<tr>";
            html += "<td class='align-middle montserrat-regular'>" + item.transaction_id + "</td>";
            html += "<td class='align-middle montserrat-regular truncate-text' style='width: 30em'>" + "<p class='my-0'>" + item.details + "</p>" + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + item.duration.toString() + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + "₱" + item.price + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + "<span class='badge badge-outline " + statusClass + "'>" + item.status + "</span>" + "</td>";
            html += displayActionButton(item.transaction_id, item.title); 
            html += "</tr>";
        }
        $('.data-container').html(html);
    });
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
