$(document).ready(function () {
    let id = getParams("id");

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
    let reader = new FileReader();

    reader.onload = function () {
        $(".orgLogo").attr("src", URL.createObjectURL(e.target.files[0]));
    }

    reader.readAsDataURL(e.target.files[0]);
});