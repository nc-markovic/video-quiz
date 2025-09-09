export class AuthUI {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.currentView = 'login'; // 'login', 'register', 'profile'
    
    if (!this.container) {
      throw new Error(`Container with ID '${containerId}' not found`);
    }
  }

  // Render the authentication interface
  render() {
    this.container.innerHTML = `
      <div class="auth-container">
        <div class="auth-header">
          <h2 class="auth-title">🎥 Video Quiz App</h2>
          <p class="auth-subtitle">Sign in to track your progress and achievements</p>
        </div>
        
        <div class="auth-content">
          <div id="authForms"></div>
          <div id="userProfile" style="display: none;"></div>
        </div>
      </div>
    `;

    this.authForms = this.container.querySelector('#authForms');
    this.userProfile = this.container.querySelector('#userProfile');
    
    this.showLoginForm();
  }

  // Show login form
  showLoginForm() {
    this.currentView = 'login';
    this.authForms.innerHTML = `
      <form class="auth-form" id="loginForm">
        <h3 class="form-title">Sign In</h3>
        
        <div class="form-group">
          <label for="loginEmail">Email</label>
          <input type="email" id="loginEmail" required placeholder="Enter your email">
        </div>
        
        <div class="form-group">
          <label for="loginPassword">Password</label>
          <input type="password" id="loginPassword" required placeholder="Enter your password">
        </div>
        
        <button type="submit" class="auth-btn primary">Sign In</button>
        
        <div class="auth-divider">
          <span>or</span>
        </div>
        
        <button type="button" class="auth-btn google" id="googleSignIn">
          <span class="google-icon">🔍</span>
          Sign in with Google
        </button>
        
        <div class="auth-links">
          <button type="button" class="link-btn" id="showRegister">Don't have an account? Sign up</button>
        </div>
      </form>
    `;

    this.bindLoginEvents();
  }

  // Show registration form
  showRegisterForm() {
    this.currentView = 'register';
    this.authForms.innerHTML = `
      <form class="auth-form" id="registerForm">
        <h3 class="form-title">Create Account</h3>
        
        <div class="form-group">
          <label for="registerName">Display Name</label>
          <input type="text" id="registerName" required placeholder="Enter your name">
        </div>
        
        <div class="form-group">
          <label for="registerEmail">Email</label>
          <input type="email" id="registerEmail" required placeholder="Enter your email">
        </div>
        
        <div class="form-group">
          <label for="registerPassword">Password</label>
          <input type="password" id="registerPassword" required placeholder="Create a password (min 6 chars)">
        </div>
        
        <button type="submit" class="auth-btn primary">Create Account</button>
        
        <div class="auth-links">
          <button type="button" class="link-btn" id="showLogin">Already have an account? Sign in</button>
        </div>
      </form>
    `;

    this.bindRegisterEvents();
  }

  // Show user profile
  showUserProfile(user) {
    this.currentView = 'profile';
    this.authForms.style.display = 'none';
    this.userProfile.style.display = 'block';
    
    this.userProfile.innerHTML = `
      <div class="profile-container">
        <div class="profile-header">
          <div class="profile-avatar">
            ${user.photoURL ? `<img src="${user.photoURL}" alt="Profile">` : '👤'}
          </div>
          <div class="profile-info">
            <h3 class="profile-name">${user.displayName || 'User'}</h3>
            <p class="profile-email">${user.email}</p>
            <p class="profile-joined">Member since ${new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="auth-btn secondary" id="signOutBtn">Sign Out</button>
        </div>
      </div>
    `;

    this.bindProfileEvents();
  }

  // Bind login form events
  bindLoginEvents() {
    const loginForm = this.container.querySelector('#loginForm');
    const googleSignIn = this.container.querySelector('#googleSignIn');
    const showRegister = this.container.querySelector('#showRegister');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    googleSignIn.addEventListener('click', () => {
      this.handleGoogleSignIn();
    });

    showRegister.addEventListener('click', () => {
      this.showRegisterForm();
    });
  }

  // Bind registration form events
  bindRegisterEvents() {
    const registerForm = this.container.querySelector('#registerForm');
    const showLogin = this.container.querySelector('#showLogin');

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    showLogin.addEventListener('click', () => {
      this.showLoginForm();
    });
  }

  // Bind profile events
  bindProfileEvents() {
    const signOutBtn = this.container.querySelector('#signOutBtn');
    
    signOutBtn.addEventListener('click', () => {
      this.handleSignOut();
    });
  }

  // Handle login
  async handleLogin() {
    const email = this.container.querySelector('#loginEmail').value;
    const password = this.container.querySelector('#loginPassword').value;

    if (!email || !password) {
      this.showMessage('Please fill in all fields.', 'error');
      return;
    }

    try {
      // Import auth service dynamically to avoid circular dependencies
      const { authService } = await import('./auth-service.js');
      const result = await authService.signIn(email, password);
      
      if (result.success) {
        this.showMessage('Login successful!', 'success');
      } else {
        this.showMessage(result.message, 'error');
      }
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  // Handle registration
  async handleRegister() {
    const name = this.container.querySelector('#registerName').value;
    const email = this.container.querySelector('#registerEmail').value;
    const password = this.container.querySelector('#registerPassword').value;

    if (!name || !email || !password) {
      this.showMessage('Please fill in all fields.', 'error');
      return;
    }

    if (password.length < 6) {
      this.showMessage('Password must be at least 6 characters long.', 'error');
      return;
    }

    try {
      // Import auth service dynamically to avoid circular dependencies
      const { authService } = await import('./auth-service.js');
      const result = await authService.register(email, password, name);
      
      if (result.success) {
        this.showMessage('Registration successful!', 'success');
      } else {
        this.showMessage(result.message, 'error');
      }
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  // Handle Google sign in
  async handleGoogleSignIn() {
    try {
      // Import auth service dynamically to avoid circular dependencies
      const { authService } = await import('./auth-service.js');
      const result = await authService.signInWithGoogle();
      
      if (result.success) {
        this.showMessage('Google sign-in successful!', 'success');
      } else {
        this.showMessage(result.message, 'error');
      }
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  // Handle sign out
  async handleSignOut() {
    try {
      // This will be implemented when we connect the auth service
      this.showMessage('Sign out will be implemented in the next step!', 'info');
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  // Show message to user
  showMessage(message, type = 'info') {
    // Remove existing message
    const existingMessage = this.container.querySelector('.auth-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `auth-message ${type}`;
    messageEl.textContent = message;

    // Insert after header
    const header = this.container.querySelector('.auth-header');
    header.after(messageEl);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 5000);
  }

  // Update UI based on authentication state
  updateAuthState(user) {
    if (user) {
      this.showUserProfile(user);
    } else {
      this.authForms.style.display = 'block';
      this.userProfile.style.display = 'none';
      this.showLoginForm();
    }
  }
}
