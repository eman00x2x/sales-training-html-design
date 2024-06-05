$(document).ready(function () {
    displayVideo();


    $('#submitComment').on('click', function () {
        const comment = $('#comment').val().trim();

        if (comment) {
            const templateName = 'Manny Florendo';
            const time = new Date().toLocaleTimeString();
            const profilePicUrl = '../Cdn/images/enroll.jpg';
            const commentCard = $(`
                <div class="card mt-2">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${profilePicUrl}" class="rounded-circle me-3" style="width: 50px; height: 50px;" alt="Profile Picture">
                            <div class="row">
                                <p class="card-text col-12 mb-0">${comment}</p>
                                <small class="text-muted">${templateName} - ${time}</small>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-primary edit-button"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-danger delete-button"><i class="bi bi-trash3"></i></button>
                        </div>
                    </div>
                </div>
            `);

            commentCard.find('.delete-button').on('click', () => commentCard.remove());

            function handleEdit(button) {
                const cardText = commentCard.find('.card-text');
                const editInput = $(`<textarea type="text" class="form-control col-12" value="${cardText.text()}">`);
                cardText.replaceWith(editInput);
                button.toggleClass('btn-primary btn-success').html('<i class="bi bi-check"></i>');

                button.off('click').on('click', function () {
                    const updatedComment = editInput.val().trim();
                    if (updatedComment) {
                        editInput.replaceWith(`<p class="card-text mb-0">${updatedComment}</p>`);
                        button.toggleClass('btn-success btn-primary').html('<i class="bi bi-pencil"></i>');

                        // Rebind the edit event
                        button.off('click').on('click', function () {
                            handleEdit($(this));
                        });
                    } else {
                        alert('Comment cannot be empty.');
                    }
                });
            }

            commentCard.find('.edit-button').on('click', function () {
                handleEdit($(this));
            });

            $('#commentDisplay').append(commentCard);
            $('#comment').val('');
        } else {
            alert('Please enter a comment.');
        }
    });
});

function displayVideo() {
    const videoId = getParams('video_id');
    $.getJSON('../Cdn/js/data/videos.json', function (data) {
        let videosData = data.data;

        // console.log(videosData)
        console.log(videosData)
        let watchVideo = videosData.filter(video => video.video_id == videoId);

        console.log(watchVideo)

        let videoDetailsHtml = ''

        watchVideo.forEach(video => {
            $(".videoFrame").attr("src", video.link)
            $(".videolist").attr("href", `manage.view.video.html?id=` + video.vid_group_id)


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
        console.log(recommendedVideos)
        let recommendedHtml = `
                <h1 class="montserrat-semibold text-center">Recommended Videos</h1>`;

        recommendedVideos.forEach(video => {
            recommendedHtml += `
                    <div class="card mt-3" data-ebook-id="${video.video_id}" role="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style="height:100%;">
                    <!-- Photo -->
                    <div class="img-container pt-2" style="height: 200px;">
                        <img src="${video.thumbnail_image}" class="card-img" alt="Image"
                            style="object-fit: contain; width: 100%; height: 100%;">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title text-uppercase montserrat-semibold m-0">${video.title}</h3>
                       
                    </div>
                </div>`;
        });

        $('.reco-videos').html(recommendedHtml);

        $('.card').click(function () {
            const videoId = $(this).data('ebook-id');
            $.getJSON('../Cdn/js/data/videos.json', function (data) {
                let response = data.data;
                f = response.keys(response).find(key => response[key].video_id === videoId);
                $(".offcanvas-title").text(response[f].title)
                $(".thumb").attr("src", response[f].thumbnail_image)
                $(".text-body").text(response[f].description)
                $(".watch-video").attr("href", `manage.training.watch.video.html?video_id=` + videoId)
            });
        });
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
            stars.forEach(s => {
                s.classList.remove('hover');
            });
            for (let i = value - 1; i >= 0; i--) {
                stars[i].classList.add('hover');
            }
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => {
                s.classList.remove('hover');
            });
        });
    });
}


