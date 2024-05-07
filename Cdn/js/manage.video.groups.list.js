$(document).ready(function () {
  displayVideoGroups(1, '', 'asc');
});

function displayVideoGroups(pageNumber, searchQuery, sortDirection) {
  const videosPerPage = 8;
  const startIndex = (pageNumber - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;

  $.getJSON('../Cdn/js/data/video.groups.json', function (response) {
    const filteredData = searchQuery ? response.data.filter(video => {
      return video.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
    }) : response.data;

    const sortedData = sortDirection === 'asc' ?
      filteredData.sort((a, b) => a.name.localeCompare(b.name)) :
      filteredData.sort((a, b) => b.name.localeCompare(a.name));

    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / videosPerPage);
    const currentPage = pageNumber;

    updatePagination(currentPage, totalPages);

    const videosResponse = sortedData.slice(startIndex, endIndex);

    let videoListHtml = '';
    videosResponse.forEach(video => {
      videoListHtml += `
        <div class="col-md-3 col-sm-6 col-xs-12 pb-4 hover-zoom">
          <a href="manage.video.list.html?id=${video.video_group_id}" style="text-decoration: none;">
            <div class="card p-2" style="background-color:#131C39; color:#fff; height:15rem;">
              <div class="card-body">
                <h1 class="card-title pb-2" style="font-size:1.5rem;">${video.name}</h1>
                <p class="">${video.description}</p>
              </div>
            </div>
          </a>
        </div>
      `;
    });
    $('.video').html(videoListHtml);
  });
}

function updatePagination(currentPage, totalPages) {
  const pageNumbers = document.getElementById('page-numbers');
  const paginationContainer = $('.btn-group');

  let paginationButtons = '';

  if (totalPages > 0) {
    paginationButtons += `<button type="button" class="btn btn-outline-primary ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">Previous</button>`;

    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? 'active' : '';
      paginationButtons += `<button type="button" class="btn btn-outline-primary ${activeClass}" onclick="changePage(${i})">${i}</button>`;
    }

    paginationButtons += `<button type="button" class="btn btn-outline-primary ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">Next</button>`;
  } else {
    paginationButtons = '';
  }

  pageNumbers.innerHTML = totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages';
  paginationContainer.html(paginationButtons);
}

function changePage(pageNumber) {
  displayVideoGroups(pageNumber, document.getElementById('searchInput').value, $('#sortDirection').val());
}

$(document).on("keyup", '.search', function () {
  let value = $(this).val().toLowerCase();

  $(".ebooks .data-container tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});


let currentSortDirection = 'asc';
function toggleSorting() {
  currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';

  const sortIcon = $('#sortIcon');
  sortIcon.removeClass('bi-caret-up-fill bi-caret-down-fill').addClass(currentSortDirection === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill');
  console.log(currentSortDirection)
  searchVideoGroups(currentSortDirection);
}
