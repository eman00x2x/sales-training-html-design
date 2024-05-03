$(document).on("click", ".btn-cancel", function () {
    window.location.href = "admin.ebooks.list.html";
});

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    $.getJSON('../Cdn/js/data/ebooks.json', function (response) {
        var book = response.data.find(function (item) {
            return item.ebook_id == bookId;
        });
        if (book) {
            $('#title').val(book.title);
            $('#subtitle').val(book.sub_title);
            $('#author').val(book.author);
            $('#category').val(book.category);
            $('#description').val(book.description);
            $('#group').val(book.ebook_group_id);
            $('#code').val(book.code);

            var thumbnailImage = "<h4 class='montserrat-semibold'>Uploaded Files</h4><div class='d-flex flex-row justify-content-start align-items-center rounded shadow-sm p-2 bg-white rounded border border-secondary-subtle'><img src='" + book.thumbnail_image + "' class='border border-secondary-subtle p-2 rounded' name='org_logo' style='height: 100px'/><div class='d-flex flex-column'><span class='ms-4 fw-semibold'>" + book.thumbnail_image.split('/').pop() + "</span></div></div>";
            $(".thumbnail_image").html(thumbnailImage);

        } else {
            console.log("Book not found with ID: " + bookId);
        }
    });
});


$(document).on("change", "#thumbnail", function (e) {
    const URL = window.URL || window.webkitURL;
    const file = e.target.files[0];

    const imageTag =
        "<h4 class='montserrat-semibold'>Uploaded Files</h4><div class='d-flex flex-row justify-content-start align-items-center rounded shadow-sm p-2 bg-white rounded border border-secondary-subtle'><img src='" +
        URL.createObjectURL(file) +
        "'class='border border-secondary-subtle p-2 rounded' name='org_logo' style='height: 100px'/><div class='d-flex flex-column'><span class='ms-4 fw-semibold d-none'>" +
        e.target.files[0].name +
        "</span> <span class='ms-4 fw-normal'>" +
        formatFileSize(e.target.files[0].size) +
        "</span><div></div>";

    if (file) {
        $(".thumbnail_image").html(imageTag);
    }
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