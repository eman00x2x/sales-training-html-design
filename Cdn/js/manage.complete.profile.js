let mobile_ctr = 0;
let educ_ctr = 0;
let cert_ctr = 0;
let prof_ctr = 0;
let work_ctr = 0;

$(document).ready(function () {
  $('#uploadImage').change(function () {
    var input = this;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#profile-pic').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  });

  $(".row-educ").removeClass();

  $.getJSON("../Cdn/js/data/profiles.json", function (response) {
    const formatDate = (epochTime) => {
      let date = new Date(epochTime * 1000);
      return date.toISOString().split("T")[0];
    };

    userID = getParams('id');

    let profile = response.data.find(
      (profile) => profile.profile_id === parseInt(userID)
    );

    if (profile) {
      $("#profile-pic").attr("src", profile.profile_image);
      $("#prefix").val(profile.name.prefix);
      $("#firstname").val(profile.name.firstname);
      $("#lastname").val(profile.name.lastname);
      $("#suffix").val(profile.name.suffix);
      $("#birthdate").val(formatDate(profile.birthday));
      $("#facebook").val(profile.social_profile.facebook);
      $("#linkedIn").val(profile.social_profile.linkedIn);

      Object.entries(profile.address[0]).forEach(([key, value]) =>
        addAddress(value, key)
      );

      profile.contact_number.map((item) => addMobileNumber(item));
      mobile_ctr = profile.contact_number.length;

      profile.education.map((item) => addEducation(item));
      educ_ctr = profile.education.length;

      profile.skills.map((item) => printSkills(item));

      profile.certification.map((item) => addCertification(item));
      cert_ctr = profile.certification.length;

      profile.professions.map((item) => addProfession(item));
      prof_ctr = profile.professions.length;

      profile.work_experience.map((item) => addWork(item));
      work_ctr = profile.work_experience.length;

      // $(".spec-skills-cert input, textarea").prop('readonly', true)

      // $(".profile-content input").prop("readonly", true);
      // $(".profile-content select").prop("disabled", true);
    } else {
      console.log("No profile found for the specified user ID.");
    }
  });
});

//ADD MOBILE
$(document).on("click", ".btn-add-mobile", function () {
  addMobileNumber();
  $(".row-mobile .input").prop('disabled', false)
  $(".row-mobile .div-remove-mobile").removeClass("d-none");
  mobile_ctr += 1;
  console.log("nyaw");
});

//ADD EDUC
$(document).on("click", ".btn-add-educ", function () {
  addEducation();
  $(".education .row-educ").addClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $(".row-educ .input").prop('disabled', false)
  $(".row-educ .div-remove-educ").removeClass("d-none");
  educ_ctr += 1;
});

//ADD SKILL
$(document).on("click", ".btn-add-skill", function () {
  let input = $(".skill-input").val();

  printSkills(input);
  $("#row-skill #deleteSkill").removeClass("d-none");
});

//ADD CERT
$(document).on("click", ".btn-add-cert", function () {
  addCertification();
  $(".row-cert .input").prop('disabled', false)
  $(".row-cert .div-remove-cert").removeClass("d-none");
  cert_ctr += 1;
});

//ADD PROFESSION
$(document).on("click", ".btn-add-profession", function () {
  addProfession();
  $(".row-profession .input").prop('disabled', false)
  $(".row-profession .div-remove-profession").removeClass("d-none");
  prof_ctr += 1;
});

//ADD WORK
$(document).on("click", ".btn-add-work", function () {
  addWork();
  $(".work .row-work").addClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $(".row-work .input").prop('disabled', false)
  $(".row-work .div-remove-work").removeClass("d-none");
  educ_ctr += 1;
});


//EDIT BUTTON
$(document).on("click", ".editButton", function () {
  console.log("pindot")
  $("input").prop("readonly", false);
  $("input").prop("disabled", false);
  $("select").prop("disabled", false);

  // MOBILE NUMBER
  $(".btn-add-mobile").removeClass("d-none");
  $(".row-mobile .div-remove-mobile").removeClass("d-none");

  // EDUCATION
  $(".btn-add-educ").removeClass("d-none");

  $(".education .row-educ").addClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $(".row-educ .div-remove-educ").removeClass("d-none");

  $(".div-add-skill").removeClass("d-none");
  $("#row-skill #deleteSkill").removeClass("d-none");

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

  $(".upload-image-section").removeClass("d-none");

  $(".editButton").addClass("d-none");
  $(".profileSaveButton").removeClass("d-none");
});

//DELETE MOBILE
$(document).on("click", ".deleteMobileRow", function () {
  $(this).parents(".row-mobile").remove();
});

//DELETE EDUC
$(document).on("click", ".deleteEducRow", function () {
  $(this).parents(".row-educ").remove();
});

//DELETE CERT
$(document).on("click", ".deleteCertRow", function () {
  $(this).parents(".row-cert").remove();
});

//DELETE PROFESSION
$(document).on("click", ".deleteProfRow", function () {
  $(this).parents(".row-profession").remove();
});

// DELETE WORK
$(document).on("click", ".deleteWorkRow", function () {
  $(this).parents(".row-work").remove();
});

//DELETE SKILL
$(document).on("click", "#deleteSkill", function () {
  $(this).parents("#row-skill").remove();
});

//SAVE 
$(document).on("click", ".profileSaveButton", function (e) {
  e.preventDefault();

  const form = $(".profile-content");

  // READONLY AND DISABLED ALL INPUTS AND SELECT
  $("input").prop("readonly", true);
  $("select").prop("disabled", true);

  // HIDE MOBILE NUMBER
  $(".btn-add-mobile").addClass("d-none");
  $(".row-mobile .div-remove-mobile").addClass("d-none");

  // HIDE EDUCATION
  $(".btn-add-educ").addClass("d-none");

  // REMOVE DROP-SHADOW OF ELEMENTS IN EDUCATION
  $("education .row-educ").removeClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $(".row-educ .div-remove-educ").addClass("d-none");

  // READONLY ALL INPUTS AND TEXT AREA
  $(".spec-skills-cert input, textarea").prop("readonly", true);

  // HIDE SKILLS
  $(".div-add-skill").addClass("d-none");
  $("#row-skill #deleteSkill").addClass("d-none");

  // HIDE CERTIFICATIONS
  $(".btn-add-cert").addClass("d-none");
  $(".row-cert .div-remove-cert").addClass("d-none");

  // HIDE PROFESSIIONS
  $(".btn-add-profession").addClass("d-none");
  $(".row-profession .div-remove-profession").addClass("d-none");

  // HIDE WORK EXPERIENCE
  $(".btn-add-work").addClass("d-none");

  // REMOVE DROP-SHADOW OF ELEMENTS IN WORK AND EXPERIENCE
  $(".work .row-work").removeClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );

  // REMOVE UPLOAD IMAGE
  $(".upload-image-section").addClass("d-none");

  $(".row-work .div-remove-work").addClass("d-none");

  // HIDE SAVE BUTTON AND SHOW EDIT BUTTON AGAIN
  $(".profileSaveButton").addClass("d-none");
  $(".editButton").removeClass("d-none");

  // PROCESS RESPONSE
  $(".response-profile").html(
    "<div class='bg-white p-3 mt-3 rounded'><div class='d-flex gap-3 align-items-center'><div class='loader'></div><p class='mb-0'>Processing, Please wait...</p></div></div>"
  );
  $("html, body").animate({ scrollTop: 0 }, "slow");

  let timeleft = 10;
  let downloadTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(downloadTimer);
      window.location.href = '../../Manage/manage.dashboard.html?modal=false'
    } else {
      $('.countdown').html("Updated... Redirecting to Dashboard Page in " + timeleft);
    }
    timeleft -= 1;
  }, 1000);

  setTimeout(function () {
    if ((message = validateInput(form.serializeArray()))) {
      const errorAlert =
        "<div class='response-profile alert alert-danger alert-dismissible fade show mt-3' role='alert'><span>Follow the format for fields: " +
        message +
        "</span><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
      $(".response-profile").html(errorAlert);
    } else {
      const successAlert =
        "<div class='response-profile alert alert-success alert-dismissible fade show mt-3' role='alert'><span class='countdown'></span><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
      $(".response-profile").html(successAlert);
    }
  }, 30);

});


//POPULATE MOBILE
function addMobileNumber(item = "") {
  let input = `<div id="row-mobile" class="d-flex justify-content-between align-items-center gap-1 mb-2">
                    <input type="text" class="input text-black form-control montserrat-regular" name="contact-number" placeholder="Add Contact Number" value="${item}">
                    <button type="button" class="deleteMobileRow btn div-remove-mobile btn-remove btn-outline btn-outline-danger d-none">
                        <i class="bi bi-trash3"></i>
                        <span class="ms-2">Remove</span>
                    </button>
                </div>`;

  $(".mobile_number").append(input);
}
//POPULATE EDUC
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
                            <input type="text" name="school" class="input text-black form-control montserrat-regular" value=${item.hasOwnProperty("school") > 0
      ? item.school
      : ""
    }>
                        </div>
                    </div>
                    <div class="row g-0 gap-2">
                        <div class="col-md">
                            <span class="fs-4 text-secondary my-2 montserrat-regular">Degree</span>
                            <input type="text" name="degree" class="input text-black form-control montserrat-regular" value=${item.hasOwnProperty("degree") > 0
      ? item.degree
      : ""
    }
                                >
                        </div>
                        <div class="col-md">
                            <span class="fs-4 text-secondary my-2 montserrat-regular">Graduated
                                on</span>
                            <input type="date" name="graduated-on" class="input text-black form-control montserrat-regular" value=${item.hasOwnProperty("graduated_at") > 0
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
//POPULATE ADDRESS
function addAddress(item, title) {
  let input = `<div class="row g-0">
                <span class="fs-4 mt-2 montserrat-semibold">${title === "current" ? "CURRENT ADDRESS" : "PERMANENT ADDRESS"
    }</span>
                <div class="row g-0 gap-2">
                    <div class="col-md">
                        <div class="">
                            <p class="fs-4 text-secondary my-2 montserrat-regular">Region</p>
                            <input type="text" name="${title + `.region`
    }" class="form-control montserrat-regular"
                                value=${item.region} autocomplete="off">
                        </div>
                        <div class="">
                            <p class="fs-4 text-secondary my-2 montserrat-regular">Province</p>
                            <input type="text" name="${title + `.province`
    }" class="form-control montserrat-regular"
                                value=${item.province} autocomplete="off">
                        </div>
                    </div>
                    <div class="col-md">
                        <div class="">
                            <p
                                class="fs-4 text-secondary mt-md-2 mb-2 montserrat-regular">Municipality</p>
                            <input type="text" name="${title + `.municipality`
    }"
                                class="form-control montserrat-regular" value=${item.municipality
    } autocomplete="off">
                        </div>
                        <div class="">
                            <p class="fs-4 text-secondary my-2 montserrat-regular">Barangay</p>
                            <input type="text" name="${title + `.barangay`
    }"
                                class="form-control montserrat-regular mb-2 mb-lg-0" value=${item.barangay
    } autocomplete="off">
                        </div>
                    </div>
                </div>
            </div>`;

  $(".address-list").append(input);
}

//POPULATE SKILLS
function printSkills(item) {
  let input = `<div id='row-skill' class="d-flex flex-row badge bg-blue-lt rounded-4 py-2 px-4 gap-3">
            <span class="fs-4 montserrat-regular">${item}</span>
            <i id="deleteSkill" class="bi bi-x fs-2 fw-bold text-secondary cursor-pointer d-none"></i>
          </div>`;
  $(input).insertBefore(".skills-list .div-add-skill");
}

//POPULATE CERTS
function addCertification(item = "") {
  let input = `<div class="row-cert d-flex justify-content-between align-items-center gap-1 mb-2">
                      <input type="text" class="input text-black form-control montserrat-regular" name="certificates" placeholder="Add Certification"  value="${item}">
                      <button type="button" class="deleteCertRow btn div-remove-cert btn-remove btn-outline btn-outline-danger d-none">
                          <i class="bi bi-trash3"></i>
                          <span class="ms-2">Remove</span>
                      </button>
                  </div>`;

  $(".certification").append(input);
}

//POPULATE PROFESSION
function addProfession(item = "") {
  let input = `<div class="row-profession d-flex justify-content-between align-items-center gap-1 mb-2">
                      <input type="text" class="input text-black form-control montserrat-regular" name="profession" placeholder="Add Profession"  value="${item}">
                      <button type="button" class="deleteProfRow btn div-remove-profession btn-remove btn-outline btn-outline-danger d-none">
                          <i class="bi bi-trash3"></i>
                          <span class="ms-2">Remove</span>
                      </button>
                  </div>`;

  $(".profession").append(input);
}

//POPULATE WORK
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
                                class="input text-black form-control montserrat-regular my-2" autocomplete="off"  value="${item.company ? item.company : ""
    }">
                        </div>
                        <span class="fs-4 text-secondary mt-1 montserrat-regular">Position</span>
                        <div class="input-container">
                            <input type="text" name="position"
                                class="input text-black form-control montserrat-regular my-2" autocomplete="off"  value="${item.position ? item.position : ""
    }">
                        </div>
                    </div>
                    <div class="d-flex flex-column col-md-6 flex-fill">
                        <span class="fs-4 text-secondary mt-1 montserrat-regular">Date
                            Hired</span>
                        <div class="input-container">
                            <input type="date" name="date-hired" 
                                class="input text-black form-control montserrat-regular my-2" autocomplete="off"  value=${myDate ? myDate : ""
    }>
                        </div>
                        <span class="fs-4 text-secondary mt-1 montserrat-regular">Date
                            Resigned</span>
                        <div class="input-container">
                            <input type="date" name="date-resigned"
                                class="input text-black form-control montserrat-regular my-2" autocomplete="off"  value=${item.date && item.date.hasOwnProperty("date_resigned")
      ? formatDate(item.date.date_resigned)
      : ""
    }>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <span class="fs-4 text-secondary mt-1 montserrat-regular">Job Description</span>
                    <div class="input-container">
                        <textarea name="description" class="text-black input form-control montserrat-regular" autocomplete="off" wrap="physical" rows="5" >${item.job_description ? item.job_description : ""}</textarea>
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

function checkAllProperties(obj, properties) {
  for (const prop of properties) {
    if (!obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return true;
}

function validateInput(input) {
  let message = [],
    tempObj = {},
    educ = [],
    address = [
      {
        permanent: {},
        current: {},
      },
    ],
    mobile = [];

  const data = input.reduce(function (obj, item, currentIndex) {
    if (item.name === "contact_number") {
      mobile.push(item.value);
    } else if (item.name.includes("education")) {
      tempObj[item.name.replace("education.", "")] = item.value;

      if (checkAllProperties(tempObj, ["school", "graduated_at", "degree"])) {
        educ.push(tempObj);
        obj["education"] = educ;
        tempObj = {};
      }
    } else if (
      item.name.includes("current") ||
      item.name.includes("permanent")
    ) {
      const attr = item.name.includes("current") ? "current" : "permanent";
      tempObj[item.name.replace(`${attr}.`, "")] = item.value;

      if (
        checkAllProperties(tempObj, [
          "region",
          "province",
          "municipality",
          "barangay",
        ])
      ) {
        address[0][attr] = tempObj;
        tempObj = {};
      }
    } else obj[item.name] = item.value;

    if (currentIndex === input.length - 1) {
      obj["address"] = address;
      obj["contact_number"] = mobile;
    }

    return obj;
  }, {});

  console.log(data);

  const validator = validate(data);

  if (validator !== undefined) {
    for (key in validator) {
      message.push(validator[key]);
    }
    return message.join(", ");
  }

  // for (key in validator) {
  //   message.push(validator[key]);
  // }
  // return message.join(", ");

  return false;
}