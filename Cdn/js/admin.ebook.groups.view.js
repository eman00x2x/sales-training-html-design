let id;

$(document).ready(function () {
    let params = new URL(document.location.toString()).searchParams;
    id = params.get("id");

    $.getJSON('../Cdn/js/data/ebook.groups.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].organization_id == id);

        $('.ebookName').text(response[f].name);
        $('.ebookDesc').text(response[f].description);
    });

    getEBookGroupData()
});

$(document).on("click", "#back", function (e) {
    window.location.href = "admin.organization.list.html"
});



function getEBookGroupData() {
    let html = "";

    $.when(
        $.getJSON("../Cdn/js/data/organization.ebooks.json"),
        $.getJSON("../Cdn/js/data/ebook.groups.json")
    ).done(function (data1, data2) {
        // https://stackoverflow.com/questions/47749932/merge-multiple-json-with-the-same-id
        const ebookGrpData = data1[0].data;
        const ebookOrg = data2[0].data;

        let expected = ebookGrpData.map(a => Object.assign(a, ebookOrg.find(b => b.ebook_group_id == a.ebook_group_id)));
        let filterByID = expected.filter(item => item.ebook_group_id == id)

        console.log(filterByID);

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
            html += `<td class='align-middle'>
                        <button type="button" data-id='${data.organization_id}' class="btn btn-md btn-view btn-outline-primary montserrat-semibold"><i class="bi bi-eye"></i><span class="ms-2">View</span></button>
                    </td>`;
            html += "</tr>";
        }
        $(".ebook-group .data-container").html(html);
    });

    /**
     * Validator Documentation https://validatejs.org/#validators-length
     **/

    function validateInput(input) {
        let message = [];

        const data = input.reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        const validator = validate(
            {
                logo: data.logo,
                name: data.name,
                description: data.description,
            },
            {
                logo: {
                    type: "image/png,image/jpeg",
                },
                name: {
                    type: "string",
                    length: { minimum: 4 },
                },
                description: {
                    type: "string",
                    length: { minimum: 10, maximum: 300 },
                },
            }
        );

        if (validator !== undefined) {
            for (key in validator) {
                message.push(validator[key]);
            }
            return message.join(", ");
        }

        return false;
    }
}