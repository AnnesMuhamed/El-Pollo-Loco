let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let gameRunning = false;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

(function() {
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    function isPortrait() {
        return window.innerHeight > window.innerWidth;
    }
    function isSmallScreen() {
        return window.innerWidth < 760;
    }
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

function init() {
   canvas = document.getElementById('canvas');
   drawStartScreen();
   setupCanvasClickHandler();
}

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

document.addEventListener('click', function(event) {
    const settingsButton = document.getElementById('settingsButton');
    const settingsMenu = document.getElementById('settingsMenu');
    
    if (settingsButton && settingsMenu && !settingsButton.contains(event.target) && !settingsMenu.contains(event.target)) {
        settingsMenu.classList.add('hidden');
    }
});

