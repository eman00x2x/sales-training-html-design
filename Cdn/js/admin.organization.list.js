$(document).ready(function () {
    $(".header").load("header.html");
    $(".sidebar").load("sidebar.html");
    $(".footer").load("footer.html");
    getOrganizationsData();
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

function displayActionButtons(id) {
    return `<td class='align-middle'>
                <div class="btn-group" role="group" aria-label="Basic outlined example ">
                    <button type="button" data-id='${id}' class="btn btn-md btn-view btn-outline-primary montserrat-semibold"><i class="bi bi-eye"></i><span class="ms-2">View</span></button>
                    <button type="button" data-id='${id}' class="btn btn-md btn-edit btn-outline-primary montserrat-semibold"><i class="bi bi-pencil-square"></i><span class="ms-2">Edit</span></button>
                    <button type="button" data-id='${id}' class="btn btn-md btn-delete btn-outline-danger montserrat-semibold"><i class="bi bi-trash"></i><span class="ms-2">Delete</span></button>
                </div>
            </td>`;
}

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
            html += "<td class='align-middle'>" + data.name + "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 550px'>" +
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