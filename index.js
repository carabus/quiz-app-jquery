const quizAppViews = ['.js-quiz-item-feedback-section','.js-start-page', 
'.js-quiz-item', '.js-quiz-state', '.js-feedback-page','.js-quiz-navigation'];

/** Quiz App State - set by resetQuizAppState() */
let quizApp = {
};

$(handleQuizApp);

/** Displays start page and handles all application events */
function handleQuizApp() {
  renderStartPage();
  handleStartQuiz();
  handleAnswerSubmit();
  handleNextQuestion();
  handleRestartQuiz();
}

/** 
  * Update current view to only show required views and hide all the rest
  * @param {array} viewsToShow - array of views to show  
  */
function updateView(viewsToShow) {
  let viewsToHide = quizAppViews.filter(function(element) {
    return !viewsToShow.includes(element);
  });
  viewsToShow.forEach(element => $(element).show());
  viewsToHide.forEach(element => $(element).hide());
}

/**
  * Shuffle array to randomize question selection
  * @param {array} array - array to shuffleArray
  */
function shuffleArray(array) {
    let i1, i2;
    for (i1 = array.length - 1; i1 > 0; i1--) {
        i2 = Math.floor(Math.random() * (i1 + 1));
        [array[i1], array[i2]] = [array[i2], array[i1]];
    }
}

/** Generate current quiz by selecting top 5 elements from shuffled STORE */
function generateQuizFromStore() {
  shuffleArray(STORE);
  return STORE.slice(0,5);
}

/** Disable quiz form */
function disableForm() {
  $('#js-quiz-item').find('input, button[type="submit"]').attr('disabled','disabled');  
}

/** Enable quiz form */
function enableForm() {
  $('#js-quiz-item').find('input, button[type="submit"]').removeAttr('disabled');
}

/** Reset quiz form */
function resetForm() {
  $('#js-quiz-item')[0].reset();
}

/** Reset application state when new quiz starts */
function resetQuizAppState() {
  quizApp = {
    currentQuiz: generateQuizFromStore(), 
    questionCounter: -1, 
    correctAnswers: 0, 
    incorrectAnswers: 0
  };
}

/** Populate quiz form with current quiz question and answer options */
function renderQuestion() {
  currentQuestion = quizApp.currentQuiz[quizApp.questionCounter];
  
  // reset and enable form
  resetForm();
  enableForm();
  
  // populate form with quiz question
  $('.js-question').text(`Question ${quizApp.questionCounter+1} of 5: ${currentQuestion.question}`);
  currentQuestion.answers.forEach(function(answer, index) {
    $(`label[for="option-${index}"]`).text(answer);  
  });
}

/** New quiz set up */
function startNewQuiz() {
  // reset application state
  resetQuizAppState();
  // process and show first question
  processNextQuestion();
  renderUserScore();   
}

/** Event handler for pressing "Start Quiz" button */
function handleStartQuiz() {
  $('#startQuiz').on('click', function(event) {
    startNewQuiz();
  });
}

/** Event handler for Submitting an answer for current quiz question */
function handleAnswerSubmit() {
  $('#js-quiz-item').submit(function(event) {
    event.preventDefault();
    // disable form so that user can not re-submit
    disableForm();
    
    // get user answer
    const answer = $(this).find('input[name="answer-options"]:checked').closest('div').find('label').text();
    console.log(`Selected value is - ${answer}`);
    
    const feedbackMessage = generateFeedbackMessage(isCorrect(answer));
    
    updateUserScore(isCorrect(answer));

    // process quiz answer
    renderQuestionFeedback(feedbackMessage);
    
    // update user score
    renderUserScore();
  });
}

/** 
  * Compare user answer to expected quiz answer.
  * @param {String} answer - answer given by a user
  */
function isCorrect(answer) {
  return answer === quizApp.currentQuiz[quizApp.questionCounter].correctAnswer;  
}

/** 
 * Generate feedback message for quiz question answer. 
 * Depends on whether the user answered correctly or not.
 * @param {boolean} isCorrectAnswer
 */
function generateFeedbackMessage(isCorrectAnswer) {
  return isCorrectAnswer ? 
  'The answer was correct.': 
  `The answer was incorrect. Correct answer is ${quizApp.currentQuiz[quizApp.questionCounter].correctAnswer}.`;
} 

/**
 * Update user score for current quiz.
 * Depends on whether the user answered correctly or not.
 * @param {boolean} isCorrectAnswer
 */
function updateUserScore(isCorrectAnswer) {
  if(isCorrectAnswer) quizApp.correctAnswers++;
  else quizApp.incorrectAnswers++;
}

/** Display quiz question feedback on the screen
 * @param {String} message - message to Display
 */
function renderQuestionFeedback(message) {
  $('.js-quiz-item-feedback').text(message);
  updateView(['.js-quiz-item-feedback-section', '.js-quiz-item','.js-quiz-state', '.js-quiz-navigation']);
}

/** Display current user score on the screen */
function renderUserScore() {
  console.log(`Current user score - ${quizApp.correctAnswers}, ${quizApp.incorrectAnswers}`);
  $('.correct').text(quizApp.correctAnswers);
  $('.incorrect').text(quizApp.incorrectAnswers);
}

/** Display Start Page section */
function renderStartPage() {
  updateView(['.js-start-page']);
}

/** Handle iteration over quiz questions*/
function processNextQuestion() {
  // update the counter
  quizApp.questionCounter++;
  
  // if it is the last question - display feedback page instead
  if (quizApp.questionCounter===quizApp.currentQuiz.length) {
      renderFeedbackPage();
      return;
  }

  // display next question
  renderQuestion();
  // updateQuizProgress();
  updateView(['.js-quiz-item','.js-quiz-state']);
}

/** Handle "Next Question" button pressed by the user*/
function handleNextQuestion() {
  $('#js-next-question').on('click', function(event) {
    processNextQuestion();
  });
}

/** Populate and display quiz feedback page. */
function renderFeedbackPage() {
  // update feedback message with current score
  $('.js-quiz-feedback').text(`You've got ${quizApp.correctAnswers} out 5 questions right. Great Job!`);
  // show feedback page
  updateView(['.js-feedback-page']);
}

/** Handle "Restart Quiz" button pressed by the user. */
function handleRestartQuiz() {
  $('#restartQuiz').on('click', function(event) {
    startNewQuiz();
  });
}