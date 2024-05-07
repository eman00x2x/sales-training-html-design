$(document).ready(function () {
    $(".mobile-add").css("display", "none")
    $(".mobile-remove").css("display", "none")

    $.getJSON('../Cdn/js/data/profiles.json', function (response) {
        const formatDate = (epochTime) => {
            let date = new Date(epochTime * 1000);
            return date.toISOString().split('T')[0];
        };

        id = getParams('id');

        let profile = response.data.find(profile => profile.profile_id === parseInt(id));

        if (profile) {
            $('#skills').val(profile.skills[0]);
            $('#certificates').val(profile.certification[0]);
            $('#professions').val(profile.professions[0]);
            $('#company').val(profile.work_experience[0].company);
            $('#position').val(profile.work_experience[0].position);
            $('#date-hired').val(formatDate(profile.work_experience[0].date.date_hire));
            $('#date-resigned').val(formatDate(profile.work_experience[0].date.date_resigned));
            $('#description').val(profile.work_experience[0].job_description);

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

$(document).on('click', '#editButton2', function () {
    $(".mobile-add").css("display", "block")
    $(".mobile-remove").css("display", "block")
    $('#editButton2').hide();
    $('#saveButton2').show();
});

$(document).on("click", "#deleteRow", function () {
    $(this).parents("#row").remove();
})

