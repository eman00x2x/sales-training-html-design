$(document).ready(function () {
  $(".mobile-add").css("display", "none");
  $(".mobile-remove").css("display", "none");

  $.getJSON("../Cdn/js/data/profiles.json", function (response) {
    const formatDate = (epochTime) => {
      let date = new Date(epochTime * 1000);
      return date.toISOString().split("T")[0];
    };

    id = getParams("id");

    let profile = response.data.find(
      (profile) => profile.profile_id === parseInt(id)
    );

    if (profile) {
      profile.skills.map((item) => printSkills(item));

      // $("#certificates").val(profile.certification[0]);
      // $("#professions").val(profile.professions[0]);
      // $("#company").val(profile.work_experience[0].company);
      // $("#position").val(profile.work_experience[0].position);
      // $("#date-hired").val(
      //   formatDate(profile.work_experience[0].date.date_hire)
      // );
      // $("#date-resigned").val(
      //   formatDate(profile.work_experience[0].date.date_resigned)
      // );
      // $("#description").val(profile.work_experience[0].job_description);
    } else {
      console.log("No profile found for the specified user ID.");
    }
  });
});

function printSkills(item) {
  let input = `<div id='row-skill' class="d-flex flex-row badge bg-blue-lt rounded-4 py-2 px-4 gap-3">
          <span class="fs-4 montserrat-regular">${item}</span>
          <i id="deleteSkill" class="bi bi-x fs-2 fw-bold text-secondary cursor-pointer d-none"></i>
        </div>`;
  $(input).insertBefore(".skills-list .div-add-skill");
  // $(".skills-list").prepend(input);
}


$(document).on("click", "#editButton2", function () {
  $(".div-add-skill").removeClass("d-none");
  $("#row-skill #deleteSkill").removeClass("d-none");

  $("#editButton2").hide();
  $("#saveButton2").show();
});

$(document).on("click", "#deleteSkill", function () {
  $(this).parents("#row-skill").remove();
});

$(document).on("click", ".btn-add-skill", function () {
  let input = $(".skill-input").val();

  printSkills(input);
});
