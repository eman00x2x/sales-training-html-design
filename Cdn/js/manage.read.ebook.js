function populateChapterDropdown(ebookId) {
    $.getJSON('../Cdn/js/data/ebooks.chapters.json', function (chaptersData) {
        let chapters = chaptersData.data;
        const filteredChapters = chapters.filter(chapter => chapter.ebook_id == ebookId);
        const chapterSelect = document.getElementById('chapterSelect');

        chapterSelect.innerHTML = '';

        if (filteredChapters.length > 0) {
            filteredChapters.forEach((chapter) => {
                const option = document.createElement('option');
                option.value = chapter.ebook_chapter_id;
                option.textContent = chapter.chapter;
                chapterSelect.appendChild(option);
            });

            const savedEbookId = sessionStorage.getItem('ebookId');
            const savedChapters = JSON.parse(sessionStorage.getItem('savedChapters')) || {};
            if (savedEbookId && savedEbookId === ebookId) {
                const selectedChapterId = savedChapters[ebookId];
                chapterSelect.value = selectedChapterId;
                loadChapterContent(selectedChapterId);
                updateButtonVisibility(selectedChapterId, filteredChapters);
            } else {
                sessionStorage.removeItem('selectedChapterId');
                sessionStorage.removeItem('ebookId');
                sessionStorage.setItem('ebookId', ebookId);
                const selectedChapterId = filteredChapters[0].ebook_chapter_id;
                sessionStorage.setItem('selectedChapterId', selectedChapterId);
                chapterSelect.value = selectedChapterId;
                loadChapterContent(selectedChapterId);
                updateButtonVisibility(selectedChapterId, filteredChapters);

            }


            chapterSelect.addEventListener('change', function () {
                const selectedChapterId = parseInt(this.value); 
                const selectedEbookId = sessionStorage.getItem('ebookId');
                let savedChapters = JSON.parse(sessionStorage.getItem('savedChapters')) || {};
                savedChapters[selectedEbookId] = selectedChapterId;
                sessionStorage.setItem('savedChapters', JSON.stringify(savedChapters));
                updateButtonVisibility(selectedChapterId, filteredChapters);
                loadChapterContent(selectedChapterId);
            });

            document.getElementById('nextButton').addEventListener('click', function () {
                const selectedIndex = chapterSelect.selectedIndex;
                if (selectedIndex < filteredChapters.length - 1) {
                    chapterSelect.selectedIndex = selectedIndex + 1;
                    chapterSelect.dispatchEvent(new Event('change'));
                }
            });

            document.getElementById('prevButton').addEventListener('click', function () {
                const selectedIndex = chapterSelect.selectedIndex;
                if (selectedIndex > 0) {
                    chapterSelect.selectedIndex = selectedIndex - 1;
                    chapterSelect.dispatchEvent(new Event('change'));
                }
            });

            function updateButtonVisibility() {
                const prevButton = document.getElementById('prevButton');
                const nextButton = document.getElementById('nextButton');
                const selectedIndex = chapterSelect.selectedIndex;

                prevButton.style.display = selectedIndex === 0 ? 'none' : 'inline-block';

                nextButton.textContent = selectedIndex === filteredChapters.length - 1 ? 'Take Exam' : 'Next';
            }

            function loadChapterContent(selectedChapterId) {
                const selectedChapter = filteredChapters.find(chapter => chapter.ebook_chapter_id == selectedChapterId);
                if (selectedChapter) {
                    const contentArea = document.querySelector('.ebook-content');
                    heading.textContent = selectedChapter.chapter;
                    contentArea.innerHTML = `<p style="text-align: justify;text-indent: 2rem;">${selectedChapter.content}</p>`;
                    sessionStorage.setItem('selectedChapterId', selectedChapterId);
                }
            }

        } else {
            chapterSelect.innerHTML = '<option>No chapters found</option>';
        }
    });
}

function nextChapter() {
    const chapterSelect = document.getElementById('chapterSelect');
    const nextIndex = chapterSelect.selectedIndex + 1;
    if (nextIndex < chapterSelect.options.length) {
        chapterSelect.selectedIndex = nextIndex;
        chapterSelect.dispatchEvent(new Event('change'));
    } else {
        window.location.href = 'take_exam.html';
    }
}

function previousChapter() {
    const chapterSelect = document.getElementById('chapterSelect');
    const previousIndex = chapterSelect.selectedIndex - 1;
    if (previousIndex >= 0) {
        chapterSelect.selectedIndex = previousIndex;
        chapterSelect.dispatchEvent(new Event('change'));
    }
}
function updateButtonVisibility(selectedChapterId, filteredChapters) {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    if (selectedChapterId === 1) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'inline-block';
    }

    if (selectedChapterId === filteredChapters.length) {
        nextButton.textContent = 'Take Exam';
    } else {
        nextButton.textContent = 'Next';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const ebookId = getParams('ebook_id');
    populateChapterDropdown(ebookId);
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }
    


    //font
    let baseSize = 16;
    let increment = 4;
    let numberOfSizes = 5;

    let select = document.getElementById('fontSizeSelector');
    let textToResize = document.getElementById('textToResize');

    for (let i = 0; i < numberOfSizes; i++) {
        let size = baseSize + increment * i;
        let option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        select.appendChild(option);
    }

    select.addEventListener('change', function () {
        textToResize.style.fontSize = this.value + 'px';
        heading.style.fontSize = parseInt(this.value) + 24 + 'px';
    });

    let savedFontSize = sessionStorage.getItem('fontSize');
    if (savedFontSize) {
        select.value = savedFontSize;
        textToResize.style.fontSize = savedFontSize + 'px';
    } else {
        textToResize.style.fontSize = baseSize + 'px';
    }

    //color scheme
    let savedColorScheme = sessionStorage.getItem('colorScheme');
    if (savedColorScheme) {
        document.querySelector(`input[name="radios-inline"][value="${savedColorScheme}"]`).checked = true;
        document.body.classList.remove('light-scheme', 'gray-scheme', 'dark-scheme');
        document.body.classList.add(`${savedColorScheme}-scheme`);
    }

    select.addEventListener('change', function () {
        sessionStorage.setItem('fontSize', this.value);
        textToResize.style.fontSize = this.value + 'px';
        heading.style.fontSize = parseInt(this.value) + 24 + 'px';
    });

    document.querySelectorAll('input[name="radios-inline"]').forEach((radio) => {
        radio.addEventListener('click', function () {
            if (this.checked) {
                const value = this.value;
                document.body.classList.remove('light-scheme', 'gray-scheme', 'dark-scheme');
                document.body.classList.add(`${value}-scheme`);
                sessionStorage.setItem('colorScheme', value);
            }
        });
    });

});






