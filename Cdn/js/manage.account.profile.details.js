$.getJSON('../Cdn/js/data/profiles.json', function(response) {
    var profile = response.data[0];
    if (profile) {
        $('#profile_image').attr('src', profile.profile_image);
        $('#contact_number').val(profile.contact_number[0]); 
        $('#prefix').val(profile.name.prefix);
        $('#firstname').val(profile.name.firstname);
        $('#lastname').val(profile.name.lastname);
        $('#suffix').val(profile.name.suffix);
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
        $('#graduated-on').val(profile.education[0].degree);

    } else {
        console.log("No profiles found in the data.");
    }
});

$(document).ready(function () {
    $('#editButton').on('click', function () {
        $('.btn-add').removeClass('d-none');
        $('#saveButton').show();
    });
});

