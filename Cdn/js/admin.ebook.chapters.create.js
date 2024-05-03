$(document).ready(function () {
    $(".header").load("header.html");
    $(".sidebar").load("sidebar.html");
    $(".footer").load("footer.html");
});

$(document).on("click", ".btn-back", function () {
    const id = getParams('id')
    const title = getParams('title')
    window.location.href = "admin.ebook.chapters.list.html?id=" + id + "&title=" + title;
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
            length: { maximum: 20, minimum: 1 }
        },
        content: {
            presence: { allowEmpty: false },
            type: "string",
            length: { maximum: 20, minimum: 1 }
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