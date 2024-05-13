let sortBy = 'title';
let sortDirection = 'asc';
const selectedCategories = [];

$(document).ready(function () {
    displayEbooks(1, '', 'asc', 'title', selectedCategories);

    $('.chk-category').change(function () {
        selectedCategories.length = 0;
        $('.chk-category:checked').each(function () {
            selectedCategories.push($(this).val());
        });
        console.log('Checkbox change - selectedCategories:', selectedCategories);
        search();
    });
});

function search() {
    console.log('Search - selectedCategories:', selectedCategories);
    let searchText = $('#search').val();
    displayEbooks(1, searchText, sortDirection, sortBy, selectedCategories);
}
function updateSortDirection(direction) {
    sortDirection = direction;
    console.log(sortDirection);
    highlightSortDirection();
    search();
}
function updateSortBy(by) {
    sortBy = by;
    search();
    highlightSortBy();
}
function changePage(pageNumber) {
    const searchQuery = $('#search').val();
    displayEbooks(pageNumber, searchQuery, sortDirection, sortBy, selectedCategories);
}

function highlightSortDirection() {
    $('.btn-sort-direction').removeClass('active');
    if (sortDirection === 'asc') {
        $('#btnSortAsc').addClass('active');
    } else {
        $('#btnSortDesc').addClass('active');
    }
}
function highlightSortBy() {
    $('.dropdown-item.sort-by').removeClass('active');
    if (sortBy === 'name') {
        $('#sortByTitle').addClass('active');
    } else {
        $('#sortByDate').addClass('active');
    }
}


function displayEbooks(pageNumber, searchQuery, sortDirection, sortBy, selectedCategories) {
    console.log('Sort By:', sortBy);
    console.log('Sort Direction:', sortDirection);
    console.log('Sort queyr', searchQuery);
    const ebooksPerPage = 8;
    const startIndex = (pageNumber - 1) * ebooksPerPage;
    const endIndex = startIndex + ebooksPerPage;

    const ebookId = getParams('id');
    $.getJSON('../Cdn/js/data/ebooks.json', function (ebookData) {
        ebooksResponse = ebookData.data;
        let ebooks = ebooksResponse.filter(ebook => ebook.ebook_group_id == ebookId);

        if (selectedCategories.length > 0) {
            ebooks = ebooks.filter(ebook => selectedCategories.includes(ebook.category));
        }
        console.log(selectedCategories);
        const filteredData = searchQuery ? ebooks.filter(ebook => {
            return ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
        }) : ebooks;
        console.log('Sorttt', sortBy);
        sortedData = sortDirection === 'asc' ?
            filteredData.sort((a, b) => a.title.localeCompare(b.title)) :
            filteredData.sort((a, b) => b.title.localeCompare(a.title));

        if (sortBy == 'title') {
            // Sort by name
            sortedData = sortDirection === 'asc' ?
                filteredData.sort((a, b) => a.title.localeCompare(b.title)) :
                filteredData.sort((b, a) => a.title.localeCompare(b.title));
        } else if (sortBy === 'created_at') {
            // Sort by creation date
            sortedData = filteredData.sort((b, a) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return sortDirection === 'asc' ? dateB - dateA : dateA - dateB;
            });
        }

        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / ebooksPerPage);
        const currentPage = pageNumber;

        updatePagination(currentPage, totalPages);
        const ebooksResponse1 = filteredData.slice(startIndex, endIndex);

        // Display ebooks
        let ebookListHtml = '';
        ebooksResponse1.forEach(ebook => {
            ebookListHtml += `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-2">
                <div class="card" data-ebook-id="${ebook.ebook_id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style="height:25rem;">
                        <!-- Photo -->
                        <div class="img-container pt-2" style="height: 200px;">
                            <img src="${ebook.thumbnail_image}" class="card-img" alt="Image"
                                style="object-fit: contain; width: 100%; height: 100%;">
                        </div>
                        <div class="card-body">
                            <h3 class="card-title text-uppercase montserrat-semibold">${ebook.title}</h3>
                            <p class="text-secondary">${ebook.author} </p>
                            <p class=" lh-1 card-text text-secondary">${ebook.sub_title} </p>
                            <p class="lh-1 card-text text-secondary text-end"> <small>${convertDate(ebook.created_at)}</small>  </p>
                        </div>
                    </div>
                </div>

          `;
        });
        $('.ebook-list').html(ebookListHtml);

        $('.card').click(function () {
            const ebookId = $(this).data('ebook-id');
            $.getJSON('../Cdn/js/data/ebooks.json', function (data) {
                let response = data.data;
                f = response.keys(response).find(key => response[key].ebook_id === ebookId);
                $(".offcanvas-title").text(response[f].title)
                $(".thumb").attr("src", response[f].thumbnail_image)
                $(".text-body").text(response[f].description)
                $(".read-ebook").attr("href", `manage.read.ebook.html?ebook_id=${ebookId}&ebook_group_id=${response[f].ebook_group_id}`);
                console.log('hatdpg');
            });
        });
    });
}

// pagination
function updatePagination(currentPage, totalPages) {
    const pageNumbers = $('#page-numbers'); 
    const paginationContainer = $('.btn-group');

    let paginationButtons = '';

    if (totalPages > 0) {
        paginationButtons += `
        <button type="button" class="btn btn-outline-primary montserrat-semibold ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">
            <span class="d-none d-md-block">Previous</span>
            <i class="bi bi-chevron-double-left d-block d-md-none"></i>
        </button>`;

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationButtons += `<button type="button" class="btn btn-outline-primary ${activeClass}" onclick="changePage(${i})">${i}</button>`;
        }

        paginationButtons += `<button type="button" class="btn btn-outline-primary montserrat-semibold ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">
         <span class="d-none d-md-block">Next</span>
        <i class="bi bi-chevron-double-right d-block d-md-none"></i>
    </button>`;
    } else {
        paginationButtons = '';
    }

    pageNumbers.html(totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages');
    paginationContainer.html(paginationButtons);
}

