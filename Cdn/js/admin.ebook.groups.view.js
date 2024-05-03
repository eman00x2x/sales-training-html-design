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
        // https://stackoverflow.com/questions/47749932/merge-multiple-json-with-the-same-id
        let filterByID = returnFilteredData(data1[0].data, data2[0].data, "ebook_group_id")

        for (let i = 0; i < filterByID.length; i++) {
            let data = filterByID[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.ebook_group_id +
                "</td>";
            html += "<td class='align-middle'>" + data.isbn + "</td>";
            html += "<td class='align-middle'><img src='" + data.thumbnail_image + "' style='width:10em;' /></td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.title +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.sub_title +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.author +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.description +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.category +
                "</td>";
            html +=
                "<td class='align-middle text-truncate' style='max-width: 150px'>" +
                data.code +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.created_at) +
                "</td>";
            html += "</tr>";
        }
        $(".ebook-group .data-container").html(html);
    });

}