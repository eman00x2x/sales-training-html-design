let cert_ctr = 0;
let prof_ctr = 0;
let work_ctr = 0;

$(document).ready(function () {
    $(".row-work").removeClass();

    $.getJSON('../Cdn/js/data/profiles.json', function (response) {
        const formatDate = (epochTime) => {
            let date = new Date(epochTime * 1000);
            return date.toISOString().split('T')[0];
        };

        id = getParams('id');

        let profile = response.data.find(profile => profile.profile_id === parseInt(id));

        if (profile) {
            $('#skills').text(profile.skills[0]);

            profile.certification.map((item) => addCertification(item));
            cert_ctr = profile.certification.length;

            profile.professions.map((item) => addProfession(item));
            prof_ctr = profile.professions.length;

            profile.work_experience.map((item) => addWork(item));
            work_ctr = profile.work_experience.length;

        } else {
            console.log("No profile found for the specified user ID.");
        }
    });
})

$(document).on("click", ".btn-add-cert", function () {
    addCertification();
    $(".row-cert .input").prop('disabled', false)
    $(".row-cert .div-remove-cert").removeClass("d-none");
    cert_ctr += 1;
});

$(document).on("click", ".btn-add-profession", function () {
    addProfession();
    $(".row-profession .input").prop('disabled', false)
    $(".row-profession .div-remove-profession").removeClass("d-none");
    prof_ctr += 1;
});

$(document).on("click", ".btn-add-work", function () {
    addWork();
    $(".work .row-work").addClass(
        "bg-light shadow-sm border mt-2 px-2 rounded"
    );
    $(".row-work .input").prop('disabled', false)
    $(".row-work .div-remove-work").removeClass("d-none");
    educ_ctr += 1;
});

$(".skill-content").on('click', '.editButton', function () {
    $(".skill-content .input").prop('disabled', false)

    // CERTIFICATIONS
    $(".btn-add-cert").removeClass("d-none");
    $(".row-cert .div-remove-cert").removeClass("d-none");

    // PROFESSIIONS
    $(".btn-add-profession").removeClass("d-none");
    $(".row-profession .div-remove-profession").removeClass("d-none");

    // WORK EXPERIENCE
    $(".btn-add-work").removeClass("d-none");

    $(".work .row-work").addClass(
        "bg-light shadow-sm border mt-2 px-2 rounded"
    );
    $(".row-work .div-remove-work").removeClass("d-none");

    $(".editButton").hide();
    $(".saveButton").show();
});

$(document).on("click", ".deleteCertRow", function () {
    $(this).parents(".row-cert").remove();
});

$(document).on("click", ".deleteProfRow", function () {
    $(this).parents(".row-profession").remove();
});

$(document).on("click", ".deleteWorkRow", function () {
    $(this).parents(".row-work").remove();
});

function addCertification(item = "") {
    let disabled = item ? "disabled" : "";
    let input = `<div class="row-cert d-flex justify-content-between align-items-center gap-1 mb-2">
                      <input type="text" class="input text-black form-control montserrat-regular" placeholder="Add Certification" disabled value="${item}">
                      <button type="button" class="deleteCertRow btn div-remove-cert btn-remove btn-outline btn-outline-danger d-none">
                          <i class="bi bi-trash3"></i>
                          <span class="ms-2">Remove</span>
                      </button>
                  </div>`;

    $(".certification").append(input);
}

function addProfession(item = "") {

    let input = `<div class="row-profession d-flex justify-content-between align-items-center gap-1 mb-2">
                      <input type="text" class="input text-black form-control montserrat-regular" placeholder="Add Profession" disabled value="${item}">
                      <button type="button" class="deleteProfRow btn div-remove-profession btn-remove btn-outline btn-outline-danger d-none">
                          <i class="bi bi-trash3"></i>
                          <span class="ms-2">Remove</span>
                      </button>
                  </div>`;

    $(".profession").append(input);
}

function addWork(item = {}) {
    let myDate;

    if (item.date && item.date.hasOwnProperty("date_hire")) {
        let date = new Date(0);
        date.setUTCSeconds(item.date.date_hire);
        myDate = date.toISOString().split("T")[0];
    }

    let input = `<div class='mb-2 row-work'>
                  <div class="d-flex flex-column flex-md-row gap-2">
                    <div class="d-flex flex-column col-md-6 flex-fill">
                        <span class="fs-4 text-secondary mt-1 montserrat-regular">Company</span>
                        <div class="input-container">
                            <input type="text" name="company"
                                class="input text-black form-control montserrat-regular my-2" autocomplete="off" disabled value="${item.company ? item.company : ""
        }">
                        </div>
                        <span class="fs-4 text-secondary mt-1 montserrat-regular">Position</span>
                        <div class="input-container">
                            <input type="text" name="position"
                                class="input text-black form-control montserrat-regular my-2" autocomplete="off" disabled value="${item.position ? item.position : ""
        }">
                        </div>
                    </div>
                    <div class="d-flex flex-column col-md-6 flex-fill">
                        <span class="fs-4 text-secondary mt-1 montserrat-regular">Date
                            Hired</span>
                        <div class="input-container">
                            <input type="date" name="date-hired" 
                                class="input text-black form-control montserrat-regular my-2" autocomplete="off" disabled value=${myDate ? myDate : ""
        }>
                        </div>
                        <span class="fs-4 text-secondary mt-1 montserrat-regular">Date
                            Resigned</span>
                        <div class="input-container">
                            <input type="date" name="date-resigned"
                                class="input text-black form-control montserrat-regular my-2" autocomplete="off" disabled value=${item.date && item.date.hasOwnProperty("date_resigned")
            ? formatDate(item.date.date_resigned)
            : ""
        }>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <span class="fs-4 text-secondary mt-1 montserrat-regular">Job Description</span>
                    <div class="input-container">
                        <textarea name="description" class="text-black input form-control montserrat-regular" autocomplete="off" wrap="physical" rows="5" disabled>${item.job_description ? item.job_description : ""}</textarea>
                    </div>
                </div>
                <div class="text-center div-remove-work d-none">
                    <button type="button" class="deleteWorkRow btn my-3 btn-remove-educ btn-remove btn-outline btn-outline-danger ">
                         <i class="bi bi-trash3"></i>
                        <span class="ms-2">Remove</span>
                    </button>
                 </div>
                </div>
                  </div>
              </div>`;

    $(".work").append(input);
}


