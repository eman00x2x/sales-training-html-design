$(document).ready(function () {
    getEbooksData();
});

$(document).on("keyup", '.search', function () {
    var value = $(this).val().toLowerCase();
    $(".ebooks .data-container tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$(document).on("click", ".btn-add", function () {
    window.location.href = "admin.ebooks.create.html";
});

$(document).on("click", ".btn-view", function () {
    let id = $(this).data('id');
    let title = $(this).data('ebook-title');
    window.location.href = "admin.ebook.chapters.list.html?id=" + id + "&title=" + title;
});

$(document).on("click", ".btn-edit", function () {
    let id = $(this).data('id');
    window.location.href = "admin.ebooks.update.html?id=" + id;
});

$(document).on('click', '.btn-delete', function (e) {
    id = $(this).data('id');
    window.location.href = "admin.ebooks.delete.html?id=" + id;
});

function displayActionButton(id, title) {
    return `<td class='align-middle text-start'>
    <div class="btn-group" role="group" aria-label="Basic outlined example ">
        <button type="button" data-id='${id}' data-ebook-title="${title}" class="btn btn-md btn-view btn-outline-primary"><i class="bi bi-eye"></i><span class="ms-2 montserrat-regular">View</span></button>
        <button type="button" data-id='${id}' class="btn btn-md btn-edit btn-outline-primary"><i class="bi bi-pencil-square"></i><span class="ms-2 montserrat-regular">Edit</span></button>
        <button type="button" data-id='${id}' class="btn btn-md btn-delete btn-outline-danger"><i class="bi bi-trash"></i><span class="ms-2 montserrat-regular">Delete</span></button>
    </div>
    </td>`;
}

function getEbooksData() {
    let html = '';

    $.getJSON('../Cdn/js/data/ebooks.json', function (response) {
        console.log(response)
        let data = response.data;
        for (let i = 0; i < data.length; i++) {
            let ebook = data[i];
            html += "<tr>";
            html += "<td class='align-middle text-center'>" + ebook.ebook_id + "</td>";
            html += "<td class='align-middle text-center'><img src='" + ebook.thumbnail_image + "' style='width:10em;' /></td>";
            html += "<td class='align-middle montserrat-regular'>" + ebook.title + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + ebook.sub_title + "</td>";
            html += "<td class='align-middle montserrat-regular text-uppercase'>" + ebook.author + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + ebook.isbn + "</td>";
            html += "<td class='align-middle montserrat-regular'>" + "<span class='badge badge-outline text-teal'>" + ebook.category + "</span>" + "</td>";
            html += displayActionButton(ebook.ebook_id, ebook.title);
            html += "</tr>";
        }
        $('.data-container').html(html);
    });
}