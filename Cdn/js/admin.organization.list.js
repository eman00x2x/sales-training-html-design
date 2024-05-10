let pageNumber = 1, search = '', order = '', sortBy = '';

$(document).ready(function () {
    $.when(
        $.getJSON("../Cdn/js/data/profiles.json"),
        $.getJSON("../Cdn/js/data/accounts.json"),
        $.getJSON("../Cdn/js/data/transactions.json")
    ).done(function (data1, data2, data3) {
        // MERGE PROFILE AND ACCOUNTS
        let response = data1[0].data.map((a) =>
            Object.assign(
                a,
                data2[0].data.find((b) => b.account_id == a.account_id)
            )
        );

        let f = response.keys(response).find((key) => response[key].account_id == 1);
        let transactions = data3[0].data.filter((item) => item.transaction_id == 1)[0]
        let obj = { ...response[f], transaction: transactions };
        console.log(obj)
    })
    getOrganizationsData(pageNumber, search, sortBy, order);
});

$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();

    $(".organizations .data-container tr").filter(function () {
        $(this).toggle($(this).find('td:eq(2)').text().toLowerCase().indexOf(search) > -1);
    });
});

$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'

    sortTable($('.organizations .data-container tr'), order, 'td:eq(2)')
});

$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');

    sortTable($('.organizations .data-container tr'), 'desc', 'td:eq(2)')
});

$(document).on("click", '.dropdown-org', function () {
    let sort = $('.btn-sort-asc').hasClass("active") ? "asc" : "desc";
    $('.dropdown-org').addClass('active');
    $('.dropdown-created-date').removeClass('active');

    sortTable($('.organizations .data-container tr'), sort, 'td:eq(2)')
});

$(document).on("click", '.dropdown-created-date', function () {
    let sort = $('.btn-sort-asc').hasClass("active") ? "asc" : "desc";
    $('.dropdown-org').removeClass('active');
    $('.dropdown-created-date').addClass('active');
    sortTable($('.organizations .data-container tr'), sort, 'td:eq(4)')
});

function sortTable(classQuery, order, col) {
    classQuery.sort(function (a, b) {
        if (order === 'asc') {
            return $(col, a).text().toLowerCase().localeCompare($(col, b).text().toLowerCase());
        } else {
            return $(col, b).text().toLowerCase().localeCompare($(col, a).text().toLowerCase());
        }
    }).appendTo($('.organizations .data-container'));
}

$(document).on('click', '.btn-add', function (e) {
    window.location.href = "admin.organization.create.html";
});

$(document).on('click', '.btn-view', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.view.html?id=" + id;
});

$(document).on('click', '.btn-edit', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.update.html?id=" + id;
});

$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.organization.delete.html?id=" + id;
});

function lowerCase(str) {
    return str.toLowerCase();
}

function isSearchQuery(query, data) {
    const filter = query ? data.filter(item =>
        lowerCase(item.name).includes(lowerCase(searchQuery)) ||
        item.organization_id == query
    ) : data;

    return filter;
}

function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "organization_id")
                return data.sort((a, b) => a[property] - b[property])
            else if (property === "created_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else
                return data.sort((a, b) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
        case "desc":
            if (property === "organization_id")
                return data.sort((b, a) => a[property] - b[property])
            else if (property === "created_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else
                return data.sort((b, a) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
        default:
            return data;
    }
}

function getOrganizationsData(currentPage, searchQuery, sortBy, order) {
    const limit = 10;
    const startIndex = (pageNumber - 1) * limit;
    const endIndex = startIndex + limit;

    let html = "";

    $.getJSON("../Cdn/js/data/organization.json", function (response) {
        const org = response.data;
        const sortedData = sortData(isSearchQuery(searchQuery, org), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        const dataPages = sortedData.slice(startIndex, endIndex);

        for (let i = 0; i < dataPages.length; i++) {
            let data = dataPages[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                data.organization_id +
                "</td>";
            html +=
                "<td class='align-middle text-center' style='max-width: 50px'><img src='" +
                data.logo +
                "' style='width:10em;' /></td>";
            html += "<td class='align-middle'>" + data.name + "</td>";
            html +=
                "<td class='align-middle truncate-text' style='max-width: 500px'><p>" +
                data.description +
                "</p></td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.created_at) +
                "</td>";
            html += displayActionButtons(data.organization_id);
            html += "</tr>";
        }

        $(".organizations .data-container").html(html);
    });
}