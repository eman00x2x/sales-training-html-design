let mobile_ctr = 0;
let educ_ctr = 0;

$(document).ready(function () {
  $("#row-educ").removeClass();
  $(".profileSaveButton").hide();

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
      $("#profile_image").attr("src", profile.profile_image);
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

      $(".profile input").prop("readonly", true);
      $(".profile select").prop("disabled", true);
    } else {
      console.log("No profile found for the specified user ID.");
    }
  });
});

$(document).on("click", ".btn-add-mobile", function () {
  addMobileNumber();
  $("#row-mobile .div-remove-mobile").removeClass("d-none");
  mobile_ctr += 1;
});

$(document).on("click", ".btn-add-educ", function () {
  addEducation();
  $("#education #row-educ").addClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $("#row-educ .div-remove-educ").removeClass("d-none");
  educ_ctr += 1;
});

$(document).on("click", "#editButton", function () {
  $(".profile input").prop("readonly", false);
  $(".profile select").prop("disabled", false);

  // MOBILE NUMBER
  $(".btn-add-mobile").removeClass("d-none");
  $("#row-mobile .div-remove-mobile").removeClass("d-none");

  // EDUCATION
  $(".btn-add-educ").removeClass("d-none");

  $("#education #row-educ").addClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $("#row-educ .div-remove-educ").removeClass("d-none");

  $("#editButton").hide();
  $(".profileSaveButton").show();
});

$(document).on("click", ".profileSaveButton", function (e) {
  e.preventDefault();

  const form = $(".profile");

  // READONLY AND DISABLED ALL INPUTS AND SELECT
  $(".profile input").prop("readonly", true);
  $(".profile select").prop("disabled", true);

  // HIDE MOBILE NUMBER
  $(".btn-add-mobile").addClass("d-none");
  $("#row-mobile .div-remove-mobile").addClass("d-none");

  // HIDE EDUCATION
  $(".btn-add-educ").addClass("d-none");

  // REMOVE DROP-SHADOW OF ELEMENTS IN EDUCATION
  $("#education #row-educ").removeClass(
    "bg-light shadow-sm border mt-2 px-2 rounded"
  );
  $("#row-educ .div-remove-educ").addClass("d-none");

  // HIDE SAVE BUTTON AND SHOW EDIT BUTTON AGAIN
  $(".profileSaveButton").hide();
  $("#editButton").show();

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

$(document).on("click", "#deleteMobileRow", function () {
  $(this).parents("#row-mobile").remove();
});

$(document).on("click", "#deleteEducRow", function () {
  $(this).parents("#row-educ").remove();
});

function addMobileNumber(item = "") {
  let input = `<div id="row-mobile" class="d-flex justify-content-between align-items-center gap-1 mb-2">
                    <input type="text" name="contact_number" class="form-control montserrat-regular" placeholder="Add Contact Number" value=${item}>
                    <button type="button" id="deleteMobileRow" class="btn div-remove-mobile btn-remove btn-outline btn-outline-danger d-none">
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

  let input = `<div id='row-educ' class='mb-2'>
                    <div class="row g-0">
                        <label for="school" class="fs-4 text-secondary my-2 montserrat-regular">School</label>
                        <div class="">
                            <input type="text" name="education.school" id="school" class="form-control montserrat-regular" value=${
                              item.hasOwnProperty("school") ? item.school : ""
                            }>
                        </div>
                    </div>
                    <div class="row g-0 gap-2">
                        <div class="col-md">
                            <label for="degree" class="fs-4 text-secondary my-2 montserrat-regular">Degree</label>
                            <input type="text" name="education.degree" id="degree" class="form-control montserrat-regular" value=${
                              item.hasOwnProperty("degree") ? item.degree : ""
                            }
                                >
                        </div>
                        <div class="col-md">
                            <label for="graduated-on" class="fs-4 text-secondary my-2 montserrat-regular">Graduated
                                on</label>
                            <input type="date" name="education.graduated_at" id="graduated-on" class="form-control montserrat-regular" value=${
                              item.hasOwnProperty("graduated_at") ? myDate : ""
                            }
                                >
                        </div>
                    </div>
                    <div class="text-center div-remove-educ d-none">
                        <button type="button" id="deleteEducRow" class="btn my-3 btn-remove-educ btn-remove btn-outline btn-outline-danger ">
                            <i class="bi bi-trash3"></i>
                            <span class="ms-2">Remove</span>
                        </button>
                    </div>
                </div>`;

  $("#education").append(input);
}

function addAddress(item, title) {
  let input = `<div class="row g-0">
                <span class="fs-4 mt-2 montserrat-semibold">${
                  title === "current" ? "CURRENT ADDRESS" : "PERMANENT ADDRESS"
                }</span>
                <div class="row g-0 gap-2">
                    <div class="col-md">
                        <div class="">
                            <label for="region" class="fs-4 text-secondary my-2 montserrat-regular">Region</label>
                            <input type="text" name="${
                              title + `.region`
                            }" id="region" class="form-control montserrat-regular"
                                value=${item.region} autocomplete="off">
                        </div>
                        <div class="">
                            <label for="province" class="fs-4 text-secondary my-2 montserrat-regular">Province</label>
                            <input type="text" name="${
                              title + `.province`
                            }" id="province" class="form-control montserrat-regular"
                                value=${item.province} autocomplete="off">
                        </div>
                    </div>
                    <div class="col-md">
                        <div class="">
                            <label for="municipality"
                                class="fs-4 text-secondary mt-md-2 mb-2 montserrat-regular">Municipality</label>
                            <input type="text" name="${
                              title + `.municipality`
                            }" id="municipality"
                                class="form-control montserrat-regular" value=${
                                  item.municipality
                                } autocomplete="off">
                        </div>
                        <div class="">
                            <label for="barangay" class="fs-4 text-secondary my-2 montserrat-regular">Barangay</label>
                            <input type="text" name="${
                              title + `.barangay`
                            }" id="barangay"
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
