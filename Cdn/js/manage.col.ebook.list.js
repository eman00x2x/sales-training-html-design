let currentPage = 1, search = '', order = '', sortBy = '',
    filterData = [{
        "Category": [
            { displayed: "Buying", value: "buying" },
            { displayed: "Earning", value: "earning" },
            { displayed: "Selling", value: "selling" },
            { displayed: "Real Estate", value: "real-estate" }
        ]
    }],
    filterBy = [];
$(document).ready(function () {
    displayEbooks(sortBy, order);
    printFilters()
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    displayEbooks(sortBy, order);
});
// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    displayEbooks(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    displayEbooks(sortBy, order);
});

// SORT BY TITLE
$(document).on("click", '.dropdown-title', function () {
    $('.dropdown-title').addClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'title'
    displayEbooks(sortBy, order);
});

// SORT BY DATE CREATED
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-title').removeClass('active');
    $('.dropdown-created-date').addClass('active');
    sortBy = 'registered_at'
    displayEbooks(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    displayEbooks(sortBy, order);
});

//FILTER
$(document).on('change', '.checklist-filter', function (e) {
    let checkboxes = $(".checklist-filter:checkbox");
    let checkedValues = [];

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            // Push the value associated with the checked checkbox
            checkedValues.push(checkboxes[i].value);
        }
    }

    filterBy = checkedValues;
    displayEbooks(sortBy, order);
});

// FUNCTION TO LOWERCASE ALL STRINGS
function lowerCase(str) {
    return str.toLowerCase();
}

// FUNCTION TO RETURN DATA THAT IS SEARCHED, DEFAULT WILL BE THE RESPONSE DATA FROM JSON
function isSearchQuery(data) {
    const filterBySearch = search ? data.filter(item =>
        lowerCase(`${item.title} ${item.author}`).includes(lowerCase(search))
    ) : data;
    console.log(filterBy);

    const filter = filterBy.length > 0 ? filterBySearch.filter(item => {
        return filterBy.some(selectedCategory =>
            item.category.toLowerCase() === selectedCategory.toLowerCase()
        );
    }) : filterBySearch;

    return filter;
}
// SORT BY ORDER AND ITS PROPERTY
function sortData(data, order, property) {
    switch (order) {
        case "asc":
            if (property === "created_at")
                return data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
            else if (property === "title")
                return data.sort((a, b) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((a, b) => a.title.localeCompare(b.title));
        case "desc":
            if (property === "created_at")
                return data.sort((a, b) => new Date(b[property]) - new Date(a[property]));
            else if (property === "title")
                return data.sort((b, a) => lowerCase(a[property]).localeCompare(lowerCase(b[property])));
            else
                return data.sort((b, a) => a.title.localeCompare(b.title));
        default:
            return data;
    }
}

// UPDATE THE PAGE NUMBERS IN PAGE BUTTONS
function updatePagination(totalPages) {
    let paginationButtons = '';

    if (totalPages > 0) {
        paginationButtons += `
        <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPage === 1 ? 'disabled' : ''}" data-num="${currentPage - 1}"">
            <span class="d-none d-md-block">Previous</span>
            <i class="bi bi-chevron-double-left d-block d-md-none"></i>
        </button>`;

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(startPage + 2, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationButtons += `<button type="button" class="btn-page btn btn-outline-primary ${activeClass}" data-num="${i}"">${i}</button>`;
        }

        paginationButtons += `
        <button type="button" class="btn-page btn btn-outline-primary montserrat-semibold ${currentPage === totalPages ? 'disabled' : ''}" data-num="${currentPage + 1}">
            <span class="d-none d-md-block">Next</span>
            <i class="bi bi-chevron-double-right d-block d-md-none"></i>
        </button>`;
    } else
        paginationButtons = '';

    $('#page-numbers').html(totalPages > 0 ? `Showing ${currentPage} out of ${totalPages} pages` : 'Showing 0 out of 0 pages');
    $('.page-buttons').html(paginationButtons);
}

function printFilters() {
    let html = '';

    for (const item of filterData) {
        const regex = /[-_]/g;
        const key = Object.keys(item)[0];
        const replacedKey = Object.keys(item)[0].replace(regex, " ");
        const value = item[key];

        html += `<div class="px-3">
                        <span class="form-check-label montserrat-medium py-2 text-uppercase">${replacedKey}</span>`;

        for (const data of value) {
            html += `<div class="form-check ">
                                        <input class="checklist-filter form-check-input" name="${key}" value="${data.value}" type="checkbox">
                                        <label class="checklist-filter form-check-label" name="${key}">
                                            ${data.displayed}
                                        </label>
                                    </div>`;
        }
        html += `</div>`;
    }

    $(".filter-list").html(html)
}

function displayEbooks(sortBy, order) {

    const limit = 9;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const ebookId = getParams('id');
    $.getJSON('../Cdn/js/data/ebooks.json', function (response) {
        const ebook = response.data;
        const ebooks = ebook.filter(ebook => ebook.ebook_group_id == ebookId);
        const sortedData = sortData(isSearchQuery(ebooks), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);
        let ebookListHtml = '';
        slicedData.forEach(ebook => {
            ebookListHtml += `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-2">
            <div class="card" data-ebook-id="${ebook.ebook_id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style="height:100%; cursor: pointer;">
                    <!-- Photo -->
                    <div class="img-container">
                        <img src="${ebook.thumbnail_image}" class="card-img" alt="Image"
                            style="object-fit: contain; height: 100%;">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title text-uppercase montserrat-semibold m-0">${ebook.title}</h3>
                        <p class="text-secondary mb-2">${ebook.author} </p>
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
                $(".read-ebook").attr("href", `manage.col.read.ebook.html?ebook_id=${ebookId}&ebook_group_id=${response[f].ebook_group_id}`);
                console.log('hatdpg');
            });
        });
    });
}