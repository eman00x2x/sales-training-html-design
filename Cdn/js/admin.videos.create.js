$(document).ready(function () {
  $(".video-div-logo").css("display", "none")
})

// $(document).on("change", "#thumbnail", function (e) {
//   var URL = window.URL || window.webkitURL;
//   var file = e.target.files[0];

//   const imageTag =
//     "<h6>Uploaded Files</h6><div class='d-flex flex-row justify-content-start align-items-center rounded shadow-sm p-2 bg-white rounded border border-secondary-subtle'><img src='" +
//     URL.createObjectURL(file) +
//     "'class='border border-secondary-subtle p-2 rounded' name='org_logo' style='height: 100px'/><div class='d-flex flex-column'><span class='ms-4 fw-semibold'>" +
//     e.target.files[0].name +
//     "</span> <span class='ms-4 fw-normal'>" +
//     formatFileSize(e.target.files[0].size) +
//     "</span><div></div>";

//   if (file) {
//     $(".thumbnail_image").html(imageTag);
//     $(".video-div-logo").css("display", "block")
//   }
// });

$(document).on("click", ".btn-remove", function (e) {
  $(".video-div-logo").css("display", "none");
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
      description: data.description,
      category: data.category,
      link: data.link,
    },
    {
      logo: {
        type: "image/png,image/jpeg",
      },
      title: {
        presence: { allowEmpty: false },
        type: "string",
        length: { minimum: 1 },
      },
      description: {
        presence: { allowEmpty: false },
        type: "string",
        length: { minimum: 1 },
      },
      category: {
        presence: { allowEmpty: false },
      },
      link: {
        presence: { allowEmpty: false },
        type: "string",
        length: { minimum: 1 },
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
