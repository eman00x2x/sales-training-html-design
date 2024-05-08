$(document).ready(function () {
  displayVideoGroups(1, '', 'name', 'asc');
});


let sortBy = 'name';
let sortDirection = 'asc';


function search() {
  displayVideoGroups(1, $('#search').val(), sortBy, sortDirection);
}


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
  const searchQuery=$('search').val();
  displayVideoGroups(pageNumber, searchQuery, sortBy, sortDirection);
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
  if (sortBy === 'name') {
    $('#sortByTitle').addClass('active');
  } else {
    $('#sortByDate').addClass('active');
  }
}

  function displayVideoGroups(pageNumber, searchQuery,sortBy, sortDirection) {

    const videosPerPage = 9;
    const startIndex = (pageNumber - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
  
    $.getJSON('../Cdn/js/data/video.groups.json', function (response) {
      const filteredData = searchQuery ? response.data.filter(video => {
        return video.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase());
      }) : response.data;

  
      sortedData = sortDirection === 'asc' ?
      filteredData.sort((b,a) => a.name.localeCompare(b.name)) :
      filteredData.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy == 'name') {
      // Sort by name
      sortedData = sortDirection === 'asc' ?
        filteredData.sort((a,b) => a.name.localeCompare(b.name)) :
        filteredData.sort((b,a) => a.name.localeCompare(b.name));
    } else if (sortBy === 'created_at') {
      // Sort by creation date
      sortedData = filteredData.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortDirection === 'asc' ?  dateB - dateA : dateA - dateB ;
      });
    }


      const totalItems = sortedData.length;
      const totalPages = Math.ceil(totalItems / videosPerPage);
      const currentPage = pageNumber;
  
      updatePagination(currentPage, totalPages);
  
      const videosResponse = sortedData.slice(startIndex, endIndex);
  
      let videoListHtml = '';
      videosResponse.forEach(video => {
        videoListHtml += `
          <div class="col-lg-4 col-md-6 col-sm-12 pb-4 hover-zoom">
            <a href="manage.view.video.html?id=${video.vid_group_id}" style="text-decoration: none;">
              <div class="card p-2" bg-white  shadow-sm  h-100 >
                <div class="card-body">
                  <h1 class="card-title pb-2" style="font-size:1.5rem;">${video.name}</h1>
                  <p class="">${video.description}</p>
                  <p class=""> <small>${convertDate(video.created_at)}</small> </p>
                </div>
              </div>
            </a>
          </div>
        `;
     
      });
      $('.ebooks').html(videoListHtml);
     
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
  


