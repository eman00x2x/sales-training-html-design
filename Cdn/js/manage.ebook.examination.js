$(document).ready(function () {
    displayExam();
});

function displayExam() {

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