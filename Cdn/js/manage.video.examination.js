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

    // const limit = 10;
    // const startIndex = (currentPage - 1) * limit;
    // const endIndex = startIndex + limit;

    $.getJSON('../Cdn/js/data/exam.json', function (examData) {
        let videoResponse = examData.data;
        let videoview = videoResponse.filter(video => video.type == 'VIDEO');



        let questionnaireHtml = ''; // Initialize the variable to hold the HTML content
        let questionIndex = 0; // Initialize question index outside the loop
        let selectedAnswers = {}; // Object to store selected answers
        
        videoview.forEach((questionnaireData, index) => {
            questionnaireData.questionaires.forEach((questionnaire) => {
                const uniqueGroupName = `question_${questionnaireData.exam_id}_${questionIndex}`; // Unique group name
                questionnaireHtml += `
                    <div class="card col-lg-12 p-5 mt-1">
                        <div class="card-title">
                            <h1>${questionIndex + 1}.) ${questionnaire.question}</h1>
                        </div>
                        <div class="card-body">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="${uniqueGroupName}" value="a" id="${uniqueGroupName}_a">
                                <label class="form-check-label" for="${uniqueGroupName}_a">${questionnaire.choices.a}</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="${uniqueGroupName}" value="b" id="${uniqueGroupName}_b">
                                <label class="form-check-label" for="${uniqueGroupName}_b">${questionnaire.choices.b}</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="${uniqueGroupName}" value="c" id="${uniqueGroupName}_c">
                                <label class="form-check-label" for="${uniqueGroupName}_c">${questionnaire.choices.c}</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="${uniqueGroupName}" value="d" id="${uniqueGroupName}_d">
                                <label class="form-check-label" for="${uniqueGroupName}_d">${questionnaire.choices.d}</label>
                            </div>
                        </div>
                    </div>
                `;
                questionIndex++; // Increment question index for the next questionnaire
            });
        });
        
        $('.questionnaire-container').html(questionnaireHtml); // Insert the generated HTML into the designated container
        
        function submitAnswers() {
            // Reset selected answers
            selectedAnswers = {};
        
            $('input[type=radio]').each(function() {
                if (this.checked) {
                    const groupName = $(this).attr('name');
                    const answer = $(this).val();
                    selectedAnswers[groupName] = answer;
                }
            });
        
            console.log(selectedAnswers);
            alert("Form submitted successfully!");

        }
        
        $('#submit-btn').click(submitAnswers);
        
        
        
        

    });
}