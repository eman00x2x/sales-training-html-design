let currentPage = 1, search = '', order = '', sortBy = '';

$(document).ready(function () {
  displayEbookGroups(sortBy, order);
  fetchPremiumDetails();
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
  
    // Fetch data from both ebook.groups.json and video.groups.json
    $.when(
      $.getJSON('../Cdn/js/data/ebook.groups.json'),
      $.getJSON('../Cdn/js/data/video.groups.json')
    ).done(function(ebookResponse, videoResponse) {
      const ebookData = ebookResponse[0].data;
      const videoData = videoResponse[0].data;
  
      // Combine ebook and video data
      const combinedData = ebookData.concat(videoData);
  
      // Sort and paginate combined data
      const sortedData = sortData(isSearchQuery(combinedData), order, sortBy);
      const totalItems = sortedData.length;
      const totalPages = Math.ceil(totalItems / limit);
      const slicedData = sortedData.slice(startIndex, endIndex);
  
      let itemListHtml = '';
      slicedData.forEach(item => {
        itemListHtml += `
          <div class="col-lg-4 col-md-6 col-sm-12 pb-4 hover-zoom">
              <div class="card p-2 bg-white shadow-sm" style="height:15rem;">
                <div class="card-body">
                  <h1 class="card-title pb-2" style="font-size:1.5rem;">${item.name}</h1>
                  <p class="">${item.description}</p>
                  <p class="card-text text-secondary text-end"><small>${convertDate(item.created_at)}</small></p>
                </div>
              </div>
          </div>`;
      });
  
      $('.ebooks').html(itemListHtml);
      updatePagination(totalPages);
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

function fetchPremiumDetails() {
    const premiumId = getParams('id');
    $.getJSON('../Cdn/js/data/premiums.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].premium_id == premiumId);
        console.log(response[f])

        $("#header").text(response[f].name)
        $(".description").text(response[f].description)

        $(".add-to-cart").attr("data-premium-id", response[f].premium_id);
        $(".add-to-cart").attr("data-premium-name", response[f].name);
        $(".add-to-cart").attr("data-premium-price", response[f].cost);
        $(".add-to-cart").attr("data-premium-decription", response[f].decription);
        $(".add-to-cart").attr("data-premium-type", response[f].type);
        $(".add-to-cart").attr("data-premium-category", response[f].category);
        
        // Check if premium is in cart and update button text
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const isInCart = cart.some(item => item.id === response[f].premium_id);
        if (isInCart) {
          $(".add-to-cart").text("Added to Cart");
          $(".add-to-cart").removeClass("btn-outline-primary").addClass("btn-success");
      } else {
          $(".add-to-cart").text("Add to Cart");
          $(".add-to-cart").removeClass("btn-success").addClass("btn-outline-primary");
      }
    });
}

//ADD TO/REMOVE FROM CART
$(document).on('click', '.add-to-cart', function () {
  const button = $(this);
  const premiumId = button.data('premium-id');
  const premiumName = button.data('premium-name');
  const premiumPrice = button.data('premium-price');
  const premiumDescription = button.data('premium-description');
  const premiumType = button.data('premium-type');
  const premiumCategory = button.data('premium-category');
  
  // Retrieve current cart from session storage or initialize a new array if it doesn't exist
  let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  // Check if the item already exists in the cart
  const existingItemIndex = cart.findIndex(item => item.id === premiumId);
  if (existingItemIndex !== -1) {
      // If the item exists, remove it from the cart
      cart.splice(existingItemIndex, 1);
      button.text('Add to Cart');
      button.removeClass('btn-success').addClass('btn-outline-primary');
  } else {
      // Add the new item to the cart
      cart.push({
          id: premiumId,
          name: premiumName,
          price: premiumPrice,
          description: premiumDescription,
          type: premiumType,
          category: premiumCategory,
      });
      button.text('Added to Cart');
      button.removeClass('btn-outline-primary').addClass('btn-success');
  }
  
  // Save the updated cart back to session storage
  sessionStorage.setItem('cart', JSON.stringify(cart));
});
