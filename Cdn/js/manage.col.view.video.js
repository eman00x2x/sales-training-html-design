$(document).ready(function () {
    displayVideo(1, '', 'asc', 'title');

});

$.getJSON('../Cdn/js/data/videos.json', function (videoData) {

    let videoResponse = videoData.data;
    let videoview = videoResponse.filter(video => video.vid_group_id == videoId);

    console.log(videoview)

    let videoViewHtml = '';
    videoResponse1.forEach(video => {
        videoListHtml += `
          <div class="col-lg-4 col-md-6 col-sm-12 mb-2">
          <div class="card" data-ebook-id="${video.vid_id}">
              <!-- Photo -->
              <div class="img-container" >
                  <img src="${video.thumbnail_image}" class="card-img" alt="Image"
                      style="object-fit: contain; height: 100%;" />
              </div>
              <div class="card-body">
                  <h3 class="card-title">${video.title}</h3>
                  <p class="text-secondary">${video.description}</p>
              </div>
          </div>
      </div>
        `;
    });
    $('.video-view').html(videoViewHtml);
});