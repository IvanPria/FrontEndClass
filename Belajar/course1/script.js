// Quiz functionality
const quizOptions = document.querySelectorAll('.quiz-option');
const prevButton = document.getElementById('prevQuestion');
const nextButton = document.getElementById('nextQuestion');

let currentQuestionIndex = 0;
const quizQuestions = document.querySelectorAll('.quiz-question');

// Initialize quiz
function initQuiz() {
    // Hide all questions except the first one
    quizQuestions.forEach((question, index) => {
        if (index !== 0) {
            question.style.display = 'none';
        }
    });
    
    // Disable prev button initially
    prevButton.disabled = true;
    prevButton.style.opacity = 0.5;
}

// Navigate to next question
nextButton.addEventListener('click', function() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        quizQuestions[currentQuestionIndex].style.display = 'none';
        currentQuestionIndex++;
        quizQuestions[currentQuestionIndex].style.display = 'block';
        
        // Enable prev button
        prevButton.disabled = false;
        prevButton.style.opacity = 1;
        
        // Disable next button if on last question
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextButton.disabled = true;
            nextButton.style.opacity = 0.5;
        }
    }
});

// Navigate to previous question
prevButton.addEventListener('click', function() {
    if (currentQuestionIndex > 0) {
        quizQuestions[currentQuestionIndex].style.display = 'none';
        currentQuestionIndex--;
        quizQuestions[currentQuestionIndex].style.display = 'block';
        
        // Enable next button
        nextButton.disabled = false;
        nextButton.style.opacity = 1;
        
        // Disable prev button if on first question
        if (currentQuestionIndex === 0) {
            prevButton.disabled = true;
            prevButton.style.opacity = 0.5;
        }
    }
});

// Handle quiz option selection
quizOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remove 'selected' class from siblings
        const parentQuestion = this.closest('.quiz-question');
        parentQuestion.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add 'selected' class to this option
        this.classList.add('selected');
        
        // Check if correct
        if (this.getAttribute('data-correct') === 'true') {
            this.style.backgroundColor = '#d4edda';
            this.style.borderColor = '#c3e6cb';
        } else {
            this.style.backgroundColor = '#f8d7da';
            this.style.borderColor = '#f5c6cb';
            
            // Highlight correct answer
            parentQuestion.querySelectorAll('.quiz-option').forEach(opt => {
                if (opt.getAttribute('data-correct') === 'true') {
                    opt.style.backgroundColor = '#d4edda';
                    opt.style.borderColor = '#c3e6cb';
                }
            });
        }
    });
});

// Initialize quiz when page loads
initQuiz();