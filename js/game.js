let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let gameRunning = false;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Landscape-Warnung für mobile Geräte
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
            // Optional: weitere UI-Elemente ausblenden
            Array.from(document.querySelectorAll('.settings-button, .settings-menu, .game-over-screen, .start-screen, .info-modal')).forEach(function(el) {
                if (el) el.style.display = 'none';
            });
        } else {
            if (warning) warning.style.display = 'none';
            if (mainContent) mainContent.style.display = '';
            // Optional: weitere UI-Elemente wieder einblenden
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

function drawStartScreen() {
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawStartButton(ctx);
    
    const startScreenImage = new Image();
    startScreenImage.onload = function() {
        ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
        drawStartButton(ctx);
    };
    startScreenImage.onerror = function() {
    };
    startScreenImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';
}

function drawStartButton(ctx) {
    const buttonX = 20;
    const buttonY = 20;
    const buttonWidth = 120;
    const buttonHeight = 40;
    
    const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = gradient;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 3;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 16px Play, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', buttonX + buttonWidth/2, buttonY + buttonHeight/2);
    
    window.startButtonCoords = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
}

function drawMobileControls(ctx) {
    if (!gameRunning) return;
    if (window.innerWidth >= 760) return;
    
    const buttonSize = 60;
    const margin = 20;
    const bottomY = ctx.canvas.height - buttonSize - margin;
    
    // Left and Right buttons (bottom left)
    const leftX = margin;
    const rightX = leftX + buttonSize + 10;
    
    // Jump and Throw buttons (bottom right)
    const throwX = ctx.canvas.width - buttonSize - margin;
    const jumpX = throwX - buttonSize - 10;
    
    // Draw Left button
    drawControlButton(ctx, leftX, bottomY, buttonSize, '<', '#FFD700', '#FFA500');
    
    // Draw Right button
    drawControlButton(ctx, rightX, bottomY, buttonSize, '>', '#FFD700', '#FFA500');
    
    // Draw Jump button
    drawControlButton(ctx, jumpX, bottomY, buttonSize, '⬆', '#FFD700', '#FFA500');
    
    // Draw Throw button
    drawControlButton(ctx, throwX, bottomY, buttonSize, '💥', '#FFD700', '#FFA500');
    
    // Store button coordinates for click detection
    window.mobileButtonCoords = {
        left: { x: leftX, y: bottomY, width: buttonSize, height: buttonSize },
        right: { x: rightX, y: bottomY, width: buttonSize, height: buttonSize },
        jump: { x: jumpX, y: bottomY, width: buttonSize, height: buttonSize },
        throw: { x: throwX, y: bottomY, width: buttonSize, height: buttonSize }
    };
}

function drawControlButton(ctx, x, y, size, text, color1, color2) {
    const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, size, size);
    
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, size, size);
    
    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 20px Play, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + size/2, y + size/2);
}

function setupCanvasClickHandler() {
    let activeButtons = new Set();
    let touchPoints = new Map(); // Track touch points by ID

    // Mouse events
    canvas.addEventListener('mousedown', function(e) {
        handleButtonPress(e, 'mouse');
    });

    canvas.addEventListener('mouseup', function(e) {
        handleButtonRelease(e, 'mouse');
    });

    canvas.addEventListener('mouseleave', function(e) {
        handleButtonRelease(e, 'mouse');
    });

    // Touch events
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        // Handle all touch points
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            handleButtonPress(touch, 'touch', touch.identifier);
        }
    });

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        // Handle all released touch points
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            handleButtonRelease(touch, 'touch', touch.identifier);
        }
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        // Update touch positions with throttling for better performance
        if (e.touches.length > 0) {
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                updateTouchPosition(touch, touch.identifier);
            }
        }
    }, { passive: false });

    function handleButtonPress(e, type, touchId = null) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;
        
        // Handle start button if game hasn't started yet
        if (!gameStarted && window.startButtonCoords) {
            const btn = window.startButtonCoords;
            if (canvasX >= btn.x && canvasX <= btn.x + btn.width &&
                canvasY >= btn.y && canvasY <= btn.y + btn.height) {
                startGame();
                return;
            }
        }
        
        // Handle mobile controls if game is running
        if (!gameRunning || !window.mobileButtonCoords) return;
        
        const buttons = window.mobileButtonCoords;
        let buttonPressed = null;
        
        if (canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width &&
            canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) {
            buttonPressed = 'left';
            keyboard.LEFT = true;
        } else if (canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width &&
                   canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) {
            buttonPressed = 'right';
            keyboard.RIGHT = true;
        } else if (canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width &&
                   canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) {
            buttonPressed = 'jump';
            keyboard.SPACE = true;
        } else if (canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width &&
                   canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) {
            buttonPressed = 'throw';
            keyboard.D = true;
        }
        
        if (buttonPressed) {
            activeButtons.add(buttonPressed);
            if (type === 'touch' && touchId !== null) {
                touchPoints.set(touchId, buttonPressed);
            }
        }
    }

    function handleButtonRelease(e, type, touchId = null) {
        if (!gameRunning || !window.mobileButtonCoords) return;
        
        if (type === 'touch' && touchId !== null) {
            // For touch events, release the button associated with this touch ID
            const buttonToRelease = touchPoints.get(touchId);
            if (buttonToRelease) {
                activeButtons.delete(buttonToRelease);
                touchPoints.delete(touchId);
                
                // Only release keyboard if no other touch is on this button
                if (!activeButtons.has(buttonToRelease)) {
                    switch (buttonToRelease) {
                        case 'left':
                            keyboard.LEFT = false;
                            break;
                        case 'right':
                            keyboard.RIGHT = false;
                            break;
                        case 'jump':
                            keyboard.SPACE = false;
                            break;
                        case 'throw':
                            keyboard.D = false;
                            break;
                    }
                }
            }
        } else {
            // For mouse events, check which button was released
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const canvasX = x * scaleX;
            const canvasY = y * scaleY;
            
            const buttons = window.mobileButtonCoords;
            
            if (canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width &&
                canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) {
                activeButtons.delete('left');
                keyboard.LEFT = false;
            } else if (canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width &&
                       canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) {
                activeButtons.delete('right');
                keyboard.RIGHT = false;
            } else if (canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width &&
                       canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) {
                activeButtons.delete('jump');
                keyboard.SPACE = false;
            } else if (canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width &&
                       canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) {
                activeButtons.delete('throw');
                keyboard.D = false;
            }
        }
    }

    function updateTouchPosition(touch, touchId) {
        // Update touch position for continuous button pressing
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;
        
        if (!gameRunning || !window.mobileButtonCoords) return;
        
        const buttons = window.mobileButtonCoords;
        const currentButton = touchPoints.get(touchId);
        
        // Check if touch is still on the same button
        let stillOnButton = false;
        if (currentButton === 'left' && 
            canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width &&
            canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) {
            stillOnButton = true;
        } else if (currentButton === 'right' && 
                   canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width &&
                   canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) {
            stillOnButton = true;
        } else if (currentButton === 'jump' && 
                   canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width &&
                   canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) {
            stillOnButton = true;
        } else if (currentButton === 'throw' && 
                   canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width &&
                   canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) {
            stillOnButton = true;
        }
        
        // If touch moved off button, release it
        if (!stillOnButton && currentButton) {
            activeButtons.delete(currentButton);
            touchPoints.delete(touchId);
            
            if (!activeButtons.has(currentButton)) {
                switch (currentButton) {
                    case 'left':
                        keyboard.LEFT = false;
                        break;
                    case 'right':
                        keyboard.RIGHT = false;
                        break;
                    case 'jump':
                        keyboard.SPACE = false;
                        break;
                    case 'throw':
                        keyboard.D = false;
                        break;
                }
            }
        }
    }
}

function resetGame() {
    if (audioManager) {
        audioManager.stopWalkingSound();
    }
    
    gameStarted = false;
    gameRunning = false;
    world = null;
    
    keyboard = new Keyboard();
    audioManager = new AudioManager();
    
    window.level1 = new Level(
        [
            // Erster Abschnitt (-719)
            new Chicken(),
            ...(isMobile ? [] : [new Chicken()]),
            new smallChicken(),
            ...(isMobile ? [] : [new smallChicken()]),
            // Zweiter Abschnitt (0)
            new Chicken(),
            ...(isMobile ? [] : [new Chicken()]),
            new smallChicken(),
            ...(isMobile ? [] : [new smallChicken()]),
            // Dritter Abschnitt (719)
            new Chicken(),
            ...(isMobile ? [] : [new Chicken()]),
            new smallChicken(),
            ...(isMobile ? [] : [new smallChicken()])
            // Vierter Abschnitt (719*2, 719*3) - nur Endboss, keine anderen Gegner
        ],

        [
            new Cloud()
        ],

        [
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

            new BackgroundObject('img/5_background/layers/air.png', 719*2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),
            new BackgroundObject('img/5_background/layers/air.png', 719*3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3)
        ],

        [
            // Erster Abschnitt (-719)
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins(),
            // Zweiter Abschnitt (0)
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins(),
            // Dritter Abschnitt (719)
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins()
            // Vierter Abschnitt (719*2, 719*3) - keine Coins
        ],

        [
            // Erster Abschnitt (-719)
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            // Zweiter Abschnitt (0)
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            // Dritter Abschnitt (719)
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle()
            // Vierter Abschnitt (719*2, 719*3) - keine Bottles
        ]
    );
}



function startGame() {
    if (gameStarted) {
        resetGame();
    } else {
        window.level1 = new Level(
            [
                new Chicken(),
                ...(isMobile ? [] : [new Chicken()]),
                new smallChicken(),
                ...(isMobile ? [] : [new smallChicken()]),
                new Chicken(),
                ...(isMobile ? [] : [new Chicken()]),
                new smallChicken(),
                ...(isMobile ? [] : [new smallChicken()]),
                new Chicken(),
                ...(isMobile ? [] : [new Chicken()]),
                new smallChicken(),
                ...(isMobile ? [] : [new smallChicken()])
            ],

            [
                new Cloud()
            ],

            [
                new BackgroundObject('img/5_background/layers/air.png', -719),
                new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
                new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
                new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

                new BackgroundObject('img/5_background/layers/air.png', 0),
                new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
                new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
                new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
                new BackgroundObject('img/5_background/layers/air.png', 719),
                new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
                new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
                new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

                new BackgroundObject('img/5_background/layers/air.png', 719*2),
                new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
                new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
                new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),
                new BackgroundObject('img/5_background/layers/air.png', 719*3),
                new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
                new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
                new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3)
            ],

            [
                new coins(),
                ...(isMobile ? [] : [new coins()]),
                new coins(),
                ...(isMobile ? [] : [new coins()]),
                new coins(),
                ...(isMobile ? [] : [new coins()]),
                new coins(),
                ...(isMobile ? [] : [new coins()]),
                new coins(),
                ...(isMobile ? [] : [new coins()]),
                new coins(),
                ...(isMobile ? [] : [new coins()]),
                new coins(),
                ...(isMobile ? [] : [new coins()]),
                new coins(),
                ...(isMobile ? [] : [new coins()]),
                new coins(),
                ...(isMobile ? [] : [new coins()])
            ],

            [
                new bottle(),
                ...(isMobile ? [] : [new bottle()]),
                new bottle(),
                ...(isMobile ? [] : [new bottle()]),
                new bottle(),
                ...(isMobile ? [] : [new bottle()]),
                new bottle(),
                ...(isMobile ? [] : [new bottle()]),
                new bottle(),
                ...(isMobile ? [] : [new bottle()]),
                new bottle(),
                ...(isMobile ? [] : [new bottle()]),
                new bottle(),
                ...(isMobile ? [] : [new bottle()]),
                new bottle(),
                ...(isMobile ? [] : [new bottle()]),
                new bottle(),
                ...(isMobile ? [] : [new bottle()])
            ]
        );
    }
    
    window.goToStartScreenCalled = false;
    
    gameStarted = true;
    gameRunning = true;
    
    if (audioManager) {
        audioManager.playBackgroundSound();
    }
    
    window.startButtonCoords = null;
    
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.add('hidden');
    
    world = new World(canvas, keyboard);
    
    world.level = window.level1;
    
    world.character.world = world;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.focus();
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);


}

function showGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.remove('hidden');
    
    if (audioManager) {
        audioManager.stopWalkingSound();
        audioManager.stopSnoringSound();
        if (audioManager.bossSquawkSound) {
            audioManager.bossSquawkSound.pause();
            audioManager.bossSquawkSound.currentTime = 0;
        }
    }
}

function goHome() {
    gameStarted = false;
    gameRunning = false;
    world = null;
    
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.add('hidden');
    
    drawStartScreen();
}

function goToStartScreen() {
    if (window.goToStartScreenCalled) {
        return;
    }
    window.goToStartScreenCalled = true;
    
    gameStarted = false;
    gameRunning = false;
    
    if (window.gameAnimationId) {
        cancelAnimationFrame(window.gameAnimationId);
        window.gameAnimationId = null;
    }
    
    if (world) {
        world = null;
    }
    
    if (audioManager) {
        audioManager.stopAllSounds();
    }
    
    drawStartScreen();
}

// Globale Funktion verfügbar machen
window.goToStartScreen = goToStartScreen;

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



function enterFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function toggleFullscreen() {
  const canvas = document.getElementById('canvas');
  const fullscreenButton = document.getElementById('fullscreenButton');
  
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    enterFullscreen(canvas);
    fullscreenButton.textContent = '⛶';
  } else {
    exitFullscreen();
    fullscreenButton.textContent = '⛶';
  }
}

function toggleSound() {
  if (audioManager) {
    audioManager.toggleSound();
  }
}

function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    if (settingsMenu) {
        settingsMenu.classList.toggle('hidden');
    }
}

function showInfo() {
    const infoModal = document.getElementById('infoModal');
    if (infoModal) {
        infoModal.classList.remove('hidden');
        const settingsMenu = document.getElementById('settingsMenu');
        if (settingsMenu) {
            settingsMenu.classList.add('hidden');
        }
    }
}

function hideInfo() {
    const infoModal = document.getElementById('infoModal');
    if (infoModal) {
        infoModal.classList.add('hidden');
    }
}



document.addEventListener('click', function(event) {
    const settingsButton = document.getElementById('settingsButton');
    const settingsMenu = document.getElementById('settingsMenu');
    
    if (settingsButton && settingsMenu && !settingsButton.contains(event.target) && !settingsMenu.contains(event.target)) {
        settingsMenu.classList.add('hidden');
    }
});

