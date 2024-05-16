$(document).ready(function () {
    $(".header").load("header.html");
    $(".sidebar").load("sidebar.html");
    $(".footer").load("footer.html");

    var urlParams = new URLSearchParams(window.location.search);
    var videoID = urlParams.get('id');

    $.getJSON('../Cdn/js/data/videos.json', function (response) {
      var video = response.data.find(function (item) {
        return item.video_id == videoID;
      });
      if (video) {
        $('#title').val(video.title);
        $('#category').val(video.category);
        $('#description').val(video.description);
        $('#link').val(video.link);

        $(".thumbnail_image").attr("src", video.thumbnail_image);
      } else {
        console.log("Video not found with ID: " + videoID);
      }
    });
  });

  $(window).on('resize', function () {
    if ($(window).width() >= 768)
      $('.sidebar').removeClass('offcanvas offcanvas-start');
    else
      $('.sidebar').addClass('offcanvas offcanvas-start');
  });

  $(document).on("click", "#back", function (e) {
    window.location.href = "admin.videos.list.html"
  });