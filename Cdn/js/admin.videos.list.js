$(document).ready(function () {
  getVideoData(1);
});

$(document).on("keyup", ".search", function () {
  var value = $(this).val().toLowerCase();
  $(".videos .data-container tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

$(document).on("click", ".btn-add", function () {
  window.location.href = "admin.videos.create.html";
});

$(document).on("click", ".btn-view", function () {
  var id = $(this).data("id");
  window.location.href = "admin.videos.view.html?id=" + id;
});

$(document).on("click", ".btn-edit", function () {
  let id = $(this).data("id");
  window.location.href = "admin.videos.update.html?id=" + id;
});

$(document).on("click", ".btn-delete", function (e) {
  id = $(this).data("id");
  window.location.href = "admin.videos.delete.html?id=" + id;
});

function displayActionButton(id, title) {
  return `<td class='align-middle text-center'>
        <button type="button" data-id='${id}' class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View</span></button>
        <button type="button" data-id='${id}' class="btn btn-md btn-edit btn-outline-primary"><i class="bi bi-pencil-square"></i><span class="ms-2 montserrat-regular">Edit</span></button>
        <button type="button" data-id='${id}' class="btn btn-md btn-delete btn-outline-danger"><i class="bi bi-trash"></i><span class="ms-2 montserrat-regular">Delete</span></button>
</td>`;
}

function getVideoData(pageNumber) {
  let html = "";
  const itemsPerPage = 10;
  const startIndex = (pageNumber - 1) * itemsPerPage;

  $.getJSON("../Cdn/js/data/videos.json", function (response) {
    const limit = limitDataToTen(response.data, startIndex, itemsPerPage)
    for (let i = 0; i < limit.length; i++) {
      let video = limit[i];
      html += "<tr>";
      html +=
        "<td class='montserrat-regular align-middle text-center'>" +
        video.video_id +
        "</td>";
      html +=
        "<td class='align-middle text-center'><img src='" +
        video.thumbnail_image +
        "' style='width:10em;' /></td>";
      html +=
        "<td class='montserrat-regular align-middle text-center text-capitalize'>" +
        video.title +
        "</td>";
      html +=
        "<td class='montserrat-regular align-middle truncate-text'>" +
        "<p>" +
        video.description +
        "</p>" +
        "</td>";
      html +=
        "<td class='montserrat-regular align-middle text-center text-capitalize'>" +
        "<span class='badge badge-outline text-teal'>" +
        video.category +
        "</span>" +
        "</td>";
      html += displayActionButtons(video.video_id);
      html += "</tr>";
    }
    $(".data-container").html(html);

    generatePagination(response.data.length, pageNumber);

  });
}