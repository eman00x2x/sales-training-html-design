
$(document).on("click", "#back", function (e) {
    window.location.href = "admin.premiums.list.html"
});
$(document).ready(function () {

    let id = getParams('id');

    $.getJSON(`../Cdn/js/data/premiums.json`, function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].premium_id == id);
        $('#category').text(response[f].category);
        $('#type').text(response[f].type);
        $('#name').text(response[f].name);
        $('#description').text(response[f].description);
        $('#script').text(response[f].script);
        $('#duration').text(response[f].duration);
        $('#cost').text(response[f].cost);
        $('#visibility').text(response[f].visibility);
        $('#created_at').text(convertDate(response[f].created_at));
    });
});

