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
        current_password: {
            presence: { allowEmpty: false },
            type: "password",
            length: { minimum: 8 }
        },
        subtitle: {
            presence: { allowEmpty: false },
            type: "password",
            length: { minimum: 8 }
        },
        author: {
            presence: { allowEmpty: false },
            type: "password",
            length: { minimum: 8 }
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