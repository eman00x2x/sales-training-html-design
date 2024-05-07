
$(document).on("click", "#back", function (e) {
    window.location.href = "admin.video.groups.list.html"
});
$(document).ready(function () {

    let id = getParams('id');

    $.getJSON(`../Cdn/js/data/video.groups.json`, function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].vid_group_id == id);
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

    const validator = validate(
        {
            name: data.name,
            description: data.description,
        },
        {
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