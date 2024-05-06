//SAMPLE DATA OF VIDEO GROUPS


$(document).on("click", "#back", function (e) {
    window.location.href = "admin.premiums.list.html"
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