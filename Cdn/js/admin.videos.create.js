$(document).ready(function () {
  $(".video-div-logo").css("display", "none")
})

$(document).on("click", "#back", function (e) {
  window.location.href = "admin.videos.list.html";
});

$(document).on("click", ".btn-remove", function (e) {
  $(".video-div-logo").css("display", "none");
});

$(document).on("change", "#logo", function (e) {
  let reader = new FileReader();

  reader.onload = function (event) {
      $(".video-div-logo").css("display", "block")
      $(".video-logo").attr('src', event.target.result)
      $(".file-name").text(e.target.files[0].name)
      $(".file-size").text(formatFileSize(e.target.files[0].size))
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