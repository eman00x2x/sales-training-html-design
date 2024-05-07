$(document).ready(function () {
    $(".mobile-add").css("display", "none")
    $(".mobile-remove").css("display", "none")

    $.getJSON('../Cdn/js/data/profiles.json', function (response) {
        const formatDate = (epochTime) => {
            let date = new Date(epochTime * 1000);
            return date.toISOString().split('T')[0];
        };

        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('id');

        let profile = response.data.find(profile => profile.profile_id === parseInt(userID));

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

$(document).on('click', '.btn-add', function () {
    let new_chq_no = parseInt($('#total_mobile_num').val()) + 1;
    let new_input = '<div id="row" class="d-flex justify-content-between align-items-center gap-1 mt-2">' +
        '<input type="text" class="form-control" placeholder="Add Contact Number" aria-label="Recipient\'s username" aria-describedby="button-addon2">' +
        '<button type="button" id="deleteRow" class="btn btn-remove btn-outline btn-outline-danger "><i class="bi bi-trash3"></i><span class="ms-2">Remove</span></button>' +
        '</div>'

    $('#mobile_number').append(new_input);
    $('#total_mobile_num').val(new_chq_no);
});

$(document).on('click', '#editButton', function () {
    $(".mobile-add").css("display", "block")
    $(".mobile-remove").css("display", "block")
    $('#editButton').hide();
    $('#saveButton').show();
});

$(document).on("click", "#deleteRow", function () {
    $(this).parents("#row").remove();
})






