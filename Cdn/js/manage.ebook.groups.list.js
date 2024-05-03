$(document).ready(function () {
  displayEbookGroups(1, '', 'asc');
});

function displayEbookGroups(pageNumber, searchQuery, sortDirection) {
  const ebooksPerPage = 8;
  const startIndex = (pageNumber - 1) * ebooksPerPage;
  const endIndex = startIndex + ebooksPerPage;

  $.getJSON('../Cdn/js/data/ebook.groups.json', function (response) {
    const filteredData = searchQuery ? response.data.filter(ebook => {
      return ebook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
    }) : response.data;

    const sortedData = sortDirection === 'asc' ?
      filteredData.sort((a, b) => a.name.localeCompare(b.name)) :
      filteredData.sort((a, b) => b.name.localeCompare(a.name));

    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / ebooksPerPage);
    const currentPage = pageNumber;

    updatePagination(currentPage, totalPages);

    const ebooksResponse = sortedData.slice(startIndex, endIndex);

    let ebookListHtml = '';
    ebooksResponse.forEach(ebook => {
      ebookListHtml += `
        <div class="col-md-3 col-sm-6 col-xs-12 pb-4 hover-zoom">
          <a href="manage.ebooks.html?id=${ebook.ebook_group_id}" style="text-decoration: none;">
            <div class="card p-2" style="background-color:#131C39; color:#fff; height:15rem;">
              <div class="card-body">
                <h1 class="card-title pb-2" style="font-size:1.5rem;">${ebook.name}</h1>
                <p class="">${ebook.description}</p>
              </div>
            </div>
          </a>
        </div>
      `;
    });
    $('.ebooks').html(ebookListHtml);
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
  displayEbookGroups(pageNumber, document.getElementById('searchInput').value, $('#sortDirection').val());
}

function searchEbookGroups() {
  console.log('Search Input:', document.getElementById('searchInput').value);
  displayEbookGroups(1, document.getElementById('searchInput').value, currentSortDirection);
}

let currentSortDirection = 'asc';
function toggleSorting() {
  currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';

  const sortIcon = $('#sortIcon');
  sortIcon.removeClass('bi-caret-up-fill bi-caret-down-fill').addClass(currentSortDirection === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill');
  console.log(currentSortDirection)
  searchEbookGroups(currentSortDirection);
}
