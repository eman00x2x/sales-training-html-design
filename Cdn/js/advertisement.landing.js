$(document).ready(function () {
    let username = getParams('username');

    if (username === undefined || username === null) {
        $('.btn-grp-login').html(`<div class="nav-item">
                        <a href="../Website/website.login.html" class="btn btn-outline-primary">
                            Log In
                        </a>
                    </div>
                    <div class="nav-item">
                        <a href="../Website/website.registration.html" class="btn btn-primary">
                            Sign Up
                        </a>
                    </div>`);
        $('.a-buy').attr('href', '../Website/website.login.html');
        $('.a-sell').attr('href', '../Website/website.login.html');
        $('.a-invest').attr('href', '../Website/website.login.html');
        $('.a-join').attr('href', '../Website/website.login.html');
    }
    else {
        $('.btn-grp-login').html(`<span class="nav-link d-flex lh-1 text-reset p-0 cursor-pointer" data-bs-toggle="dropdown"
            aria-expanded="false">
            <span class="avatar avatar-sm"
              style="background-image: url(https://image.philproperties.ph/blank-profile.png)"></span>
            <div class="d-none d-xl-block ps-2">
              <small class="text-muted d-block mb-1">Logged as</small> <span class="text-default text-capitalize">${username}</span>
            </div>
          </span>
          <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <a class="ajax dropdown-item" href="admin.profile.view.html?id=1">
              <i class="dropdown-icon ti ti-user me-2"></i> Profile
            </a>
            <div class="dropdown-divider m-0 p-0"></div>
            <a class="dropdown-item doLogOut" href="?option=doLogOut">
              <i class="dropdown-icon ti ti-logout-2 me-2"></i> Sign out
            </a>
          </div>`);
        $('.a-buy').attr('href', '../Manage/manage.appointment.buy.html');
        $('.a-sell').attr('href', '../Manage/manage.appointment.sell.html');
        $('.a-invest').attr('href', '../Manage/manage.appointment.invest.html');
        $('.a-join').attr('href', '../Manage/manage.dashboard.html');
    }
})