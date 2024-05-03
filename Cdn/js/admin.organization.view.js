let id;

$(document).ready(function () {
    let params = new URL(document.location.toString()).searchParams;
    id = params.get("id");

    $.getJSON('../Cdn/js/data/organization.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].organization_id == id);

        $(".orgLogo").attr("src", response[f].logo);
        $('.orgName').text(response[f].name);
        $('.orgDesc').text(response[f].description);
    });

    getOrgEBookGroupData()
    getOrgVideoGroupData()
    getOrgUserData()
});

$(document).on("click", "#back", function (e) {
    window.location.href = "admin.organization.list.html"
});

$(document).on("change", "#logo", function (e) {
    var URL = window.URL || window.webkitURL;
    var file = e.target.files[0];

    if (file) {
        $(".orgLogo").attr("src", URL.createObjectURL(file));
    }
});

function getOrgEBookGroupData() {
    let html = "";

    $.when(
        $.getJSON("../Cdn/js/data/organization.ebooks.json"),
        $.getJSON("../Cdn/js/data/ebook.groups.json")
    ).done(function (data1, data2) {
        // https://stackoverflow.com/questions/47749932/merge-multiple-json-with-the-same-id
        let filterByID = returnFilteredData(data1[0].data, data2[0].data, "ebook_group_id", "organization_id");

        for (let i = 0; i < filterByID.length; i++) {
            let data = filterByID[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                (i + 1) +
                "</td>";
            html +=
                "<td class='align-middle text-center'>" +
                data.transaction_id +
                "</td>";
            html += "<td class='align-middle'>" + data.name + "</td>";
            html += "<td class='align-middle'>" + data.cost + "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.started_at) +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.end_at) +
                "</td>";
            html +=
                "<td class='align-middle'><span class='badge badge-outline text-yellow'>" +
                data.status +
                "</span></td>";
            // html += `<td class='align-middle'>
            //             <button type="button" data-id='${data.transaction_id}' data-bs-toggle='modal' data-bs-target='#dynamicModal' class="btn btn-md btn-view btn-outline-primary montserrat-semibold"><i class="bi bi-eye"></i><span class="ms-2">View</span></button>
            //         </td>`;
            html += "</tr>";
        }
        $(".ebook-group .data-container").html(html);
    });
}

function getOrgVideoGroupData() {
    let html = "";

    $.when(
        $.getJSON("../Cdn/js/data/organization.video.json"),
        $.getJSON("../Cdn/js/data/video.groups.json")
    ).done(function (data1, data2) {
        // https://stackoverflow.com/questions/47749932/merge-multiple-json-with-the-same-id
        let filterByID = returnFilteredData(data1[0].data, data2[0].data, "vid_group_id", "organization_id");

        for (let i = 0; i < filterByID.length; i++) {
            let data = filterByID[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                (i + 1) +
                "</td>";
            html +=
                "<td class='align-middle text-center'>" +
                data.transaction_id +
                "</td>";
            html += "<td class='align-middle'>" + data.name + "</td>";
            html += "<td class='align-middle'>" + data.cost + "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.started_at) +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.end_at) +
                "</td>";
            html +=
                "<td class='align-middle'><span class='badge badge-outline text-yellow'>" +
                data.status +
                "</span></td>";
            // html += `<td class='align-middle'>
            //             <button type="button" data-id='${data.transaction_id}' data-bs-toggle='modal' data-bs-target='#dynamicModal' class="btn btn-md btn-view btn-outline-primary montserrat-semibold"><i class="bi bi-eye"></i><span class="ms-2">View</span></button>
            //         </td>`;
            html += "</tr>";
        }
        $(".video-group .data-container").html(html);
    });
}

function getOrgUserData() {
    let html = "";

    $.when(
        $.getJSON("../Cdn/js/data/accounts.json"),
        $.getJSON("../Cdn/js/data/profiles.json")
    ).done(function (data1, data2) {
        // https://stackoverflow.com/questions/47749932/merge-multiple-json-with-the-same-id
        let filterByID = returnFilteredData(data1[0].data, data2[0].data, "account_id", "organization_id");

        for (let i = 0; i < filterByID.length; i++) {
            let data = filterByID[i];

            html += "<tr>";
            html +=
                "<td class='align-middle text-center'>" +
                (i + 1) +
                "</td>";
            html +=
                "<td class='align-middle text-center'>" +
                data.account_id +
                "</td>";
            html += "<td class='align-middle'>" + `${data.name.prefix} ${data.name.firstname} ${data.name.lastname} ${data.name.suffix}` + "</td>";
            html += "<td class='align-middle'>" + data.email + "</td>";
            html +=
                "<td class='align-middle'>" +
                data.username +
                "</td>";
            html +=
                "<td class='align-middle'>" +
                convertDate(data.registered_at) +
                "</td>";
            html +=
                "<td class='align-middle text-capitalize'>" + data.account_type + "</td>";
            // html += `<td class='align-middle'>
            //             <button type="button" data-id='${data.transaction_id}' data-bs-toggle='modal' data-bs-target='#dynamicModal' class="btn btn-md btn-view btn-outline-primary montserrat-semibold"><i class="bi bi-eye"></i><span class="ms-2">View</span></button>
            //         </td>`;
            html += "</tr>";
        }
        $(".users .data-container").html(html);
    });
}