let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let gameRunning = false;

// Landscape-Warnung für mobile Geräte
(function() {
    /**
     * Checks if the current device is a mobile device
     * @returns {boolean} True if mobile device, false otherwise
     * @description Detects mobile devices using user agent string
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Checks if the device is in portrait orientation
     * @returns {boolean} True if portrait, false if landscape
     * @description Compares window height and width
     */
    function isPortrait() {
        return window.innerHeight > window.innerWidth;
    }
    
    /**
     * Checks if the screen is small (mobile-sized)
     * @returns {boolean} True if screen width is less than 760px
     * @description Determines if device has a small screen
     */
    function isSmallScreen() {
        return window.innerWidth < 760;
    }
    
    /**
     * Toggles landscape warning visibility
     * @description Shows/hides landscape warning based on device and orientation
     */
    function toggleLandscapeWarning() {
        var warning = document.querySelector('.landscape-warning');
        var mainContent = document.getElementById('canvas');
        var body = document.body;
        if (isMobileDevice() && isPortrait() && isSmallScreen()) {
            if (warning) warning.style.display = 'flex';
            if (mainContent) mainContent.style.display = 'none';
            Array.from(document.querySelectorAll('.settings-button, .settings-menu, .game-over-screen, .start-screen, .info-modal')).forEach(function(el) {
                if (el) el.style.display = 'none';
            });
        } else {
            if (warning) warning.style.display = 'none';
            if (mainContent) mainContent.style.display = '';
            Array.from(document.querySelectorAll('.settings-button, .settings-menu, .game-over-screen, .start-screen, .info-modal')).forEach(function(el) {
                if (el) el.style.display = '';
            });
        }
    }
    window.addEventListener('orientationchange', toggleLandscapeWarning);
    window.addEventListener('resize', toggleLandscapeWarning);
    document.addEventListener('DOMContentLoaded', toggleLandscapeWarning);
    setTimeout(toggleLandscapeWarning, 100);
})();

/**
 * Initializes the game
 * @description Sets up canvas, draws start screen, and sets up event handlers
 */
function init() {
   canvas = document.getElementById('canvas');
   drawStartScreen();
   setupCanvasClickHandler();
}

/**
 * Handles keyboard key down events
 * @param {KeyboardEvent} e - The keyboard event object
 * @description Processes key presses and updates keyboard state
 */
function handleKeyDown(e) {
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if(e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if(e.keyCode == 38) {
        keyboard.UP = true;
    }

    if(e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if(e.keyCode == 68) {
        keyboard.D = true;
    }

    if(e.keyCode == 77) {
        toggleSound();
    }
}
    
/**
 * Handles keyboard key up events
 * @param {KeyboardEvent} e - The keyboard event object
 * @description Processes key releases and updates keyboard state
 */
function handleKeyUp(e) {
    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if(e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if(e.keyCode == 38) {
        keyboard.UP = false;
    }

    if(e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if(e.keyCode == 68) {
        keyboard.D = false;
    }

    if(e.keyCode == 77) {
    }
}

window.goToStartScreen = goToStartScreen;

