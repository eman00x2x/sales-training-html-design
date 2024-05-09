let data;

const getModel = (url) => {
  $.getJSON(url, function (response) {
    data = response.data;
  });
};

function limitDataToTen(data, startIndex, itemsPerPage) {
  return data.slice(startIndex, startIndex + itemsPerPage);
}

const convertDate = (dateData) => {
  let date = new Date(0);
  date.setUTCSeconds(dateData);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDate = (epochTime) => {
  let date = new Date(epochTime * 1000);
  return date.toISOString().split("T")[0];
};

// function sortNamesAlphabetically() {
//   var rows = $('.table tbody tr').get();
//   rows.sort(function (a, b) {
//       var nameA = $(a).find('td:eq(3)').text().toUpperCase(); 
//       var nameB = $(b).find('td:eq(3)').text().toUpperCase(); 
//       return nameA.localeCompare(nameB);
//   });
//   $.each(rows, function (index, row) {
//       $('.table').append(row);
//   });
// }

function sortTable(sortBy, sortOrder) {
  var rows = $('.table tbody tr').get();
  rows.sort(function (a, b) {
    var valueA, valueB;
    if (sortBy === 'name') {
      valueA = $(a).find('[data-sort-key="name"]').text().toUpperCase();
      valueB = $(b).find('[data-sort-key="name"]').text().toUpperCase();
    } else if (sortBy === 'date') {
      var dateStrA = $(a).find('[data-sort-key="date"]').text();
      var dateStrB = $(b).find('[data-sort-key="date"]').text();
      var dateA = new Date(dateStrA);
      var dateB = new Date(dateStrB);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA; 
    }
    return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA); 
  });
  $.each(rows, function (index, row) {
    $('.table').append(row);
  });
}

$(document).ready(function () {
  $('.dropdown-menu a.dropdown-item').on('click', function (e) {
    e.preventDefault();
    var sortBy = $(this).data('sort-by');
    if (sortBy) {
      sortTable(sortBy, 'asc');
    }
  });

  $('button[data-sort-by]').on('click', function () {
    var sortBy = $(this).data('sort-by');
    var sortOrder = $(this).data('sort-order');
    if (sortBy) {
      sortTable(sortBy, sortOrder);
    }
  });
});


const displayActionButtons = (id) => {
  return `<td class='align-middle'>
              <div class="btn-group" role="group" aria-label="Basic outlined example ">
                  <button type="button" data-id='${id}' class="btn btn-md btn-view btn-outline-primary montserrat-semibold"><i class="bi bi-eye"></i><span class="ms-2">View</span></button>
                  <button type="button" data-id='${id}' class="btn btn-md btn-edit btn-outline-primary montserrat-semibold"><i class="bi bi-pencil-square"></i><span class="ms-2">Edit</span></button>
                  <button type="button" data-id='${id}' class="btn btn-md btn-delete btn-outline-danger montserrat-semibold"><i class="bi bi-trash"></i><span class="ms-2">Delete</span></button>
              </div>
          </td>`;
};

const returnFilteredData = (data1, data2, attr, filter = "") => {
  let expected = data1.map(a => Object.assign(a, data2.find(b => b[attr] == a[attr])));
  console.log('expected', expected)
  let filterByID = expected.filter(item => filter === "" ? item[attr] == id : item[filter] == id)

  return filterByID;
};

const niceTrim = (data, length) => {
  if (data.length < length) {
    return data;
  } else {
    return data.substring(0, length - 3) + "...";
  }
};

const formatFileSize = (bytes, decimalPoint = 2) => {
  if (bytes == 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const getParams = (p) => {
  let params = new URLSearchParams(window.location.search);
  if (params.has(p) === true) {
    return params.get(p);
  } else {
    alert("Undefined parameter '" + p + "'");
  }
};

$(document).ready(function () {
  $(".header").load("header.html");
  $(".sidebar").load("sidebar.html");
  $(".footer").load("footer.html");
});

$(document).on("click", ".btn-save", function (e) {
  e.preventDefault();

  const form = $("#form");

  console.log(form)

  $(".btn-save").css({
    cursor: "wait",
    "pointer-events": "none",
  });

  $("#form :input").attr("readonly", true);
  $(".btn-save").hide();

  $(".response").html(
    "<div class='bg-white p-3 mt-3 rounded'><div class='d-flex gap-3 align-items-center'><div class='loader'></div><p class='mb-0'>Processing, Please wait...</p></div></div>"
  );
  $("html, body").animate({ scrollTop: 0 }, "slow");

  setTimeout(function () {
    if ((message = validateInput(form.serializeArray()))) {
      const errorAlert =
        "<div class='response alert alert-danger alert-dismissible fade show mt-3' role='alert'><span>Follow the format for fields: " +
        message +
        "</span><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
      $(".response").html(errorAlert);
    } else {
      const successAlert =
        "<div class='response alert alert-success alert-dismissible fade show mt-3' role='alert'><span>Submitted but nothing happened! form data" +
        form.serialize() +
        ". See <a href='../Cdn/js/script.js'>../Cdn/js/script.js</a></span><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
      $(".response").html(successAlert);
    }

    $(".btn-save").css({
      cursor: "pointer",
      "pointer-events": "auto",
    });

    // $(".btn-save").show();
    // $("#form :input").removeAttr("readonly");
  }, 30);

  /* $.post(form.attr('action'), form.serialize(), function (data, status) {

    let response;

    if (typeof data == 'object') {
      response = data;
    } else { response = JSON.parse(data); }

    $('.btn-save').css({
      'cursor': 'pointer',
      'pointer-events': 'auto'
    });

    $('.btn-save').show();
    $('.response').html(response.message);
    $("#form :input").removeAttr('readonly');

    if (response.status == 1) {
      if ($('#reference_url').val() !== undefined) {

        let message = " <div class='bg-white p-3 mt-3 rounded'><div class='d-flex gap-3 align-items-center'><div class='loader'></div><p class='mb-0'>Please wait while you are redirecting...</p></div></div>";

        $('.response').html(message);

        setTimeout(function () {
          window.location = $('#reference_url').val();
        }, 10);
      }
    }

  }); */

  return false;
});

$(document).on("click", ".pagination-btn", function () {
  var pageNumber = $(this).data("page");
  getVideoData(pageNumber);
});

$(document).on("click", ".prev", function () {
  var pageNumber = $(this).data("page") === 1 ? $(this).data("page") : $(this).data("page") - 1;
  getVideoData(pageNumber);
});

$(document).on("click", ".next", function () {
  var pageNumber = $(this).data("page") === $(this).data("max") ? $(this).data("page") : $(this).data("page") + 1;
  getVideoData(pageNumber);
});

function generatePagination(totalItems, currentPage) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let paginationHtml = "";
  
  const maxButtons = 3;

  let startPage = currentPage - 1;
  if (startPage <= 0) startPage = 1;

  if (totalPages - currentPage < 2) {
    startPage = totalPages - maxButtons + 1;
    if (startPage <= 0) startPage = 1;
  }
  
  $(".prev-btn").html(
    `<button
    type="button"
    class="btn btn-outline-primary montserrat-semibold prev rounded-left"
    data-page=${currentPage}
  >
    <span class="d-none d-md-block rounded-left">Previous</span
    ><i class="bi bi-chevron-double-left d-block d-md-none"></i>
  </button>`
  );

  for (let i = startPage; i < startPage + maxButtons && i <= totalPages; i++) {
    paginationHtml += `<button type="button" class="btn btn-outline-primary montserrat-semibold pagination-btn rounded-0" data-page="${i}">${i}</button>`;
  }

  $(".next-btn").html(
    `<button
    type="button"
    class="btn btn-outline-primary montserrat-semibold next rounded-right"
    data-page=${currentPage}
    data-max=${totalPages}
  >
    <span class="d-none d-md-block rounded-right">Next</span
    ><i class="bi bi-chevron-double-right d-block d-md-none"></i>
  </button>`
  );

  $(".showing").html(`<p class="align-center my-auto">Showing ${currentPage} out of ${totalPages} pages</p>`);
  $(".pagination-page").html(paginationHtml);
  $(".pagination-btn").removeClass("active");
  $(`.pagination-btn[data-page="${currentPage}"]`).addClass("active");
}
