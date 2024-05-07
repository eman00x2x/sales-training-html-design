
$(document).on("click", "#back", function (e) {
    window.location.href = "admin.video.groups.list.html"
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