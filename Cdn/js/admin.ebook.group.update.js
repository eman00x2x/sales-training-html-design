
$(document).on("click", "#back", function (e) {
    window.location.href = "admin.ebook.groups.list.html"
});
$(document).ready(function () {
    let id = getParams('id');

    $.getJSON(`../Cdn/js/data/ebook.groups.json`, function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].ebook_group_id == id);
        $('#name').val(response[f].name);
        $('#description').val(response[f].description);
    });
});

function validateInput(input) {
    let message = [];

    const data = input.reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    const validator = validate(data, {
        name: {
            presence: { allowEmpty: false },
            type: "string",
            length: { minimum: 4 },
        },
        description: {
            presence: { allowEmpty: false },
            type: "string",
            length: { minimum: 4 }
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