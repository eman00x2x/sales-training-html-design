$(document).ready(function () {
  $(".header").load("header.html");
  $(".sidebar").load("sidebar.html");
  $(".footer").load("footer.html");
});

$(document).on("click", ".btn-cancel", function () {
  window.location.href = "videos.list.html";
});

$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  var videoId = urlParams.get("id");

  $.getJSON("../Cdn/js/data/videos.json", function (response) {
    var video = response.data.find(function (item) {
      return item.video_id == videoId;
    });
    if (video) {
      $("#title").val(video.title);
      $("#category").val(video.category);
      $("#description").val(video.description);
      $("#link").val(video.link);

      $(".vidLogo").attr("src", video.thumbnail_image);
    } else {
      console.log("Book not found with ID: " + videoId);
    }
  });
});

$(document).on("change", "#logo", function (e) {
  let reader = new FileReader();

  reader.onload = function () {
    $(".vidLogo").attr("src", URL.createObjectURL(e.target.files[0]));
  }

  reader.readAsDataURL(e.target.files[0]);
});

function validateInput(input) {
  let message = [];

  const data = input.reduce(function (obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});

  const validator = validate(
    {
      thumbnail: data.thumbnail,
      title: data.title,
      category: data.category,
      description: data.description,
      link: data.link,
    },
    {
      logo: {
        type: "image/png,image/jpeg",
      },
      title: {
        presence: { allowEmpty: false },
        type: "string",
        length: { maximum: 100 },
      },
      category: {
        presence: { allowEmpty: false },
      },
      description: {
        presence: { allowEmpty: false },
        type: "string",
        length: { maximum: 350 },
      },
      link: {
        presence: { allowEmpty: false },
        type: "string",
        length: { maximum: 100 },
      },
    }
  );

  if (validator !== undefined) {
    for (key in validator) {
      message.push(validator[key]);
    }
    return message.join(", ");
  }

  return false;
}

$(document).on("click", "#back", function (e) {
  window.location.href = "admin.videos.list.html";
});