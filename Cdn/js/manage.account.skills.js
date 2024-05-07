$(document).ready(function () {
    $('#editButton2').on('click', function () {
        console.log("Edit button clicked");
        $('.btn-add').removeClass('d-none');
        $('#saveButton2').show();
    });
});
