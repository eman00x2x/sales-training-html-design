$(document).ready(function () {
    $(".header").load("header.html");
    $(".sidebar").load("sidebar.html");
    $(".footer").load("footer.html");
});

$(document).on("click", ".btn-back", function () {
    window.location.href = "admin.ebooks.list.html";
});

$(document).on("change", "#thumbnail", function (e) {
    let URL = window.URL || window.webkitURL;
    let file = e.target.files[0];

    let imageTag =
        "<h4 class='montserrat-semibold'>Uploaded Files</h4><div class='d-flex flex-row justify-content-start align-items-center rounded shadow-sm p-2 bg-white rounded border border-secondary-subtle'><img src='" +
        URL.createObjectURL(file) +
        "'class='border border-secondary-subtle p-2 rounded' name='org_logo' style='height: 100px'/><div class='d-flex flex-column'><span class='ms-4 fw-semibold'>" +
        e.target.files[0].name +
        "</span> <span class='ms-4 fw-normal'>" +
        formatFileSize(e.target.files[0].size) +
        "</span><div></div>";

    if (file) {
        $(".thumbnail_image").html(imageTag);
    }
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