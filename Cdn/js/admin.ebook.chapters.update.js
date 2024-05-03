$(document).on("click", ".btn-cancel", function () {
    const ebook_id = getParams('ebook_id')
    const title = getParams('title')
    window.location.href = "admin.ebook.chapters.list.html?id=" + ebook_id + "&title=" + title;
});

$(document).ready(function () {
    let urlParams = new URLSearchParams(window.location.search);
    let chapterId = urlParams.get('ebook_chapter_id');

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


function validateInput(input) {

    let message = [];

    let data = input.reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    let validator = validate({
        chapter: data.chapter,
        content: data.chapter,
    }, {
        chapter: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 20 }
        },
        content: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 400 }
        },
    });

    if (validator !== undefined) {
        for (key in validator) {
            message.push(validator[key]);
        }
        return message.join(", ");
    }

    return false;

}