import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';

export class QuizService {
    constructor() {
        this.quizAttemptsCollection = 'quiz_attempts';
    }
    
    // Get the next attempt number for a user
    async getNextAttemptNumber(userId) {
        try {
            // Simplified query - get all attempts for user and count them
            const q = query(
                collection(db, this.quizAttemptsCollection),
                where('userId', '==', userId)
            );
            
            const querySnapshot = await getDocs(q);
            
            // Return the count + 1 for next attempt number
            return querySnapshot.size + 1;
            
        } catch (error) {
            console.error('Error getting next attempt number:', error);
            return 1; // Default to first attempt on error
        }
    }
    
    // Save a quiz attempt with numbered naming
    async saveQuizAttempt(userId, userName, quizData) {
        try {
            console.log('� FIREBASE SERVICE RECEIVED:');
            console.log('🚨 Parameter 1 (userId):', userId, 'Type:', typeof userId);
            console.log('🚨 Parameter 2 (userName):', userName, 'Type:', typeof userName);  
            console.log('🚨 Parameter 3 (quizData):', quizData, 'Type:', typeof quizData);
            
            console.log('�🔍 saveQuizAttempt called with parameters:', {
                userId: userId,
                userName: userName,
                quizData: quizData,
                userIdType: typeof userId,
                userNameType: typeof userName,
                quizDataType: typeof quizData
            });
            
            // Validate input parameters
            if (!userId) {
                throw new Error('userId is required but was: ' + userId);
            }
            
            if (!userName) {
                throw new Error('userName is required but was: ' + userName);
            }
            
            if (!quizData) {
                throw new Error('quizData is required but was: ' + quizData);
            }
            
            if (!quizData.imageUrl) {
                throw new Error('quizData.imageUrl is required but was: ' + quizData.imageUrl);
            }
            
            if (!quizData.questions || !Array.isArray(quizData.questions)) {
                throw new Error('quizData.questions must be an array but was: ' + typeof quizData.questions);
            }
            
            console.log('🔄 Saving quiz attempt for user:', userId);
            console.log('📊 Quiz data:', {
                imageUrl: quizData.imageUrl,
                questionsCount: quizData.questions?.length,
                score: quizData.score,
                totalQuestions: quizData.totalQuestions
            });
            
            const attemptNumber = await this.getNextAttemptNumber(userId);
            const documentId = `${userId}_attempt${attemptNumber}`;
            
            console.log('📝 Creating document:', documentId);
            
            const attemptData = {
                userId: userId,
                userName: userName,
                attemptNumber: attemptNumber,
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
            
            // Use setDoc with custom document ID
            await setDoc(doc(db, this.quizAttemptsCollection, documentId), attemptData);
            
            return {
                success: true,
                attemptId: documentId,
                attemptNumber: attemptNumber,
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
    
    // Get user's quiz attempts
    async getUserQuizAttempts(userId, limitCount = 10) {
        try {
            const q = query(
                collection(db, this.quizAttemptsCollection),
                where('userId', '==', userId),
                orderBy('attemptNumber', 'desc'),
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
    
    // Calculate user progress from all attempts
    async getUserProgress(userId) {
        try {
            const q = query(
                collection(db, this.quizAttemptsCollection),
                where('userId', '==', userId),
                orderBy('attemptNumber', 'asc')
            );
            
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                return {
                    success: true,
                    progress: {
                        userName: 'Unknown User',
                        totalQuizzes: 0,
                        totalScore: 0,
                        averageScore: 0,
                        bestScore: 0,
                        totalTimeSpent: 0,
                        lastQuizDate: null,
                        attempts: []
                    },
                    message: 'No quiz attempts found'
                };
            }
            
            let totalQuizzes = 0;
            let totalScore = 0;
            let bestScore = 0;
            let totalTimeSpent = 0;
            let lastQuizDate = null;
            let userName = 'Unknown User';
            const attempts = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                totalQuizzes++;
                totalScore += data.score || 0;
                bestScore = Math.max(bestScore, data.percentage || 0);
                totalTimeSpent += data.timeSpent || 0;
                
                if (data.completedAt && (!lastQuizDate || data.completedAt > lastQuizDate)) {
                    lastQuizDate = data.completedAt;
                }
                
                if (data.userName) {
                    userName = data.userName;
                }
                
                attempts.push({
                    id: doc.id,
                    attemptNumber: data.attemptNumber,
                    score: data.score,
                    percentage: data.percentage,
                    timeSpent: data.timeSpent,
                    completedAt: data.completedAt,
                    imageUrl: data.imageUrl
                });
            });
            
            const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
            
            return {
                success: true,
                progress: {
                    userName: userName,
                    totalQuizzes: totalQuizzes,
                    totalScore: totalScore,
                    averageScore: averageScore,
                    bestScore: bestScore,
                    totalTimeSpent: totalTimeSpent,
                    lastQuizDate: lastQuizDate,
                    attempts: attempts.sort((a, b) => b.attemptNumber - a.attemptNumber)
                },
                message: 'User progress calculated successfully'
            };
            
        } catch (error) {
            console.error('Error calculating user progress:', error);
            return {
                success: false,
                error: error.message,
                progress: null,
                message: 'Failed to calculate user progress'
            };
        }
    }
    
    // Get leaderboard (top users by average score)
    async getLeaderboard(limitCount = 10) {
        try {
            // Get all quiz attempts
            const q = query(
                collection(db, this.quizAttemptsCollection),
                orderBy('userId', 'asc')
            );
            
            const querySnapshot = await getDocs(q);
            const userStats = {};
            
            // Calculate stats for each user
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const userId = data.userId;
                
                if (!userStats[userId]) {
                    userStats[userId] = {
                        userId: userId,
                        userName: data.userName || 'Unknown User',
                        totalQuizzes: 0,
                        totalScore: 0,
                        bestScore: 0,
                        totalTimeSpent: 0
                    };
                }
                
                userStats[userId].totalQuizzes++;
                userStats[userId].totalScore += data.score || 0;
                userStats[userId].bestScore = Math.max(userStats[userId].bestScore, data.percentage || 0);
                userStats[userId].totalTimeSpent += data.timeSpent || 0;
            });
            
            // Convert to array and calculate average scores
            const leaderboard = Object.values(userStats).map(user => ({
                ...user,
                averageScore: user.totalQuizzes > 0 ? Math.round(user.totalScore / user.totalQuizzes) : 0
            }));
            
            // Sort by average score (descending) and limit results
            leaderboard.sort((a, b) => b.averageScore - a.averageScore);
            
            return {
                success: true,
                leaderboard: leaderboard.slice(0, limitCount),
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
