class QuizSystem {
    constructor() {
        this.questions = [
            {
                question: "What is the capital of France?",
                options: ["London", "Paris", "Berlin", "Madrid"],
                correctAnswer: 1
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                correctAnswer: 3
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correctAnswer: 2
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["Ag", "Au", "Fe", "Cu"],
                correctAnswer: 1
            }
        ];
        
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.quizCompleted = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.questionText = document.querySelector('.question-text');
        this.optionBtns = document.querySelectorAll('.option-btn');
        this.questionCounter = document.querySelector('.question-counter');
        this.scoreDisplay = document.querySelector('.score');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.finishBtn = document.querySelector('.finish-btn');
        this.progressFill = document.querySelector('.progress-fill');
        this.resultsModal = document.querySelector('.results-modal');
        this.finalScore = document.querySelector('.score-value');
        this.percentage = document.querySelector('.percent-value');
        this.retryBtn = document.querySelector('.retry-btn');
        this.newQuizBtn = document.querySelector('.new-quiz-btn');
    }
    
    bindEvents() {
        this.optionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectOption(e));
        });
        
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.finishBtn.addEventListener('click', () => this.finishQuiz());
        this.retryBtn.addEventListener('click', () => this.retryQuiz());
        this.newQuizBtn.addEventListener('click', () => this.newQuiz());
    }
    
    selectOption(event) {
        const selectedBtn = event.currentTarget;
        const optionIndex = parseInt(selectedBtn.dataset.option);
        
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        
        this.optionBtns.forEach(btn => {
            btn.classList.remove('selected');
            btn.disabled = true;
        });
        
        selectedBtn.classList.add('selected');
        
        if (optionIndex === this.questions[this.currentQuestionIndex].correctAnswer) {
            selectedBtn.classList.add('correct');
            this.score++;
        } else {
            selectedBtn.classList.add('incorrect');
            const correctBtn = this.optionBtns[this.questions[this.currentQuestionIndex].correctAnswer];
            correctBtn.classList.add('correct');
        }
        
        this.updateScore();
        this.updateNavigationButtons();
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.updateDisplay();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        this.questionText.textContent = currentQuestion.question;
        this.questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        
        this.optionBtns.forEach((btn, index) => {
            btn.querySelector('.option-text').textContent = currentQuestion.options[index];
            btn.classList.remove('selected', 'correct', 'incorrect');
            btn.disabled = false;
            
            if (this.userAnswers[this.currentQuestionIndex] !== null) {
                btn.disabled = true;
                if (index === this.userAnswers[this.currentQuestionIndex]) {
                    btn.classList.add('selected');
                }
                if (index === currentQuestion.correctAnswer) {
                    btn.classList.add('correct');
                } else if (index === this.userAnswers[this.currentQuestionIndex] && 
                          index !== currentQuestion.correctAnswer) {
                    btn.classList.add('incorrect');
                }
            }
        });
        
        this.updateNavigationButtons();
        this.updateProgress();
    }
    
    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            this.nextBtn.style.display = 'none';
            this.finishBtn.style.display = 'inline-block';
        } else {
            this.nextBtn.style.display = 'inline-block';
            this.finishBtn.style.display = 'none';
        }
        
        this.nextBtn.disabled = this.userAnswers[this.currentQuestionIndex] === null;
        this.finishBtn.disabled = this.userAnswers.some(answer => answer === null);
    }
    
    updateScore() {
        this.scoreDisplay.textContent = `Score: ${this.score}/${this.questions.length}`;
    }
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    finishQuiz() {
        this.quizCompleted = true;
        this.showResults();
    }
    
    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        this.finalScore.textContent = `${this.score}/${this.questions.length}`;
        this.percentage.textContent = `${percentage}%`;
        
        this.resultsModal.style.display = 'flex';
    }
    
    retryQuiz() {
        this.resultsModal.style.display = 'none';
        this.resetQuiz();
    }
    
    newQuiz() {
        this.resultsModal.style.display = 'none';
        this.resetQuiz();
        this.shuffleQuestions();
    }
    
    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.quizCompleted = false;
        this.updateDisplay();
        this.updateScore();
    }
    
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
        this.updateDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuizSystem();
});
