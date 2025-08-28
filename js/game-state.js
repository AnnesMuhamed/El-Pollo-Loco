let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * Stops walking sound and resets game flags
 * @description Stops audio and resets game state variables
 */
function stopAudioAndResetFlags() {
    if (audioManager) {
        audioManager.stopWalkingSound();
    }
    
    gameStarted = false;
    gameRunning = false;
    world = null;
}

/**
 * Creates new keyboard and audio manager instances
 * @description Initializes fresh input and audio systems
 */
function createNewInstances() {
    keyboard = new Keyboard();
    audioManager = new AudioManager();
    resetGameOverStates();
}

/**
 * Creates enemies array for the level
 * @returns {Array} Array of enemy objects
 * @description Creates enemies with mobile/desktop differentiation
 */
function createEnemiesArray() {
    const enemies = [
        new Chicken(),
        new smallChicken(),
        new Chicken(),
        new smallChicken(),
        new Chicken(),
        new smallChicken()
    ];

    if (!isMobile) {
        enemies.push(
            new Chicken(),
            new smallChicken(),
            new Chicken(),
            new smallChicken(),
            new Chicken(),
            new smallChicken()
        );
    }

    return enemies;
}

/**
 * Creates background objects array for the level
 * @returns {Array} Array of background objects
 * @description Creates layered background objects with proper positioning
 */
function createBackgroundObjectsArray() {
    return [
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
    ];
}

/**
 * Creates coins array for the level
 * @returns {Array} Array of coin objects
 * @description Creates coins with mobile/desktop differentiation
 */
function createCoinsArray() {
    const coins = [
        new window.coins(),
        new window.coins(),
        new window.coins(),
        new window.coins(),
        new window.coins()
    ];

    if (!isMobile) {
        coins.push(
            new window.coins(),
            new window.coins(),
            new window.coins(),
            new window.coins(),
            new window.coins()
        );
    }

    return coins;
}

/**
 * Creates bottles array for the level
 * @returns {Array} Array of bottle objects
 * @description Creates bottles with mobile/desktop differentiation
 */
function createBottlesArray() {
    const bottles = [
        new window.bottle(),
        new window.bottle(),
        new window.bottle(),
        new window.bottle(),
        new window.bottle()
    ];

    if (!isMobile) {
        bottles.push(
            new window.bottle(),
            new window.bottle(),
            new window.bottle(),
            new window.bottle(),
            new window.bottle()
        );
    }

    return bottles;
}

/**
 * Resets the game state and initializes a new game
 * @description Resets all game variables, creates new level, and prepares for a new game session
 */
function resetGame() {
    stopAudioAndResetFlags();
    resetGameOverStates();
    createNewInstances();
    
    const enemies = createEnemiesArray();
    const clouds = [new Cloud()];
    const backgroundObjects = createBackgroundObjectsArray();
    const coins = createCoinsArray();
    const bottles = createBottlesArray();

    window.level1 = new Level(enemies, clouds, backgroundObjects, coins, bottles);
}

/**
 * Resets all game over related states
 * @description Resets related flags
 */
function resetGameOverStates() {
    if (world) {
        world.showGameOver = false;
        world.gameOverScreenShown = false;
        world.characterDeathTime = null;
        world.gameWon = false;
        world.victoryScreenShown = false;
        world.hitEnemies.clear();
    }
    
    window.goToStartScreenCalled = false;
}

/**
 * Resets victory screen states
 * @description Resets all victory-related flags
 */
function resetVictoryStates() {
    if (world) {
        world.victoryScreenShown = false;
        world.gameWon = false;
        world.showGameOver = false;
        world.gameOverScreenShown = false;
        world.characterDeathTime = null;
    }
    window.goToStartScreenCalled = false;
}

/**
 * Creates the initial level for a new game
 * @returns {Level} The created level object
 * @description Creates a new level with enemies, clouds, background, coins, and bottles
 */
function createInitialLevel() {
    const enemies = [
        new Chicken(),
        new smallChicken(),
        new Chicken(),
        new smallChicken(),
        new Chicken(),
        new smallChicken(),
        new Chicken(),
        new smallChicken()
    ];

    if (!isMobile) {
        enemies.push(
            new Chicken(),
            new smallChicken(),
            new Chicken(),
            new smallChicken()
        );
    }

    const clouds = [
        new Cloud()
    ];

    const backgroundObjects = [
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
    ];

    const coins = [
        new window.coins(),
        new window.coins(),
        new window.coins(),
        new window.coins(),
        new window.coins()
    ];

    if (!isMobile) {
        coins.push(
            new window.coins(),
            new window.coins(),
            new window.coins(),
            new window.coins(),
            new window.coins()
        );
    }

    const bottles = [
        new window.bottle(),
        new window.bottle(),
        new window.bottle(),
        new window.bottle(),
        new window.bottle()
    ];

    if (!isMobile) {
        bottles.push(
            new window.bottle(),
            new window.bottle(),
            new window.bottle(),
            new window.bottle(),
            new window.bottle()
        );
    }

    return new Level(enemies, clouds, backgroundObjects, coins, bottles);
}

/**
 * Initializes game state variables
 * @description Sets up game flags and resets necessary variables
 */
function initializeGameState() {
    window.goToStartScreenCalled = false;
    gameStarted = true;
    gameRunning = true;
    window.startButtonCoords = null;
}

/**
 * Sets up audio and starts background music
 * @description Initializes audio manager and plays background sound
 */
function setupAudio() {
    if (audioManager) {
        audioManager.playBackgroundSound();
    }
}

/**
 * Creates and initializes the game world
 * @description Creates new world instance and sets up character
 */
function createGameWorld() {
    resetGameOverStates();
    world = new World(canvas, keyboard);
    world.level = window.level1;
    world.character.world = world;
}

/**
 * Sets up canvas and keyboard events
 * @description Clears canvas and adds keyboard event listeners
 */
function setupCanvasAndEvents() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.focus();
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);
}

/**
 * Starts a new game session
 * @description Initializes game state, creates level, and begins gameplay
 */
function startGame() {
    if (gameStarted) {
        resetGame();
    } else {
        window.level1 = createInitialLevel();
    }
    
    resetVictoryStates();
    initializeGameState();
    setupAudio();
    createGameWorld();
    setupCanvasAndEvents();
}





/**
 * Returns to the start screen after victory
 * @description Resets game state, stops all sounds, and shows start screen
 */
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
    
    if (world && world.lastFrameTime) {
        world.stopAnimation();
    }
    
    if (world) {
        world = null;
    }
    
    if (audioManager) {
        audioManager.stopAllSounds();
    }
    
    drawStartScreen();
    
    setTimeout(() => {
        window.goToStartScreenCalled = false;
    }, 7000);
}

/**
 * Restarts the game with complete reset
 * @description Resets all game states and starts a new game
 */
function restartGame() {
    if (world) {
        world.stopAnimation();
        world = null;
    }
    
    if (audioManager) {
        audioManager.stopAllSounds();
    }
    
    resetGameOverStates();
    resetVictoryStates();
    
    gameStarted = false;
    gameRunning = false;
    
    window.level1 = createInitialLevel();
    resetVictoryStates();
    initializeGameState();
    setupAudio();
    createGameWorld();
    setupCanvasAndEvents();
}

/**
 * Returns to home screen from game over
 * @description Resets game state and shows start screen
 */
function goHome() {
    if (world) {
        world.stopAnimation();
        world = null;
    }
    
    if (audioManager) {
        audioManager.stopAllSounds();
    }
    
    resetGameOverStates();
    resetVictoryStates();
    
    gameStarted = false;
    gameRunning = false;
    
    drawStartScreen();
}

window.goToStartScreen = goToStartScreen;
window.restartGame = restartGame;
window.goHome = goHome; 