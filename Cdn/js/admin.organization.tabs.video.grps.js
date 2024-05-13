$(document).ready(function () {
    id = getParams('id');

    getOrgVideoGroupData()
});

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