$(document).on("DOMContentLoaded", function () {
    let modal = getParams('modal')

    if(modal === undefined | modal === null){
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.show();
    }
});

// ASCENDING BUTTON
$(document).on("click", '.complete', function () {
    window.location.href ="manage.complete.profile.html?id=1";
});
