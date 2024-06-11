$(document).ready(function () {
    const ebookId = getParams('ebook_id');
    const ebookgroupId = getParams('ebook_group_id');
    const sessionPrefix = `${ebookgroupId}_${ebookId}_`;

    $(".ebooklist").attr("href", `manage.ebooks.html?id=${ebookgroupId}`);
    $("#header").attr("href", `manage.ebooks.html?id=${ebookgroupId}`);

    updateEbookDetails();
    changefont();

    // Load saved settings
    loadSettings();
    // Call the function to display all sessionStorage items
    displaySessionStorage();

    // CHAPTERS
    $.getJSON('../Cdn/js/data/ebooks.chapters.json', function (chaptersData) {
        let chapters = chaptersData.data;
        const filteredChapters = chapters.filter(chapter => chapter.ebook_id == ebookId);
        const chapterSelect = $('#chapterSelect');
        initRating();

        chapterSelect.empty();

        if (filteredChapters.length > 0) {
            $.each(filteredChapters, function (index, chapter) {
                chapterSelect.append($('<option>', {
                    value: chapter.ebook_chapter_id,
                    text: chapter.chapter
                }));
            });

            // Load saved chapter or display the first chapter initially
            const savedChapterId = sessionStorage.getItem(`${sessionPrefix}currentChapter`);

            if (savedChapterId) {
                const initialChapter = filteredChapters.find(chapter => chapter.ebook_chapter_id == savedChapterId);
                displayChapterContent(initialChapter, filteredChapters.length, filteredChapters);
                chapterSelect.val(savedChapterId);
            } else {
                const initialChapter = filteredChapters[0];
                displayChapterContent(initialChapter, filteredChapters.length, filteredChapters);
            }

            // Add event listener to the dropdown to update content when selection changes
            chapterSelect.on('change', function () {
                const selectedChapterId = $(this).val();
                const selectedChapter = filteredChapters.find(chapter => chapter.ebook_chapter_id == selectedChapterId);
                if (selectedChapter) {
                    displayChapterContent(selectedChapter, filteredChapters.length, filteredChapters);
                    sessionStorage.setItem(`${sessionPrefix}currentChapter`, selectedChapterId); // Save the current chapter
                }
            });
        }
    });

    // COLOR SCHEME SELECTOR
    $('input[name="radios-inline"]').on('change', function () {
        const selectedScheme = $(this).val();
        sessionStorage.setItem(`${sessionPrefix}colorScheme`, selectedScheme); // Save the selected color scheme

        applyColorScheme(selectedScheme);
    });

    // FONT SIZE SELECTOR
    $('#fontSizeSelector').on('change', function () {
        const selectedSize = parseInt($(this).val());
        sessionStorage.setItem(`${sessionPrefix}fontSize`, selectedSize); // Save the selected font size
        applyFontSize(selectedSize);
    });

    // Apply saved settings immediately after they are loaded
    function loadSettings() {
        const colorScheme = sessionStorage.getItem(`${sessionPrefix}colorScheme`);
        if (colorScheme) {
            $(`input[name="radios-inline"][value="${colorScheme}"]`).prop('checked', true);
            applyColorScheme(colorScheme);
        }

        const savedFontSize = sessionStorage.getItem(`${sessionPrefix}fontSize`);
        if (savedFontSize) {
            $('#fontSizeSelector').val(savedFontSize);
            applyFontSize(parseInt(savedFontSize));
        }
    }

    function applyColorScheme(scheme) {
        $('body').removeClass('light-scheme gray-scheme dark-scheme').addClass(`${scheme}-scheme`);
    }

    function applyFontSize(size) {
        const contentSize = size; // Use the selected font size for the content
        const headerSize = size + 10; // Add 10 pixels to the selected font size for the header
        $('.ebook-content').css('font-size', contentSize + 'px');
        $('#heading').css('font-size', headerSize + 'px');
    }
});

// Function to display chapter content and update progress bar
function displayChapterContent(chapter, totalChapters, filteredChapters) {
    const contentArea = $('.ebook-content');
    const heading = $('#heading');

    heading.text(chapter.chapter);
    contentArea.html(`<p style="text-align: justify; text-indent: 2rem;">${chapter.content}</p>`);

    // Calculate progress based on the chapter index and total chapters
    const chapterIndex = filteredChapters.findIndex(c => c.ebook_chapter_id === chapter.ebook_chapter_id);
    const progress = ((chapterIndex + 1) / totalChapters) * 100; // Calculate progress as a percentage

    // Update progress bar width, aria-valuenow, and visually hidden text
    const progressBar = $('.progress-bar');
    progressBar.css('width', progress + '%');
    progressBar.attr('aria-valuenow', progress);
    progressBar.find('.visually-hidden').text(progress + '% Complete');

    // Update button visibility and text based on the chapter index
    if (chapterIndex === 0) {
        $('#prevButton').hide(); // Hide the Previous button on the first chapter
    } else {
        $('#prevButton').show();
    }

    if (chapterIndex === totalChapters - 1) {
        $('#nextButton').text('Finish');
    } else {
        $('#nextButton').text('Next');
    }

    // Show modal for examination after every chapter
    $('#nextButton').off('click').on('click', function () {
        sessionStorage.setItem('nextChapter', chapterIndex + 1);
        window.location.href = "manage.ebook.examination.html";
    });
}

// NAVIGATION FUNCTIONS
function previousChapter() {
    const chapterSelect = $('#chapterSelect');
    const currentIndex = chapterSelect.find('option:selected').index();
    if (currentIndex > 0) {
        chapterSelect.val(chapterSelect.find('option').eq(currentIndex - 1).val()).change();
    }
}

function nextChapter() {
    const chapterSelect = $('#chapterSelect');
    const currentIndex = chapterSelect.find('option:selected').index();
    const totalChapters = chapterSelect.find('option').length;

    if (currentIndex < totalChapters - 1) {
        const nextChapterId = chapterSelect.find('option').eq(currentIndex + 1).val();
        sessionStorage.setItem('nextChapterId', nextChapterId); // Store the next chapter ID
        const ebookId = getParams('ebook_id');
        const ebookGroupId = getParams('ebook_group_id');
        window.location.href = `manage.ebook.examination.html?ebook_id=${ebookId}&ebook_group_id=${ebookGroupId}`;
    } else {
        const ebookGroupId = getParams('ebook_group_id');
        window.location.href = `manage.ebooks.html?id=${ebookGroupId}`;
    }
}

function changefont() {
    const $fontSizeSelector = $('#fontSizeSelector');

    for (let fontSize = 14; fontSize <= 26; fontSize += 2) {
        $fontSizeSelector.append($('<option>', {
            value: fontSize,
            text: fontSize
        }));
    }
}

// DISPLAY EBOOK DETAILS
function updateEbookDetails() {
    const ebookId = getParams('ebook_id');

    $.getJSON('../Cdn/js/data/ebooks.json', function (data) {
        let response = data.data;
        const ebook = response.find(item => item.ebook_id == ebookId);

        $('#header').text(ebook.title);
        $('.author').text(ebook.author);
        $('.ebook-image').attr('src', ebook.thumbnail_image);
    });
}

function initRating() {
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('rating-value');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            ratingValue.value = value;
            stars.forEach(s => {
                s.classList.remove('selected');
            });
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('selected');
            }
        });

        star.addEventListener('mouseover', () => {
            const value = star.getAttribute('data-value');
            stars.forEach(s => {
                s.classList.remove('hover');
            });
            for (let i = value - 1; i >= 0; i--) {
                stars[i].classList.add('hover');
            }
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => {
                s.classList.remove('hover');
            });
        });
    });
}

// Function to display all items stored in sessionStorage
function displaySessionStorage() {
    const sessionKeys = Object.keys(sessionStorage);
    const sessionValues = sessionKeys.map(key => sessionStorage.getItem(key));

    for (let i = 0; i < sessionKeys.length; i++) {
        console.log(`Key: ${sessionKeys[i]}, Value: ${sessionValues[i]}`);
    }
}

