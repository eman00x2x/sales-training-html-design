let id;

$(document).ready(function () {
    let params = new URL(document.location.toString()).searchParams;
    id = params.get("id");

    $.getJSON('../Cdn/js/data/ebook.groups.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].ebook_group_id == id);

        $('.ebookName').text(response[f].name);
        $('.ebookDesc').text(response[f].description);
    });

    getEBookGroupData()
});

$(document).on("click", "#back", function (e) {
    window.location.href = "admin.ebook.groups.list.html"
});

 function getEBookGroupData() {
     let html = "";

     $.when(
         $.getJSON("../Cdn/js/data/ebook.groups.json"),
         $.getJSON("../Cdn/js/data/ebooks.json"),
     ).done(function (data1, data2) {
        //   let ebookGroups = data1[0].data;
         let ebooks = data2[0].data;
        
         let filteredEbooks = ebooks.filter(ebook => ebook.ebook_group_id == id);
         filteredEbooks = limitDataToTen(filteredEbooks);

         filteredEbooks.forEach(ebooks => {
          html += "<tr>";
            html +=
            "<td class='align-middle text-center'>" +
            ebooks.ebook_id +
            "</td>";
        html += "<td class='align-middle'>" + ebooks.isbn + "</td>";
        html += "<td class='align-middle'><img src='" + ebooks.thumbnail_image + "' style='width:10em;' /></td>";
        html +=
            "<td class='align-middle text-truncate' style='max-width: 150px'>" +
            ebooks.title +
            "</td>";
        html +=
            "<td class='align-middle text-truncate' style='max-width: 150px'>" +
            ebooks.sub_title +
            "</td>";
        html +=
            "<td class='align-middle text-truncate' style='max-width: 150px'>" +
            ebooks.author +
            "</td>";
        html +=
            "<td class='align-middle text-truncate' style='max-width: 150px'>" +
            ebooks.description +
            "</td>";
        html +=
            "<td class='align-middle text-truncate' style='max-width: 150px'>" +
            ebooks.category +
            "</td>";
        html +=
            "<td class='align-middle text-truncate' style='max-width: 150px'>" +
            ebooks.code +
            "</td>";
        html +=
            "<td class='align-middle'>" +
            convertDate(ebooks.created_at) +
            "</td>";
        html += "</tr>";
         });
        
         $(".ebook-group .data-container").html(html);
     });
 }

