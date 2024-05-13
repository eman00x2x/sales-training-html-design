$(document).ready(function () {
    id = getParams('id');
    
    getOrgUserData()
});


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