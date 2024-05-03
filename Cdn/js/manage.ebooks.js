$(document).ready(function () {
    displayEbooks(1, '', 'title', '');

});

function displayEbooks(pageNumber, sortDirection, sortBy, searchText) {

    const ebooksPerPage = 8;
    const startIndex = (pageNumber - 1) * ebooksPerPage;
    const endIndex = startIndex + ebooksPerPage;

    const ebookId = getParams('id');
    $.getJSON('../Cdn/js/data/ebooks.json', function (ebookData) {

        let ebooksResponse = ebookData.data;
        let ebooks = ebooksResponse.filter(ebook => ebook.ebook_group_id == ebookId);
        let filteredEbooks = [];

        filteredEbooks = ebooks.filter(ebook => {
            return ebook.title.toLowerCase().includes(searchText.toLowerCase()) ||
                ebook.isbn.toLowerCase().includes(searchText.toLowerCase()) ||
                ebook.author.toLowerCase().includes(searchText.toLowerCase());
        });

        sortDirection === 'asc' ?
            filteredEbooks.sort((a, b) => a[sortBy].localeCompare(b[sortBy])) :
            filteredEbooks.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));

        const totalItems = filteredEbooks.length;
        const totalPages = Math.ceil(totalItems / ebooksPerPage);
        const currentPage = pageNumber;

        updatePagination(currentPage, totalPages);
        const ebooksResponse1 = filteredEbooks.slice(startIndex, endIndex);

        // Display ebooks
        let ebookListHtml = '';
        ebooksResponse1.forEach(ebook => {
            ebookListHtml += `
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
                    <div class="card" data-ebook-id="${ebook.id}"> <!-- Add data-ebook-id attribute to store ebook ID -->
                        <!-- Photo -->
                        <div class="img-container" style="height: 200px;">
                            <img src="${ebook.thumbnail_image}" class="card-img" alt="Image"
                                style="object-fit: contain; width: 100%; height: 100%;">
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${ebook.title}</h3>
                            <p class="text-secondary">${ebook.author} </p>
                        </div>
                    </div>
                </div>

          `;
        });
        $('.ebook-list').html(ebookListHtml);
        $('.card').click(function() {
            const ebookId = $(this).data('ebook-id'); // Get the ebook ID from data attribute
            // $.getJSON('url-to-fetch-ebook-details?id=' + ebookId, function(data) {
            //     // Update modal content with ebook details
            //     $('#exampleModalLabel').text(data.title);
            //     $('.modal-body').html(`<p><strong>Title:</strong> ${data.title}</p><p><strong>Author:</strong> ${data.author}</p>`);
            // });
            $('#exampleModal').modal('show');
        });
    });
}


// sorting
let currentSortDirection = 'asc';
let sortBy = 'title';

function displayChosen(chosenText, selectedSortBy) {
    document.getElementById('dropdownMenuButton').innerText = chosenText;
    sortBy = selectedSortBy;
    searchEbook();
}

function searchEbook() {
    let searchText = document.getElementById('searchInput').value;
    displayEbooks(1, currentSortDirection, sortBy, searchText);
}

function toggleSorting() {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    const sortIcon = $('#sortIcon');
    sortIcon.removeClass('bi-caret-up-fill bi-caret-down-fill').addClass(currentSortDirection === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill');
    searchEbook();
}


// pagination
function updatePagination(currentPage, totalPages) {
    const pageNumbers = document.getElementById('page-numbers');
    const paginationContainer = $('.btn-group');

    let paginationButtons = `<button type="button" class="btn btn-outline-primary ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">Previous</button>`;

    if (totalPages > 0) {
        paginationButtons += `<button type="button" class="btn btn-outline-primary ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">Previous</button>`;

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationButtons += `<button type="button" class="btn btn-outline-primary ${activeClass}" onclick="changePage(${i})">${i}</button>`;
        }

        paginationButtons += `<button type="button" class="btn btn-outline-primary ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">Next</button>`;
        pageNumbers.innerHTML = `Showing ${currentPage} out of ${totalPages} pages`;

    } else {
        pageNumbers.innerHTML = `Showing 0 out of 0 pages`;
    }
    paginationContainer.html(paginationButtons);
}

function changePage(pageNumber) {
    displayEbooks(pageNumber, currentSortDirection, sortBy, document.getElementById('searchInput').value);
}
