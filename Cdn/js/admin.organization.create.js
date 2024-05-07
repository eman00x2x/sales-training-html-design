$(document).ready(function () {
    $(".org-div-logo").css("display", "none")
})

$(document).on("click", "#back", function (e) {
    window.location.href = "admin.organization.list.html"
});

$(document).on("click", ".btn-remove", function (e) {
    $(".org-div-logo").css("display", "none")
});

$(document).on("change", "#logo", function (e) {
    let reader = new FileReader();

    reader.onload = function (event) {
        $(".org-div-logo").css("display", "block")
        $(".org-logo").attr('src', event.target.result)
        $(".file-name").text(e.target.files[0].name)
        $(".file-size").text(formatFileSize(e.target.files[0].size))
    }

    reader.readAsDataURL(e.target.files[0]);
});

/**
 * Validator Documentation https://validatejs.org/#validators-length
 **/

function validateInput(input) {
    let message = [];

    const data = input.reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    const validator = validate(
        {
            logo: data.logo,
            name: data.name,
            description: data.description,
        },
        {
            logo: {
                type: "image/png,image/jpeg",
            },
            name: {
                type: "string",
                length: { minimum: 4 },
            },
            description: {
                type: "string",
                length: { maximum: 100 },
            },
        }
    );

    if (validator !== undefined) {
        for (key in validator) {
            message.push(validator[key]);
        }
        return message.join(", ");
    }

    return false;
}