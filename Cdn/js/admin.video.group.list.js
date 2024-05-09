
$(document).ready(function () {
    getVideoGroupData();
});

$(document).on('click', '.btn-edit', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.video.groups.update.html?id=" + id;
});
$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.video.groups.delete.html?id=" + id;
});
$(document).on('click', '.btn-view', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.video.groups.view.html?id=" + id;
});
$(document).on('click', '.btn-add', function (e) {
    window.location.href = "admin.video.groups.create.html";
});

$(document).ready(function () {
    $('#search').on('input', function() {
        var searchText = $(this).val().toLowerCase().trim();
        if (!searchText) {
            $('.video-group .data-container tr').show();
            return;
        }
        $('.video-group .data-container tr').hide().filter(function() {
            var idText = $(this).find('td:eq(0)').text().trim();
            return idText === searchText;
        }).show();
    });
});

function getVideoGroupData() {
    let html = "";

    $.getJSON("../Cdn/js/data/video.groups.json", function (response) {
        const org = response.data;
        const limitedData = limitDataToTen(org);


        for (let i = 0; i < limitedData.length; i++) {
            let data = org[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.vid_group_id +
                "</td>";
            html += "<td class='align-middle' data-sort-key='name'>" + data.name + "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.description +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.created_at) +
                "</td>";
            html += displayActionButtons(data.vid_group_id);
            html += "</tr>";
        }
        $(".video-group .data-container").html(html);
    });
}