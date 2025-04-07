// Quiz functionality
const quizQuestions = document.querySelectorAll('.quiz-question');
const prevButton = document.getElementById('prevQuestion');
const nextButton = document.getElementById('nextQuestion');
const questionCounter = document.querySelector('.question-counter');
const scoreSection = document.getElementById('scoreSection');
const scoreBar = document.getElementById('scoreBar');
const scoreText = document.getElementById('scoreText');
const correctCountElement = document.getElementById('correctCount');
const scorePercentageElement = document.getElementById('scorePercentage');
const feedbackText = document.getElementById('feedbackText');
const retryButton = document.getElementById('retryButton');
const nextRoadmapButton = document.getElementById('nextRoadmapButton');
const loadingMessage = document.getElementById('loadingMessage');

let currentQuestionIndex = 0;
let answeredQuestions = [];
let correctAnswers = 0;

// Initialize quiz
function initQuiz() {
    // Show only the first question
    quizQuestions.forEach((question, index) => {
        question.classList.remove('active');
        if (index === 0) {
            question.classList.add('active');
        }
    });
    
    // Reset variables
    currentQuestionIndex = 0;
    answeredQuestions = Array(quizQuestions.length).fill(false);
    correctAnswers = 0;
    
    // Reset all options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('correct', 'incorrect', 'disabled');
    });
    
    // Update question counter
    updateQuestionCounter();
    
    // Hide score section
    scoreSection.style.display = 'none';
    loadingMessage.style.display = 'none';
    
    // Disable navigation buttons initially
    updateNavigationButtons();
}

// Update question counter
function updateQuestionCounter() {
    questionCounter.textContent = `Soal ${currentQuestionIndex + 1} dari ${quizQuestions.length}`;
}

// Update navigation buttons
function updateNavigationButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    
    // Enable next button only if current question has been answered
    nextButton.disabled = !answeredQuestions[currentQuestionIndex];
    
    // If on last question and it's answered, change next button text
    if (currentQuestionIndex === quizQuestions.length - 1 && answeredQuestions[currentQuestionIndex]) {
        nextButton.textContent = 'Lihat Hasil';
    } else {
        nextButton.textContent = 'Selanjutnya';
    }
}

// Navigate to next question
nextButton.addEventListener('click', function() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        // Move to next question
        quizQuestions[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex++;
        quizQuestions[currentQuestionIndex].classList.add('active');
        updateQuestionCounter();
        updateNavigationButtons();
    } else {
        // Show results
        showResults();
    }
});

// Navigate to previous question
prevButton.addEventListener('click', function() {
    if (currentQuestionIndex > 0) {
        quizQuestions[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex--;
        quizQuestions[currentQuestionIndex].classList.add('active');
        updateQuestionCounter();
        updateNavigationButtons();
    }
});

// Handle quiz option selection
document.querySelectorAll('.quiz-options').forEach(optionsContainer => {
    optionsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('quiz-option') && !e.target.classList.contains('disabled')) {
            const options = this.querySelectorAll('.quiz-option');
            const selectedOption = e.target;
            const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
            
            // Disable all options in this question
            options.forEach(option => {
                option.classList.add('disabled');
            });
            
            // Mark question as answered
            const questionIndex = parseInt(this.closest('.quiz-question').getAttribute('data-index'));
            answeredQuestions[questionIndex] = true;
            
            // Update correct answer count
            if (isCorrect) {
                correctAnswers++;
                selectedOption.classList.add('correct');
            } else {
                selectedOption.classList.add('incorrect');
                
                // Highlight the correct answer
                options.forEach(option => {
                    if (option.getAttribute('data-correct') === 'true') {
                        option.classList.add('correct');
                    }
                });
            }
            
            // Enable navigation
            updateNavigationButtons();
        }
    });
});

// Show quiz results
function showResults() {
    // Hide questions, show score section
    quizQuestions.forEach(question => {
        question.classList.remove('active');
    });
    questionCounter.style.display = 'none';
    
    // Calculate score
    const scorePercentage = (correctAnswers / quizQuestions.length) * 100;
    
    // Update score elements
    scoreBar.style.width = `${scorePercentage}%`;
    correctCountElement.textContent = correctAnswers;
    scorePercentageElement.textContent = `${scorePercentage}%`;
    
    // Show appropriate feedback and buttons based on score
    if (scorePercentage < 100) {
        // Failed - show retry button
        feedbackText.innerHTML = '<p>Nilai Anda masih di bawah 100%. Silakan coba lagi untuk meningkatkan pemahaman Anda.</p>';
        feedbackText.style.color = 'var(--warning)';
        retryButton.style.display = 'inline-block';
        nextRoadmapButton.style.display = 'none';
    } else {
        // Passed - show next roadmap button
        feedbackText.innerHTML = '<p>Selamat! Anda telah berhasil menyelesaikan quiz ini dengan baik.</p>';
        feedbackText.style.color = 'var(--primary)';
        retryButton.style.display = 'none';
        nextRoadmapButton.style.display = 'inline-block';
        
        // // Auto redirect after 3 seconds
        // loadingMessage.style.display = 'block';
        // setTimeout(function() {
        //     window.location.href = '../index.html';
        // }, 3000);
    }
    
    // Show score section
    scoreSection.style.display = 'block';
    
    // Hide navigation buttons
    document.querySelector('.quiz-navigation').style.display = 'none';
}

// Retry the quiz
retryButton.addEventListener('click', function() {
    // Reset and restart the quiz
    initQuiz();
    
    // Show navigation buttons again
    document.querySelector('.quiz-navigation').style.display = 'flex';
    questionCounter.style.display = 'block';
});

// Initialize quiz when page loads
initQuiz();