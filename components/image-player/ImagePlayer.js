export class ImagePlayer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            imageSrc: null,
            showControls: true,
            allowZoom: true,
            ...options
        };
        
        this.image = null;
        this.zoomLevel = 1;
        this.isZoomed = false;
        this.panStart = { x: 0, y: 0 };
        this.panOffset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.createHTML();
        this.initializeElements();
        this.initializeEventListeners();
    }
    
    createHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container with ID '${this.containerId}' not found`);
        }
        
        container.innerHTML = `
            <div class="image-container">
                <div class="image-wrapper" id="imageWrapper">
                    <img id="imagePlayer" 
                         src="${this.options.imageSrc || ''}" 
                         alt="Quiz Image"
                         draggable="false">
                </div>
                
                ${this.options.showControls ? `
                <div class="image-controls">
                    ${this.options.allowZoom ? `
                    <div class="control-group">
                        <button class="control-btn zoom-in-btn" title="Zoom In">🔍+</button>
                        <button class="control-btn zoom-out-btn" title="Zoom Out">🔍-</button>
                        <button class="control-btn reset-zoom-btn" title="Reset Zoom">🔄</button>
                    </div>
                    <div class="control-group">
                        <span class="zoom-level">100%</span>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                <div class="image-overlay" id="imageOverlay">
                    <div class="overlay-content">
                        <div class="loading-spinner" id="loadingSpinner">
                            <div class="spinner"></div>
                            <p>Loading image...</p>
                        </div>
                        <div class="error-message" id="errorMessage" style="display: none;">
                            <p>❌ Failed to load image</p>
                            <button class="retry-btn">Retry</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    initializeElements() {
        this.image = document.getElementById('imagePlayer');
        this.imageWrapper = document.getElementById('imageWrapper');
        this.imageOverlay = document.getElementById('imageOverlay');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        
        if (this.options.showControls) {
            this.retryBtn = document.querySelector('.retry-btn');
            
            // Only initialize zoom elements if zoom is allowed
            if (this.options.allowZoom) {
                this.zoomLevelDisplay = document.querySelector('.zoom-level');
                this.zoomInBtn = document.querySelector('.zoom-in-btn');
                this.zoomOutBtn = document.querySelector('.zoom-out-btn');
                this.resetZoomBtn = document.querySelector('.reset-zoom-btn');
            }
        }
    }
    
    initializeEventListeners() {
        // Image load events
        this.image.addEventListener('load', () => this.handleImageLoad());
        this.image.addEventListener('error', () => this.handleImageError());
        
        // Mouse events for panning when zoomed
        this.imageWrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Touch events for mobile
        this.imageWrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.imageWrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.imageWrapper.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Zoom-related events only if zoom is allowed
        if (this.options.allowZoom) {
            // Wheel event for zoom
            this.imageWrapper.addEventListener('wheel', (e) => this.handleWheel(e));
            
            // Keyboard shortcuts for zoom
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }
        
        // Control buttons
        if (this.options.showControls) {
            if (this.retryBtn) {
                this.retryBtn.addEventListener('click', () => this.retryLoad());
            }
            
            // Zoom control buttons only if zoom is allowed
            if (this.options.allowZoom) {
                if (this.zoomInBtn) this.zoomInBtn.addEventListener('click', () => this.zoomIn());
                if (this.zoomOutBtn) this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
                if (this.resetZoomBtn) this.resetZoomBtn.addEventListener('click', () => this.resetZoom());
            }
        }
    }
    
    handleImageLoad() {
        this.hideOverlay();
        this.dispatchEvent('imageLoaded', { src: this.image.src });
    }
    
    handleImageError() {
        this.showError();
        this.dispatchEvent('imageError', { src: this.image.src });
    }
    
    handleMouseDown(e) {
        if (!this.isZoomed) return;
        
        e.preventDefault();
        this.panStart = { x: e.clientX, y: e.clientY };
        this.imageWrapper.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isZoomed || !this.panStart) return;
        
        e.preventDefault();
        const deltaX = e.clientX - this.panStart.x;
        const deltaY = e.clientY - this.panStart.y;
        
        this.panOffset.x += deltaX;
        this.panOffset.y += deltaY;
        
        this.updateImageTransform();
        this.panStart = { x: e.clientX, y: e.clientY };
    }
    
    handleMouseUp(e) {
        if (!this.isZoomed) return;
        
        this.imageWrapper.style.cursor = this.isZoomed ? 'grab' : 'default';
        this.panStart = null;
    }
    
    handleTouchStart(e) {
        if (!this.isZoomed || e.touches.length !== 1) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        this.panStart = { x: touch.clientX, y: touch.clientY };
    }
    
    handleTouchMove(e) {
        if (!this.isZoomed || !this.panStart || e.touches.length !== 1) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.panStart.x;
        const deltaY = touch.clientY - this.panStart.y;
        
        this.panOffset.x += deltaX;
        this.panOffset.y += deltaY;
        
        this.updateImageTransform();
        this.panStart = { x: touch.clientX, y: touch.clientY };
    }
    
    handleTouchEnd(e) {
        if (!this.isZoomed) return;
        
        this.panStart = null;
    }
    
    handleWheel(e) {
        if (!this.options.allowZoom) return;
        
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(0.5, Math.min(3, this.zoomLevel + delta));
        this.setZoom(newZoom);
    }
    
    handleKeyboard(e) {
        if (!this.options.allowZoom) return;
        
        switch(e.key) {
            case '+':
            case '=':
                e.preventDefault();
                this.zoomIn();
                break;
            case '-':
                e.preventDefault();
                this.zoomOut();
                break;
            case '0':
                e.preventDefault();
                this.resetZoom();
                break;
        }
    }
    
    zoomIn() {
        const newZoom = Math.min(3, this.zoomLevel + 0.25);
        this.setZoom(newZoom);
    }
    
    zoomOut() {
        const newZoom = Math.max(0.5, this.zoomLevel - 0.25);
        this.setZoom(newZoom);
    }
    
    resetZoom() {
        this.setZoom(1);
    }
    
    setZoom(zoomLevel) {
        this.zoomLevel = zoomLevel;
        this.isZoomed = zoomLevel !== 1;
        
        if (this.isZoomed) {
            this.imageWrapper.style.cursor = 'grab';
        } else {
            this.imageWrapper.style.cursor = 'default';
            this.panOffset = { x: 0, y: 0 };
        }
        
        this.updateImageTransform();
        this.updateZoomDisplay();
        
        this.dispatchEvent('zoomChanged', { zoomLevel: this.zoomLevel });
    }
    
    updateImageTransform() {
        const transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoomLevel})`;
        this.image.style.transform = transform;
    }
    
    updateZoomDisplay() {
        if (this.zoomLevelDisplay) {
            this.zoomLevelDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }
    
    showOverlay() {
        this.imageOverlay.style.display = 'flex';
    }
    
    hideOverlay() {
        this.imageOverlay.style.display = 'none';
    }
    
    showError() {
        this.loadingSpinner.style.display = 'none';
        this.errorMessage.style.display = 'block';
    }
    
    retryLoad() {
        this.loadingSpinner.style.display = 'block';
        this.errorMessage.style.display = 'none';
        this.image.src = this.image.src; // Trigger reload
    }
    
    // Public methods
    setImageSrc(src) {
        this.showOverlay();
        this.loadingSpinner.style.display = 'block';
        this.errorMessage.style.display = 'none';
        this.image.src = src;
    }
    
    getImageSrc() {
        return this.image.src;
    }
    
    getZoomLevel() {
        return this.zoomLevel;
    }
    
    isImageLoaded() {
        return this.image.complete && this.image.naturalHeight !== 0;
    }
    
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
    
    addEventListener(event, callback) {
        document.addEventListener(event, callback);
    }
}
