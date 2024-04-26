let data;

const getModel = (url) => {
  $.getJSON(url, function (response) {
	data = response.data;
  });
};

const convertDate = (dateData) => {
  let date = new Date(0);
  date.setUTCSeconds(dateData);
  return date.toLocaleDateString("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
  });
};

const niceTrim = (data, length) => {
	if (data.length < length) {
      return data;
    } else {
      return data.substring(0, length - 3) + "...";
    }
};

$(document).on("click", ".btn-save", function (e) {
  e.preventDefault();

  const form = $("#form");

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
	  $(".response").html(message);
	} else {
	  $(".response").html(
		"<p>Submitted but nothing happened! form data " +
		  form.serialize() +
		  " see <a href='../Cdn/js/script.js'>../Cdn/js/script.js</a></p>"
	  );
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