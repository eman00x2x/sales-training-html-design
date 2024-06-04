$(document).ready(function () {
  displaySteps();
});

const steps = [
  {
    number: 1,
    title: "Career Orientation",
    note: "This is a friendly reminder that your examination is scheduled immediately after the orientation session. Please ensure that you are prepared and ready to demonstrate your understanding of the material covered during the orientation.",
    link: "/Manage/manage.ebook.examination.html",
  },
  {
    number: 2,
    title: "Setting My Career Path",
    note: "Choose your desired agent type and which will be the basis of your learning modules.",
    link: "/Manage/manage.choose.your.path.html",
  },
  {
    number: 3,
    title: "Training Program",
    note: "Learn through different of modules which includes series of videos related to your desired agent type. There will be an examination per modules to test your knowledge.",
    link: "/Manage/manage.col.video.groups.list.html",
  },
  {
    number: 4,
    title: "Requirements",
    note: "Pick a schedule for your on-site interview which will evaluate your knowledge and skills. Make sure to attend your chosen schedule as it is crucial for your next career path.",
    link: "/Manage/manage.profession.requirements.html",
  }
];

function displaySteps() {
  let html = "";

  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    html +=
      " <a href='" +
      step.link +
      "' class='container mx-5 mx-auto' style='text-decoration: none; color: #000;'>";
    html += '<div class="steps shadow-sm rounded p-5 bg-white">';
    html +=
      '<div class="d-flex justify-content-start align-items-center mb-3">';
    html += '<div class="step-number rounded-circle">';
    html += "<p>" + step.number + "</p>";
    html += "</div>";
    html += '<div class="step-title my-auto d-flex">';
    html += '<h2 class="ms-3 my-auto font-weight-bold">' + step.title + "</h2>";
    html += "</div>";
    html += "</div>";
    html += '<div class="border-top border-dark"></div>';
    html += '<div class="d-flex justify-content-start mt-3 mb-3">';
    html += '<div class="step-note">';
    html += '<p class="font-weight-bold">Note:</p>';
    html += "</div>";
    html += '<div class="ms-3">';
    html += "<p>" + step.note + "</p>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "</a>";

    if (i < steps.length - 1) {
      html += "<div class='line mx-auto'></div>";
    }
  }
  $(".steps").html(html);
}
