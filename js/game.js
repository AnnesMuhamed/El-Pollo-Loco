let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let gameRunning = false;

function init() {
   canvas = document.getElementById('canvas');
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

function startGame() {
    if (gameStarted) {
        resetGame();
    } else {
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
    
    gameStarted = true;
    gameRunning = true;
    
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.add('hidden');
    
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.add('hidden');
    
    world = new World(canvas, keyboard);
    
    world.level = window.level1;
    
    world.character.world = world;
    
    canvas.focus();
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);
}

function showGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.remove('hidden');
    
    // Stoppe das Footstep-Audio beim Game Over
    if (audioManager) {
        audioManager.stopWalkingSound();
        audioManager.stopSnoringSound();
    }
}

function goHome() {
    gameStarted = false;
    gameRunning = false;
    world = null;
    
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.add('hidden');
    
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.remove('hidden');
}

function goToStartScreen() {
    gameStarted = false;
    gameRunning = false;
    world = null;
    
    // Stoppe das Footstep-Audio beim Gewinnen
    if (audioManager) {
        audioManager.stopWalkingSound();
        audioManager.stopSnoringSound();
    }
    
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.remove('hidden');
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
        // M key released - no action needed for sound toggle
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

