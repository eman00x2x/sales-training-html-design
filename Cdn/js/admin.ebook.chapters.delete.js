$(document).ready(function () {
    chapterId = getParams('ebook_chapter_id');

    $.getJSON('../Cdn/js/data/ebooks.chapters.json', function (response) {
        var book = response.data.find(function (item) {
            return item.ebook_chapter_id == chapterId;
        });
        if (book) {
            $('#chapter').val(book.chapter);
            $('#content').val(book.content);
        } else {
            console.log("Book not found with ID: " + chapterId);
        }
    });
});

$(document).on("click", "#back", function () {
    const ebook_id = getParams('ebook_id')
    const title = getParams('title')
    window.location.href = "admin.ebook.chapters.list.html?id=" + ebook_id + "&title=" + title;
});