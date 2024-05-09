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
                <h1 class="title montserrat-bold">${video.title}</h1>
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
