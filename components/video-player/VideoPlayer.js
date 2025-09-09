export class VideoPlayer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            autoplay: false,
            controls: true,
            poster: null,
            ...options
        };
        
        this.video = null;
        this.playPauseBtn = null;
        this.progressBar = null;
        this.progressFilled = null;
        this.currentTime = null;
        this.totalTime = null;
        this.muteBtn = null;
        this.volumeRange = null;
        this.fullscreenBtn = null;
        
        this.isPlaying = false;
        this.isMuted = false;
        
        this.init();
    }
    
    init() {
        this.createHTML();
        this.initializeElements();
        this.initializeEventListeners();
        this.updateTimeDisplay();
        this.setupPoster();
    }
    
    createHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container with ID '${this.containerId}' not found`);
        }
        
        container.innerHTML = `
            <div class="video-container">
                <video id="videoPlayer" preload="metadata" ${this.options.poster ? `poster="${this.options.poster}"` : ''}>
                    <source src="${this.options.videoSrc || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                
                <div class="video-controls">
                    <div class="controls-top">
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-filled"></div>
                            </div>
                            <div class="time-display">
                                <span class="current-time">0:00</span>
                                <span>/</span>
                                <span class="total-time">0:00</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="controls-bottom">
                        <button class="play-pause-btn">
                            <span class="play-icon">▶</span>
                            <span class="pause-icon">⏸</span>
                        </button>
                        
                        <div class="volume-controls">
                            <button class="mute-btn">🔊</button>
                            <div class="volume-slider">
                                <input type="range" class="volume-range" min="0" max="100" value="100">
                            </div>
                        </div>
                        
                        <button class="fullscreen-btn">⛶</button>
                    </div>
                </div>
                
                ${this.options.poster ? `
                <div class="poster-overlay" id="posterOverlay">
                    <div class="poster-content">
                        <img src="${this.options.poster}" alt="Video poster" class="poster-image">
                        <div class="play-button-overlay">
                            <span class="play-icon-large">▶</span>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    setupPoster() {
        if (!this.options.poster) return;
        
        this.posterOverlay = document.getElementById('posterOverlay');
        
        // Hide poster when video starts playing
        this.video.addEventListener('play', () => {
            if (this.posterOverlay) {
                this.posterOverlay.style.display = 'none';
            }
        });
        
        // Show poster when video is paused and at beginning
        this.video.addEventListener('pause', () => {
            if (this.posterOverlay && this.video.currentTime === 0) {
                this.posterOverlay.style.display = 'flex';
            }
        });
        
        // Show poster when video ends
        this.video.addEventListener('ended', () => {
            if (this.posterOverlay) {
                this.posterOverlay.style.display = 'flex';
            }
        });
        
        // Click poster to play
        if (this.posterOverlay) {
            this.posterOverlay.addEventListener('click', () => {
                this.play();
            });
        }
    }
    
    initializeElements() {
        this.video = document.getElementById('videoPlayer');
        this.playPauseBtn = document.querySelector('.play-pause-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressFilled = document.querySelector('.progress-filled');
        this.currentTime = document.querySelector('.current-time');
        this.totalTime = document.querySelector('.total-time');
        this.muteBtn = document.querySelector('.mute-btn');
        this.volumeRange = document.querySelector('.volume-range');
        this.fullscreenBtn = document.querySelector('.fullscreen-btn');
    }
    
    initializeEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.video.addEventListener('click', () => this.togglePlayPause());
        
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        
        this.video.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        this.video.addEventListener('ended', () => this.handleVideoEnd());
        
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeRange.addEventListener('input', (e) => this.handleVolumeChange(e));
        
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    togglePlayPause() {
        if (this.video.paused) {
            this.play();
        } else {
            this.pause();
        }
    }
    
    play() {
        this.video.play();
        this.isPlaying = true;
        this.updatePlayPauseButton();
    }
    
    pause() {
        this.video.pause();
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }
    
    updatePlayPauseButton() {
        const playIcon = this.playPauseBtn.querySelector('.play-icon');
        const pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
        
        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }
    
    updateProgress() {
        const percent = (this.video.currentTime / this.video.duration) * 100;
        this.progressFilled.style.width = `${percent}%`;
        this.updateTimeDisplay();
    }
    
    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = percent * this.video.duration;
    }
    
    updateTimeDisplay() {
        if (this.video.duration) {
            this.currentTime.textContent = this.formatTime(this.video.currentTime);
            this.totalTime.textContent = this.formatTime(this.video.duration);
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    handleVideoEnd() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.video.muted = this.isMuted;
        this.updateMuteButton();
    }
    
    updateMuteButton() {
        this.muteBtn.textContent = this.isMuted ? '🔇' : '🔊';
    }
    
    handleVolumeChange(e) {
        const volume = e.target.value / 100;
        this.video.volume = volume;
        
        if (volume === 0) {
            this.isMuted = true;
            this.updateMuteButton();
        } else if (this.isMuted) {
            this.isMuted = false;
            this.updateMuteButton();
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.video.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.video.currentTime -= 10;
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.video.currentTime += 10;
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.video.volume = Math.min(1, this.video.volume + 0.1);
                this.volumeRange.value = this.video.volume * 100;
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.video.volume = Math.max(0, this.video.volume - 0.1);
                this.volumeRange.value = this.video.volume * 100;
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'KeyF':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }
    
    // Public methods for external control
    getCurrentTime() {
        return this.video.currentTime;
    }
    
    getDuration() {
        return this.video.duration;
    }
    
    seekTo(time) {
        this.video.currentTime = time;
    }
    
    addEventListener(event, callback) {
        this.video.addEventListener(event, callback);
    }
}
