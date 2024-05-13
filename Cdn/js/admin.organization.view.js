let id;

$(document).ready(function () {
    id = getParams('id');

    $.getJSON('../Cdn/js/data/organization.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].organization_id == id);

        $(".orgLogo").attr("src", response[f].logo);
        $('.orgName').text(response[f].name);
        $('.orgDesc').text(response[f].description);
    });

    $("#tab-top-1").load("admin.organization.tabs.ebook.grps.html");
    $("#tab-top-2").load("admin.organization.tabs.video.grps.html");
    $("#tab-top-3").load("admin.organization.tabs.reg.accs.html");
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
