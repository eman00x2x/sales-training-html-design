let mobile_ctr = 0;
let educ_ctr = 0;

$(document).ready(function () {
  $(".row-educ").removeClass();

  $.getJSON("../Cdn/js/data/profiles.json", function (response) {
    const formatDate = (epochTime) => {
      let date = new Date(epochTime * 1000);
      return date.toISOString().split("T")[0];
    };

    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get("id");

    let profile = response.data.find(
      (profile) => profile.profile_id === parseInt(userID)
    );

    if (profile) {
      $("#prefix").val(profile.name.prefix);
      $("#firstname").val(profile.name.firstname);
      $("#lastname").val(profile.name.lastname);
      $("#suffix").val(profile.name.suffix);
      $("#birthdate").val(formatDate(profile.birthday));
      $("#facebook").val(profile.social_profile.facebook);
      $("#linkedIn").val(profile.social_profile.linkedIn);
      $("#perma-region").val(profile.address[0].permanent.region);
      $("#perma-province").val(profile.address[0].permanent.province);
      $("#perma-municipality").val(profile.address[0].permanent.municipality);
      $("#perma-barangay").val(profile.address[0].permanent.barangay);
      $("#region").val(profile.address[0].current.region);
      $("#province").val(profile.address[0].current.province);
      $("#municipality").val(profile.address[0].current.municipality);
      $("#barangay").val(profile.address[0].current.barangay);

      profile.contact_number.map((item) => addMobileNumber(item));
      mobile_ctr = profile.contact_number.length;

      profile.education.map((item) => addEducation(item));
      educ_ctr = profile.education.length;

    } else {
      console.log("No profile found for the specified user ID.");
    }
  });
});

$(document).on("click", ".btn-add-mobile", function () {
  addMobileNumber();
  $(".row-mobile .input").prop('disabled', false)
  $(".row-mobile .div-remove-mobile").removeClass("d-none");
  mobile_ctr += 1;
  console.log("nyaw");
});

$(document).on("click", ".btn-add-educ", function () {
  addEducation();
  $(".education .row-educ").addClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $(".row-educ .input").prop('disabled', false)
  $(".row-educ .div-remove-educ").removeClass("d-none");
  educ_ctr += 1;
});

$(".profile-content").on("click", ".editButton", function () {
  $(".profile-content .input").prop('disabled', false)

  // MOBILE NUMBER
  $(".btn-add-mobile").removeClass("d-none");
  $(".row-mobile .div-remove-mobile").removeClass("d-none");

  // EDUCATION
  $(".btn-add-educ").removeClass("d-none");

  $(".education .row-educ").addClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $(".row-educ .div-remove-educ").removeClass("d-none");

  $(".profile-content .editButton").hide();
  $(".profile-content .saveButton").show();
});

$(document).on("click", ".deleteMobileRow", function () {
  $(this).parents(".row-mobile").remove();
});

$(document).on("click", ".deleteEducRow", function () {
  $(this).parents(".row-educ").remove();
});

function addMobileNumber(item = "") {
  let input = `<div id="row-mobile" class="d-flex justify-content-between align-items-center gap-1 mb-2">
                  <input type="text" class="input text-black form-control montserrat-regular" name="contact-number" placeholder="Add Contact Number" disabled value="${item}">
                  <button type="button" class="deleteMobileRow btn div-remove-mobile btn-remove btn-outline btn-outline-danger d-none">
                      <i class="bi bi-trash3"></i>
                      <span class="ms-2">Remove</span>
                  </button>
              </div>`;

  $(".mobile_number").append(input);
}

function addEducation(item = {}) {
  let myDate;

  if (item.hasOwnProperty("graduated_at")) {
    let date = new Date(0);
    date.setUTCSeconds(item.graduated_at);
    myDate = date.toISOString().split("T")[0];
  }

  let input = `<div class='row-educ mb-2'>
                    <div class="row g-0">
                        <span class="fs-4 text-secondary my-2 montserrat-regular">School</span>
                        <div class="">
                            <input type="text" name="school" class="input text-black form-control montserrat-regular" disabled value=${item.hasOwnProperty("school") > 0
      ? item.school
      : ""
    }>
                        </div>
                    </div>
                    <div class="row g-0 gap-2">
                        <div class="col-md">
                            <span class="fs-4 text-secondary my-2 montserrat-regular">Degree</span>
                            <input type="text" name="degree" class="input text-black form-control montserrat-regular" disabled value=${item.hasOwnProperty("degree") > 0
      ? item.degree
      : ""
    }
                                >
                        </div>
                        <div class="col-md">
                            <span class="fs-4 text-secondary my-2 montserrat-regular">Graduated
                                on</span>
                            <input type="date" name="graduated-on" class="input text-black form-control montserrat-regular" disabled value=${item.hasOwnProperty("graduated_at") > 0
      ? myDate
      : ""
    }
                                >
                        </div>
                    </div>
                    <div class="text-center div-remove-educ d-none">
                        <button type="button" class="deleteEducRow btn my-3 btn-remove-educ btn-remove btn-outline btn-outline-danger ">
                            <i class="bi bi-trash3"></i>
                            <span class="ms-2">Remove</span>
                        </button>
                    </div>
                </div>`;

  $(".education").append(input);
}

