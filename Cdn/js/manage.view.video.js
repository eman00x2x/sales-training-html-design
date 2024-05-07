$(document).ready(function () {
    displayVideo(1, '', 'title', '');

});

function displayVideo(pageNumber, sortDirection, sortBy, searchText) {

    const videosPerPage = 8;
    const startIndex = (pageNumber - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;

    const videoId = getParams('id');
    $.getJSON('../Cdn/js/data/videos.json', function (videoData) {

        let videoResponse = videoData.data;
        let video = videoResponse.filter(video => video.vid_group_id == videoId);
        let filteredVideos = [];

        

        filteredVideos = video.filter(video => {
            return video.title.toLowerCase().includes(searchText.toLowerCase()) ||
                video.isbn.toLowerCase().includes(searchText.toLowerCase()) ||
                video.author.toLowerCase().includes(searchText.toLowerCase());
        });

        sortDirection === 'asc' ?
            filteredVideos.sort((a, b) => a[sortBy].localeCompare(b[sortBy])) :
            filteredVideos.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));

        const totalItems = filteredVideos.length;
        const totalPages = Math.ceil(totalItems / videosPerPage);
        const currentPage = pageNumber;

        updatePagination(currentPage, totalPages);
        const videoResponse1 = filteredVideos.slice(startIndex, endIndex);

        let videoListHtml = '';
        videoResponse1.forEach(video => {
            videoListHtml += `
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
                    <div class="card" data-ebook-id="${video.ebook_id}">
                        <!-- Photo -->
                        <div class="img-container" style="height: 200px;">
                            <img src="${video.thumbnail_image}" class="card-img" alt="Image"
                                style="object-fit: contain; width: 100%; height: 100%;">
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${video.title}</h3>
                            <p class="text-secondary">${video.description} </p>
                        </div>
                    </div>
                </div>

          `;
        });
        $('.ebook-list').html(videoListHtml);
        $('.card').click(function() {
            const videoId = $(this).data('ebook-id'); 
            $.getJSON('../Cdn/js/data/videos.json', function (data) {
                let response = data.data;
                f = response.keys(response).find(key => response[key].video_id === videoId);
                $('#modalEbookTitle').text(response[f].title);
                // $('#modalEbookAuthor').text(response[f].author);
                $('#modalEbookDescription').text(response[f].description);
                $('#modalEbookImage').attr('src', response[f].thumbnail_image);
                // Set ebook ID for "Read Now" button
                $('#readNowButton').attr('href', 'manage.read.ebook.html?ebook_id=' + videoId);
                $('#exampleModal').modal('show');
            });
        });
    });
}


// sorting
let currentSortDirection = 'asc';
let sortBy = 'title';

function displayChosen(chosenText, selectedSortBy) {
    document.getElementById('dropdownMenuButton').innerText = chosenText;
    sortBy = selectedSortBy;
    searchVideo();
}

function searchVideo() {
    let searchText = document.getElementById('searchInput').value;
    displayVideo(1, currentSortDirection, sortBy, searchText);
}

function toggleSorting() {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    const sortIcon = $('#sortIcon');
    sortIcon.removeClass('bi-caret-up-fill bi-caret-down-fill').addClass(currentSortDirection === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill');
    searchVideo();
}


// pagination
function updatePagination(currentPage, totalPages) {
    const pageNumbers = document.getElementById('page-numbers');
    const paginationContainer = $('.btn-group');

    let paginationButtons = `<button type="button" class="btn btn-outline-primary ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">Previous</button>`;

    if (totalPages > 0) {

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationButtons += `<button type="button" class="btn btn-outline-primary ${activeClass}" onclick="changePage(${i})">${i}</button>`;
        }

        paginationButtons += `<button type="button" class="btn btn-outline-primary ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">Next</button>`;
        pageNumbers.innerHTML = `Showing ${currentPage} out of ${totalPages} pages`;

    } else {
        pageNumbers.innerHTML = `Showing 0 out of 0 pages`;
    }
    paginationContainer.html(paginationButtons);
}

function changePage(pageNumber) {
    displayVideo(pageNumber, currentSortDirection, sortBy, document.getElementById('searchInput').value);
}
