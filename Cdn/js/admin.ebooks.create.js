$(document).on("click", ".btn-back", function () {
    window.location.href = "admin.ebooks.list.html";
});

$(document).ready(function () {
    $(".ebook-div-thumbnail").css("display", "none")
})

$(document).on("click", ".btn-remove", function (e) {
    $(".ebook-div-thumbnail").css("display", "none")
});

$(document).on("change", "#thumbnail", function (e) {
    let reader = new FileReader();

    reader.onload = function (event) {
        $(".ebook-div-thumbnail").css("display", "block")
        $(".ebook-thumbnail").attr('src', event.target.result)
        $(".file-name").text(e.target.files[0].name)
        $(".file-size").text(formatFileSize(e.target.files[0].size))
    }

    reader.readAsDataURL(e.target.files[0]);
});

function validateInput(input) {

    let message = [];

    let data = input.reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    let validator = validate({
        thumbnail: data.thumbnail,
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
        category: data.category,
        description: data.description,
        group: data.group,
        code: data.code,
    }, {
        logo: {
            type: "image/png,image/jpeg",
        },
        title: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 20 }
        },
        subtitle: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 50 }
        },
        author: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 50 }
        },
        category: {
            presence: { allowEmpty: false },
        },
        description: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 100 }
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