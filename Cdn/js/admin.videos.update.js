$(document).ready(function () {
  let id = getParams('id');

  $.getJSON("../Cdn/js/data/videos.json", function (data) {
    let response = data.data;
    video_data = data.data
    f = response
      .keys(response)
      .find((key) => response[key].video_id == id);

    $(".vidLogo").attr("src", response[f].thumbnail_image);
    $("#title").val(response[f].title);
    $("#category").val(response[f].category);
    $("#description").val(response[f].description);
    $("#link").val(response[f].link);
  });
});

$(document).on("click", ".btn-cancel", function () {
  window.location.href = "videos.list.html";
});

$(document).on("change", "#logo", function (e) {
  let reader = new FileReader();

  reader.onload = function () {
    $(".vidLogo").attr("src", URL.createObjectURL(e.target.files[0]));
  };

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
