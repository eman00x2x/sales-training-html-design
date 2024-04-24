# Sample html file
> - with dynamic header, footer and sidebar
> - with sample data retrieved from .json file
> - view file from /Admin/organization.list.html
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organizations</title>
    
        <link href="../Cdn/vendor/bootstrap-5.3.3/css/bootstrap.min.css" rel="stylesheet" />
        
        <script src="../Cdn/vendor/bootstrap-5.3.3/js/bootstrap.min.js"></script>
        <script src="../Cdn/vendor/jquery-3.7.1/jquery-3.7.1.min.js"></script>

        <script type="text/javascript">

            $(document).ready(function () {
                getOrganizationsData();
            });

            function getOrganizationsData() {
                let html = '';

                $.getJSON('../Cdn/js/data/organization.json', function (response) {
                    const org = response.data;
                    for (let i = 0; i < org.length; i++) {
                        let data = org[i];
                        html += "<tr>";
                        for (let key in data) {
                            switch(key) {
                                case 'created_at':
                                    let date = new Date(0);
                                    date.setUTCSeconds(data[key]);
                                    data[key] = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                    break;
                                case 'logo':
                                    data[key] = "<img src='" + data[key] + "' style='width:64px;' />";
                                    break;
                            }
                            html += "<td class='align-middle'>" + data[key] + "</td>";
                        }
                        html += "<tr>";
                    }
                    $('.organizations .data').html(html);
                });
            }
        </script>
    
</head>

<body>

    <div class='header'></div>
    <div class='sidebar'></div>
    <div class='container'>
        <div class='content'>
            <!-- all content body should be here -->

            <div class='list'><!-- list data -->
                <div class='table-responsive'>
                    <table class='table table-bordered organizations'>
                        <thead>
                            <tr>
                                <th class="align-middle">ID</th>
                                <th class="align-middle">NAME</th>
                                <th class="align-middle">DESCRIPTION</th>
                                <th class="align-middle">LOGO</th>
                                <th class="align-middle">PRIVILEGES</th>
                                <th class="align-middle">CREATED AT</th>
                            </tr>
                        </thead>
                        <tbody class="data"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class='footer'></div>

</body>
</html>
```


# Folder Structure
- Cdn
  -  vendor ** libraries **
      - bootstrap-5.3.3
        - css
          - bootstrap css collections
        - js
          - bootstrap js collections
     - jquery-3.7.1
        - jquery.3.7.1.min.js
  - images
    - profiles
    - ebooks
    - videos
  - css - system custom css
  - js - system custom js
    - data
      - data collections
- Admin
- Advertisements
- Manage
- Organization
  
> HTML files should be in the folders designated for them


# HTML Designing Plan
Start per Applications
Use Google Chart for our Charts

# Administrator
- Dashboard
  - Charts
    - Transactions per month
    - User Registration per month
- Organization
  - Create, Update, Delete
  - List, view
- Accounts with profile
  - Create, Update, Delete
  - List, view
- Ebook Groups
  - Create, Update, Delete
  - List, view
- Video Groups
  - Create, Update, Delete
  - List, view
- Ebooks
  - Create, Update, Delete
  - List, view
  - Chapters
    - Create, Update, Delete
    - List, view
- Videos
  -  Create, Update, Delete
  -  List, view

# Organization
- Dashboard
  - Charts
    - Registered user per month
- My Account
  - View, Update
  - Change Password
- Users Management
  - List of registered users
    - Create, Update, Delete
    - View
      - List of uploaded requirements or files
      - View, download and print file
- My Collections
  - Videos
    - List of video groups
      - list of videos in a group
      - view video
  - Ebooks
    - List of ebook groups
      - list of ebooks in a group
      - view ebook
- Transactions
  - list
  - detaild view
- Market Place
  - Videos
    - List of unpurchased video collections
    - view video group/collections
    - add to cart
  - Ebooks
    - List of unpurchased ebooks collections
    - view ebook group/collections
    - add to cart
  - Checkout
    - Cart Items, Total amount, payment gateway selections

# User Accounts
- Dashboard
  - ??
- My Account
  - View, Update
  - Change Email
    - Resend Email Verification
    - Email Verification Template
  - Change Password
- Video Collections
  - List of video groups
    - Watch video
      - Add Comments
      - Add Ratings
    - Examination
- Ebook Collections
  - List of ebook groups
    - Read Ebook
      - Add Comments
      - Add Ratings
    - Examination
- Complete Account Profile
- Professions
  - Affiliate
    - ??
  - Sales Person
    - list of video collections for sales persons training
    - Examination
    - Requiremetns Upload

# Advertisements
- Ads
  - Templates - video with buttons 

# Others
- Registration Form Page
  - Congratulations for registering page
  - Resend email verification page
  - Email Verification Template - letter to be sent
- Email Verification Page - link from email will redirect here

