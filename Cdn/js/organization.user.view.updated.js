     
     
 $(document).ready(function () {
    let params = new URL(document.location.toString()).searchParams;
    let id = params.get("id");

    $.getJSON("../Cdn/js/data/profiles.json", function (data) {


      $.getJSON("../Cdn/js/data/accounts.json", function (account) { 

      let response = data.data;
      let accountResponse = account.data;
      let userData = response.find((item) => item.profile_id == id);
      let accountData =  accountResponse.find((item) => item.account_id == id);


      console.log(accountData.account_type)

      let fullName = `${userData.name.prefix} ${userData.name.firstname} ${userData.name.lastname} ${userData.name.suffix}`;
      let permanentAddress = userData.address[0].permanent;
      let fullAddress = `${permanentAddress.region}, ${permanentAddress.province}, ${permanentAddress.municipality}, ${permanentAddress.barangay}`;
      let accType = "";

      $(".user-img").attr("src", userData.profile_image);
      $("#lastname").val(userData.name.suffix);
      $("#name").val(userData.name.firstname);
      $("#address").val(fullAddress);
      $("#contact").val(userData.contact_number);
      $("#type").val(accountData.account_type)
      $(".bread-title").text(fullName)

      });



   
    });
  });

  $(document).on("click", "#back", function (e) {
  window.location.href = "organization.user.list.html"
});

$(document).on("change", "#logo", function (e) {
  var URL = window.URL || window.webkitURL;
  var file = e.target.files[0];

  if (file) {
    $(".user-img").attr("src", URL.createObjectURL(file));
  }
});

  function validateInput(input) {
    let message = [];

    const data = input.reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});

    const validator = validate(
      {
        logo: data.logo,
        lastname: data.lastname,
        firstname: data.fname,
        mname: data.mname,
      },
      {
        logo: {
          type: "image/png,image/jpeg",
        },
        lastname: {
          type: "string",
          length: { minimum: 4 },
        },

        firstname: {
          type: "string",
          length: { minimum: 4 },
        },

        lastname: {
          type: "string",
          length: { minimum: 4 },
        },
      }
    );

    if (validator !== undefined) {
      for (key in validator) {
        message.push(validator[key]);
      }
      return message.join(", ");
    }

    return false;
  }