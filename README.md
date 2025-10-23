# 🎯 AI Quiz App

An intelligent image quiz application powered by Google's Gemini AI that creates dynamic quizzes from any image with beautiful animations and real-time scoring.

![AI Quiz App](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-Ready-orange)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Integrated-blue)

## 🌟 What is this app?

The AI Quiz App is an innovative web application that transforms any image into an interactive quiz experience. Simply upload an image or provide an image URL, and our AI will analyze it to generate intelligent, contextual questions about the image content. Perfect for education, training, entertainment, or testing visual comprehension skills.

### ✨ Key Features

- 🤖 **AI-Powered Quiz Generation** - Leverages Google's Gemini AI to create smart, contextual questions
- 🔐 **Secure Authentication** - Firebase Auth integration with Google sign-in
- 💾 **Cloud Storage** - All quiz attempts and progress saved to Firebase Firestore
- 🎨 **Beautiful UI/UX** - Modern design with smooth animations and transitions
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Real-time Scoring** - Instant feedback with progress tracking
- 🚀 **Optimized Performance** - Fast loading and efficient database queries

## � How to Use

### For Users

1. **Sign In**: Click the "Sign in with Google" button to authenticate
2. **Upload Image**: 
   - Click "Choose File" to upload an image from your device, OR
   - Paste an image URL in the provided field
3. **Generate Quiz**: Click "Generate Quiz" and wait for AI to analyze your image
4. **Take Quiz**: Answer the generated questions about your image
5. **View Results**: Get instant feedback and see your score
6. **Track Progress**: All your quiz attempts are automatically saved

### For Developers

#### Prerequisites
- Node.js (v14 or higher)
- A Google Cloud account with Gemini API access
- A Firebase project

#### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nc-markovic/video-quiz.git
   cd ai-quiz-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**
   
   Create your API configuration by following the `API_KEY_SETUP.md` file:
   - Set up Firebase project credentials
   - Obtain Gemini API key from Google AI Studio
   - Configure authentication settings

4. **Start the development server**
   ```bash
   npm start
   ```
   
   The app will be available at `http://localhost:8000`

## 📁 Project Structure

```
ai-quiz-app/
├── index.html                 # Main application entry point
├── package.json              # Project dependencies and scripts
├── API_KEY_SETUP.md          # Setup guide for API keys
├── README.md                 # This file
├── seed.spec.ts              # Test specifications
│
├── components/               # Modular JavaScript components
│   ├── ai-service/          # AI integration layer
│   │   ├── gemini-service-config.js    # Gemini AI configuration
│   │   ├── gemini-service.js           # Gemini API wrapper
│   │   └── multi-ai-service-fixed.js   # Multi-AI service handler
│   │
│   ├── app/                 # Main application logic
│   │   └── main-app.js      # Core app functionality
│   │
│   ├── firebase/            # Firebase integration
│   │   ├── auth-service.js  # Authentication service
│   │   ├── auth-ui.js       # Authentication UI components
│   │   ├── firebase-config.js # Firebase configuration
│   │   └── quiz-service.js  # Quiz data management
│   │
│   ├── image-player/        # Image handling component
│   │   └── ImagePlayer.js   # Image display and management
│   │
│   └── quiz-system/         # Quiz logic and UI
│       └── QuizSystem.js    # Quiz generation and interaction
│
└── styles/                  # Application styling
    └── main.css            # Main stylesheet with animations
```

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup with modern web standards
- **CSS3** - Custom styling with animations and responsive design
- **Vanilla JavaScript** - Pure JS with ES6+ features and modules
- **Web Components** - Modular, reusable component architecture

### Backend Services
- **Firebase Authentication** - Secure user management with Google OAuth
- **Firebase Firestore** - NoSQL cloud database for real-time data
- **Firebase Hosting** - Fast, secure web hosting (optional)

### AI & APIs
- **Google Gemini AI** - Advanced AI for image analysis and quiz generation
- **Google AI Studio** - API management and configuration

### Development Tools
- **Node.js** - Development environment and package management
- **Playwright** - End-to-end testing framework
- **NPM** - Package management and scripts

### Key Features Implementation

#### 🔐 Authentication System
- **Firebase Auth** integration with Google provider
- Secure session management
- User state persistence
- Automatic token refresh

#### 🤖 AI Quiz Generation
- **Gemini Pro Vision** for image analysis
- Dynamic question generation based on image content
- Configurable difficulty levels
- Context-aware question types

#### 🎨 Beautiful UI/UX
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Animations** for smooth transitions
- **Progressive enhancement** for accessibility
- **Mobile-first** responsive design

#### � Data Management
- **Optimized Firestore queries** for fast data retrieval
- **Real-time synchronization** across devices
- **Efficient data structure** for scalability
- **Automatic backup** and version control

#### ⚡ Performance Optimizations
- **Lazy loading** for images and components
- **Code splitting** for faster initial load
- **Efficient DOM manipulation**
- **Optimized Firebase rules** for security and speed

## 🌐 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📱 Mobile Compatibility

Fully responsive design tested on:
- 📱 iPhone (iOS 12+)
- 🤖 Android devices (Android 8+)
- 📟 Tablets and larger screens

## 🔧 Configuration

The app requires minimal configuration:

1. **Firebase Setup** - Follow `API_KEY_SETUP.md`
2. **Gemini API** - Obtain key from Google AI Studio
3. **Environment Variables** - Set in Firebase hosting or your server

## 🚀 Deployment

Ready for deployment to:
- **Firebase Hosting** (recommended)
- **Vercel**
- **Netlify**
- **GitHub Pages**
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues, questions, or contributions:
- 📧 Create an issue on GitHub
- 💬 Check existing discussions
- 📖 Review the API setup guide

---

**Ready to create intelligent quizzes? Get started now!** 🚀

The app is fully functional with Firebase authentication, AI quiz generation, beautiful styling, and optimized performance. Perfect for educators, trainers, or anyone looking to create engaging image-based learning experiences.
