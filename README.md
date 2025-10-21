# 🖼️ Image Quiz App - AI-Powered Quiz Generation

A modern web application that generates quiz questions from images using Google's Gemini AI and tracks user progress with Firebase.

## 🚀 Features

### ✅ Core Functionality
- **Image Display**: Interactive image viewer with zoom, pan, and controls
- **AI Quiz Generation**: Uses Google Gemini AI to generate quiz questions from images
- **User Authentication**: Firebase authentication with email/password and Google sign-in
- **Progress Tracking**: Saves quiz attempts, scores, and user progress to Firebase
- **Real-time Updates**: Live progress tracking and leaderboards

### 🎯 Key Features of Image Quiz App
1. **Images Instead of Videos**: More accessible and faster loading
2. **AI-Generated Questions**: Dynamic quiz creation based on image content
3. **Enhanced User Experience**: Better controls and responsive design
4. **Comprehensive Tracking**: Detailed user progress and statistics

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), Web Components, CSS Grid/Flexbox
- **AI Service**: Google Gemini API (free tier)
- **Backend**: Google Firebase (Authentication, Firestore, Storage)
- **Image Processing**: Client-side image handling with zoom/pan functionality

## 📁 Project Structure

```
components/
├── image-player/              # Image display component
│   ├── ImagePlayer.js         # Main image player class
│   ├── image-player.css       # Image player styles
│   └── demo.html              # Image player demo
├── ai-service/                # AI integration
│   ├── gemini-service.js      # Gemini AI service
│   └── demo.html              # AI service demo
├── firebase/                  # Firebase integration
│   ├── firebase-config.js     # Firebase configuration
│   ├── auth-service.js        # Authentication service
│   ├── auth-ui.js             # Authentication UI
│   ├── auth-ui.css            # Auth UI styles
│   ├── quiz-service.js        # Quiz tracking service
│   └── quiz-service-demo.html # Quiz service demo
├── quiz-system/               # Quiz functionality
│   ├── QuizSystem.js          # Quiz system class
│   ├── quiz-system.css        # Quiz styles
│   └── demo.html              # Quiz demo
└── image-quiz-app.html        # Main integrated app
```

## 🧪 Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- Local web server (Python, Node.js, or similar)
- Google account for Gemini API key
- Firebase project (already configured)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd image-quiz-app
   ```

2. **Start a local web server**:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. **Open the main app**:
   ```
   http://localhost:8000
   ```

### Setup Instructions

#### 1. Get Gemini API Key (Required)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" and create a new key
4. Copy the key and set it in the app (it will be prompted on first use)

#### 2. Firebase Configuration (Already Done)
The app is already configured with Firebase:
- **Project ID**: video-quizz
- **Authentication**: Email/password and Google sign-in enabled
- **Firestore**: Database for storing quiz attempts and user progress

## 🎮 How to Use

### Basic Usage
1. **Open the app**: Navigate to `image-quiz-app.html`
2. **Sign in**: Use email/password or Google sign-in
3. **Load an image**: Enter an image URL or click "Load Sample Image"
4. **Generate quiz**: Click "Generate Quiz" to create AI-powered questions
5. **Answer questions**: Complete the quiz and see your score
6. **View progress**: Your progress is automatically saved to Firebase

### Advanced Features
- **Image Controls**: Zoom in/out, pan around zoomed images
- **Keyboard Shortcuts**: + (zoom in), - (zoom out), 0 (reset zoom)
- **Touch Support**: Pinch to zoom, drag to pan on mobile
- **Progress Tracking**: View your quiz history and statistics
- **Leaderboards**: Compete with other users

## 🔧 Component Demos

### Individual Component Testing
- **Image Player**: `components/image-player/demo.html`
- **AI Service**: `components/ai-service/demo.html`
- **Quiz System**: `components/quiz-system/demo.html`
- **Firebase Services**: `components/firebase/quiz-service-demo.html`

### Main App
- **Integrated App**: `index.html` (root level)

## 📊 Firebase Data Structure

### Collections

#### `quiz_attempts`
```javascript
{
  userId: "user123",
  imageUrl: "https://example.com/image.jpg",
  questions: [...],
  userAnswers: [0, 1, 2, 0],
  score: 3,
  totalQuestions: 5,
  percentage: 60,
  timeSpent: 120,
  completedAt: timestamp,
  createdAt: timestamp
}
```

#### `user_progress`
```javascript
{
  totalQuizzes: 10,
  totalScore: 45,
  averageScore: 75,
  bestScore: 100,
  totalTimeSpent: 1200,
  lastQuizDate: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🎨 Customization

### Image Player Options
```javascript
const imagePlayer = new ImagePlayer('containerId', {
    showControls: true,    // Show zoom controls
    allowZoom: true        // Enable zoom functionality
});
```

### Quiz System Options
```javascript
const quizSystem = new QuizSystem('containerId', {
    questions: [],         // Quiz questions array
    showResults: true,    // Show results modal
    allowRetry: true      // Allow quiz retry
});
```

### AI Service Options
```javascript
const questions = await geminiService.generateQuizFromImage(imageUrl, {
    numQuestions: 5,           // Number of questions
    difficulty: 'medium',      // easy, medium, hard
    questionTypes: ['multiple_choice'],
    subject: 'general'         // Subject focus
});
```

## 🔒 Security & Privacy

- **API Keys**: Stored locally in browser localStorage
- **User Data**: Encrypted and stored securely in Firebase
- **Image Processing**: Images are processed client-side, not stored
- **Authentication**: Secure Firebase authentication

## 📱 Responsive Design

The app is fully responsive and works on:
- **Desktop**: Full feature set with keyboard shortcuts
- **Tablet**: Touch-optimized controls
- **Mobile**: Simplified interface with touch gestures

## 🚀 Performance

- **Image Loading**: Optimized image loading with error handling
- **AI Requests**: Efficient API calls with proper error handling
- **Firebase**: Real-time updates with minimal bandwidth usage
- **Caching**: Local storage for API keys and user preferences

## 🐛 Troubleshooting

### Common Issues

1. **"Gemini API key is required"**
   - Get a free API key from Google AI Studio
   - Set it in the app when prompted

2. **"Failed to load image"**
   - Check if the image URL is valid and accessible
   - Try a different image URL

3. **"Authentication failed"**
   - Check Firebase configuration
   - Ensure you're using a supported browser

4. **"Quiz generation failed"**
   - Verify your Gemini API key is correct
   - Check your internet connection
   - Try with a different image

### Debug Mode
Open browser developer tools to see detailed error messages and API responses.

## 🔮 Future Enhancements

- **Multiple AI Providers**: Support for OpenAI, Claude, etc.
- **Quiz Categories**: Subject-specific quiz generation
- **Social Features**: Share quizzes with friends
- **Advanced Analytics**: Detailed performance insights
- **Offline Support**: Work without internet connection
- **Mobile App**: Native mobile applications

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Note**: This app requires a Gemini API key to function. The API key is free and can be obtained from Google AI Studio. Firebase is already configured and ready to use.
