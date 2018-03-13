const quizAppViews = ['.js-quiz-item-feedback-section','.js-start-page', '.js-quiz-item','.js-quiz-state', '.js-feedback-page','.js-quiz-navigation'];

// Quiz App State - set by resetQuizAppState()
let quizApp = {
};

$(handleQuizApp);

function handleQuizApp() {
  renderStartPage();
  handleStartQuiz();
  handleAnswerSubmit();
  handleNextQuestion();
  handleRestartQuiz();
}

// Update current view to only show required views and hide all the rest
function updateView(viewsToShow) {
  let viewsToHide = quizAppViews.filter(function(element) {
    return !viewsToShow.includes(element);
  });
  viewsToShow.forEach(element => $(element).show());
  viewsToHide.forEach(element => $(element).hide());
}

// shuffle STORE array to randomize question selection
function shuffleArray(array) {
  let i1, i2;
  for (i1 = array.length - 1; i1 > 0; i1--) {
    i2 = Math.floor(Math.random() * (i1 + 1));
    [array[i1], array[i2]] = [array[i2], array[i1]];
  }
}

function generateQuizFromStore() {
  shuffleArray(STORE);
  return STORE.slice(0,5);
}

function disableForm() {
  $('#js-quiz-item').find(':input, :button').attr('disabled','disabled');  
}

function enableForm() {
  $('#js-quiz-item').find(':input, :button').removeAttr('disabled');
}

function resetForm() {
  $('#js-quiz-item')[0].reset();
}

function resetQuizAppState() {
  quizApp = {currentQuiz: generateQuizFromStore(), questionCounter: -1, correctAnswers: 0, incorrectAnswers: 0};
}

function renderQuestion() {
  currentQuestion = quizApp.currentQuiz[quizApp.questionCounter];
  
  // reset and enable form
  resetForm();
  enableForm();
  
  // populate form with quiz question
  $('.js-question').text(currentQuestion.question);
  $('label[for="option-1"]').text(currentQuestion.answer1);
  $('label[for="option-2"]').text(currentQuestion.answer2);  
  $('label[for="option-3"]').text(currentQuestion.answer3);
  $('label[for="option-4"]').text(currentQuestion.answer4);
}

// New quiz set up
function startNewQuiz() {
  // reset application state
  resetQuizAppState();

  // show first question
  processNextQuestion();
  renderUserScore();   
}

function handleStartQuiz() {
  $('#startQuiz').on('click', function(event) {
    startNewQuiz();
  });
}

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

function isCorrect(answer) {
  return answer === quizApp.currentQuiz[quizApp.questionCounter].correctAnswer;  
}

function generateFeedbackMessage(isCorrectAnswer) {
  return isCorrectAnswer ? 'The answer was correct. Yay!': `The answer was incorrect. Correct answer is ${quizApp.currentQuiz[quizApp.questionCounter].correctAnswer}.`;
} 

function updateUserScore(isCorrectAnswer) {
  if(isCorrectAnswer) quizApp.correctAnswers++;
  else quizApp.incorrectAnswers++;
}

function renderQuestionFeedback(message) {
  $('.js-quiz-item-feedback').text(message);
  updateView(['.js-quiz-item-feedback-section', '.js-quiz-item','.js-quiz-state', '.js-quiz-navigation']);
}

function renderUserScore() {
  console.log(`Current user score - ${quizApp.correctAnswers}, ${quizApp.incorrectAnswers}`);
  $('.js-quiz-current-score').text(`${quizApp.correctAnswers} correct, ${quizApp.incorrectAnswers} incorrect`);
}

function updateQuizProgress() {
  $('.js-quiz-progress').text(`Question ${quizApp.questionCounter+1} out of 5`);
}

function renderStartPage() {
  updateView(['.js-start-page']);
}

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
  updateQuizProgress();
  updateView(['.js-quiz-item','.js-quiz-state']);
}

function handleNextQuestion() {
  $('#js-next-question').on('click', function(event) {
    processNextQuestion();
  });
}

function renderFeedbackPage() {
  // update feedback message with current score
  $('.js-quiz-feedback').text(`You've got ${quizApp.correctAnswers} out 5 questions right. Great Job!`);
  // show feedback page
  updateView(['.js-feedback-page']);
}

function handleRestartQuiz() {
  $('#restartQuiz').on('click', function(event) {
    startNewQuiz();
  });
}