$(document).ready(function () {
    displayVideo(1, '', 'asc', 'title');

});


function search() {
    console.log('Search Input:', document.getElementById('search').value);
    displayVideo(1, document.getElementById('search').value, sortBy, sortDirection);
  }



let sortBy = 'title';
let sortDirection = 'asc';


function updateSortDirection(direction) {
    sortDirection = direction;
    console.log(sortDirection);
    highlightSortDirection();
    search();
  }
  
  function updateSortBy(by) {
    sortBy = by;
    search();
    highlightSortBy();
  }
  function changePage(pageNumber) {
    const searchText=document.getElementById('search').value;
    displayVideo(pageNumber, searchText, sortBy, sortDirection);
  }
  function highlightSortDirection() {
    $('.btn-sort-direction').removeClass('active');
    if (sortDirection === 'asc') {
      $('#btnSortAsc').addClass('active');
    } else {
      $('#btnSortDesc').addClass('active');
    }
  }
  
  function highlightSortBy() {
    $('.dropdown-item.sort-by').removeClass('active');
    if (sortBy === 'title') {
      $('#sortByTitle').addClass('active');
    } else {
      $('#sortByDate').addClass('active');
    }
  }
// pagination





function displayVideo(pageNumber, searchText, sortBy, sortDirection) {

    console.log('Sort By:', sortBy);
    console.log('Sort Direction:', sortDirection);
    console.log('Sort queyr', searchText);


    const videosPerPage = 8;
    const startIndex = (pageNumber - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;

    const videoId = getParams('id');



    $.getJSON('../Cdn/js/data/videos.json', function (videoData) {

        let videoResponse = videoData.data;
        let videoview = videoResponse.filter(video => video.vid_group_id == videoId);
        console.log(videoview)



         const filteredVideos = searchText ? videoview.filter(video => {
            return video.title.toLowerCase().includes(searchText.toLowerCase()) ||
                video.category.toLowerCase().includes(searchText.toLowerCase()) ||
                video.description.toLowerCase().includes(searchText.toLowerCase());
        }) : videoview;

        console.log(filteredVideos)

        sortedData = sortDirection === 'asc' ?
             filteredVideos.sort((b,a) => a.title.localeCompare(b.title)) :
            filteredVideos.sort((a,b) => a.title.localeCompare(b.title));

        if(sortBy == 'title')
        {
            sortedData = sortDirection === 'asc' ?
            filteredVideos.sort((a,b) => a.title.localeCompare(b.title)) :
            filteredVideos.sort((b,a) => a.title.localeCompare(b.title));
        }else if (sortBy === 'category')
            {
                sortedData = sortDirection === 'asc' ?
        filteredVideos.sort((a, b) => a.category.localeCompare(b.category)) :
        filteredVideos.sort((b, a) => a.category.localeCompare(b.category));
            }

         

        const totalItems = filteredVideos.length;
        const totalPages = Math.ceil(totalItems / videosPerPage);
        const currentPage = pageNumber;


        updatePagination(currentPage, totalPages);
        const videoResponse1 = filteredVideos.slice(startIndex, endIndex);

            // console.log(videoResponse1)

        let videoListHtml = '';
        videoResponse1.forEach(video => {

          // console.log(video)
            videoListHtml += `
                <div class="col-lg-4 col-md-6 col-sm-12 mb-2">
                    <div class="card" data-ebook-id="${video.video_id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <!-- Photo -->
                        <div class="img-container pt-2" style="height: 200px;">
                            <img src="${video.thumbnail_image}" class="card-img" alt="Image"
                                style="object-fit: contain; width: 100%; height: 100%;">
                        </div>
                        <div class="card-body">
                            <h3 class="card-title text-uppercase montserrat-semibold">${video.title}</h3>
                            <p class=" card-text text-secondary">${video.description} </p>
                            <p class=" card-text text-secondary text-end"> <small>${convertDate(video.created_at)}</small>  </p>
                            
          
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

                console.log(videoId);

                console.log(response[f])

                $(".offcanvas-title").text(response[f].title)
                $(".thumb").attr("src",response[f].thumbnail_image)
                $(".text-body").text(response[f].description)
                $(".watch-video").attr("href",`manage.watch.video.html?video_id=`+ videoId)

              
                // $('#modalEbookTitle').text(response[f].title);
                // // $('#modalEbookAuthor').text(response[f].author);
                // $('#modalEbookDescription').text(response[f].description);
                // $('#modalEbookImage').attr('src', response[f].thumbnail_image);
                // // Set ebook ID for "Read Now" button
                // $('#readNowButton').attr('href', 'manage.read.ebook.html?ebook_id=' + videoId);
                // $('#exampleModal').modal('show');
            });
        });
    });
}

function updatePagination(currentPage, totalPages) {
    const pageNumbers = document.getElementById('page-numbers'); 
    const paginationContainer = $('.btn-group');
  
    let paginationButtons = '';
  
    if (totalPages > 0) {
      paginationButtons += `
      <button type="button" class="btn btn-outline-primary montserrat-semibold ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">
          <span class="d-none d-md-block">Previous</span>
          <i class="bi bi-chevron-double-left d-block d-md-none"></i>
      </button>`;
  
      for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationButtons += `<button type="button" class="btn btn-outline-primary ${activeClass}" onclick="changePage(${i})">${i}</button>`;
      }
  
      paginationButtons += `<button type="button" class="btn btn-outline-primary montserrat-semibold ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">
       <span class="d-none d-md-block">Next</span>
      <i class="bi bi-chevron-double-right d-block d-md-none"></i>
  </button>`;
    } else {
      paginationButtons = '';
    }
  
    pageNumbers.innerHTML = totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages';
    paginationContainer.html(paginationButtons);
  }
// sorting

