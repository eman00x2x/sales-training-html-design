const id = getParams('id')
const title = getParams('title')

$(document).ready(function () {

    $(document).on("keyup", '.search', function () {
        var value = $(this).val().toLowerCase();
        $(".ebooks .data-container tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    var urlParams = new URLSearchParams(window.location.search);
    var bookId = urlParams.get('id');
    var title = urlParams.get('title');
    var html = "";

    $('.book-title').text(title);

    $.getJSON('../Cdn/js/data/ebooks.chapters.json', function (response) {
        var chapters = response.data.filter(function (item) {
            return item.ebook_id == bookId;
        });

        if (chapters.length > 0) {
            chapters.forEach(function (chapter) {
                html += "<tr>";
                html += "<td class='align-middle montserrat-bold'>" + chapter.chapter + "</td>";
                html += "<td class='align-middle truncate-text'style='max-width: 30em'>" + "<p>"  + chapter.content + "</p>" + "</td>";
                html += "<td class='align-middle montserrat-regular'>" + convertDate(chapter.created_at) + "</td>";
                html += displayActionButton(chapter.ebook_chapter_id);
                html += "</tr>";
            });
        } else {
            console.log("No chapters found for the book with ID: " + bookId);
        }
        $(".chapter .data-container").html(html);
    });
});


$(document).on("click", ".btn-add", function (e) {
    window.location.href = "admin.ebook.chapters.create.html?id=" + id + "&title=" + title;
});

$(document).on("click", ".btn-edit", function () {
    let btn_id = $(this).data('id');
    window.location.href = "admin.ebook.chapters.update.html?ebook_id=" + id + "&ebook_chapter_id=" + btn_id + "&title=" + title;
});

$(document).on('click', '.btn-delete', function (e) {
    let btn_id = $(this).data('id');
    window.location.href = "admin.ebook.chapters.delete.html?ebook_id=" + id + "&ebook_chapter_id=" + btn_id + "&title=" + title;
});

function displayActionButton(id) {
    return `<td class='align-middle text-center'>
    <div class="btn-group" role="group" aria-label="Basic outlined example ">
                <button type="button" data-id='${id}' class="btn btn-md btn-edit btn-outline-primary"><i class="bi bi-pencil-square"></i><span class='montserrat-regular'>Edit</span></button>
                <button type="button" data-id='${id}' class="btn btn-md btn-delete btn-outline-danger"><i class="bi bi-trash"></i><span class='montserrat-regular'>Delete</span></button>
    </div>
    </td>`;
}