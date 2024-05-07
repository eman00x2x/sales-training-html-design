let id = ""
    $(document).ready(function () {
      let params = new URL(document.location.toString()).searchParams;
      id = params.get("id");
      
      $.getJSON('../Cdn/js/data/video.groups.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].vid_group_id == id);

        $('#name').text(response[f].name);
        $('#description').text(response[f].description);
      });
    });

    $(document).on("click", "#back", function (e) {
      window.location.href = "admin.video.groups.list.html"
    });
