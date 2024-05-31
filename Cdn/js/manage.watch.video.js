$(document).ready(function () {
    displayVideo();
});

function displayVideo(){
    const videoId = getParams('video_id');
    $.getJSON('../Cdn/js/data/videos.json', function (data) {
        let videosData = data.data;

        // console.log(videosData)
        console.log(videoId)
        let watchVideo = videosData.filter(video => video.video_id == videoId);

        console.log(watchVideo)

        let videoDetailsHtml = ''

        watchVideo.forEach(video =>{
                $(".videoFrame").attr("src",video.link)
                $(".videolist").attr("href",`manage.view.video.html?id=`+ video.vid_group_id)
            

                videoDetailsHtml += `
                
                <div class="vidTitle pt-3">
                <div class="d-flex justify-content-between">
                <h1 class="title montserrat-bold">${video.title}</h1>
                <div class="rating">
                <input type="hidden" id="rating-value" value="0">
                <span class="star" data-value="1">&#9733;</span>
                <span class="star" data-value="2">&#9733;</span>
                <span class="star" data-value="3">&#9733;</span>
                <span class="star" data-value="4">&#9733;</span>
                <span class="star" data-value="5">&#9733;</span>
              </div>
                </div>
                <div >
                    <p class="desc montserrat-light"> ${video.description}</p>
                </div>
            </div>

            <div>
                <form action="">
                    <textarea class="form-control" name="example-textarea" placeholder="Add a Comment"></textarea>
                    
                    <div class="text-end pt-1">
                        <button class="btn btn-success " type="submit">Comment</button>

                    </div>
                </form>
            </div>

            
                
                `;
            });

            $('.vid-details').html(videoDetailsHtml)
       
    });
}
