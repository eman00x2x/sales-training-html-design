$(document).ready(function () {
    function updatePasswordValidation() {
        let newPasswordValue = document.getElementById('new-password').value;
        let confirmPasswordValue = document.getElementById('confirm-password').value;
        console.log("New Password:", newPasswordValue); // pan-check ng value
        console.log("Confirm Password:", confirmPasswordValue);
        let iconElements = document.querySelectorAll('.password-requirement .bi');

        if (newPasswordValue.length > 7) {
            iconElements[0].className = 'bi bi-check-circle-fill fs-2 text-success eight-char';

            if (/[a-z]/.test(newPasswordValue) && /[A-Z]/.test(newPasswordValue)) {
                iconElements[1].className = 'bi bi-check-circle-fill fs-2 text-success upper-lower';
            } else {
                iconElements[1].className = 'bi bi-x-circle-fill fs-2 text-danger upper-lower';
            }

            if (/\d/.test(newPasswordValue)) {
                iconElements[2].className = 'bi bi-check-circle-fill fs-2 text-success one-num';
            } else {
                iconElements[2].className = 'bi bi-x-circle-fill fs-2 text-danger one-num';
            }

            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPasswordValue)) {
                iconElements[3].className = 'bi bi-check-circle-fill fs-2 text-success special-char';
            } else {
                iconElements[3].className = 'bi bi-x-circle-fill fs-2 text-danger special-char';
            }

            if (newPasswordValue === confirmPasswordValue) {
                iconElements[4].className = 'bi bi-check-circle-fill fs-2 text-success match-password';
            } else {
                iconElements[4].className = 'bi bi-x-circle-fill fs-2 text-danger match-password';
            }
        } else {
            iconElements[0].className = 'bi bi-x-circle-fill fs-2 text-danger eight-char';
            iconElements[1].className = 'bi bi-x-circle-fill fs-2 text-danger upper-lower';
            iconElements[2].className = 'bi bi-x-circle-fill fs-2 text-danger one-num';
            iconElements[3].className = 'bi bi-x-circle-fill fs-2 text-danger special-char';
            iconElements[4].className = 'bi bi-x-circle-fill fs-2 text-danger match-password';
        }
    }

    document.getElementById('new-password').addEventListener('input', updatePasswordValidation);
    document.getElementById('confirm-password').addEventListener('input', updatePasswordValidation);

    updatePasswordValidation();
});
