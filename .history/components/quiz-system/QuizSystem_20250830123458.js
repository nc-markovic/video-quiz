export class QuizSystem {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            questions: [],
            showResults: true,
            allowRetry: true,
            ...options
        };
        
        this.questions = this.options.questions.length > 0 ? this.options.questions : this.getDefaultQuestions();
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.quizCompleted = false;
        
        this.questionText = null;
        this.optionBtns = null;
        this.questionCounter = null;
        this.scoreDisplay = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.finishBtn = null;
        this.progressFill = null;
        this.resultsModal = null;
        this.finalScore = null;
        this.percentage = null;
        this.retryBtn = null;
        this.newQuizBtn = null;
        
        this.init();
    }
    
    getDefaultQuestions() {
        return [
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
    }
    
    init() {
        this.createHTML();
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    createHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container with ID '${this.containerId}' not found`);
        }
        
        container.innerHTML = `
            <div class="quiz-container">
                <header class="quiz-header">
                    <h1>Video Quiz</h1>
                    <div class="quiz-info">
                        <span class="question-counter">Question 1 of ${this.questions.length}</span>
                        <span class="score">Score: 0/${this.questions.length}</span>
                    </div>
                </header>

                <main class="quiz-main">
                    <div class="question-container">
                        <h2 class="question-text">${this.questions[0].question}</h2>
                        
                        <div class="options-container">
                            ${this.questions[0].options.map((option, index) => `
                                <button class="option-btn" data-option="${index}">
                                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                    <span class="option-text">${option}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="navigation">
                        <button class="nav-btn prev-btn" disabled>← Previous</button>
                        <button class="nav-btn next-btn">Next →</button>
                        <button class="nav-btn finish-btn" style="display: none;">Finish Quiz</button>
                    </div>
                </main>

                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>

            ${this.options.showResults ? `
                <div class="results-modal" style="display: none;">
                    <div class="modal-content">
                        <h2>Quiz Results</h2>
                        <div class="results-summary">
                            <p class="final-score">Final Score: <span class="score-value">0/${this.questions.length}</span></p>
                            <p class="percentage">Percentage: <span class="percent-value">0%</span></p>
                        </div>
                        <div class="action-buttons">
                            ${this.options.allowRetry ? '<button class="retry-btn">Retry Quiz</button>' : ''}
                            <button class="new-quiz-btn">New Quiz</button>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
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
        
        if (this.options.showResults) {
            this.resultsModal = document.querySelector('.results-modal');
            this.finalScore = document.querySelector('.score-value');
            this.percentage = document.querySelector('.percent-value');
            this.retryBtn = document.querySelector('.retry-btn');
            this.newQuizBtn = document.querySelector('.new-quiz-btn');
        }
    }
    
    bindEvents() {
        this.optionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectOption(e));
        });
        
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.finishBtn.addEventListener('click', () => this.finishQuiz());
        
        if (this.options.showResults) {
            if (this.retryBtn) this.retryBtn.addEventListener('click', () => this.retryQuiz());
            if (this.newQuizBtn) this.newQuizBtn.addEventListener('click', () => this.newQuiz());
        }
    }
    
    selectOption(event) {
        const selectedBtn = event.currentTarget;
        const optionIndex = parseInt(selectedBtn.dataset.option);
        
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        
        // Disable all buttons and show feedback
        this.optionBtns.forEach(btn => {
            btn.classList.remove('selected');
            btn.disabled = true;
        });
        
        selectedBtn.classList.add('selected');
        
        // Check if answer is correct and update score
        if (optionIndex === this.questions[this.currentQuestionIndex].correctAnswer) {
            selectedBtn.classList.add('correct');
            this.score++;
        } else {
            selectedBtn.classList.add('incorrect');
            // Show correct answer
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
            
            // Show previous answers if they exist
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
        
        // Enable next/finish only if current question is answered
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
        if (this.options.showResults) {
            this.showResults();
        }
        this.dispatchEvent('quizCompleted', { score: this.score, total: this.questions.length });
    }
    
    showResults() {
        if (!this.options.showResults) return;
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        this.finalScore.textContent = `${this.score}/${this.questions.length}`;
        this.percentage.textContent = `${percentage}%`;
        
        this.resultsModal.style.display = 'flex';
    }
    
    retryQuiz() {
        if (!this.options.showResults || !this.options.allowRetry) return;
        
        this.resultsModal.style.display = 'none';
        this.resetQuiz();
    }
    
    newQuiz() {
        if (!this.options.showResults) return;
        
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
    
    // Public methods for external control
    setQuestions(questions) {
        this.questions = questions;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.quizCompleted = false;
        this.updateDisplay();
        this.updateScore();
    }
    
    getScore() {
        return { score: this.score, total: this.questions.length, percentage: Math.round((this.score / this.questions.length) * 100) };
    }
    
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }
    
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
}
