let pathId = 0;

$(document).ready(function () {
  displayPath();
});

const paths = [
  {
    id: 1,
    imgPath: "./../Cdn/images/Affiliate.svg",
    title: "AFFILIATE",
    note: "Marketing partner who earns commission by generating sales for another company's products or services, acting as a referrer.",
    success:
      "You have chosen Affiliate. Acquire knowledge and skills throughout watching series of videos.",
    link: "/Manage/manage.ebook.examination.html",
  },
  {
    id: 2,
    imgPath: "./../Cdn/images/Salesperson.svg",
    title: "SALESPERSON",
    note: "Frontline seller directly interacting with customers, answering questions, negotiating deals, and closing sales to achieve sales goals.",
    success:
      "You have chosen Salesperson. Acquire knowledge and skills throughout watching series of videos. ",
    link: "/Manage/manage.ebook.examination.html",
  },
  {
    id: 3,
    imgPath: "./../Cdn/images/Real-Estate-Broker.svg",
    title: "REAL ESTATE BROKER",
    note: "Licensed professional with advanced training who oversees real estate transactions, handles them personally, or supervises salespersons.",
    success:
      "You have chosen Real-Estate Broker. Acquire knowledge and skills throughout watching series of videos. ",
    link: "/Manage/manage.ebook.examination.html",
  },
];

$(document).on("click", ".choose", function () {
  var id = $(this).data("id");
  pathId = id;
  let html = `
  <button type="button" class="btn confirm border border-secondary-subtle btn-light text-white" data-id="${pathId}" data-bs-toggle='modal' data-bs-target='#pathModal' style="background-image: linear-gradient(to left, #0b267d, #354e9f);">
    Confirm
  </button>
  <button type="button" class="btn btn-delete" data-bs-dismiss="modal">
    Cancel
  </button>`;
  $(".modal-btn").html(html);
});

$(document).on("click", ".confirm", function () {
  var id = $(this).data("id");
  pathId = id;

  let response = paths;
  f = response.keys(response).find((key) => response[key].id == pathId);

  $(".pathImg").attr("src", response[f].imgPath);
  $("#title").text(response[f].title);
  $("#success").text(response[f].success);
});

function displayPath() {
  let html = "";

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    html += `
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4 my-5">
        <button class="choose p-2 rounded" style="border: none; background: #D9D9D9;" data-id="${path.id}" data-bs-toggle='modal' data-bs-target='#dynamicModal'>
          <div class="rounded" style="background-image: linear-gradient(black, #131C39); padding: 0 60px;">
            <img style="margin-top: -60px; margin-bottom: 20px;" src="${path.imgPath}" alt="">
          </div>
          <div>
            <h1 class="mt-3" style="font-weight: 700;">${path.title}</h1>
            <p class="mt-3">${path.note}</p>
          </div>
        </button>
      </div>`;
  }
  $(".paths").html(html);
}
