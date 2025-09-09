export class VideoPlayer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            autoplay: false,
            controls: true,
            thumbnails: true,
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
        this.thumbnailContainer = null;
        
        this.isPlaying = false;
        this.isMuted = false;
        this.thumbnailCanvas = null;
        this.thumbnailContext = null;
        
        this.init();
    }
    
    init() {
        this.createHTML();
        this.initializeElements();
        this.initializeEventListeners();
        this.updateTimeDisplay();
        this.setupThumbnails();
    }
    
    createHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container with ID '${this.containerId}' not found`);
        }
        
        container.innerHTML = `
            <div class="video-container">
                <video id="videoPlayer" preload="metadata">
                    <source src="${this.options.videoSrc || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                
                <div class="video-controls">
                    <div class="controls-top">
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-filled"></div>
                                <div class="thumbnail-container" style="display: none;">
                                    <img class="thumbnail-image" alt="Video thumbnail">
                                    <span class="thumbnail-time">0:00</span>
                                </div>
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
            </div>
        `;
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
        this.thumbnailContainer = document.querySelector('.thumbnail-container');
        this.thumbnailImage = document.querySelector('.thumbnail-image');
        this.thumbnailTime = document.querySelector('.thumbnail-time');
    }
    
    setupThumbnails() {
        if (!this.options.thumbnails) return;
        
        // Create canvas for generating thumbnails
        this.thumbnailCanvas = document.createElement('canvas');
        this.thumbnailContext = this.thumbnailCanvas.getContext('2d');
        this.thumbnailCanvas.width = 160;
        this.thumbnailCanvas.height = 90;
        
        // Add progress bar hover events
        this.progressBar.addEventListener('mousemove', (e) => this.showThumbnail(e));
        this.progressBar.addEventListener('mouseenter', () => this.thumbnailContainer.style.display = 'block');
        this.progressBar.addEventListener('mouseleave', () => this.thumbnailContainer.style.display = 'none');
    }
    
    showThumbnail(event) {
        if (!this.options.thumbnails || !this.video.duration) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        const time = percent * this.video.duration;
        
        // Update thumbnail time display
        this.thumbnailTime.textContent = this.formatTime(time);
        
        // Position thumbnail container
        const thumbnailWidth = 160;
        const offset = Math.max(0, Math.min(event.clientX - rect.left - thumbnailWidth / 2, rect.width - thumbnailWidth));
        this.thumbnailContainer.style.left = `${offset}px`;
        
        // Generate thumbnail if video is loaded
        if (this.video.readyState >= 2) {
            this.generateThumbnail(time);
        }
    }
    
    generateThumbnail(time) {
        try {
            // Set video time to generate thumbnail
            const currentTime = this.video.currentTime;
            this.video.currentTime = time;
            
            // Wait for seek to complete, then capture frame
            this.video.addEventListener('seeked', () => {
                this.captureThumbnail();
                this.video.currentTime = currentTime; // Restore original time
            }, { once: true });
        } catch (error) {
            console.log('Thumbnail generation not supported for this video');
        }
    }
    
    captureThumbnail() {
        try {
            this.thumbnailContext.drawImage(this.video, 0, 0, 160, 90);
            this.thumbnailImage.src = this.thumbnailCanvas.toDataURL();
        } catch (error) {
            // Fallback to a placeholder if thumbnail generation fails
            this.thumbnailImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik02MCA0NUw0MCAyNUg4MEw2MCA0NVoiIGZpbGw9IiM2NjYiLz4KPC9zdmc+';
        }
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
