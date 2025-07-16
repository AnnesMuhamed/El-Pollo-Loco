let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let gameRunning = false;

function init() {
   canvas = document.getElementById('canvas');
   setupMobileControls();
   drawStartScreen();
   setupCanvasClickHandler();
}

function drawStartScreen() {
    const ctx = canvas.getContext('2d');
    const startScreenImage = new Image();
    startScreenImage.onload = function() {
        ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
        drawStartButton(ctx);
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

function setupCanvasClickHandler() {
    canvas.addEventListener('click', function(e) {
        if (!gameStarted) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const canvasX = x * scaleX;
            const canvasY = y * scaleY;
            
            if (window.startButtonCoords) {
                const btn = window.startButtonCoords;
                if (canvasX >= btn.x && canvasX <= btn.x + btn.width &&
                    canvasY >= btn.y && canvasY <= btn.y + btn.height) {
                    startGame();
                }
            }
        }
    });
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
            new Chicken(),
            new smallChicken(),
            new smallChicken(),
            // Zweiter Abschnitt (0)
            new Chicken(),
            new Chicken(),
            new smallChicken(),
            new smallChicken(),
            // Dritter Abschnitt (719)
            new Chicken(),
            new Chicken(),
            new smallChicken(),
            new smallChicken()
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
            new coins(),
            new coins(),
            new coins(),
            new coins(),
            // Zweiter Abschnitt (0)
            new coins(),
            new coins(),
            new coins(),
            new coins(),
            new coins(),
            // Dritter Abschnitt (719)
            new coins(),
            new coins(),
            new coins(),
            new coins(),
            new coins()
            // Vierter Abschnitt (719*2, 719*3) - keine Coins
        ],

        [
            // Erster Abschnitt (-719)
            new bottle(),
            new bottle(),
            new bottle(),
            new bottle(),
            new bottle(),
            // Zweiter Abschnitt (0)
            new bottle(),
            new bottle(),
            new bottle(),
            new bottle(),
            new bottle(),
            // Dritter Abschnitt (719)
            new bottle(),
            new bottle(),
            new bottle(),
            new bottle(),
            new bottle()
            // Vierter Abschnitt (719*2, 719*3) - keine Bottles
        ]
    );
}

function showMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (mobileControls && isMobileDevice) {
        mobileControls.classList.remove('hidden');
    } else if (mobileControls) {
        mobileControls.classList.add('hidden');
    }
}

function hideMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) {
        mobileControls.classList.add('hidden');
    }
}

function startGame() {
    if (gameStarted) {
        resetGame();
    } else {
        window.level1 = new Level(
            [
                new Chicken(),
                new Chicken(),
                new smallChicken(),
                new smallChicken(),
                new Chicken(),
                new Chicken(),
                new smallChicken(),
                new smallChicken(),
                new Chicken(),
                new Chicken(),
                new smallChicken(),
                new smallChicken()
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
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins(),
                new coins()
            ],

            [
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle()
            ]
        );
    }
    
    gameStarted = true;
    gameRunning = true;
    
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

    showMobileControls();
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
    hideMobileControls();
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
    gameStarted = false;
    gameRunning = false;
    world = null;
    
    if (audioManager) {
        audioManager.stopWalkingSound();
        audioManager.stopSnoringSound();
        if (audioManager.bossSquawkSound) {
            audioManager.bossSquawkSound.pause();
            audioManager.bossSquawkSound.currentTime = 0;
        }
    }
    
    drawStartScreen();
    hideMobileControls();
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

function setupMobileControls() {
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnJump = document.getElementById('btnJump');
    const btnThrow = document.getElementById('btnThrow');

    if (!btnLeft || !btnRight || !btnJump || !btnThrow) return;

    function addButtonControl(btn, keyDown, keyUp) {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); keyDown(); });
        btn.addEventListener('mousedown', (e) => { e.preventDefault(); keyDown(); });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); keyUp(); });
        btn.addEventListener('mouseup', (e) => { e.preventDefault(); keyUp(); });
        btn.addEventListener('mouseleave', (e) => { e.preventDefault(); keyUp(); });
    }

    addButtonControl(btnLeft,  () => keyboard.LEFT = true,  () => keyboard.LEFT = false);
    addButtonControl(btnRight, () => keyboard.RIGHT = true, () => keyboard.RIGHT = false);
    addButtonControl(btnJump,  () => keyboard.SPACE = true, () => keyboard.SPACE = false);
    addButtonControl(btnThrow, () => keyboard.D = true,    () => keyboard.D = false);
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

document.addEventListener('DOMContentLoaded', setupMobileControls);

document.addEventListener('click', function(event) {
    const settingsButton = document.getElementById('settingsButton');
    const settingsMenu = document.getElementById('settingsMenu');
    
    if (settingsButton && settingsMenu && !settingsButton.contains(event.target) && !settingsMenu.contains(event.target)) {
        settingsMenu.classList.add('hidden');
    }
});

