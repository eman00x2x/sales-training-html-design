$(document).on("click", ".btn-cancel", function () {
    window.location.href = "admin.ebooks.list.html";
});

$(document).ready(function () {
    id = getParams('id');

    $.getJSON('../Cdn/js/data/ebooks.json', function (response) {
        let book = response.data.find(function (item) {
            return item.ebook_id == id;
        });
        if (book) {
            $('#title').val(book.title);
            $('#subtitle').val(book.sub_title);
            $('#author').val(book.author);
            $('#category').val(book.category);
            $('#description').val(book.description);
            $('#group').val(book.ebook_group_id);
            $('#code').val(book.code);
            $(".ebookThumbnail").attr("src", book.thumbnail_image);

        } else {
            console.log("Book not found with ID: " + book.ebook_id);
        }
    });
});


$(document).on("change", "#thumbnail", function (e) {
    let reader = new FileReader();

    reader.onload = function () {
        $(".ebookThumbnail").attr("src", URL.createObjectURL(e.target.files[0]));
    }

    reader.readAsDataURL(e.target.files[0]);
});

function validateInput(input) {

    const message = [];

    const data = input.reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    const validator = validate({
        thumbnail: data.thumbnail,
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
        category: data.category,
        description: data.description,
        group: data.group,
        code: data.code,
    }, {
        title: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 100 }
        },
        subtitle: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 100 }
        },
        author: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 100 }
        },
        category: {
            presence: { allowEmpty: false },
        },
        description: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 350 }
        },
        group: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 10 }
        },
        code: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 12 }
        }
    });

    if (validator !== undefined) {
        for (key in validator) {
            message.push(validator[key]);
        }
        return message.join(", ");
    }
    return false;
}