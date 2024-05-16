$(document).ready(function () {
  var id = getParams("id");

  $.getJSON("../Cdn/js/data/videos.json", function (data) {
    let response = data.data;
    f = response.keys(response).find((key) => response[key].video_id == id);

    $(".thumbnail_image").attr("src", response[f].thumbnail_image);
    $("#title").text(response[f].title);
    $("#category").text(response[f].category);
    $("#description").text(response[f].description);
    $("#link").text(response[f].link);
  });
});

$(window).on("resize", function () {
  if ($(window).width() >= 768)
    $(".sidebar").removeClass("offcanvas offcanvas-start");
  else $(".sidebar").addClass("offcanvas offcanvas-start");
});

$(document).on("click", "#back", function (e) {
  window.location.href = "admin.videos.list.html";
});
