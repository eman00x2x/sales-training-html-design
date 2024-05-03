
$(document).ready(function () {
    $('.header').load('header.html');
    $('.sidebar').load('sidebar.html');
    $('.footer').load('footer.html');
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


function getVideoGroupData() {
    let html = "";

    $.getJSON("../Cdn/js/data/video.groups.json", function (response) {
        const org = response.data;

        for (let i = 0; i < org.length; i++) {
            let data = org[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.vid_group_id +
                "</td>";
            html += "<td class='align-middle'>" + data.name + "</td>";
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