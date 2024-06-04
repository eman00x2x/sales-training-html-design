        $(document).ready(function () {
            getOrganizationsData(1, '', 'asc', 'name');

          });

          let sortBy = 'name';
          let sortDirection = 'asc';


          function search() {
            getOrganizationsData(1, $('#search').val(), sortBy, sortDirection);
          }
        
          
          
          function updateSortDirection(direction) {
            sortDirection = direction;
            console.log(sortDirection);
            highlightSortDirection();
            search();
          }
          
          function updateSortBy(by) {
            sortBy = by;
            search();
            highlightSortBy();
          }
          
          
          function changePage(pageNumber) {
            const searchText=$('search').val();
            getOrganizationData(pageNumber, searchText, sortBy, sortDirection);
          }
          
          
          function highlightSortDirection() {
            $('.btn-sort-direction').removeClass('active');
            if (sortDirection === 'asc') {
              $('#btnSortAsc').addClass('active');
            } else {
              $('#btnSortDesc').addClass('active');
            }
          }
          
          function highlightSortBy() {
            $('.dropdown-item.sort-by').removeClass('active');
            if (sortBy === 'name') {
              $('#sortByTitle').addClass('active');
            } else {
              $('#sortByDate').addClass('active');
            }
          }


        $(document).on('click', '.btn-add', function (e) {
            window.location.href = "organization.user.create.html";
        });

          function getOrganizationsData(pageNumber, searchText, sortBy, sortDirection) {

            const userPerPage = 9;
            const startIndex = (pageNumber - 1) * userPerPage;
            const endIndex = startIndex + userPerPage;

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
                            // console.log(filteredData)


                            const tableBody = $(".userTable tbody");
                            filteredData.forEach((item) => {
                                let fullName = `${item.name.prefix} ${item.name.firstname} ${item.name.lastname} ${item.name.suffix}`;
                                let permanentAddress = item.address[0].permanent;
                                let fullAddress = `${permanentAddress.region}, ${permanentAddress.province}, ${permanentAddress.municipality}, ${permanentAddress.barangay}`;
                                let newRow = `
                                    <tr>
                                        <td>${item.profile_id}</td>
                                        <td>${fullName}</td>
                                        <td>${item.email}</td>
                                        <td>${item.account_type}</td>
                                        <td> ${convertDate(item.registered_at)}</td>
                                        <td>
                                            <div class="d-flex flex-nowrap gap-1">
                                                <a class="btn border-primary bg-body" href="organization.user.view.html?id=${item.profile_id}" >   <span class="p-4">   </span></a>
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

          function updatePagination(currentPage, totalPages) {
            const pageNumbers = document.getElementById('page-numbers');
            const paginationContainer = $('.btn-group');
          
            let paginationButtons = '';
          
          
            if (totalPages > 0) {
              paginationButtons += `
              <button type="button" class="btn btn-outline-primary montserrat-semibold ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">
                  <span class="d-none d-md-block">Previous</span>
                  <i class="bi bi-chevron-double-left d-block d-md-none"></i>
              </button>`;
          
              for (let i = 1; i <= totalPages; i++) {
                const activeClass = i === currentPage ? 'active' : '';
                paginationButtons += `<button type="button" class="btn btn-outline-primary ${activeClass}" onclick="changePage(${i})">${i}</button>`;
              }
          
              paginationButtons += `<button type="button" class="btn btn-outline-primary montserrat-semibold ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">
               <span class="d-none d-md-block">Next</span>
              <i class="bi bi-chevron-double-right d-block d-md-none"></i>
          </button>`;
            } else {
              paginationButtons = '';
            }
            pageNumbers.innerHTML = totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages';
            paginationContainer.html(paginationButtons);
          }
        //   <a class="btn border-primary bg-body" href="organization.user.view.update.html?id=${item.profile_id}"> <i class="bi bi-pencil-square"></i> Edit</a> 
