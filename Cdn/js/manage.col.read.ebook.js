$(document).ready(function () {
    const ebookId = getParams('ebook_id');
    const ebookgroupId = getParams('ebook_group_id');
    $(".ebooklist").attr("href", `manage.ebooks.html?id=${ebookgroupId}`);
    $("#header").attr("href", `manage.ebooks.html?id=${ebookgroupId}`);

    updateEbookDetails();
    changefont();

    // CHAPTERS
    $.getJSON('../Cdn/js/data/ebooks.chapters.json', function (chaptersData) {
        let chapters = chaptersData.data;
        const filteredChapters = chapters.filter(chapter => chapter.ebook_id == ebookId);
        const chapterSelect = $('#chapterSelect');

        chapterSelect.empty();

        if (filteredChapters.length > 0) {
            $.each(filteredChapters, function (index, chapter) {
                chapterSelect.append($('<option>', {
                    value: chapter.ebook_chapter_id,
                    text: chapter.chapter
                }));
            });

            // Call the function to display the content of the first chapter initially
            displayChapterContent(filteredChapters[0]);

            // Add event listener to the dropdown to update content when selection changes
            chapterSelect.on('change', function () {
                const selectedChapterId = $(this).val();
                const selectedChapter = filteredChapters.find(chapter => chapter.ebook_chapter_id == selectedChapterId);
                if (selectedChapter) {
                    displayChapterContent(selectedChapter);
                }
            });
        }
    });
});

// Function to display chapter content
function displayChapterContent(chapter) {
    const contentArea = $('.ebook-content');
    const heading = $('#heading');

    heading.text(chapter.chapter);
    contentArea.html(`<p style="text-align: justify; text-indent: 2rem;">${chapter.content}</p>`);
    sessionStorage.setItem('selectedChapterId', chapter.ebook_chapter_id);
}


//DISPLAY EBOOK DETAILS
function updateEbookDetails() {
    const ebookId = getParams('ebook_id');

    $.getJSON('../Cdn/js/data/ebooks.json', function (data) {
        let response = data.data;
        f = response.keys(response).find(key => response[key].ebook_id == ebookId);

        $('#header').text(response[f].title);
        $('.author').text(response[f].author);
        $('.ebook-image').attr('src', response[f].thumbnail_image);
    });
}

//FONT SIZE
function changefont() {
    const $fontSizeSelector = $('#fontSizeSelector');

    for (let fontSize = 16; fontSize <= 32; fontSize += 2) {
        $fontSizeSelector.append($('<option>', {
            value: fontSize,
            text: fontSize
        }));
    }
}