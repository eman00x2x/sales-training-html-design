$(document).ready(function () {
    let id = getParams('id');

    $.getJSON('../Cdn/js/data/organization.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].organization_id == id);

        $(".orgLogo").attr("src", response[f].logo);
        $('#name').val(response[f].name);
        $('#description').val(response[f].description);
    });
});

$(document).on("click", "#back", function (e) {
    window.location.href = "admin.organization.list.html"
});

$(document).on("change", "#logo", function (e) {
    let reader = new FileReader();

    reader.onload = function () {
        $(".orgLogo").attr("src", URL.createObjectURL(e.target.files[0]));
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
                length: { minimum: 10, maximum: 300 },
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