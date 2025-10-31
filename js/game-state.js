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
 * Resets the game state and initializes a new game
 * @description Resets all game variables, creates new level, and prepares for a new game session
 */
function resetGame() {
    stopAudioAndResetFlags();
    resetGameOverStates();
    createNewInstances();
    
    window.level1 = initLevel1();
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
    return initLevel1();
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
    if (world && world.endBoss) {
        world.endBoss.cleanup();
    }
    
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
 * Starts a new game session and background sound after user interaction
 * @description Initializes audio and then begins game setup and rendering
 */
function startGame() {
    setupAudio();
    if (gameStarted) {
        resetGame();
    } else {
        window.level1 = createInitialLevel();
    }
    resetVictoryStates();
    initializeGameState();
    createGameWorld();
    setupCanvasAndEvents();
}

/**
 * Sets a flag to prevent duplicate start screen calls
 * @returns {boolean} True if already set, otherwise false
 */
function setAndCheckStartScreenFlag() {
    if (window.goToStartScreenCalled) {
        return true;
    }
    window.goToStartScreenCalled = true;
    return false;
}

/**
 * Sets core game running states to false
 */
function pauseGameFlags() {
    gameStarted = false;
    gameRunning = false;
}

/**
 * Cancels animation frame if active
 */
function stopMainAnimationFrame() {
    if (window.gameAnimationId) {
        cancelAnimationFrame(window.gameAnimationId);
        window.gameAnimationId = null;
    }
}

/**
 * Stops world animation loop if needed
 */
function stopWorldAnimationLoop() {
    if (world && world.lastFrameTime) {
        world.stopAnimation();
    }
}

/**
 * Clears world reference
 */
function clearWorldReference() {
    if (world) {
        world = null;
    }
}

/**
 * Stops all audio when returning to start screen
 */
function stopAllAudioOnReturn() {
    if (audioManager) {
        audioManager.stopAllSounds();
    }
}

/**
 * Draws the start screen
 */
function renderStartScreen() {
    drawStartScreen();
}

/**
 * Resets start screen flag after timeout
 */
function resetStartScreenFlagWithDelay() {
    setTimeout(() => {
        window.goToStartScreenCalled = false;
    }, 7000);
}

/**
 * Returns to the start screen after victory
 * @description Resets game state, stops all sounds, and shows start screen
 */
function goToStartScreen() {
    if (setAndCheckStartScreenFlag()) { return; }
    pauseGameFlags();
    stopMainAnimationFrame();
    stopWorldAnimationLoop();
    clearWorldReference();
    stopAllAudioOnReturn();
    renderStartScreen();
    resetStartScreenFlagWithDelay();
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

window.startGame = startGame;
window.goToStartScreen = goToStartScreen;
window.restartGame = restartGame;
window.goHome = goHome; 