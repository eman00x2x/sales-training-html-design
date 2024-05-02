# Javascript specific page
  - All javascript for a specific page should be in /Cdn/js folder
  - javascript specific page filename format should be in dot notation.
    - organization.create.js
    - organization.list.js
  - example of javascript specific page
    ```
    function validateInput(input) {
      ....
    }
    ```
  - Global function should be in script.js

# Design Major Revision
  - Your design does not meet the standards
  - We will use the Tabler Template
  - Preview: https://preview.tabler.io/layout-vertical-transparent.html
  - The selected layout is the Vertical Transparent Layout
  - Installation 
    - insert the following css and js in html header
      - CSS
      ```
        <link href="../Cdn/vendor/tabler/dist/css/tabler.min.css" rel="stylesheet" />
        <link href="../Cdn/vendor/tabler/dist/css/tabler-vendors.min.css?1695847769" rel="stylesheet" />
      ```
      - JS
      ```
        <script src="../Cdn/vendor/tabler/dist/js/tabler.min.js"></script>
      ```
  - Documentation
    - https://tabler.io/docs/getting-started
    - or view-source then copy the code from the preview https://preview.tabler.io/layout-vertical-transparent.html

## How to view working html files
  - Setup a server and navigate to http://localhost/sales-training-html-design/Admin/organization.list.html

### Sample html files
  - Data retrieval from .json file
  - Dynamic Modal
  - Retrieval of unique id from .json file
    - http://localhost/sales-training-html-design/examples/retrieved-data-from-json.html

  - Form submission
    - http://localhost/sales-training-html-design/examples/form-submit.html

### Standard element classes naming convention
#### ` buttons `
- btn-save
- btn-cancel
- btn-delete
- btn-filter
- btn-sort
- btn-dismiss
- btn-reload
- btn-upload

#### ` containers `
- form-container
- response
- {action}-container

### Folder Structure
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

# HTML Designing Tasks
> Every day at 10 AM, 2 PM, and 5 PM, please make a commit.
- Please do not commit unfinished tasks.
- Complete at least two tasks every day.
- Message in group chat the files completed daily at 5 PM.
- I will mark tasks that are accepted with an 'X'.
- Tasks not accepted will have an issue created for them.
- Revisions should be made after the issue has been created.

## Administrator
- Dashboard
  - Charts
    - Use Google Chart
    - [ ] Transactions per month
    - [ ] User Registration per month
- Organization **assigned to rogu**
  - [ ] Create
  - [ ] Update
  - [ ] Delete
  - [ ] List [#1](https://github.com/eman00x2x/sales-training-html-design/issues/1)
  - [ ] view
- Accounts with profile **assigned to rogu**
  - [ ] Create
  - [ ] Update
  - [ ] Delete
  - [ ] List
  - [ ] view
- Ebook Groups **assigned to Rimel**
  - [ ] Create
  - [ ] Update
  - [ ] Delete
  - [ ] List
  - [ ] view
- Video Groups **assigned to Rimel**
  - [ ] Create
  - [ ] Update
  - [ ] Delete
  - [ ] List
  - [ ] view
- Ebooks **assigned to Vien**
  - [ ] Create
  - [ ] Update
  - [ ] Delete
  - [ ] List
  - [ ] view
  - Chapters **assigned to Vien**
    - [ ] Create
    - [ ] Update
    - [ ] Delete
    - [ ] List
    - [ ] view
- Videos **assigned to Andrei**
  - [ ] Create
  - [ ] Update
  - [ ] Delete
  - [ ] List
  - [ ] view
- Premiums **assigned to Rimel**
  - [ ] Create
  - [ ] Update
  - [ ] Delete
  - [ ] List
  - [ ] view

## Organization
- Dashboard
  - Charts
    - Use Google Chart
    - [ ] Registered user per month
- My Account **assigned to camille**
  - [ ] View
  - [ ] Update
  - [ ] Change Password
- Users Management **assigned to jamiel**
  - [ ] List of registered users
  - [ ] Create
  - [ ] Update
  - [ ] Delete
  - [ ] View
    - [ ] List of uploaded requirements or files
    - [ ] View
    - [ ] Download

## User Accounts
- Dashboard
  - ??
- My Account **assigned to Vien**
  - [ ] View
  - [ ] Update
  - [ ] Change Email
    - [ ] Resend Email Verification
    - [ ] Email Verification Template
  - [ ] Change Password
- Video Collections **assigned to jamiel**
  - [ ] List of video groups
    - [ ] Watch video
      - [ ] Add Comments
      - [ ] Add Ratings
    - [ ] Examination
- Ebook Collections **assigned to kc**
  - [ ] List of ebook groups
    - [ ] Read Ebook
      - [ ] Add Comments
      - [ ] Add Ratings
    - [ ] Examination
- [ ] Complete Account Profile
- Professions **assigned to Andrei**
  - [ ] Affiliate
    - ??
  - [ ] Sales Person
    - [ ] list of video collections for sales persons training
    - [ ] Examination
    - [ ] Requiremetns Upload
- My Collections **assigned to Camille**
  - Videos
    - [ ] List of video groups
      - [ ] list of videos in a group
      - [ ] View video
  - Ebooks
    - [ ] List of ebook groups
      - [ ] list of ebooks in a group
      - [ ] View ebook
- Transactions **assigned to Vien**
  - [ ] list
  - [ ] Detaild view
  - [ ] Invoice
- Market Place **assigned to kc**
  - [ ] List of Premiums
  - [ ] Preview Ebooks and Video Collections (Groups)
  - [ ] add to cart
  - Checkout
    - [ ] Cart Items, Total amount
      - [ ] Payment gateway selections
- Email
  - [ ] Create
  - [ ] Selection of Email Templates

## Website
**assigned to jamiel**
- [ ] Registration Form Page
  - [ ] Congratulations for registering page
  - [ ] Resend email verification page
  - [ ] Email Verification Template - letter to be sent
- [ ] Email Verification Page - link from email will redirect here

## EMAIL
- [ ] Email Templates atleast 10
  - Distributions
    - kc 2 templates
    - jamiel 2 templates
    - Vien 2 templates
    - Rimel 4 templates

## ADVERTISEMENTS
- [ ] Ads Templates atleast 10
  - Distributions
    - Camille 2 templates
    - Andrei 2 templates
    - rogu 6 templates

