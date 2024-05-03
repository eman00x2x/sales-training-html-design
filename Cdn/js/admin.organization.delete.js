let id = ""

$(document).ready(function () {
    let params = new URL(document.location.toString()).searchParams;
    id = params.get("id");

    $.getJSON('../Cdn/js/data/organization.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].organization_id == id);

        $(".orgLogo").attr("src", response[f].logo);
        $('#name').text(response[f].name);
        $('#description').text(response[f].description);
    });
});

$(document).on("click", "#back", function (e) {
    window.location.href = "admin.organization.list.html"
});

$(document).on("change", "#logo", function (e) {
    var URL = window.URL || window.webkitURL;
    var file = e.target.files[0];
    if (file) {
        $(".orgLogo").attr("src", URL.createObjectURL(file));
    }
});