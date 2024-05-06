$(document).ready(function () {
    getAccountsData();
});

$(document).on("keyup", '.search', function () {
    var value = $(this).val().toLowerCase();
    $(".accounts .data-container tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
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

function getAccountsData() {
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

        for (let i = 0; i < response1.length; i++) {
            let data = response1[i];

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
            html += displayActionButtons(data.account_id);
            html += "</tr>";
        }
        $(".accounts .data-container").html(html);
    })
}