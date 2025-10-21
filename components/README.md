# Image Quiz App - Component Architecture# Image Quiz App - Component Architecture# Video Quiz App - Component Architecture



This project is structured using a modular component-based approach, making it easy to maintain, test, and integrate components for image-based quiz generation.



## 📁 Component StructureThis project is structured using a modular component-based approach, making it easy to maintain, test, and integrate components for image-based quiz generation.This project is structured using a modular component-based approach, making it easy to maintain, test, and integrate components.



```

components/

├── image-player/           # Image Player Component## 📁 Component Structure## 📁 Component Structure

│   ├── ImagePlayer.js      # Main component class

│   ├── image-player.css    # Component styles

│   └── demo.html           # Standalone demo

├── ai-service/             # AI Integration Components``````

│   ├── gemini-service.js   # Google Gemini AI service

│   ├── multi-ai-service-fixed.js # Multi-provider AI servicecomponents/components/

│   └── demo.html           # AI service demo

├── firebase/               # Firebase Integration├── image-player/           # Image Player Component├── video-player/           # Video Player Component

│   ├── firebase-config.js  # Firebase configuration

│   ├── auth-service.js     # Authentication service│   ├── ImagePlayer.js      # Main component class│   ├── VideoPlayer.js     # Main component class

│   ├── auth-ui.js          # Authentication UI

│   ├── auth-ui.css         # Auth UI styles│   ├── image-player.css    # Component styles│   ├── video-player.css   # Component styles

│   ├── quiz-service.js     # Quiz tracking service

│   └── quiz-service-demo.html # Quiz service demo│   └── demo.html           # Standalone demo│   └── demo.html          # Standalone demo

├── quiz-system/            # Quiz System Component

│   ├── QuizSystem.js       # Main component class├── ai-service/             # AI Integration Components├── quiz-system/           # Quiz System Component

│   ├── quiz-system.css     # Component styles

│   └── demo.html           # Standalone demo│   ├── gemini-service.js   # Google Gemini AI service│   ├── QuizSystem.js      # Main component class

├── image-quiz-app.html     # Integrated demo app

└── README.md               # This file│   ├── multi-ai-service-fixed.js # Multi-provider AI service│   ├── quiz-system.css    # Component styles

```

│   └── demo.html           # AI service demo│   └── demo.html          # Standalone demo

## 🖼️ Image Player Component

├── firebase/               # Firebase Integration├── demo.html              # Main integration demo

### Features

- Interactive image display with zoom controls│   ├── firebase-config.js  # Firebase configuration└── README.md              # This file

- Pan functionality for zoomed images

- Keyboard shortcuts (+ zoom in, - zoom out, 0 reset)│   ├── auth-service.js     # Authentication service```

- Touch support for mobile devices

- Responsive design│   ├── auth-ui.js          # Authentication UI

- Error handling for invalid image URLs

│   ├── auth-ui.css         # Auth UI styles## 🎥 Video Player Component

### Usage

│   ├── quiz-service.js     # Quiz tracking service

```javascript

import { ImagePlayer } from './components/image-player/ImagePlayer.js';│   └── quiz-service-demo.html # Quiz service demo### Features



// Basic usage├── quiz-system/            # Quiz System Component- Custom HTML5 video controls

const imagePlayer = new ImagePlayer('containerId');

│   ├── QuizSystem.js       # Main component class- Progress bar with seek functionality

// With custom options

const imagePlayer = new ImagePlayer('containerId', {│   ├── quiz-system.css     # Component styles- Volume control with mute toggle

    showControls: true,

    allowZoom: true,│   └── demo.html           # Standalone demo- Fullscreen support

    maxZoom: 3

});├── image-quiz-app.html     # Integrated demo app- Keyboard shortcuts (spacebar, arrows, M, F)



// Public API└── README.md               # This file- Responsive design

imagePlayer.setImageSrc(url);        // Set image source

imagePlayer.zoomIn();                // Zoom in```

imagePlayer.zoomOut();               // Zoom out

imagePlayer.resetZoom();             // Reset to fit### Usage

```

## 🖼️ Image Player Component

### CSS Integration

```html```javascript

<link rel="stylesheet" href="components/image-player/image-player.css">

```### Featuresimport { VideoPlayer } from './components/video-player/VideoPlayer.js';



## 🤖 AI Service Components- Interactive image display with zoom controls



### Gemini Service- Pan functionality for zoomed images// Basic usage

- Google Gemini API integration

- Image analysis and quiz generation- Keyboard shortcuts (+ zoom in, - zoom out, 0 reset)const videoPlayer = new VideoPlayer('containerId');

- Configurable question parameters

- Error handling and fallbacks- Touch support for mobile devices



### Multi-AI Service- Responsive design// With options

- Multiple AI provider support

- Automatic fallback between providers- Error handling for invalid image URLsconst videoPlayer = new VideoPlayer('containerId', {

- Free and premium service options

- Rate limiting and quota management    videoSrc: 'path/to/video.mp4',



### Usage### Usage    autoplay: false,



```javascript    controls: true

import { GeminiService } from './components/ai-service/gemini-service.js';

import { MultiAIService } from './components/ai-service/multi-ai-service-fixed.js';```javascript});



// Gemini serviceimport { ImagePlayer } from './components/image-player/ImagePlayer.js';

const geminiService = new GeminiService();

const questions = await geminiService.generateQuizFromImage(imageUrl, options);// Public API



// Multi-provider service// Basic usagevideoPlayer.getCurrentTime();        // Get current video time

const aiService = new MultiAIService();

const questions = await aiService.generateQuizFromImage(imageUrl, options);const imagePlayer = new ImagePlayer('containerId');videoPlayer.getDuration();           // Get video duration

```

videoPlayer.seekTo(time);           // Seek to specific time

## 🔥 Firebase Integration

// With custom optionsvideoPlayer.addEventListener(event, callback); // Listen to video events

### Authentication Service

- Email/password authenticationconst imagePlayer = new ImagePlayer('containerId', {```

- Google sign-in integration

- User state management    showControls: true,

- Session persistence

    allowZoom: true,### CSS Integration

### Quiz Service

- Quiz attempt tracking    maxZoom: 3```html

- User progress analytics

- Leaderboard functionality});<link rel="stylesheet" href="components/video-player/video-player.css">

- Data persistence in Firestore

```

### Auth UI Component

- Pre-built authentication forms// Public API

- Error handling and validation

- Responsive designimagePlayer.setImageSrc(url);        // Set image source## 📝 Quiz System Component

- Customizable styling

imagePlayer.zoomIn();                // Zoom in

### Usage

imagePlayer.zoomOut();               // Zoom out### Features

```javascript

import { AuthService } from './components/firebase/auth-service.js';imagePlayer.resetZoom();             // Reset to fit- Multiple choice questions

import { QuizService } from './components/firebase/quiz-service.js';

import { AuthUI } from './components/firebase/auth-ui.js';```- Navigation between questions



// Authentication- Real-time scoring

const authService = new AuthService();

const user = await authService.signIn(email, password);### CSS Integration- Progress tracking



// Quiz tracking```html- Results modal

const quizService = new QuizService();

await quizService.saveQuizAttempt(userId, quizData);<link rel="stylesheet" href="components/image-player/image-player.css">- Customizable options



// Auth UI```

const authUI = new AuthUI('authContainer');

```### Usage



## 📝 Quiz System Component## 🤖 AI Service Components



### Features```javascript

- Multiple choice questions

- Navigation between questions### Gemini Serviceimport { QuizSystem } from './components/quiz-system/QuizSystem.js';

- Real-time scoring

- Progress tracking- Google Gemini API integration

- Results modal

- Customizable options- Image analysis and quiz generation// Basic usage with default questions

- Keyboard navigation support

- Configurable question parametersconst quizSystem = new QuizSystem('containerId');

### Usage

- Error handling and fallbacks

```javascript

import { QuizSystem } from './components/quiz-system/QuizSystem.js';// With custom options



// Basic usage with default questions### Multi-AI Serviceconst quizSystem = new QuizSystem('containerId', {

const quizSystem = new QuizSystem('containerId');

- Multiple AI provider support    questions: customQuestions,

// With custom options

const quizSystem = new QuizSystem('containerId', {- Automatic fallback between providers    showResults: true,

    questions: customQuestions,

    showResults: true,- Free and premium service options    allowRetry: true

    allowRetry: true

});- Rate limiting and quota management});



// Public API

quizSystem.setQuestions(questions);  // Set custom questions

quizSystem.getScore();               // Get current score### Usage// Public API

quizSystem.getCurrentQuestion();     // Get current question

quizSystem.resetQuiz();              // Reset quiz statequizSystem.setQuestions(questions);  // Set custom questions

```

```javascriptquizSystem.getScore();               // Get current score

### CSS Integration

```htmlimport { GeminiService } from './components/ai-service/gemini-service.js';quizSystem.getCurrentQuestion();     // Get current question

<link rel="stylesheet" href="components/quiz-system/quiz-system.css">

```import { MultiAIService } from './components/ai-service/multi-ai-service-fixed.js';quizSystem.resetQuiz();              // Reset quiz state



## 🔗 Component Integration```



### Main App Integration// Gemini service

The main app (`index.html`) demonstrates how to integrate all components:

const geminiService = new GeminiService();### CSS Integration

```html

<!-- CSS includes -->const questions = await geminiService.generateQuizFromImage(imageUrl, options);```html

<link rel="stylesheet" href="components/image-player/image-player.css">

<link rel="stylesheet" href="components/quiz-system/quiz-system.css"><link rel="stylesheet" href="components/quiz-system/quiz-system.css">

<link rel="stylesheet" href="components/firebase/auth-ui.css">

// Multi-provider service```

<!-- JavaScript integration -->

<script type="module">const aiService = new MultiAIService();

import { ImagePlayer } from './components/image-player/ImagePlayer.js';

import { QuizSystem } from './components/quiz-system/QuizSystem.js';const questions = await aiService.generateQuizFromImage(imageUrl, options);## 🔗 Component Integration

import { MultiAIService } from './components/ai-service/multi-ai-service-fixed.js';

import { AuthService } from './components/firebase/auth-service.js';```

import { QuizService } from './components/firebase/quiz-service.js';

### Event Communication

// Initialize components

const imagePlayer = new ImagePlayer('imageContainer');## 🔥 Firebase IntegrationComponents communicate through custom events:

const quizSystem = new QuizSystem('quizContainer');

const aiService = new MultiAIService();

const authService = new AuthService();

const quizService = new QuizService();### Authentication Service```javascript

</script>

```- Email/password authentication// Video player events



## 🧪 Component Testing- Google sign-in integrationvideoPlayer.addEventListener('timeupdate', (e) => {



Each component includes a standalone demo for individual testing:- User state management    const currentTime = videoPlayer.getCurrentTime();



- **Image Player**: `components/image-player/demo.html`- Session persistence    // Handle time updates

- **AI Service**: `components/ai-service/demo.html`

- **Quiz System**: `components/quiz-system/demo.html`});

- **Firebase Services**: `components/firebase/quiz-service-demo.html`

### Quiz Service

## 📱 Responsive Design

- Quiz attempt tracking// Quiz system events

All components are designed to work across different screen sizes:

- User progress analyticsdocument.addEventListener('quizCompleted', (e) => {

- **Desktop**: Full feature set with mouse interactions

- **Tablet**: Touch-optimized controls and layouts- Leaderboard functionality    const { score, total } = e.detail;

- **Mobile**: Simplified UI with essential features

- Data persistence in Firestore    // Handle quiz completion

## 🎨 Customization

});

### Styling

Each component's CSS can be customized by overriding CSS variables or classes:### Auth UI Component```



```css- Pre-built authentication forms

/* Custom image player styling */

.image-player-container {- Error handling and validation### Synchronization Example

    --primary-color: #your-color;

    --background-color: #your-bg;- Responsive design```javascript

}

- Customizable styling// Example of how components will work together

/* Custom quiz styling */

.quiz-container {videoPlayer.addEventListener('timeupdate', (e) => {

    --accent-color: #your-accent;

    --text-color: #your-text;### Usage    const currentTime = videoPlayer.getCurrentTime();

}

```    



### Configuration```javascript    // Check if it's time to show a quiz question

Components accept configuration options during initialization:

import { AuthService } from './components/firebase/auth-service.js';    if (currentTime === 30) { // 30 seconds

```javascript

// Image player with custom settingsimport { QuizService } from './components/firebase/quiz-service.js';        videoPlayer.pause();

const imagePlayer = new ImagePlayer('container', {

    showControls: false,import { AuthUI } from './components/firebase/auth-ui.js';        quizSystem.showQuestion(0);

    allowZoom: true,

    maxZoom: 5    }

});

// Authentication});

// Quiz system with custom behavior

const quizSystem = new QuizSystem('container', {const authService = new AuthService();```

    shuffleQuestions: true,

    timeLimit: 60,const user = await authService.signIn(email, password);

    showHints: false

});## 🚀 Getting Started

```

// Quiz tracking

## 🔧 Development

const quizService = new QuizService();### 1. Individual Component Testing

### Adding New Components

1. Create a new folder in `components/`await quizService.saveQuizAttempt(userId, quizData);- **Video Player**: Open `components/video-player/demo.html`

2. Follow the naming convention: `ComponentName.js`

3. Include CSS file: `component-name.css`- **Quiz System**: Open `components/quiz-system/demo.html`

4. Create demo file: `demo.html`

5. Update this README with documentation// Auth UI



### Best Practicesconst authUI = new AuthUI('authContainer');### 2. Integration Testing

- Use ES6 modules for imports/exports

- Include proper error handling```- Open `components/demo.html` to see both components working together

- Write semantic HTML

- Use CSS custom properties for theming

- Include JSDoc comments for public APIs

- Emit custom events for component communication## 📝 Quiz System Component### 3. Custom Implementation

```html

### Features<!DOCTYPE html>

- Multiple choice questions<html>

- Navigation between questions<head>

- Real-time scoring    <link rel="stylesheet" href="components/video-player/video-player.css">

- Progress tracking    <link rel="stylesheet" href="components/quiz-system/quiz-system.css">

- Results modal</head>

- Customizable options<body>

- Keyboard navigation support    <div id="videoContainer"></div>

    <div id="quizContainer"></div>

### Usage    

    <script type="module">

```javascript        import { VideoPlayer } from './components/video-player/VideoPlayer.js';

import { QuizSystem } from './components/quiz-system/QuizSystem.js';        import { QuizSystem } from './components/quiz-system/QuizSystem.js';

        

// Basic usage with default questions        const videoPlayer = new VideoPlayer('videoContainer');

const quizSystem = new QuizSystem('containerId');        const quizSystem = new QuizSystem('quizContainer');

    </script>

// With custom options</body>

const quizSystem = new QuizSystem('containerId', {</html>

    questions: customQuestions,```

    showResults: true,

    allowRetry: true## 🎯 Next Steps

});

These components are designed to work together in **Mini Project 3: Video-Quiz Synchronization**, where we'll:

// Public API

quizSystem.setQuestions(questions);  // Set custom questions1. **Time-based triggers**: Show quiz questions at specific video timestamps

quizSystem.getScore();               // Get current score2. **Video control**: Pause video when questions appear

quizSystem.getCurrentQuestion();     // Get current question3. **Progress tracking**: Sync quiz progress with video playback

quizSystem.resetQuiz();              // Reset quiz state4. **Results integration**: Use quiz results to control video behavior

```

## 🔧 Customization

### CSS Integration

```html### Video Player Options

<link rel="stylesheet" href="components/quiz-system/quiz-system.css">- `videoSrc`: Custom video source

```- `autoplay`: Auto-play video on load

- `controls`: Show/hide custom controls

## 🔗 Component Integration

### Quiz System Options

### Main App Integration- `questions`: Custom question array

The main app (`index.html`) demonstrates how to integrate all components:- `showResults`: Show results modal

- `allowRetry`: Allow quiz retry

```html

<!-- CSS includes -->### Styling

<link rel="stylesheet" href="components/image-player/image-player.css">Each component has its own CSS file that can be customized:

<link rel="stylesheet" href="components/quiz-system/quiz-system.css">- `video-player.css` - Video player styles

<link rel="stylesheet" href="components/firebase/auth-ui.css">- `quiz-system.css` - Quiz system styles



<!-- JavaScript integration -->## 📱 Responsive Design

<script type="module">

import { ImagePlayer } from './components/image-player/ImagePlayer.js';Both components are fully responsive and work on:

import { QuizSystem } from './components/quiz-system/QuizSystem.js';- Desktop computers

import { MultiAIService } from './components/ai-service/multi-ai-service-fixed.js';- Tablets

import { AuthService } from './components/firebase/auth-service.js';- Mobile devices

import { QuizService } from './components/firebase/quiz-service.js';

## 🧪 Testing

// Initialize components

const imagePlayer = new ImagePlayer('imageContainer');Test components individually or together:

const quizSystem = new QuizSystem('quizContainer');1. **Video Player**: Test controls, keyboard shortcuts, fullscreen

const aiService = new MultiAIService();2. **Quiz System**: Test navigation, scoring, results

const authService = new AuthService();3. **Integration**: Test component communication and events

const quizService = new QuizService();

</script>## 🎨 Design Principles

```

- **Modular**: Each component is self-contained

## 🧪 Component Testing- **Reusable**: Components can be used in different projects

- **Configurable**: Options allow customization

Each component includes a standalone demo for individual testing:- **Event-driven**: Components communicate through events

- **Responsive**: Works on all device sizes

- **Image Player**: `components/image-player/demo.html`
- **AI Service**: `components/ai-service/demo.html`
- **Quiz System**: `components/quiz-system/demo.html`
- **Firebase Services**: `components/firebase/quiz-service-demo.html`

## 📱 Responsive Design

All components are designed to work across different screen sizes:

- **Desktop**: Full feature set with mouse interactions
- **Tablet**: Touch-optimized controls and layouts
- **Mobile**: Simplified UI with essential features

## 🎨 Customization

### Styling
Each component's CSS can be customized by overriding CSS variables or classes:

```css
/* Custom image player styling */
.image-player-container {
    --primary-color: #your-color;
    --background-color: #your-bg;
}

/* Custom quiz styling */
.quiz-container {
    --accent-color: #your-accent;
    --text-color: #your-text;
}
```

### Configuration
Components accept configuration options during initialization:

```javascript
// Image player with custom settings
const imagePlayer = new ImagePlayer('container', {
    showControls: false,
    allowZoom: true,
    maxZoom: 5
});

// Quiz system with custom behavior
const quizSystem = new QuizSystem('container', {
    shuffleQuestions: true,
    timeLimit: 60,
    showHints: false
});
```

## 🔧 Development

### Adding New Components
1. Create a new folder in `components/`
2. Follow the naming convention: `ComponentName.js`
3. Include CSS file: `component-name.css`
4. Create demo file: `demo.html`
5. Update this README with documentation

### Best Practices
- Use ES6 modules for imports/exports
- Include proper error handling
- Write semantic HTML
- Use CSS custom properties for theming
- Include JSDoc comments for public APIs
- Emit custom events for component communication