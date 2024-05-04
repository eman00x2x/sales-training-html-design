$(document).ready(function () {
    getOrganizationsData();

  });


  $(document).on("keyup", '.search', function () {
    var value = $(this).val().toLowerCase();
    $(".userTable .data-container tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});


$(document).on('click', '.btn-add', function (e) {
    window.location.href = "organization.user.create.html";
});

  function getOrganizationsData()
  {
    

    $.getJSON("../Cdn/js/data/profiles.json", function (data) {


      $.getJSON("../Cdn/js/data/accounts.json", function (account) { 

        const profileData = data.data;
        const accountData = account.data;

        for (let i = 0; i < profileData.length && i < accountData.length; i++) {
          
            let profData = profileData[i];
            let accData = accountData[i];

            const tableBody = $(".userTable tbody");

             let fullName = `${profData.name.prefix} ${profData.name.firstname} ${profData.name.lastname} ${profData.name.suffix}`;
             let permanentAddress = profData.address[0].permanent;
             let fullAddress = `${permanentAddress.region}, ${permanentAddress.province}, ${permanentAddress.municipality}, ${permanentAddress.barangay}`;
             let accType = "";
                 if (profData.account_id === accData.account_id) {
                     accType = accData.account_type;
                 }
           
                 let newRow = `
                 <tr>
                     <td>${profData.profile_id}</td>
                     <td><img src="${profData.profile_image}" alt="Profile Image" class="profileImg"></td>
                     <td>${fullName}</td>
                     <td>${fullAddress}</td>
                     <td>${accType}</td>
                     <td>
                                     <div class="d-flex flex-nowrap gap-1">
                                       <a class="btn border-primary bg-body" href="organization.user.view.html?id=${profData.profile_id}" > <i class="bi bi-eye"></i> View</a>
               
                                         <a class="btn border-primary bg-body"" href="organization.user.view.update.html?id=${profData.profile_id}"> <i class="bi bi-pencil-square"></i> Edit</a> 
                                      <a class="btn border-danger bg-body" href="organization.user.delete.html?id=${profData.profile_id}" > <i class="bi bi-trash"></i> Delete</a>
               
                                     </div>
                                   </td>
                 </tr>
               `;
                 tableBody.append(newRow);



        }
   
      });
    });
  }