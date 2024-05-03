let id = ""

$(document).ready(function () {
  $(".header").load("header.html");
  $(".sidebar").load("sidebar.html");
  $(".footer").load("footer.html");

  let params = new URL(document.location.toString()).searchParams;
  id = params.get("id");

  $.getJSON('../Cdn/js/data/ebook.groups.json', function (data) {
    let response = data.data;
    f = response.keys(response).find(key => response[key].ebook_group_id == id);

    $('#name').text(response[f].name);
    $('#description').text(response[f].description);   
  });
});

$(document).on("click", "#back", function (e) {
  window.location.href = "admin.ebook.groups.list.html"
});