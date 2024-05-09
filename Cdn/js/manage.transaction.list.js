$(document).ready(function () {
    id = getParams('id')

    getTransactionsData();
});

$(document).on("keyup", '.search', function () {
    var value = $(this).val().toLowerCase();
    $(".ebooks .data-container tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$(document).on("click", ".btn-view", function () {
    let id = $(this).data('id');
    let title = $(this).data('ebook-title');
    window.location.href = "admin.ebook.chapters.list.html?id=" + id + "&title=" + title;
});

$(document).on("click", ".btn-edit", function () {
    let id = $(this).data('id');
    window.location.href = "admin.ebooks.update.html?id=" + id;
});

$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.ebooks.delete.html?id=" + id;
});

function displayActionButton(id, title) {
    return `<td class='align-middle text-start'>
    <div class="btn-group" role="group" aria-label="Basic outlined example ">
        <button type="button" data-id='${id}' data-ebook-title="${title}" class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View Transaction</span></button>
    </div>
    </td>`;
}

function getTransactionsData() {
    let html = '';

    $.getJSON('../Cdn/js/data/transactions.json', function (response) {

        var data = response.data.filter(function (item) {
            return item.transaction_id == id;
        });

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            html += "<tr>";
            html += "<td class='align-middle montserrat-regular'>" + item.transaction_id + "</td>";
            html += "<td class='align-middle montserrat-regular truncate-text m-0' style='max-width: 30em'>" + "<p>" + item.details + "</p>" + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + item.duration.toString() + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + "₱" + item.price + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + "<span class='badge badge-outline text-teal'>" + item.status + "</span>" + "</td>";
            html += displayActionButton(item.ebook_id, item.title);
            html += "</tr>";
        }
        $('.data-container').html(html);
    });
}