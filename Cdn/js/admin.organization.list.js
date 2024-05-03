$(document).ready(function () {
    getOrganizationsData();
});

$(document).on("keyup", '.search', function () {
    var value = $(this).val().toLowerCase();
    $(".organizations .data-container tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$(document).on('click', '.btn-add', function (e) {
    window.location.href = "admin.organization.create.html";
});

$(document).on('click', '.btn-view', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.view.html?id=" + id;
});

$(document).on('click', '.btn-edit', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.update.html?id=" + id;
});

$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.delete.html?id=" + id;
});

function getOrganizationsData() {
    let html = "";

    $.getJSON("../Cdn/js/data/organization.json", function (response) {
        const org = response.data;

        for (let i = 0; i < org.length; i++) {
            let data = org[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.organization_id +
                "</td>";
            html +=
                "<td class='align-middle text-center' style='max-width: 50px'><img src='" +
                data.logo +
                "' style='width:10em;' /></td>";
            html += "<td class='align-middle' style='min-width: 250px'>" + data.name + "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 500px'>" +
                data.description +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.created_at) +
                "</td>";
            html += displayActionButtons(data.organization_id);
            html += "</tr>";
        }
        $(".organizations .data-container").html(html);
    });
}