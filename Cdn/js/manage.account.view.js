$(document).ready(function () {
    id = getParams('id');

    $.when(
        $.getJSON("../Cdn/js/data/profiles.json"),
        $.getJSON("../Cdn/js/data/accounts.json"),
    ).done(function (data1, data2) {
        // MERGE PROFILE AND ACCOUNTS
        let response = (data1[0].data).map(a => Object.assign(a, (data2[0].data).find(b => b.account_id == a.account_id)));

        let profile = response.find(profile => profile.account_id == id);
        if (profile) {
            $('#acc-id').text(profile.account_id);
            $('#birthday').text(convertDate(profile.birthday));
            $('#username').text(profile.username);
            $('#email').text(profile.email);
            console.log(profile);
        } else {
            console.log("No profile found for the specified account ID.");
        }
    });

    $('#tab-top-1').load('manage.account.profile.details.html', function () {
    });

    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        if (target === '#tab-top-1') {
            $('#tab-top-1').load('manage.account.profile.details.html');
        }
        else if (target === '#tab-top-2') {
            $('#tab-top-2').load('manage.account.skills.html');
        }
    });
});
