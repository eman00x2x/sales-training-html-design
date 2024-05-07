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

          function getOrganizationsData() {
            $.getJSON("../Cdn/js/data/profiles.json", function (data) {
                $.getJSON("../Cdn/js/data/accounts.json", function (account) {
                    $.getJSON("../Cdn/js/data/organization.json", function (organization) {

                        const profileData = data.data;
                        const accountData = account.data;
                        const organizationData = organization.data;

                        let params = new URL(document.location.toString()).searchParams;
                        let id = params.get("id");

                        let orgData = organizationData.find((item) => item.organization_id == id);

                        if (orgData) {
                            let orgId = orgData.organization_id;
                            let mergedData = profileData.map(profile => {
                                let accData = accountData.find(account => account.account_id === profile.account_id);
                                return { ...profile, ...accData };
                            });
                            let filteredData = mergedData.filter(item => item.organization_id == orgId);
                            const tableBody = $(".userTable tbody");
                            filteredData.forEach((item) => {
                                let fullName = `${item.name.prefix} ${item.name.firstname} ${item.name.lastname} ${item.name.suffix}`;
                                let permanentAddress = item.address[0].permanent;
                                let fullAddress = `${permanentAddress.region}, ${permanentAddress.province}, ${permanentAddress.municipality}, ${permanentAddress.barangay}`;
                                let newRow = `
                                    <tr>
                                        <td>${item.profile_id}</td>
                                        <td><img src="${item.profile_image}" alt="Profile Image" class="profileImg"></td>
                                        <td>${fullName}</td>
                                        <td>${fullAddress}</td>
                                        <td>${item.account_type}</td>
                                        <td>
                                            <div class="d-flex flex-nowrap gap-1">
                                                <a class="btn border-primary bg-body" href="organization.user.view.html?id=${item.profile_id}" > <i class="bi bi-eye"></i> View</a>
                                                <a class="btn border-primary bg-body" href="organization.user.view.update.html?id=${item.profile_id}"> <i class="bi bi-pencil-square"></i> Edit</a> 
                                                <a class="btn border-danger bg-body" href="organization.user.delete.html?id=${item.profile_id}" > <i class="bi bi-trash"></i> Delete</a>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                                tableBody.append(newRow);
                            });
                        }
                    });
                });
            });
          }

