$(document).ready(function () {
    $.getJSON("../Cdn/js/data/accounts.json", function (response) {
        id = getParams('id');
        let account = response.data.find(account => account.account_id === parseInt(id));
        let accountEmail = account.email;

        // CHECK WHETHER THE EMAIL IS THE SAME AS INPUTTED EMAIL
        $(document).on("click", "#send-email-btn", function () {
            let inputEmail = $('.current-email').val().trim();
            console.log("Input Email:", inputEmail); 
            console.log("Account Email:", accountEmail); 
            if (inputEmail === accountEmail) {
                $('#tab-top-4').load('manage.account.tabs.code.html');
            } else {
                alert("Email does not match. Please enter the correct email.");
            }
        });
    });

    // AUTOMATICALLY GO TO THE NEXT INPUT AS YOU TYPE
    $(document).on("input", ".digit-box", function () {
        let boxes = document.querySelectorAll('.digit-box');
        let index = Array.from(boxes).indexOf(this);

        if (this.value.length === 1) {
            if (index < boxes.length - 1) {
                boxes[index + 1].focus();
            } else {
                $('#verify-code-btn').click();
            }
        }
    });

    // AUTOMATICALLY GO TO THE NEXT INPUT AS YOU DELETE / BACKSPACE
    $(document).on("keydown", ".digit-box", function (e) {
        let boxes = document.querySelectorAll('.digit-box');
        let index = Array.from(boxes).indexOf(this);

        if (e.key === 'Backspace' && this.value.length === 0) {
            if (index > 0) {
                boxes[index - 1].focus();
            }
        }
    });
});
