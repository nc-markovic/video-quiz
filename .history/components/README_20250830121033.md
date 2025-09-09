# Video Quiz App - Component Architecture

This project is structured using a modular component-based approach, making it easy to maintain, test, and integrate components.

## 📁 Component Structure

```
components/
├── video-player/           # Video Player Component
│   ├── VideoPlayer.js     # Main component class
│   ├── video-player.css   # Component styles
│   └── demo.html          # Standalone demo
├── quiz-system/           # Quiz System Component
│   ├── QuizSystem.js      # Main component class
│   ├── quiz-system.css    # Component styles
│   └── demo.html          # Standalone demo
├── demo.html              # Main integration demo
└── README.md              # This file
```

## 🎥 Video Player Component

### Features
- Custom HTML5 video controls
- Progress bar with seek functionality
- Volume control with mute toggle
- Fullscreen support
- Keyboard shortcuts (spacebar, arrows, M, F)
- Responsive design

### Usage

```javascript
import { VideoPlayer } from './components/video-player/VideoPlayer.js';

// Basic usage
const videoPlayer = new VideoPlayer('containerId');

// With options
const videoPlayer = new VideoPlayer('containerId', {
    videoSrc: 'path/to/video.mp4',
    autoplay: false,
    controls: true
});

// Public API
videoPlayer.getCurrentTime();        // Get current video time
videoPlayer.getDuration();           // Get video duration
videoPlayer.seekTo(time);           // Seek to specific time
videoPlayer.addEventListener(event, callback); // Listen to video events
```

### CSS Integration
```html
<link rel="stylesheet" href="components/video-player/video-player.css">
```

## 📝 Quiz System Component

### Features
- Multiple choice questions
- Navigation between questions
- Real-time scoring
- Progress tracking
- Results modal
- Customizable options

### Usage

```javascript
import { QuizSystem } from './components/quiz-system/QuizSystem.js';

// Basic usage with default questions
const quizSystem = new QuizSystem('containerId');

// With custom options
const quizSystem = new QuizSystem('containerId', {
    questions: customQuestions,
    showResults: true,
    allowRetry: true
});

// Public API
quizSystem.setQuestions(questions);  // Set custom questions
quizSystem.getScore();               // Get current score
quizSystem.getCurrentQuestion();     // Get current question
quizSystem.resetQuiz();              // Reset quiz state
```

### CSS Integration
```html
<link rel="stylesheet" href="components/quiz-system/quiz-system.css">
```

## 🔗 Component Integration

### Event Communication
Components communicate through custom events:

```javascript
// Video player events
videoPlayer.addEventListener('timeupdate', (e) => {
    const currentTime = videoPlayer.getCurrentTime();
    // Handle time updates
});

// Quiz system events
document.addEventListener('quizCompleted', (e) => {
    const { score, total } = e.detail;
    // Handle quiz completion
});
```

### Synchronization Example
```javascript
// Example of how components will work together
videoPlayer.addEventListener('timeupdate', (e) => {
    const currentTime = videoPlayer.getCurrentTime();
    
    // Check if it's time to show a quiz question
    if (currentTime === 30) { // 30 seconds
        videoPlayer.pause();
        quizSystem.showQuestion(0);
    }
});
```

## 🚀 Getting Started

### 1. Individual Component Testing
- **Video Player**: Open `components/video-player/demo.html`
- **Quiz System**: Open `components/quiz-system/demo.html`

### 2. Integration Testing
- Open `components/demo.html` to see both components working together

### 3. Custom Implementation
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="components/video-player/video-player.css">
    <link rel="stylesheet" href="components/quiz-system/quiz-system.css">
</head>
<body>
    <div id="videoContainer"></div>
    <div id="quizContainer"></div>
    
    <script type="module">
        import { VideoPlayer } from './components/video-player/VideoPlayer.js';
        import { QuizSystem } from './components/quiz-system/QuizSystem.js';
        
        const videoPlayer = new VideoPlayer('videoContainer');
        const quizSystem = new QuizSystem('quizContainer');
    </script>
</body>
</html>
```

## 🎯 Next Steps

These components are designed to work together in **Mini Project 3: Video-Quiz Synchronization**, where we'll:

1. **Time-based triggers**: Show quiz questions at specific video timestamps
2. **Video control**: Pause video when questions appear
3. **Progress tracking**: Sync quiz progress with video playback
4. **Results integration**: Use quiz results to control video behavior

## 🔧 Customization

### Video Player Options
- `videoSrc`: Custom video source
- `autoplay`: Auto-play video on load
- `controls`: Show/hide custom controls

### Quiz System Options
- `questions`: Custom question array
- `showResults`: Show results modal
- `allowRetry`: Allow quiz retry

### Styling
Each component has its own CSS file that can be customized:
- `video-player.css` - Video player styles
- `quiz-system.css` - Quiz system styles

## 📱 Responsive Design

Both components are fully responsive and work on:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 Testing

Test components individually or together:
1. **Video Player**: Test controls, keyboard shortcuts, fullscreen
2. **Quiz System**: Test navigation, scoring, results
3. **Integration**: Test component communication and events

## 🎨 Design Principles

- **Modular**: Each component is self-contained
- **Reusable**: Components can be used in different projects
- **Configurable**: Options allow customization
- **Event-driven**: Components communicate through events
- **Responsive**: Works on all device sizes
