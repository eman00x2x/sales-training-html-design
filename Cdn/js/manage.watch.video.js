$(document).ready(function () {
    displayVideo();
});

function displayVideo(){
    const videoId = getParams('video_id');
    $.getJSON('../Cdn/js/data/videos.json', function (data) {
        let videosData = data.data;

        // console.log(videosData)
        console.log(videosData)
        let watchVideo = videosData.filter(video => video.video_id == videoId);

        console.log(watchVideo)

        let videoDetailsHtml = ''

        watchVideo.forEach(video =>{
                $(".videoFrame").attr("src",video.link)
                $(".videolist").attr("href",`manage.view.video.html?id=`+ video.vid_group_id)
            

                videoDetailsHtml += `
                
                <div class="vidTitle pt-3 row">
                <div class="d-flex justify-content-between flex-wrap">
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
            

     

            
                
                `;
            });



            $('.vid-details').html(videoDetailsHtml);
            initRating();

            let recommendedVideos = videosData.filter(video => video.video_id != videoId).slice(0, 3);
                let recommendedHtml = `
                <h1 class="montserrat-semibold text-center">Recommended Videos</h1>`;
                
                recommendedVideos.forEach(video => {
                    recommendedHtml += `
                    <div class="card">
                        <div class="thumbnail">
                            <img src="${video.thumbnail_image}" alt="${video.title}">
                        </div>
                        <div class="card-body">
                            <div class="card-title">${video.title}</div>
                        </div>
                    </div>`;
                });

                $('.reco').html(recommendedHtml);
    });
}

function validateInput(input) {
    let message = [];
  
    const data = input.reduce(function (obj, item) {
      obj[item.comment] = item.value;
      return obj;
    }, {});
  
    const validator = validate(
      {
        comment: data.comment,
      },
      {
       
        comment: {
          type: "string",
          length: { minimum: 4 },
        }
  
       
       
      }
    );
  
    if (validator !== undefined) {
      for (key in validator) {
        message.push(validator[key]);
      }
      return message.join(", ");
    }
  
    return false;
  }


//   function getParams(param) {
//     // Mock function to get URL parameters for demo purposes
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(param);
// }

function initRating() {
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('rating-value');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            ratingValue.value = value;
            stars.forEach(s => {
                s.classList.remove('selected');
            });
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('selected');
            }
        });

        star.addEventListener('mouseover', () => {
            const value = star.getAttribute('data-value');
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('hover');
            }
        });

        star.addEventListener('mouseout', () => {
            const value = star.getAttribute('data-value');
            for (let i = 0; i < value; i++) {
                stars[i].classList.remove('hover');
            }
        });
    });
}

