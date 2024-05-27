let currentPage = 1, search = '', order = '', sortBy = '',
  filterData = [{
    "Category": [
      { displayed: "Package", value: "package" }, 
      { displayed: "Individual", value: "individual" }
    ]
  },
  {
    "Type": [
      { displayed: "Silver", value: "silver" }, 
      { displayed: "Gold", value: "gold" }
    ]
  }];

filterBy = [];

$(document).ready(function () {
    displayPremiums(sortBy, order);
    printFilters();
    checkCartState();
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1;
    displayPremiums(sortBy, order);
});

// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc';
    displayPremiums(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc';
    displayPremiums(sortBy, order);
});

// SORT BY TITLE
$(document).on("click", '.dropdown-title', function () {
    $('.dropdown-title').addClass('active');
    $('.dropdown-id').removeClass('active');
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'name';
    displayPremiums(sortBy, order);
});

// SORT BY DATE CREATED
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-title').removeClass('active');
    $('.dropdown-created-date').addClass('active');
    sortBy = 'created_at';
    displayPremiums(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    displayPremiums(sortBy, order);
});

// FILTER
$(document).on('change', '.checklist-filter', function (e) {
    let checkboxes = $(".checklist-filter:checkbox");
    let checkedValues = [];

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            // Push the value associated with the checked checkbox
            checkedValues.push(checkboxes[i].value);
        }
    }

    filterBy = checkedValues;
    console.log("FilterBy array:", filterBy);
    displayPremiums(sortBy, order);
});

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
    return str.toLowerCase();
}

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
    const filterBySearch = search ? data.filter(item =>
      lowerCase(`${item.name}`).includes(lowerCase(search)) ||
      item.premium_id == search
    ) : data;
    console.log(filterBy);

    const filter = filterBy.length > 0 ? filterBySearch.filter(item => {
      return filterBy.some(selectedFilter => {
          // Check if the selected filter matches either category or type
          return item.category.toLowerCase() === selectedFilter.toLowerCase() ||
                 item.type.toLowerCase() === selectedFilter.toLowerCase();
      });
  }) : filterBySearch;

    return filter;
}

// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
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

function printFilters() {
    let html = '';

    for (const item of filterData) {
        const regex = /[-_]/g;
        const key = Object.keys(item)[0];
        const replacedKey = Object.keys(item)[0].replace(regex, " ");
        const value = item[key];

        html += `<div class="px-3">
                        <span class="form-check-label montserrat-medium py-2 text-uppercase">${replacedKey}</span>`;

        for (const data of value) {
            html += `<div class="form-check">
                                        <input class="checklist-filter form-check-input" name="${key}" value="${data.value}" type="checkbox">
                                        <label class="checklist-filter form-check-label" name="${key}">
                                            ${data.displayed}
                                        </label>
                                    </div>`;
        }
        html += `</div>`;
    }

    $(".filter-list").html(html);
}

// GET THE DATA
function displayPremiums(sortBy, order) {
  const limit = 10;
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  $.getJSON('../Cdn/js/data/premiums.json', function (response) {
    const premium = response.data;
    const sortedData = sortData(isSearchQuery(premium), order, sortBy);
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / limit);
    updatePagination(totalPages);
    const slicedData = sortedData.slice(startIndex, endIndex);
    let premiumListHtml = '';
    slicedData.forEach(premium => {
      premiumListHtml += `
      <div class="col-lg-4 col-md-6 col-sm-12 pb-4">
      <div class="card p-2 bg-white shadow-sm" style="min-height:17rem;">
          <div class="card-body d-flex flex-column justify-content-between">
              <div>
                  <h1 class="card-title pb-2" style="font-size:1.5rem;">${premium.name}</h1>
                  <p class="">${premium.description}</p>
                  <p class="card-text text-secondary text-end"><small>${convertDate(premium.created_at)}</small></p>
              </div>
              <div class="row g-2 pt-3">
                  <div class="col-6">
                      <button class="btn btn-outline-primary w-100 add-to-cart" 
                              data-premium-id="${premium.premium_id}" 
                              data-premium-name="${premium.name}" 
                              data-premium-price="${premium.price}"
                              data-premium-description="${premium.description}"
                              data-premium-type="${premium.type}"
                              data-premium-category="${premium.category}">
                          Add to Cart
                      </button>
                  </div>
                  <div class="col-6">
                      <button class="btn btn-outline-secondary w-100 view-details" data-premium-id="${premium.premium_id}">Preview</button>
                  </div>
              </div>
          </div>
      </div>
  </div>`;
    });
    $('.ebooks').html(premiumListHtml);
    checkCartState(); // Call this function after rendering the buttons
  });
}

// UPDATE THE PAGE NUMBERS IN PAGE BUTTONS
function updatePagination(totalPages) {
  let paginationButtons = '';

  if (totalPages > 0) {
      paginationButtons += `
      <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPage === 1 ? 'disabled' : ''}" data-num="${currentPage - 1}">
          <span class="d-none d-md-block">Previous</span>
          <i class="bi bi-chevron-double-left d-block d-md-none"></i>
      </button>`;

      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(startPage + 2, totalPages);

      for (let i = startPage; i <= endPage; i++) {
          const activeClass = i === currentPage ? 'active' : '';
          paginationButtons += `<button type="button" class="btn-page btn btn-outline-primary ${activeClass}" data-num="${i}">${i}</button>`;
      }

      paginationButtons += `
      <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPage === totalPages ? 'disabled' : ''}" data-num="${currentPage + 1}">
          <span class="d-none d-md-block">Next</span>
          <i class="bi bi-chevron-double-right d-block d-md-none"></i>
      </button>`;
  } else {
      paginationButtons = '';
  }

  $('#page-numbers').html(totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages');
  $('.page-buttons').html(paginationButtons);
}

// ADD TO CART
$(document).on('click', '.add-to-cart', function () {
  const button = $(this);
  const premiumId = button.data('premium-id');
  const premiumName = button.data('premium-name');
  const premiumPrice = button.data('premium-price');
  const premiumDescription = button.data('premium-description');
  const premiumType = button.data('premium-type');
  const premiumCategory = button.data('premium-category');

  // Retrieve current cart from session storage or initialize a new array if it doesn't exist
  let cart = sessionStorage.getItem('cart');
  cart = cart ? JSON.parse(cart) : [];

  // Check if the item already exists in the cart
  const existingItemIndex = cart.findIndex(item => item.id === premiumId);
  if (existingItemIndex !== -1) {
      // If the item exists, remove it from the cart
      cart.splice(existingItemIndex, 1);
      button.removeClass('btn-success').addClass('btn-outline-primary').text('Add to Cart');
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
      button.removeClass('btn-outline-primary').addClass('btn-success').text('Added to Cart');
  }

  // Save the updated cart back to session storage
  sessionStorage.setItem('cart', JSON.stringify(cart));

  // Optional: Display a message or update the cart UI
  // alert(`${premiumName} has been ${existingItemIndex !== -1 ? 'removed from' : 'added to'} your cart.`);
});

// Function to check the state of buttons on page load
function checkCartState() {
  let cart = sessionStorage.getItem('cart');
  cart = cart ? JSON.parse(cart) : [];
  
  $('.add-to-cart').each(function () {
      const button = $(this);
      const premiumId = button.data('premium-id');
      const existsInCart = cart.some(item => item.id === premiumId);
      
      if (existsInCart) {
          button.removeClass('btn-outline-primary').addClass('btn-success').text('Added to Cart');
      } else {
          button.removeClass('btn-success').addClass('btn-outline-primary').text('Add to Cart');
      }
  });
}

//PREVIEW GROUPS
$(document).on('click', '.view-details', function () {
  const premiumId = $(this).data('premium-id');
  window.location.href = `manage.preview.premiums.html?id=${premiumId}`;
});

