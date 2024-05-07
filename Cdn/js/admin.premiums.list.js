 //SAMPLE DATA OF Premium GROUPS

 $(document).ready(function () {
    getPremiumsData();
});
$(document).on('click', '.btn-edit', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.premiums.update.html?id=" + id;
});
$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.premiums.delete.html?id=" + id;
});
$(document).on('click', '.btn-add', function (e) {
    window.location.href = "admin.premiums.create.html";
});

$(document).on('click', '.btn-view', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.premiums.view.html?id=" + id;
});


$(document).ready(function () {
    $('#search').on('input', function() {
        var searchText = $(this).val().toLowerCase().trim();
        if (!searchText) {
            $('.premiums .data-container tr').show();
            return;
        }
        $('.premiums .data-container tr').hide().filter(function() {
            var idText = $(this).find('td:eq(0)').text().trim();
            return idText === searchText;
        }).show();
    });
});

function getPremiumsData() {
    let html = "";

    $.getJSON("../Cdn/js/data/premiums.json", function (response) {
        const org = response.data;

        for (let i = 0; i < org.length; i++) {
            let data = org[i];

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
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
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
    });
}