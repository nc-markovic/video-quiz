# 🎥 Video Quiz App with Firebase

A full-stack video quiz application built with modern web technologies and Google Firebase.

## � Quick Start - API Setup

**For AI-powered Image Quiz features**: See [API_KEY_SETUP.md](./API_KEY_SETUP.md) for instructions on getting your free Gemini API key.

**To try immediately**: Use the Video Quiz feature which works without any API keys!

## �🚀 Features

### ✅ Phase 1: Firebase Setup & Authentication (COMPLETED)
- **Email/Password Authentication** - User registration and login
- **User Profile Management** - Display user information and sign out
- **Form Validation** - Input validation and error handling
- **Responsive Design** - Works on all device sizes
- **Firebase Integration** - Real-time authentication with Firebase

### 🔄 Phase 2: Firebase Project Setup (COMPLETED)
- **Real Firebase Project** - Connected to actual Firebase services
- **Production Configuration** - Real Firebase credentials and settings
- **Free Plan Optimization** - Optimized for Firebase free "Spark" plan
- **Authentication Testing** - Fully tested email/password authentication

### ⏳ Upcoming Phases
- **Phase 3**: Firestore Database Integration
- **Phase 4**: Video Upload and Management
- **Phase 5**: Quiz Creation and Management
- **Phase 6**: User Progress Tracking
- **Phase 7**: Deployment and Hosting

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), Web Components, CSS Grid/Flexbox
- **Backend**: Google Firebase (Authentication, Firestore, Storage, Hosting)
- **Build Tools**: Vite, ESBuild, PostCSS
- **State Management**: Custom Event System, Local Storage, IndexedDB
- **UI/UX**: Modern CSS, Responsive Design
- **Data Architecture**: Firestore collections for users, videos, quizzes, quiz attempts

## 📁 Project Structure

```
components/
├── firebase/
│   ├── firebase-config.js      # Firebase initialization
│   ├── auth-service.js         # Authentication service
│   ├── auth-ui.js             # Authentication UI component
│   ├── auth-ui.css            # Authentication styles
│   └── auth-demo.html         # Demo page
├── video-player/              # Video player component
├── quiz-system/               # Quiz system component
└── video-quiz-app.html        # Integrated app
```

## 🧪 Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- Local web server (Python, Node.js, or similar)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/nc-markovic/video-quiz.git
   cd video-quiz
   ```

2. Start a local web server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Open the demo:
   ```
   http://localhost:8000/components/firebase/auth-demo.html
   ```

## 🔐 Authentication Demo

The authentication system is fully functional and includes:

- **User Registration** - Create new accounts with email/password
- **User Login** - Sign in with existing accounts
- **User Profile** - Display user information and sign out
- **Form Validation** - Real-time input validation
- **Error Handling** - User-friendly error messages

### Test the Authentication
1. Open `http://localhost:8000/components/firebase/auth-demo.html`
2. Click "Create Account" to register a new user
3. Sign in with your credentials
4. View your user profile
5. Test sign out functionality

## 🔧 Firebase Configuration

The app is configured to work with Firebase free plan:

- **Authentication**: Email/password only (free tier)
- **Database**: Firestore (free tier)
- **Storage**: Firebase Storage (free tier)
- **Hosting**: Firebase Hosting (free tier)

## 📝 Development Progress

### Phase 1: Firebase Setup & Authentication ✅
- [x] Firebase project configuration
- [x] Authentication service implementation
- [x] UI components for login/register/profile
- [x] Form validation and error handling
- [x] Responsive design implementation

### Phase 2: Firebase Project Setup ✅
- [x] Real Firebase project connection
- [x] Production configuration
- [x] Free plan optimization
- [x] Authentication testing and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for providing excellent backend services
- Modern web standards for making this possible
- The open-source community for inspiration and tools

---

**Last Updated**: December 2024  
**Current Phase**: Phase 2 Complete - Ready for Phase 3 (Firestore Integration)
