

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
    link: "/Manage/manage.training.program.html",
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
  let stepParam = getParams('step');

  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    let lock = `<div class="container mx-5 mx-auto"
    style="text-decoration: none; color: #000;">
    <div class="steps shadow-lg rounded position-relative overflow-hidden border border-secondary-subtle">
      <div class="unlock position-absolute w-100 h-100 z-2 d-flex justify-content-center align-items-center">
        <i class="bi bi-lock-fill" style="font-size: 100px; color: #1c1c39"></i>
      </div>
      <div class="gradient p-5">
        <div class="d-flex justify-content-start align-items-center mb-3">
          <div class="step-number rounded-circle">
            <p>${step.number}</p>
          </div>
          <div class="step-title my-auto d-flex">
            <h2 class="ms-3 my-auto font-weight-bold">${step.title}</h2>
          </div>
        </div>
        <div class="border-top border-dark"></div>
        <div class="d-flex justify-content-start mt-3 mb-3">
          <div class="step-note">
            <p class="font-weight-bold">Note:</p>
          </div>
          <div class="ms-3">
            <p>${step.note}</p>
          </div>
        </div>
      </div>
    </div>
  </div>`

    let unlock = `<a href=${step.link} class="container mx-5 mx-auto"
    style="text-decoration: none; color: #000;">
    <div class="steps shadow-lg rounded position-relative overflow-hidden border border-secondary-subtle">
      <div class="p-5">
        <div class="d-flex justify-content-start align-items-center mb-3">
          <div class="step-number rounded-circle">
            <p>${step.number}</p>
          </div>
          <div class="step-title my-auto d-flex">
            <h2 class="ms-3 my-auto font-weight-bold">${step.title}</h2>
          </div>
        </div>
        <div class="border-top border-dark"></div>
        <div class="d-flex justify-content-start mt-3 mb-3">
          <div class="step-note">
            <p class="font-weight-bold">Note:</p>
          </div>
          <div class="ms-3">
            <p>${step.note}</p>
          </div>
        </div>
      </div>
    </div>
  </a>`
    html += i <= stepParam - 1 ? unlock : lock;

    if (i < steps.length - 1) {
      html += "<div class='line mx-auto'></div>";
    }
  }
  $(".steps").html(html);
}
