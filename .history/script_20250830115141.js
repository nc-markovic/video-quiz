class VideoPlayer {
    constructor() {
        this.video = document.getElementById('videoPlayer');
        this.playPauseBtn = document.querySelector('.play-pause-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressFilled = document.querySelector('.progress-filled');
        this.currentTime = document.querySelector('.current-time');
        this.totalTime = document.querySelector('.total-time');
        this.muteBtn = document.querySelector('.mute-btn');
        this.volumeRange = document.querySelector('.volume-range');
        this.fullscreenBtn = document.querySelector('.fullscreen-btn');
        
        this.isPlaying = false;
        this.isMuted = false;
        
        this.initializeEventListeners();
        this.updateTimeDisplay();
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
}

document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});
