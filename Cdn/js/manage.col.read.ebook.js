$(document).ready(function () {
    const ebookId = getParams('ebook_id');
    const ebookgroupId = getParams('ebook_group_id');
    $(".ebooklist").attr("href", `manage.col.ebook.list.html?id=${ebookgroupId}`);
    $("#header").attr("href", `manage.col.ebook.list.html?id=${ebookgroupId}`);

    updateEbookDetails();
    changefont();

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

            // Call the function to display the content of the first chapter initially
            displayChapterContent(filteredChapters[0], filteredChapters.length);

            // Add event listener to the dropdown to update content when selection changes
            chapterSelect.on('change', function () {
                const selectedChapterId = $(this).val();
                const selectedChapter = filteredChapters.find(chapter => chapter.ebook_chapter_id == selectedChapterId);
                if (selectedChapter) {
                    displayChapterContent(selectedChapter, filteredChapters.length);
                    if ($(this).find('option:selected').index() === $(this).find('option').length - 1) {
                        $('#nextButton').text('Finish');
                    }
                }
            });
        }
    });

    // COLOR SCHEME SELECTOR
    $('input[name="radios-inline"]').on('change', function () {
        const selectedScheme = $(this).val();

        switch (selectedScheme) {
            case 'light':
                $('body').removeClass('gray-scheme dark-scheme').addClass('light-scheme');
                break;
            case 'gray':
                $('body').removeClass('light-scheme dark-scheme').addClass('gray-scheme');
                break;
            case 'dark':
                $('body').removeClass('light-scheme gray-scheme').addClass('dark-scheme');
                break;
            default:
                break;
        }
    });

    // FONT SIZE SELECTOR
    $('#fontSizeSelector').on('change', function () {
        const selectedSize = parseInt($(this).val());
        const contentSize = selectedSize; // Use the selected font size for the content
        const headerSize = selectedSize + 10; // Add 10 pixels to the selected font size for the header
        $('.ebook-content').css('font-size', contentSize + 'px');
        $('#heading').css('font-size', headerSize + 'px');
    });

    $('#submitComment').on('click', function () {
        const comment = $('#comment').val().trim();
        
        if (comment) {
            const templateName = 'Manny Florendo'; // Replace this with your template name
            const time = new Date().toLocaleTimeString();
            const profilePicUrl = '../Cdn/images/enroll.jpg'; // Replace this with the URL of your profile picture
            const commentCard = $(`
                <div class="card mt-2">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${profilePicUrl}" class="rounded-circle me-3" style="width: 50px; height: 50px;" alt="Profile Picture">
                            <div class="row">
                                <p class="card-text col-12 mb-0">${comment}</p>
                                <small class="text-muted">${templateName} - ${time}</small>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-primary edit-button"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-danger delete-button"><i class="bi bi-trash3"></i></button>
                        </div>
                    </div>
                </div>
            `);
    
            commentCard.find('.delete-button').on('click', () => commentCard.remove());
    
            function handleEdit(button) {
                const cardText = commentCard.find('.card-text');
                const editInput = $(`<textarea type="text" class="form-control col-12" value="${cardText.text()}">`);
                cardText.replaceWith(editInput);
                button.toggleClass('btn-primary btn-success').html('<i class="bi bi-check"></i>');
    
                button.off('click').on('click', function () {
                    const updatedComment = editInput.val().trim();
                    if (updatedComment) {
                        editInput.replaceWith(`<p class="card-text mb-0">${updatedComment}</p>`);
                        button.toggleClass('btn-success btn-primary').html('<i class="bi bi-pencil"></i>');
    
                        // Rebind the edit event
                        button.off('click').on('click', function () {
                            handleEdit($(this));
                        });
                    } else {
                        alert('Comment cannot be empty.');
                    }
                });
            }
    
            commentCard.find('.edit-button').on('click', function () {
                handleEdit($(this));
            });
    
            $('#commentDisplay').append(commentCard);
            $('#comment').val('');
        } else {
            alert('Please enter a comment.');
        }
    });
    

});

// Function to display chapter content and update progress bar
function displayChapterContent(chapter, totalChapters) {
    const contentArea = $('.ebook-content');
    const heading = $('#heading');

    heading.text(chapter.chapter);
    contentArea.html(`<p style="text-align: justify; text-indent: 2rem;">${chapter.content}</p>`);

    // Calculate progress based on the chapter index and total chapters
    const chapterIndex = $('#chapterSelect').prop('selectedIndex');
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

// FONT SIZE
function changefont() {
    const $fontSizeSelector = $('#fontSizeSelector');

    for (let fontSize = 14; fontSize <= 26; fontSize += 2) {
        $fontSizeSelector.append($('<option>', {
            value: fontSize,
            text: fontSize
        }));
    }
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
        chapterSelect.val(chapterSelect.find('option').eq(currentIndex + 1).val()).change();
    } else {
        // Get the eBook ID and eBook group ID
        const ebookGroupId = getParams('ebook_group_id');

        window.location.href = `manage.col.ebook.list.html?id=${ebookGroupId}`;
    }
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
