$(document).ready(function () {
    getVideoData();
});

$(document).on("click", ".btn-add", function () {
    window.location.href = "admin.ebooks.create.html";
});

$(document).on("click", ".btn-view", function () {
    var id = $(this).data("id");
    window.location.href = "admin.videos.view.html?id=" + id;
});

$(document).on("click", ".btn-edit", function () {
    let id = $(this).data('id');
    window.location.href = "admin.videos.update.html?id=" + id;
});

$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.videos.delete.html?id=" + id;
});

function displayActionButton(id, title) {
    return `<td class='align-middle text-center'>
        <button type="button" data-id='${id}' class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View</span></button>
        <button type="button" data-id='${id}' class="btn btn-md btn-edit btn-outline-primary"><i class="bi bi-pencil-square"></i><span class="ms-2 montserrat-regular">Edit</span></button>
        <button type="button" data-id='${id}' class="btn btn-md btn-delete btn-outline-danger"><i class="bi bi-trash"></i><span class="ms-2 montserrat-regular">Delete</span></button>
</td>`;
}

function getVideoData() {
    let html = '';

    $.getJSON('../Cdn/js/data/videos.json', function (response) {
        console.log(response)
        let data = response.data;
        for (let i = 0; i < data.length; i++) {
            let video = data[i];
            html += "<tr>";
            html +=
                "<td class='montserrat-regular align-middle text-center'>" +
                video.video_id +
                "</td>";
            html +=
                "<td class='montserrat-regular d-flex h-100 w-100 justify-content-center align-items-center text-center'><img src='" +
                video.thumbnail_image +
                "' style='width:10em;' /></td>";
            html +=
                "<td class='montserrat-regular align-middle text-center text-capitalize'>" +
                video.title +
                "</td>";
            html +=
                "<td class='montserrat-regular align-middle truncate-text'>" +
                "<p>" +
                video.description +
                "</p>" +
                "</td>";
            html +=
                "<td class='montserrat-regular align-middle text-center text-capitalize'>" +
                video.category +
                "</td>";
            html += displayActionButtons(video.video_id);
            html += "</tr>";
        }
        $('.data-container').html(html);
    });
}