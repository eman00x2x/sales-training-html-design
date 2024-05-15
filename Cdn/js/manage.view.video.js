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
    displayVideos(sortBy, order);
    printFilters()
});

// SEARCH
$(document).on("keyup", '.search', function () {
    search = $(this).val().toLowerCase();
    currentPage = 1
    displayVideos(sortBy, order);
});
// ASCENDING BUTTON
$(document).on("click", '.btn-sort-asc', function () {
    $('.btn-sort-asc').addClass('active');
    $('.btn-sort-desc').removeClass('active');
    order = 'asc'
    displayVideos(sortBy, order);
});

// DESCENDING BUTTON
$(document).on("click", '.btn-sort-desc', function () {
    $('.btn-sort-desc').addClass('active');
    $('.btn-sort-asc').removeClass('active');
    order = 'desc'
    displayVideos(sortBy, order);
});

// SORT BY TITLE
$(document).on("click", '.dropdown-title', function () {
    $('.dropdown-title').addClass('active');
    $('.dropdown-id').removeClass('active')
    $('.dropdown-created-date').removeClass('active');
    sortBy = 'title'
    displayVideos(sortBy, order);
});

// SORT BY DATE CREATED
$(document).on("click", '.dropdown-created-date', function () {
    $('.dropdown-title').removeClass('active');
    $('.dropdown-created-date').addClass('active');
    sortBy = 'registered_at'
    displayVideos(sortBy, order);
});

// PAGINATION
$(document).on('click', '.btn-page', function (e) {
    currentPage = $(this).data('num');
    displayVideos(sortBy, order);
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
    displayVideos(sortBy, order);
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

function displayVideos(sortBy, order) {

    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const videoId = getParams('id');
    $.getJSON('../Cdn/js/data/videos.json', function (videoData) {
        let videoResponse = videoData.data;
        let videoview = videoResponse.filter(video => video.vid_group_id == videoId);

        console.log(videoview)
        const sortedData = sortData(isSearchQuery(videoview), order, sortBy);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        updatePagination(totalPages);
        const slicedData = sortedData.slice(startIndex, endIndex);
        let videoListHtml = '';
        slicedData.forEach(video => {
            videoListHtml += `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-2">
                <div class="card" data-ebook-id="${video.video_id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style="height:100%;">
                        <!-- Photo -->
                        <div class="img-container pt-2" style="height: 200px;">
                            <img src="${video.thumbnail_image}" class="card-img" alt="Image"
                                style="object-fit: contain; width: 100%; height: 100%;">
                        </div>
                        <div class="card-body">
                            <h3 class="card-title text-uppercase montserrat-semibold m-0">${video.title}</h3>
                            <p class=" card-text text-secondary">${video.description} </p>

                            <p class="lh-1 card-text text-secondary text-end"> <small>${convertDate(video.created_at)}</small>  </p>
                        </div>
                    </div>
                </div>

          `;
        });
        $('.ebook-list').html(videoListHtml);

        $('.card').click(function () {
            const videoId = $(this).data('ebook-id');
            $.getJSON('../Cdn/js/data/videos.json', function (data) {
              let response = data.data;
              f = response.keys(response).find(key => response[key].video_id === videoId);
              $(".offcanvas-title").text(response[f].title)
              $(".thumb").attr("src",response[f].thumbnail_image)
              $(".text-body").text(response[f].description)
              $(".watch-video").attr("href",`manage.watch.video.html?video_id=`+ videoId)
          });
        });
    });
}