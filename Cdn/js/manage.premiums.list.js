let currentPage = 1, search = '', order = '', sortBy = '';

$(document).ready(function () {
  displayEbookGroups(sortBy, order);
});

// SEARCH
$(document).on("keyup", '.search', function () {
  search = $(this).val().toLowerCase();
  currentPage = 1
  displayEbookGroups(sortBy, order);
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
  $('.btn-sort-asc').addClass('active');
  $('.btn-sort-desc').removeClass('active');
  order = 'asc'
  displayEbookGroups(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
  $('.btn-sort-desc').addClass('active');
  $('.btn-sort-asc').removeClass('active');
  order = 'desc'
  displayEbookGroups(sortBy, order);
});

// SORT BY E-BOOK TITLE
$(document).on("click", '.dropdown-title', function () {
  $('.dropdown-title').addClass('active');
  $('.dropdown-created-date').removeClass('active');
  sortBy = 'name'
  displayEbookGroups(sortBy, order);
});

// SORT BY ORGANIZATION CREATED DATE
$(document).on("click", '.dropdown-created-date', function () {
  $('.dropdown-created-date').addClass('active');
  $('.dropdown-title').removeClass('active');
  sortBy = 'created_at'
  displayEbookGroups(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
  currentPage = $(this).data('num');
  displayEbookGroups(sortBy, order);
});

//GO TO EBOOKS
$(document).on('click', '.card', function (e) {
  const ebookId = $(this).data('ebook-id');
  window.location.href = "manage.ebooks.html?id=" + ebookId;
});

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
  return str.toLowerCase();
}

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
  const filter = search ? data.filter(item =>
      lowerCase(item.name).includes(lowerCase(search)) ||
      item.organization_id == search
  ) : data;

  return filter;
}


// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
  console.log(property)
  console.log(order)
  console.log(property)
  switch (order) {
      case "asc":
          if (property === "name")
            return data.sort((a, b) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
          else if (property === "created_at")
              return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
          else
              return data.sort((a, b) => a.name.localeCompare(b.name));
      case "desc":
          if (property === "name")
            return data.sort((b, a) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
          else if (property === "created_at")
              return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
          else
              return data.sort((b, a) => a.name.localeCompare(b.name));
      default:
          return data;
  }
}

// GET THE DATA
function displayEbookGroups(sortBy, order) {
  const limit = 10;
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  $.getJSON('../Cdn/js/data/premiums.json', function (response) {
    const ebook = response.data;
    const sortedData = sortData(isSearchQuery(ebook),order,sortBy);
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / limit);
    updatePagination(totalPages);
    const slicedData = sortedData.slice(startIndex, endIndex);
    let ebookListHtml = '';
    slicedData.forEach(ebook => {
      ebookListHtml += `
      <div class="col-lg-4 col-md-6 col-sm-12 pb-4 hover-zoom">
        <a href="manage.ebooks.html?id=${ebook.ebook_group_id}" style="text-decoration: none;">
            <div class="card p-2 bg-white shadow-sm" style="height:15rem;">
              <div class="card-body">
                <h1 class="card-title pb-2" style="font-size:1.5rem;">${ebook.name}</h1>
                <p class="">${ebook.description}</p>
                <p class=" card-text text-secondary text-end"> <small>${convertDate(ebook.created_at)}</small>  </p>
              </div>
            </div>
          </a>
        </div>
      `;
    });
    $('.ebooks').html(ebookListHtml);
  });
}

// UPDATE THE PAGE NUMBERS IN PAGE BUTTONS
function updatePagination(totalPages) {
  let paginationButtons = '';

  if (totalPages > 0) {
      paginationButtons += `
      <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPage === 1 ? 'disabled' : ''}" data-num="${currentPage - 1}"">
          <span class="d-none d-md-block">Previous</span>
          <i class="bi bi-chevron-double-left d-block d-md-none"></i>
      </button>`;

      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(startPage + 2, totalPages);

      for (let i = startPage; i <= endPage; i++) {
          const activeClass = i === currentPage ? 'active' : '';
          paginationButtons += `<button type="button" class="btn-page btn btn-outline-primary ${activeClass}" data-num="${i}"">${i}</button>`;
      }

      paginationButtons += `
      <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPage === totalPages ? 'disabled' : ''}" data-num="${currentPage + 1}">
          <span class="d-none d-md-block">Next</span>
          <i class="bi bi-chevron-double-right d-block d-md-none"></i>
      </button>`;
  } else
      paginationButtons = '';

  $('#page-numbers').html(totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages');
  $('.page-buttons').html(paginationButtons);
}

