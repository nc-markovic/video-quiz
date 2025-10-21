import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc,
    setDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit,
    serverTimestamp,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';

export class QuizService {
    constructor() {
        this.quizzesCollection = 'quizzes';
        this.quizAttemptsCollection = 'quiz_attempts';
        this.userProgressCollection = 'user_progress';
    }
    
    // Save a quiz attempt
    async saveQuizAttempt(userId, quizData) {
        try {
            const attemptData = {
                userId: userId,
                imageUrl: quizData.imageUrl,
                questions: quizData.questions,
                userAnswers: quizData.userAnswers,
                score: quizData.score,
                totalQuestions: quizData.totalQuestions,
                percentage: quizData.percentage,
                timeSpent: quizData.timeSpent || 0,
                completedAt: serverTimestamp(),
                createdAt: serverTimestamp()
            };
            
            const docRef = await addDoc(collection(db, this.quizAttemptsCollection), attemptData);
            
            // Update user progress
            await this.updateUserProgress(userId, quizData);
            
            return {
                success: true,
                attemptId: docRef.id,
                message: 'Quiz attempt saved successfully'
            };
            
        } catch (error) {
            console.error('Error saving quiz attempt:', error);
            return {
                success: false,
                error: error.message,
                message: 'Failed to save quiz attempt'
            };
        }
    }
    
    // Update user progress
    async updateUserProgress(userId, quizData) {
        try {
            const progressRef = doc(db, this.userProgressCollection, userId);
            const progressDoc = await getDoc(progressRef);
            
            const currentProgress = progressDoc.exists() ? progressDoc.data() : {
                totalQuizzes: 0,
                totalScore: 0,
                averageScore: 0,
                bestScore: 0,
                totalTimeSpent: 0,
                lastQuizDate: null,
                createdAt: serverTimestamp()
            };
            
            const newTotalQuizzes = currentProgress.totalQuizzes + 1;
            const newTotalScore = currentProgress.totalScore + quizData.score;
            const newAverageScore = Math.round(newTotalScore / newTotalQuizzes);
            const newBestScore = Math.max(currentProgress.bestScore, quizData.percentage);
            const newTotalTimeSpent = currentProgress.totalTimeSpent + (quizData.timeSpent || 0);
            
            const updatedProgress = {
                totalQuizzes: newTotalQuizzes,
                totalScore: newTotalScore,
                averageScore: newAverageScore,
                bestScore: newBestScore,
                totalTimeSpent: newTotalTimeSpent,
                lastQuizDate: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            
            // If document doesn't exist, add createdAt timestamp
            if (!progressDoc.exists()) {
                updatedProgress.createdAt = serverTimestamp();
            }
            
            // Use setDoc with merge to create or update the document
            await setDoc(progressRef, updatedProgress, { merge: true });
            
            return {
                success: true,
                message: 'User progress updated successfully'
            };
            
        } catch (error) {
            console.error('Error updating user progress:', error);
            return {
                success: false,
                error: error.message,
                message: 'Failed to update user progress'
            };
        }
    }
    
    // Get user's quiz attempts
    async getUserQuizAttempts(userId, limitCount = 10) {
        try {
            const q = query(
                collection(db, this.quizAttemptsCollection),
                where('userId', '==', userId),
                orderBy('completedAt', 'desc'),
                limit(limitCount)
            );
            
            const querySnapshot = await getDocs(q);
            const attempts = [];
            
            querySnapshot.forEach((doc) => {
                attempts.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return {
                success: true,
                attempts: attempts,
                message: 'Quiz attempts retrieved successfully'
            };
            
        } catch (error) {
            console.error('Error getting user quiz attempts:', error);
            return {
                success: false,
                error: error.message,
                attempts: [],
                message: 'Failed to retrieve quiz attempts'
            };
        }
    }
    
    // Get user progress
    async getUserProgress(userId) {
        try {
            const progressRef = doc(db, this.userProgressCollection, userId);
            const progressDoc = await getDoc(progressRef);
            
            if (progressDoc.exists()) {
                return {
                    success: true,
                    progress: progressDoc.data(),
                    message: 'User progress retrieved successfully'
                };
            } else {
                // Create initial progress if it doesn't exist
                const initialProgress = {
                    totalQuizzes: 0,
                    totalScore: 0,
                    averageScore: 0,
                    bestScore: 0,
                    totalTimeSpent: 0,
                    lastQuizDate: null,
                    createdAt: serverTimestamp()
                };
                
                await updateDoc(progressRef, initialProgress);
                
                return {
                    success: true,
                    progress: initialProgress,
                    message: 'Initial progress created'
                };
            }
            
        } catch (error) {
            console.error('Error getting user progress:', error);
            return {
                success: false,
                error: error.message,
                progress: null,
                message: 'Failed to retrieve user progress'
            };
        }
    }
    
    // Get leaderboard (top users by average score)
    async getLeaderboard(limitCount = 10) {
        try {
            const q = query(
                collection(db, this.userProgressCollection),
                orderBy('averageScore', 'desc'),
                limit(limitCount)
            );
            
            const querySnapshot = await getDocs(q);
            const leaderboard = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                leaderboard.push({
                    userId: doc.id,
                    averageScore: data.averageScore,
                    totalQuizzes: data.totalQuizzes,
                    bestScore: data.bestScore,
                    totalTimeSpent: data.totalTimeSpent
                });
            });
            
            return {
                success: true,
                leaderboard: leaderboard,
                message: 'Leaderboard retrieved successfully'
            };
            
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            return {
                success: false,
                error: error.message,
                leaderboard: [],
                message: 'Failed to retrieve leaderboard'
            };
        }
    }
    
    // Get quiz statistics
    async getQuizStatistics() {
        try {
            const attemptsQuery = query(collection(db, this.quizAttemptsCollection));
            const progressQuery = query(collection(db, this.userProgressCollection));
            
            const [attemptsSnapshot, progressSnapshot] = await Promise.all([
                getDocs(attemptsQuery),
                getDocs(progressQuery)
            ]);
            
            let totalAttempts = 0;
            let totalScore = 0;
            let totalQuestions = 0;
            let totalTimeSpent = 0;
            
            attemptsSnapshot.forEach((doc) => {
                const data = doc.data();
                totalAttempts++;
                totalScore += data.score;
                totalQuestions += data.totalQuestions;
                totalTimeSpent += data.timeSpent || 0;
            });
            
            const averageScore = totalAttempts > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
            const totalUsers = progressSnapshot.size;
            const averageTimePerQuiz = totalAttempts > 0 ? Math.round(totalTimeSpent / totalAttempts) : 0;
            
            return {
                success: true,
                statistics: {
                    totalAttempts,
                    totalUsers,
                    averageScore,
                    averageTimePerQuiz,
                    totalTimeSpent
                },
                message: 'Quiz statistics retrieved successfully'
            };
            
        } catch (error) {
            console.error('Error getting quiz statistics:', error);
            return {
                success: false,
                error: error.message,
                statistics: null,
                message: 'Failed to retrieve quiz statistics'
            };
        }
    }
    
    // Listen to user progress changes (real-time updates)
    onUserProgressChange(userId, callback) {
        const progressRef = doc(db, this.userProgressCollection, userId);
        
        return onSnapshot(progressRef, (doc) => {
            if (doc.exists()) {
                callback({
                    success: true,
                    progress: doc.data(),
                    message: 'User progress updated'
                });
            } else {
                callback({
                    success: false,
                    progress: null,
                    message: 'User progress not found'
                });
            }
        }, (error) => {
            console.error('Error listening to user progress:', error);
            callback({
                success: false,
                error: error.message,
                progress: null,
                message: 'Failed to listen to user progress'
            });
        });
    }
    
    // Listen to user quiz attempts (real-time updates)
    onUserQuizAttemptsChange(userId, callback, limitCount = 10) {
        const q = query(
            collection(db, this.quizAttemptsCollection),
            where('userId', '==', userId),
            orderBy('completedAt', 'desc'),
            limit(limitCount)
        );
        
        return onSnapshot(q, (querySnapshot) => {
            const attempts = [];
            querySnapshot.forEach((doc) => {
                attempts.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            callback({
                success: true,
                attempts: attempts,
                message: 'Quiz attempts updated'
            });
        }, (error) => {
            console.error('Error listening to quiz attempts:', error);
            callback({
                success: false,
                error: error.message,
                attempts: [],
                message: 'Failed to listen to quiz attempts'
            });
        });
    }
    
    // Delete a quiz attempt
    async deleteQuizAttempt(attemptId) {
        try {
            const attemptRef = doc(db, this.quizAttemptsCollection, attemptId);
            await updateDoc(attemptRef, {
                deleted: true,
                deletedAt: serverTimestamp()
            });
            
            return {
                success: true,
                message: 'Quiz attempt deleted successfully'
            };
            
        } catch (error) {
            console.error('Error deleting quiz attempt:', error);
            return {
                success: false,
                error: error.message,
                message: 'Failed to delete quiz attempt'
            };
        }
    }
    
    // Get quiz attempt by ID
    async getQuizAttempt(attemptId) {
        try {
            const attemptRef = doc(db, this.quizAttemptsCollection, attemptId);
            const attemptDoc = await getDoc(attemptRef);
            
            if (attemptDoc.exists()) {
                return {
                    success: true,
                    attempt: {
                        id: attemptDoc.id,
                        ...attemptDoc.data()
                    },
                    message: 'Quiz attempt retrieved successfully'
                };
            } else {
                return {
                    success: false,
                    attempt: null,
                    message: 'Quiz attempt not found'
                };
            }
            
        } catch (error) {
            console.error('Error getting quiz attempt:', error);
            return {
                success: false,
                error: error.message,
                attempt: null,
                message: 'Failed to retrieve quiz attempt'
            };
        }
    }
}

// Create and export singleton instance
export const quizService = new QuizService();
