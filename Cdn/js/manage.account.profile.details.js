$(document).ready(function () {
    $(".mobile-add").css("display", "none")

    $.getJSON('../Cdn/js/data/profiles.json', function (response) {
        const formatDate = (epochTime) => {
            let date = new Date(epochTime * 1000);
            return date.toISOString().split('T')[0];
        };

        id = getParams('id');

        let profile = response.data.find(profile => profile.profile_id === parseInt(id));

        if (profile) {
            $('#profile_image').attr('src', profile.profile_image);
            $('#contact_number').val(profile.contact_number[0]);
            $('#prefix').val(profile.name.prefix);
            $('#firstname').val(profile.name.firstname);
            $('#lastname').val(profile.name.lastname);
            $('#suffix').val(profile.name.suffix);
            $('#birthdate').val(formatDate(profile.birthday));
            $('#facebook').val(profile.social_profile.facebook);
            $('#linkedIn').val(profile.social_profile.linkedIn);
            $('#perma-region').val(profile.address[0].permanent.region);
            $('#perma-province').val(profile.address[0].permanent.province);
            $('#perma-municipality').val(profile.address[0].permanent.municipality);
            $('#perma-barangay').val(profile.address[0].permanent.barangay);
            $('#region').val(profile.address[0].current.region);
            $('#province').val(profile.address[0].current.province);
            $('#municipality').val(profile.address[0].current.municipality);
            $('#barangay').val(profile.address[0].current.barangay);
            $('#school').val(profile.education[0].school);
            $('#degree').val(profile.education[0].degree);
            $('#graduated-on').val(formatDate(profile.education[0].graduated_at));

        } else {
            console.log("No profile found for the specified user ID.");
        }
    });
})

$(document).on('click', '#editButton', function () {
    $(".mobile-add").css("display", "block")
    $('#saveButton').show();
});
