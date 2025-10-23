// Main App Controller
import { ImagePlayer } from '../image-player/ImagePlayer.js';
import { QuizSystem } from '../quiz-system/QuizSystem.js';
import { MultiAIService } from '../ai-service/multi-ai-service-fixed.js';
import { GeminiService } from '../ai-service/gemini-service.js';
import { AuthService } from '../firebase/auth-service.js';
import { QuizService } from '../firebase/quiz-service.js';
import { AuthUI } from '../firebase/auth-ui.js';

export class MainApp {
    constructor() {
        this.currentUser = null;
        this.currentQuizData = null;
        this.quizStartTime = null;
        
        this.sampleImages = [
            'https://picsum.photos/800/600?random=1',
            'https://picsum.photos/800/600?random=2',
            'https://picsum.photos/800/600?random=3',
            'https://picsum.photos/800/600?random=4',
            'https://picsum.photos/800/600?random=5'
        ];
        
        this.initializeServices();
        this.getDOMElements();
        this.setupEventListeners();
        this.setupAuth();
    }
    
    initializeServices() {
        // Initialize image player
        this.imagePlayer = new ImagePlayer('imageContainer', {
            showControls: true,
            allowZoom: false
        });
        
        // Initialize quiz system
        this.quizSystem = new QuizSystem('quizContainer', {
            questions: [],
            showResults: true,
            allowRetry: true
        });
        
        // Initialize AI services
        this.geminiService = new GeminiService();
        
        try {
            const multiAIService = new MultiAIService();
            this.aiService = multiAIService;
            console.log('✅ MultiAIService initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize MultiAIService:', error);
            this.aiService = this.geminiService;
            console.log('🔄 Using GeminiService as fallback');
        }
        
        // Initialize Firebase services
        this.authService = new AuthService();
        this.quizService = new QuizService();
        
        // Initialize auth UI
        this.authUI = new AuthUI('authContainer');
    }
    
    getDOMElements() {
        this.authSection = document.getElementById('authSection');
        this.userInfoSection = document.getElementById('userInfoSection');
        this.userInfoText = document.getElementById('userInfoText');
        this.signOutBtn = document.getElementById('signOutBtn');
        this.imageUrlInput = document.getElementById('imageUrlInput');
        this.loadSampleBtn = document.getElementById('loadSampleBtn');
        this.resetImageBtn = document.getElementById('resetImageBtn');
        this.aiProviderSelect = document.getElementById('aiProvider');
        this.providerStatus = document.getElementById('providerStatus');
        this.imageStatusIndicator = document.getElementById('imageStatusIndicator');
        this.quizStatusIndicator = document.getElementById('quizStatusIndicator');
    }
    
    setupEventListeners() {
        // Button event listeners
        this.loadSampleBtn.addEventListener('click', () => this.loadSampleImage());
        this.resetImageBtn.addEventListener('click', () => this.resetImage());
        this.aiProviderSelect.addEventListener('change', () => this.handleProviderChange());
        this.signOutBtn.addEventListener('click', () => this.signOut());
        
        // Input event listeners
        this.imageUrlInput.addEventListener('input', () => this.handleImageUrlChange());
        
        // Image player event listeners
        this.imagePlayer.addEventListener('imageLoaded', (e) => {
            this.updateImageStatus('success', '✅ Image loaded successfully!');
        });
        
        this.imagePlayer.addEventListener('imageError', (e) => {
            this.updateImageStatus('error', '❌ Failed to load image. Please check the URL.');
        });
        
        // Quiz completion event listener
        document.addEventListener('quizCompleted', (e) => this.handleQuizCompleted(e));
        
        // Initialize provider status
        this.updateProviderStatus();
    }
    
    setupAuth() {
        // Add fallback auth button handlers
        this.setupFallbackAuth();
        
        // Check if AuthUI loaded properly
        setTimeout(() => {
            const authContainer = document.getElementById('authContainer');
            const fallbackAuth = document.getElementById('fallbackAuth');
            
            if (authContainer.children.length <= 1) {
                console.log('AuthUI not loaded, showing fallback auth buttons');
                if (fallbackAuth) {
                    fallbackAuth.style.display = 'flex';
                }
            } else {
                if (fallbackAuth) {
                    fallbackAuth.style.display = 'none';
                }
            }
        }, 1000);
        
        // Auth state change listener
        this.authService.onAuthStateChange((user) => {
            this.currentUser = user;
            if (user) {
                this.showUserInfo(user);
            } else {
                this.showAuthSection();
            }
        });
    }
    
    loadSampleImage() {
        const randomImage = this.sampleImages[Math.floor(Math.random() * this.sampleImages.length)];
        this.imageUrlInput.value = randomImage;
        this.handleImageUrlChange();
    }
    
    resetImage() {
        this.imageUrlInput.value = '';
        this.imagePlayer.reset();
        this.quizSystem.reset();
        this.updateImageStatus('', 'Enter an image URL above');
        this.updateQuizStatus('', 'Quiz questions will be generated automatically');
        this.currentQuizData = null;
    }
    
    async handleImageUrlChange() {
        const imageUrl = this.imageUrlInput.value.trim();
        
        if (imageUrl) {
            this.updateImageStatus('loading', '📥 Loading image...');
            
            try {
                await this.imagePlayer.setImage(imageUrl);
                await this.generateQuizQuestions(imageUrl);
            } catch (error) {
                this.updateImageStatus('error', '❌ Failed to load image. Please check the URL.');
                console.error('Error loading image:', error);
            }
        } else {
            this.resetImage();
        }
    }
    
    async generateQuizQuestions(imageUrl) {
        try {
            this.updateQuizStatus('loading', '🤖 Generating AI quiz questions...');
            this.quizStartTime = Date.now();
            
            const questions = await this.aiService.generateQuestions(imageUrl);
            
            if (questions && questions.length > 0) {
                this.quizSystem.setQuestions(questions);
                
                this.currentQuizData = {
                    imageUrl: imageUrl,
                    questions: questions,
                    userAnswers: new Array(questions.length).fill(null),
                    score: 0,
                    totalQuestions: questions.length,
                    percentage: 0,
                    timeSpent: 0
                };
                
                console.log('✅ Successfully generated AI-powered questions');
                this.updateQuizStatus('success', '✅ AI-generated quiz ready!');
            } else {
                throw new Error('No questions generated');
            }
        } catch (error) {
            console.error('Error generating questions:', error);
            this.updateQuizStatus('error', '❌ Failed to generate quiz questions. Please try again.');
        }
    }
    
    handleQuizCompleted(e) {
        console.log('🎯 Quiz completed event fired:', e.detail);
        const { score, total, userAnswers, questions } = e.detail;
        const percentage = Math.round((score / total) * 100);
        
        console.log('📊 Quiz completion data:', {
            score,
            total,
            percentage,
            userAnswers,
            questionsCount: questions?.length,
            currentUser: this.currentUser ? this.currentUser.uid : 'Not logged in',
            currentQuizData: this.currentQuizData ? 'Present' : 'Missing'
        });
        
        let message = `🎉 Quiz completed! Your score: ${score}/${total} (${percentage}%)`;
        
        if (percentage === 100) {
            message += '\\n🏆 Perfect! You were very observant!';
        } else if (percentage >= 80) {
            message += '\\n🌟 Great job! You paid good attention!';
        } else if (percentage >= 60) {
            message += '\\n👍 Good effort! Maybe watch the image again?';
        } else {
            message += '\\n🤔 You might want to look at the image more carefully next time!';
        }
        
        this.updateQuizStatus('completed', message);
        
        // Add save status message for logged-in users
        if (this.currentUser) {
            setTimeout(() => {
                const answerDetails = userAnswers ? ` (${userAnswers.filter(a => a !== null).length} answers recorded)` : '';
                this.updateQuizStatus('completed', message + `\\n💾 Saving your result to your account...${answerDetails}`);
            }, 1000);
        } else {
            setTimeout(() => {
                this.updateQuizStatus('completed', message + '\\n⚠️ Sign in to save your progress and track your improvement!');
            }, 1000);
        }
        
        // Update quiz data for saving
        if (this.currentQuizData) {
            this.currentQuizData.score = score;
            this.currentQuizData.percentage = percentage;
            this.currentQuizData.userAnswers = userAnswers || new Array(total).fill(null);
            this.currentQuizData.questions = questions || this.currentQuizData.questions;
            
            if (this.quizStartTime) {
                this.currentQuizData.timeSpent = Math.round((Date.now() - this.quizStartTime) / 1000);
            }
            
            console.log('🎯 About to call saveQuizResult() FROM MAIN EVENT HANDLER');
            this.saveQuizResult();
        }
    }
    
    async saveQuizResult() {
        console.log('🟢 saveQuizResult() FUNCTION STARTED');
        console.log('🔄 saveQuizResult() called');
        console.log('Current user:', this.currentUser ? this.currentUser.uid : 'None');
        console.log('Current quiz data:', this.currentQuizData);
        
        if (!this.currentUser) {
            console.log('❌ Cannot save quiz result: User not logged in');
            alert('Please sign in first to save quiz results');
            return;
        }
        
        if (!this.currentQuizData) {
            console.log('❌ Cannot save quiz result: No quiz data available');
            alert('Please complete a quiz first');
            return;
        }
        
        if (!this.currentQuizData.imageUrl || !this.currentQuizData.questions) {
            console.log('❌ Invalid quiz data structure:', this.currentQuizData);
            alert('Invalid quiz data - please generate a new quiz');
            return;
        }
        
        try {
            this.updateQuizStatus('saving', '💾 Saving your quiz result...');
            
            const formattedQuizData = {
                imageUrl: this.currentQuizData.imageUrl,
                questions: this.currentQuizData.questions,
                userAnswers: this.currentQuizData.userAnswers,
                score: this.currentQuizData.score,
                totalQuestions: this.currentQuizData.totalQuestions,
                percentage: this.currentQuizData.percentage,
                timeSpent: this.currentQuizData.timeSpent,
                timestamp: new Date().toISOString(),
                quizType: 'image-based'
            };
            
            console.log('🔍 currentQuizData before formatting:', this.currentQuizData);
            console.log('🔍 formattedQuizData after formatting:', formattedQuizData);
            console.log('💾 Saving formatted quiz data:', formattedQuizData);
            
            const userName = this.currentUser.displayName || this.currentUser.email || 'Anonymous User';
            
            console.log('🚨 IMMEDIATELY AFTER userName ASSIGNMENT:');
            console.log('🚨 currentUser.displayName:', this.currentUser.displayName);
            console.log('🚨 currentUser.email:', this.currentUser.email);
            console.log('🚨 userName assigned:', userName, typeof userName);
            
            console.log('🔍 Final check before calling saveQuizAttempt:');
            console.log('  userId:', this.currentUser.uid, typeof this.currentUser.uid);
            console.log('  userName:', userName, typeof userName);
            console.log('  formattedQuizData:', formattedQuizData, typeof formattedQuizData);
            console.log('  formattedQuizData.imageUrl:', formattedQuizData?.imageUrl);
            console.log('  formattedQuizData.questions:', formattedQuizData?.questions);
            
            if (!this.currentUser.uid) {
                console.error('❌ userId is missing!');
                return;
            }
            if (!userName) {
                console.error('❌ userName is missing!');
                return;
            }
            if (!formattedQuizData) {
                console.error('❌ formattedQuizData is missing!');
                return;
            }
            
            console.log('🚨 EXACT CALL TRACE - Parameters about to be passed:');
            console.log('🚨 Parameter 1 (userId):', this.currentUser.uid, 'Type:', typeof this.currentUser.uid);
            console.log('🚨 Parameter 2 (userName):', userName, 'Type:', typeof userName);
            console.log('🚨 Parameter 3 (formattedQuizData):', formattedQuizData, 'Type:', typeof formattedQuizData);
            
            const result = await this.quizService.saveQuizAttempt(this.currentUser.uid, userName, formattedQuizData);
            console.log('📤 Firebase save result:', result);
            
            if (result.success) {
                console.log('Quiz result saved successfully!');
                const detailedMessage = `✅ Quiz result saved to your account!\\n` +
                                      `📊 Score: ${formattedQuizData.score}/${formattedQuizData.totalQuestions} (${formattedQuizData.percentage}%)\\n` +
                                      `⏱️ Time: ${formattedQuizData.timeSpent} seconds\\n` +
                                      `🔢 Attempt #${result.attemptNumber}`;
                
                this.updateQuizStatus('success', detailedMessage);
                
                setTimeout(() => {
                    this.updateQuizStatus('completed', `🎉 Quiz completed! Your score: ${formattedQuizData.score}/${formattedQuizData.totalQuestions} (${formattedQuizData.percentage}%)\\n✅ Saved to your account!`);
                }, 3000);
            } else {
                console.error('Failed to save quiz result:', result.message);
                this.updateQuizStatus('error', `❌ Failed to save quiz result: ${result.message || 'Unknown error'}\\n🔄 You can try again by completing another quiz.`);
            }
            
        } catch (error) {
            console.error('Error saving quiz result:', error);
            this.updateQuizStatus('error', `❌ Error saving quiz result: ${error.message}\\n🔄 Please try again.`);
        }
    }
    
    handleProviderChange() {
        this.updateProviderStatus();
    }
    
    updateProviderStatus() {
        const selectedProvider = this.aiProviderSelect.value;
        
        if (selectedProvider === 'gemini') {
            this.providerStatus.textContent = '✅ Available';
            this.providerStatus.style.color = '#48bb78';
        } else {
            this.providerStatus.textContent = '❌ Not Available';
            this.providerStatus.style.color = '#ef4444';
        }
    }
    
    showUserInfo(user) {
        this.authSection.classList.add('hidden');
        this.userInfoSection.classList.remove('hidden');
        this.userInfoText.textContent = `Signed in as ${user.displayName || user.email}`;
    }
    
    showAuthSection() {
        this.authSection.classList.remove('hidden');
        this.userInfoSection.classList.add('hidden');
    }
    
    async signOut() {
        try {
            await this.authService.signOut();
            this.showAuthSection();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }
    
    setupFallbackAuth() {
        // Implementation for fallback auth handlers
        // This would include modal and form handling logic
    }
    
    updateImageStatus(type, message) {
        this.imageStatusIndicator.className = `status-indicator ${type}`;
        this.imageStatusIndicator.innerHTML = `<span>${message}</span>`;
        this.imageStatusIndicator.classList.remove('hidden');
    }
    
    updateQuizStatus(type, message) {
        this.quizStatusIndicator.className = `status-indicator ${type}`;
        this.quizStatusIndicator.innerHTML = `<span>${message}</span>`;
        this.quizStatusIndicator.classList.remove('hidden');
    }
    
    // Initialize the app
    init() {
        this.loadSampleImage();
        console.log('🚀 Main App initialized successfully');
    }
}