import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

export class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.setupAuthStateListener();
  }

  // Setup authentication state listener
  setupAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.notifyAuthStateChange(user);
    });
  }

  // Register new user with email/password
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      return {
        success: true,
        user: userCredential.user,
        message: 'Registration successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign in with email/password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        message: 'Sign in successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      
      // Configure the provider for better popup handling
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Add additional scopes if needed
      provider.addScope('email');
      provider.addScope('profile');
      
      // Try popup first, fallback to redirect if COOP blocks it
      try {
        const userCredential = await signInWithPopup(auth, provider);
        return {
          success: true,
          user: userCredential.user,
          message: 'Google sign in successful!'
        };
      } catch (popupError) {
        // If popup fails due to COOP, try redirect method
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.message.includes('Cross-Origin-Opener-Policy') ||
            popupError.message.includes('COOP')) {
          
          // Use redirect method as fallback
          await signInWithRedirect(auth, provider);
          return {
            success: true,
            user: null, // Will be handled by auth state change
            message: 'Redirecting to Google sign-in...'
          };
        }
        throw popupError;
      }
    } catch (error) {
      // Handle specific popup errors
      if (error.code === 'auth/popup-closed-by-user') {
        return {
          success: false,
          error: error.message,
          message: 'Sign-in was cancelled. Please try again.'
        };
      } else if (error.code === 'auth/popup-blocked') {
        return {
          success: false,
          error: error.message,
          message: 'Popup was blocked. Please allow popups for this site and try again.'
        };
      } else if (error.code === 'auth/cancelled-popup-request') {
        return {
          success: false,
          error: error.message,
          message: 'Sign-in was cancelled. Please try again.'
        };
      }
      
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Sign out successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Sign out failed. Please try again.'
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Add auth state change listener
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of auth state change
  notifyAuthStateChange(user) {
    this.authStateListeners.forEach(callback => {
      try {
        callback(user);
      } catch (error) {
        console.error('Auth state listener error:', error);
      }
    });
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/network-request-failed': 'Network error. Please check your connection.'
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }
}

// Create and export singleton instance
export const authService = new AuthService();
