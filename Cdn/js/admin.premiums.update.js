
$(document).on("click", "#back", function (e) {
    window.location.href = "admin.premiums.list.html"
});
$(document).ready(function () {

    let id = getParams('id');

    $.getJSON(`../Cdn/js/data/premiums.json`, function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].premium_id == id);
        $('#category').val(response[f].category);
        $('#type').val(response[f].type);
        $('#name').val(response[f].name);
        $('#description').val(response[f].description);
        $('#script').val(response[f].script);
        $('#duration').val(response[f].duration);
        $('#cost').val(response[f].cost);
        $('#visibility').val(response[f].visibility);
    });
});

function validateInput(input) {
    let message = [];

    const data = input.reduce(function (obj, item) {
        if (item.name === 'cost') {
            obj[item.name] = parseFloat(item.value);
        } else if (item.name === 'visibility') {
            obj[item.name] = parseFloat(item.value);
        } else {
            obj[item.name] = item.value;
        }
        return obj;
    }, {});
    const validator = validate(data, {
        category: {
            presence: { allowEmpty: false },
            type: "string",
        },
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
        duration: {
            presence: { allowEmpty: false },
            type: "string",
        },
        cost: {
            presence: { allowEmpty: false },
            type: "number",
        },
        visibility: {
            presence: { allowEmpty: false },
            type: "number",
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