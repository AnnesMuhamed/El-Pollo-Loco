function resetGame() {
    if (audioManager) {
        audioManager.stopWalkingSound();
    }
    
    gameStarted = false;
    gameRunning = false;
    world = null;
    
    keyboard = new Keyboard();
    audioManager = new AudioManager();
    
    resetGameOverStates();
    
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
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins(),
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins(),
            ...(isMobile ? [] : [new coins()]),
            new coins()
        ],

        [
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle(),
            ...(isMobile ? [] : [new bottle()]),
            new bottle()
        ]
    );
}

function resetGameOverStates() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
        gameOverScreen.classList.add('hidden');
    }
    
    if (world) {
        world.showGameOver = false;
        world.gameOverScreenShown = false;
        world.characterDeathTime = null;
    }
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
    
    resetGameOverStates();
    
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
        audioManager.stopBackgroundSound();
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
    
    window.goToStartScreenCalled = false;
}

window.goToStartScreen = goToStartScreen; 