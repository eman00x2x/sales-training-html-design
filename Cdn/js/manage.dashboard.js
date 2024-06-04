// modal-script.js
document.addEventListener('DOMContentLoaded', function () {
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
});


// ASCENDING BUTTON
$(document).on("click", '.complete', function () {
    window.location.href ="manage.complete.profile.html?id=1";
});
