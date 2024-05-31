$(document).ready(function () {
    const getParams = (param) => {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    $.getJSON("../Cdn/js/data/accounts.json", function (response) {
        let id = getParams('id');
        let account = response.data.find(account => account.account_id === parseInt(id));
        let accountEmail = account.email;
        let verificationCode = "123456"; // sample verification code

        $(document).on("submit", "#email-form", function (event) {
            event.preventDefault();
            let inputEmail = $('.current-email').val().trim();
            console.log("Input Email:", inputEmail);
            console.log("Account Email:", accountEmail);
            if (inputEmail === accountEmail) {
                $('#tab-top-4').load('manage.account.tabs.code.html');
            } else {
                alert("Email does not match. Please enter the correct email.");
            }
        });

        // Automatically go to the next input as you type
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

        // Automatically go to the next input as you delete / backspace
        $(document).on("keydown", ".digit-box", function (e) {
            let boxes = document.querySelectorAll('.digit-box');
            let index = Array.from(boxes).indexOf(this);

            if (e.key === 'Backspace' && this.value.length === 0) {
                if (index > 0) {
                    boxes[index - 1].focus();
                }
            }
        });

        // Handle verification code input
        $(document).on("click", "#verify-code-btn", function () {
            let inputCode = "";
            $('.digit-box').each(function () {
                inputCode += $(this).val();
            });

            if (inputCode === verificationCode) {
                $('#tab-top-4').load('manage.account.tabs.new.email.html');
            } else {
                alert("Verification code does not match. Please enter the correct code.");
            }
        });

        // Handle new email update
        $(document).on("click", "#update-email-btn", function () {
            let newEmail = $('#new-email').val().trim();
            let reEnterEmail = $('#re-enter-email').val().trim();

            if (newEmail === reEnterEmail) {
                alert("Email updated successfully!");
            } else {
                alert("The emails do not match. Please re-enter them.");
            }
        });
    });
});
