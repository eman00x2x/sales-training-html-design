let id = ""

$(document).ready(function () {
 
    let params = new URL(document.location.toString()).searchParams;
    id = params.get("id");

    $.getJSON('../Cdn/js/data/premiums.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].premium_id == id);
        $('#category').val(response[f].category);
        $('#type').val(response[f].type);
        $('#name').val(response[f].name);
        $('#description').val(response[f].description);
        $('#script').val(response[f].script);
        $('#duration').val(response[f].duration);
        $('#cost').val(response[f].cost);
    });
});

$(document).on("click", "#back", function (e) {
    window.location.href = "admin.premiums.list.html"
});
