let id;

$(document).ready(function () {
    id = getParams('id');
    $.when(
        $.getJSON("../Cdn/js/data/profiles.json"),
        $.getJSON("../Cdn/js/data/accounts.json"),
        $.getJSON("../Cdn/js/data/organization.json")
    ).done(function (data1, data2, data3) {
        // MERGE PROFILE AND ACCOUNTS
        let response = (data1[0].data).map(a => Object.assign(a, (data2[0].data).find(b => b.account_id == a.account_id)));
        // MERGE RESPONSE AND ORGANIZATION
        let result = response.map(a => ({ ...a, "organization": (data3[0].data).find(b => b.organization_id == a.organization_id) }));
        let f = result.keys(result).find(key => result[key].account_id == id);

        $(".accLogo").attr("src", response[f].profile_image);
        $('.accName').text(`${response[f].name.prefix} ${response[f].name.firstname} ${response[f].name.lastname} ${response[f].name.suffix}`);
        $('.accDesc').text(response[f].description);
        console.log(result[f])
    })

    $('#tab-top-1').load('admin.accounts.profile.html');
    $('#tab-top-2').load('admin.accounts.skills.html');

    // $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
    //     var target = $(e.target).attr("href");
    //     if (target === '#tab-top-1') {
    //         $('#tab-top-1').load('admin.accounts.profile.html');
    //     }
    //     else if (target === '#tab-top-2') {
    //         $('#tab-top-2').load('admin.accounts.skills.html');
    //     }
    // });
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