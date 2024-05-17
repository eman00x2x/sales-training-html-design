let mobile_ctr = 0;
let educ_ctr = 0;

$(document).ready(function () {
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

      $(".profile-content input").prop("readonly", true);
      $(".profile-content select").prop("disabled", true);

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
  $(".profile-content input").prop("readonly", false);
  $(".profile-content select").prop("disabled", false);

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
  $(".profile-content .profileSaveButton").show();
});

$(document).on("click", ".deleteMobileRow", function () {
  $(this).parents(".row-mobile").remove();
});

$(document).on("click", ".deleteEducRow", function () {
  $(this).parents(".row-educ").remove();
});

$(document).on("click", ".profileSaveButton", function (e) {
  e.preventDefault();

  const form = $(".profile-content");

  // READONLY AND DISABLED ALL INPUTS AND SELECT
  $(".profile input").prop("readonly", true);
  $(".profile select").prop("disabled", true);

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

  // HIDE SAVE BUTTON AND SHOW EDIT BUTTON AGAIN
  $(".profileSaveButton").hide();
  $(".editButton").show();

  // PROCESS RESPONSE
  $(".response-profile").html(
    "<div class='bg-white p-3 mt-3 rounded'><div class='d-flex gap-3 align-items-center'><div class='loader'></div><p class='mb-0'>Processing, Please wait...</p></div></div>"
  );
  $("html, body").animate({ scrollTop: 0 }, "slow");

  setTimeout(function () {
    if ((message = validateInput(form.serializeArray()))) {
      const errorAlert =
        "<div class='response-profile alert alert-danger alert-dismissible fade show mt-3' role='alert'><span>Follow the format for fields: " +
        message +
        "</span><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
      $(".response-profile").html(errorAlert);
    } else {
      const successAlert =
        "<div class='response-profile alert alert-success alert-dismissible fade show mt-3' role='alert'><span>Submitted but nothing happened! form data" +
        form.serialize() +
        ". See <a href='../Cdn/js/script.js'>../Cdn/js/script.js</a></span><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
      $(".response-profile").html(successAlert);
    }
  }, 30);
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

function addAddress(item, title) {
  let input = `<div class="row g-0">
                <span class="fs-4 mt-2 montserrat-semibold">${
                  title === "current" ? "CURRENT ADDRESS" : "PERMANENT ADDRESS"
                }</span>
                <div class="row g-0 gap-2">
                    <div class="col-md">
                        <div class="">
                            <p class="fs-4 text-secondary my-2 montserrat-regular">Region</p>
                            <input type="text" name="${
                              title + `.region`
                            }" class="form-control montserrat-regular"
                                value=${item.region} autocomplete="off">
                        </div>
                        <div class="">
                            <p class="fs-4 text-secondary my-2 montserrat-regular">Province</p>
                            <input type="text" name="${
                              title + `.province`
                            }" class="form-control montserrat-regular"
                                value=${item.province} autocomplete="off">
                        </div>
                    </div>
                    <div class="col-md">
                        <div class="">
                            <p
                                class="fs-4 text-secondary mt-md-2 mb-2 montserrat-regular">Municipality</p>
                            <input type="text" name="${
                              title + `.municipality`
                            }"
                                class="form-control montserrat-regular" value=${
                                  item.municipality
                                } autocomplete="off">
                        </div>
                        <div class="">
                            <p class="fs-4 text-secondary my-2 montserrat-regular">Barangay</p>
                            <input type="text" name="${
                              title + `.barangay`
                            }"
                                class="form-control montserrat-regular mb-2 mb-lg-0" value=${
                                  item.barangay
                                } autocomplete="off">
                        </div>
                    </div>
                </div>
            </div>`;

  $(".address-list").append(input);
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
