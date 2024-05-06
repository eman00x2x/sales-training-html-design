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

        var thumbnailImage =
          "<h6>Uploaded Files</h6><div class='d-flex flex-row justify-content-start align-items-center rounded shadow-sm p-2 bg-white rounded border border-secondary-subtle'><img src='" +
          video.thumbnail_image +
          "' class='border border-secondary-subtle p-2 rounded' name='org_logo' style='height: 100px'/><div class='d-flex flex-column'><span class='ms-4 fw-semibold'>" +
          video.thumbnail_image.split("/").pop() +
          "</span></div></div>";
        $(".thumbnail_image").html(thumbnailImage);
      } else {
        console.log("Book not found with ID: " + videoId);
      }
    });
  });

  $(document).on("change", "#thumbnail", function (e) {
    var URL = window.URL || window.webkitURL;
    var file = e.target.files[0];

    const imageTag =
      "<h6>Uploaded Files</h6><div class='d-flex flex-row justify-content-start align-items-center rounded shadow-sm p-2 bg-white rounded border border-secondary-subtle'><img src='" +
      URL.createObjectURL(file) +
      "'class='border border-secondary-subtle p-2 rounded' name='org_logo' style='height: 100px'/><div class='d-flex flex-column'><span class='ms-4 fw-semibold'>" +
      e.target.files[0].name +
      "</span> <span class='ms-4 fw-normal'>" +
      formatFileSize(e.target.files[0].size) +
      "</span><div></div>";

    if (file) {
      $(".thumbnail_image").html(imageTag);
    }
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