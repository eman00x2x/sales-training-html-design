let data;

const getModel = (url) => {
  $.getJSON(url, function (response) {
    data = response.data;
  });
};

function limitDataToTen(data) {
  return data.slice(0, 10);
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
  return date.toISOString().split('T')[0];
};


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
}

const returnFilteredData = (data1, data2, attr, filter = "") => {
  let expected = data1.map(a => Object.assign(a, data2.find(b => b[attr] == a[attr])));
  console.log('expected', expected)
  let filterByID = expected.filter(item => filter === "" ? item[attr] == id : item[filter] == id)

  return filterByID;
}

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
  let params = new URLSearchParams(window.location.search)
  if (params.has(p) === true) {
    return params.get(p);
  } else {
    alert("Undefined parameter '" + p + "'");
  }
}

$(document).ready(function () {
  $(".header").load("header.html");
  $(".sidebar").load("sidebar.html");
  $(".footer").load("footer.html");
});

$(document).on("click", ".btn-save", function (e) {
  e.preventDefault();

  const form = $("#form");

  console.log(form.serializeArray());

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
      const successAlert = "<div class='response alert alert-success alert-dismissible fade show mt-3' role='alert'><span>Submitted but nothing happened! form data" +
        form.serialize() +
        ". See <a href='../Cdn/js/script.js'>../Cdn/js/script.js</a></span><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
      $(".response").html(successAlert);
    }

    $(".btn-save").css({
      cursor: "pointer",
      "pointer-events": "auto",
    });

    $(".btn-save").show();
    $("#form :input").removeAttr("readonly");
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
