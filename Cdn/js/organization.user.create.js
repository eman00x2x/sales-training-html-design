$(document).ready(function () {
  $(".org-div-logo").css("display", "none")
})

$(document).on("click", "#back", function (e) {
  window.location.href = "organization.iser.list.html"
});

$(document).on("click", ".btn-remove", function (e) {
  $(".org-div-logo").css("display", "none")
});

$(document).on("change", "#logo", function (e) {
  let reader = new FileReader();

  reader.onload = function (event) {
      $(".org-div-logo").css("display", "block")
      $(".org-logo").attr('src', event.target.result)
      $(".file-name").text(e.target.files[0].name)
      $(".file-size").text(formatFileSize(e.target.files[0].size))
  }

  reader.readAsDataURL(e.target.files[0]);
});

$(document).on('click', ".toggle-password", function (e) {
  e.preventDefault();

  if ($('.toggle-input').attr("type") == "text") {
      $('.toggle-input').attr('type', 'password');
      $('.toggle-password i').addClass("bi-eye-slash-fill");
      $('.toggle-password i').removeClass("bi-eye-fill");
  } else if ($('.toggle-input').attr("type") == "password") {
      $('.toggle-input').attr('type', 'text');
      $('.toggle-password i').removeClass("bi-eye-slash-fill");
      $('.toggle-password i').addClass("bi-eye-fill");
  }
});

/**
* Validator Documentation https://validatejs.org/#validators-length
**/

function validateInput(input) {
  let message = [];

  const data = input.reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
  }, {});

  const validator = validate(
      {
          username: data.username,
          password: data.password,
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
          user_type: data.user_type,
      },
      {
          username: {
              presence: { allowEmpty: false },
              type: "string",
              length: { minimum: 6 },
          },
          password: {
              presence: { allowEmpty: false },
              // format: {
              //     pattern: "(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$",
              //     message: "must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character."
              // },
          },
          email: {
              presence: { allowEmpty: false },
              type: "string",
              format: {
                  pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: "must be a valid email address."
              }
          },
          firstname: {
              presence: { allowEmpty: false },
              type: "string",
          },
          lastname: {
              presence: { allowEmpty: false },
              type: "string",
          },
          user_type: {
              presence: { allowEmpty: false },
              type: "string",
          }
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