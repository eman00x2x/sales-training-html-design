$(document).on("click", "#back", function (e) {
    window.location.href = "organization.user.list.html"
  });

  $(document).on("change", "#logo", function (e) {
    var URL = window.URL || window.webkitURL;
    var file = e.target.files[0];

    const imageTag =
      "<h6>Uploaded Files</h6><div class='d-flex flex-row justify-content-start align-items-center rounded shadow-sm p-2 bg-white rounded border border-secondary-subtle'><img src='" +
      URL.createObjectURL(file) +
      "'class='border border-secondary-subtle p-2 rounded' name='org_logo' style='height: 100px'/><div class='d-flex flex-column'><span class='ms-4 fw-semibold'>" +
      e.target.files[0].name +
      "</span> <span class='ms-4 fw-normal'>" +
      formatFileSize(e.target.files[0].size) +
      "</span><div></div>";

    if (file) {
      $(".org_logo").html(imageTag);
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