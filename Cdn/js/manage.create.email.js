$(document).ready(function() {
    tinymce.init({
        selector: '#email-editor',
        plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        toolbar_mode: 'floating',
        elementpath: false
    });

    function loadTemplate(templateUrl) {
        $.get(templateUrl, function(data) {
            tinymce.get('email-editor').setContent(data);
        }).fail(function(error) {
            console.error('Error loading template:', error);
        });
    }

    $('#template1').on('click', function() {
        loadTemplate('email.announcement.template.html');
    });

    $('#template2').on('click', function() {
        loadTemplate('email.marketing.template.html');
    });

    $('#recipients').tagsinput({
        confirmKeys: [13, 44] // Enter and comma
    });

    $('#saveEmailButton').on('click', function() {
        const recipients = $('#recipients').tagsinput('items');
        const emailContent = tinymce.get('email-editor').getContent();
        console.log('Recipients:', recipients);
        console.log('Email Content:', emailContent);
    });
});
