$(document).ready(function () {
  displayEbookGroups(1, '', 'asc', 'name');
});

let sortBy = 'name';
let sortDirection = 'asc';

function search() {
  console.log('Search Input:', document.getElementById('search').value);
  displayEbookGroups(1, document.getElementById('search').value, sortBy, sortDirection);
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
  const searchQuery=document.getElementById('search').value;
  displayEbookGroups(pageNumber, searchQuery, sortBy, sortDirection);
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


function displayEbookGroups(pageNumber, searchQuery, sortBy, sortDirection) {
  console.log('Sort By:', sortBy);
  console.log('Sort Direction:', sortDirection);
  console.log('Sort queyr', searchQuery);
  const ebooksPerPage = 8;
  const startIndex = (pageNumber - 1) * ebooksPerPage;
  const endIndex = startIndex + ebooksPerPage;

  $.getJSON('../Cdn/js/data/ebook.groups.json', function (response) {
    const filteredData = searchQuery ? response.data.filter(ebook => {
      return ebook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
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




