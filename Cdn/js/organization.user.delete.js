let id;
let org;

$(document).ready(function () {
  id = getParams("id");
  org = getParams("org");
  $.when(
    $.getJSON("../Cdn/js/data/profiles.json"),
    $.getJSON("../Cdn/js/data/accounts.json"),
    $.getJSON("../Cdn/js/data/organization.json")
  ).done(function (data1, data2, data3) {
    // MERGE PROFILE AND ACCOUNTS
    let response = data1[0].data.map((a) =>
      Object.assign(
        a,
        data2[0].data.find((b) => b.account_id == a.account_id)
      )
    );
    // MERGE RESPONSE AND ORGANIZATION
    let result = response.map((a) => ({
      ...a,
      organization: data3[0].data.find(
        (b) => b.organization_id == a.organization_id
      ),
    }));
    let f = result.keys(result).find((key) => result[key].account_id == id);


    $('.name').text(response[f].name.firstname + " " + response[f].name.lastname);
    $('#acc-id').text(response[f].account_id);
    $('#birthday').text(convertDate(response[f].birthday));
    $('#username').text(response[f].username);
    $('#email').text(response[f].email);
    $('.acc-fb').text(response[f].social_profile.facebook);
    $('.acc-linkedIn').text(response[f].social_profile.linkedIn);
    $(".accLogo").attr("src", response[f].profile_image);
    $(".accName").text(
      `${response[f].name.prefix} ${response[f].name.firstname} ${response[f].name.lastname} ${response[f].name.suffix}`
    );
    $(".breadlink").attr("href", `organization.user.list.html?id=${org}`);
    console.log(result[f]);
  });

});

$(document).on("click", "#back", function (e) {
  window.location.href = `organization.user.list.html?id=${org}`;
});

$(document).on("change", "#logo", function (e) {
  var URL = window.URL || window.webkitURL;
  var file = e.target.files[0];

  if (file) {
    $(".orgLogo").attr("src", URL.createObjectURL(file));
  }
});