document.addEventListener("DOMContentLoaded", function () {
    tinymce.init({
        selector: '#email-editor',
        plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        toolbar_mode: 'floating',
        elementpath: false
    });

    // Function to load templates into the TinyMCE editor
    function loadTemplate(templateUrl) {
        fetch(templateUrl)
            .then(response => response.text())
            .then(data => {
                tinymce.get('email-editor').setContent(data);
            })
            .catch(error => console.error('Error loading template:', error));
    }

    // Event listeners for template selection
    document.getElementById('template1').addEventListener('click', () => loadTemplate('email.announcement.template.html'));
    document.getElementById('template2').addEventListener('click', () => loadTemplate('email.marketing.template.html'));
});