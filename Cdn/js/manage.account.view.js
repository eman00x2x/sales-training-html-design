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
            $("#profile-pic").attr("src", profile.profile_image);
            $('.name').text(profile.name.firstname + " " + profile.name.lastname);
            $('#acc-id').text(profile.account_id);
            $('#birthday').text(convertDate(profile.birthday));
            $('#username').text(profile.username);
            $('#email').text(profile.email);
            console.log(profile);
        } else {
            console.log("No profile found for the specified account ID.");
        }
    })
    $('#tab-top-1').load('manage.account.profile.details.html');
    $('#tab-top-2').load('manage.account.skills.html');
    $('#tab-top-3').load('manage.change.password.html');
    $('#tab-top-4').load('manage.update.email.html');
});

