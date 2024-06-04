$(document).ready(function () {
    $('.btn-login').on('click', function () {
        const username = $('#username').val();
        const password = $('#password').val();

        setUser(username, password);

        switch(username){
            case 'admin':
                window.location.href = '../../Admin/admin.dashboard.html'
                break;
            case 'organization':
                window.location.href = '../../Organization/organization.dashboard.html'
                break;
            case 'user':
                window.location.href = `../../Advertisements/landing.html?username=${username}`
                break;
        }
    })
});