let id;

$(document).ready(function () {
    let params = new URL(document.location.toString()).searchParams;
    id = params.get("id");
    $.getJSON('../Cdn/js/data/video.groups.json', function (data) {
        let response = data.data;
        let videoGroup = response.find(group => group.vid_group_id == id);
        $('.vidName').text(videoGroup.name);
        $('.vidDesc').text(videoGroup.description);
    });

    getVidGroupData()
});

$(document).on("click", "#back", function (e) {
    window.location.href = "admin.video.groups.list.html"
});

function getVidGroupData() {
    let html = "";

    $.when(
        $.getJSON("../Cdn/js/data/video.groups.json"),
        $.getJSON("../Cdn/js/data/videos.json"),
    ).done(function (data1, data2) {
        // let videoGroups = data1[0].data;
        let videos = data2[0].data;
        
        let filteredVideos = videos.filter(video => video.vid_group_id == id);
         filteredVideos = limitDataToTen(filteredVideos);
        filteredVideos.forEach(video => {
            html += "<tr>";
            html += "<td class='align-middle text-center'>" + video.video_id + "</td>";
            html += "<td class='align-middle'><img src='" + video.thumbnail_image + "' style='width:10em;' /></td>";
            html += "<td class='align-middle text-truncate' style='max-width: 150px' data-sort-key='name'>" + video.title + "</td>";
            html += "<td class='align-middle text-truncate' style='max-width: 150px'>" + video.description + "</td>";
            html += "<td class='align-middle text-truncate' style='max-width: 150px'>" + video.category + "</td>";
            html += "<td class='align-middle text-truncate' style='max-width: 150px'>" + video.link + "</td>";
            html += "<td class='align-middle'>" + convertDate(video.created_at) + "</td>";
            html += "</tr>";
        });
        
        $(".video-group .data-container").html(html);
    });
}