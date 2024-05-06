$(document).ready(function () {

    $.getJSON('../Cdn/js/data/profiles.json', function (response) {
        var profile = response.data[0];
        if (profile) {
            $('#acc-id').text(profile.profile_id);
            $('#birthday').text(convertDate(profile.birthday));

        } else {
            console.log("No profiles found in the data.");
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

