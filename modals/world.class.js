class World {
  character = new Character();
  endBoss = new Endboss();
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = -0;
  statusBar = new StatusBar();
  statusBarBottle = new StatusBarBottle();
  statusBarCoin = new StatusBarCoin();
  statusBarEndboss = new StatusBarEndboss();
  throwableObject = [];
  splashes = [];
  youWonImage;
  youLostImage;
  gameOverImage;
  characterDeathTime;
  showGameOver = false;
  gameOverScreenShown = false;
  gameWon = false;
  victoryScreenShown = false;

  /**
   * Creates a new World instance
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on
   * @param {Keyboard} keyboard - The keyboard input handler
   * @description Initializes the game world, sets up canvas context and starts game loops
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level1;
    this.loadYouWonImage();
    this.loadGameOverImages();
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  /**
   * Loads the "You won A.png" image
   * @description Loads the victory screen image
   */
  loadYouWonImage() {
    this.youWonImage = new Image();
    this.youWonImage.src = 'img/You won, you lost/You won A.png';
  }

  /**
   * Loads the game over images
   * @description Loads the "You lost b.png" and "Game Over.png" images
   */
  loadGameOverImages() {
    this.youLostImage = new Image();
    this.youLostImage.src = 'img/You won, you lost/You lost b.png';
    this.gameOverImage = new Image();
    this.gameOverImage.src = 'img/You won, you lost/Game Over.png';
  }

  /**
   * Sets the world reference for the character
   * @description Allows the character to access world properties and methods
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts collision detection loops
   * @description Checks for collisions every 200ms
   */
  checkCollisions() {
    this.collisionInterval = setInterval(() => {
      if (!window.goToStartScreenCalled) {
      this.checkEnemyCollisions();
      this.checkCoinCollisions();
      this.checkBottleCollisions();
      this.checkBossBottleCollision();
        this.checkEnemyBottleCollision(); 
      }
    }, 50); 
  }

  /**
   * Checks for collisions between character and enemies
   * @description Handles enemy death when jumped on and character damage on side collision
   */
  checkEnemyCollisions() {
    wuCheckEnemyCollisions(this);
  }

  /**
   * Handles collision between character and boss
   * @description Manages boss attacks and character damage
   */
  handleBossCollision() {
    return wuHandleBossCollision(this);
  }

  /**
   * Handles Mario-style jump-kill collision
   * @param {Object} enemy - The enemy to check collision with
   * @returns {boolean} True if jump-kill occurred, false otherwise
   * @description Kills enemy when character jumps on them
   */
  handleJumpKillCollision(enemy) {
    return wuHandleJumpKillCollision(this, enemy);
  }

  /**
   * Handles side collision between character and enemy
   * @param {Object} enemy - The enemy to check collision with
   * @description Manages character damage on side collision with enemies
   */
  handleSideCollision(enemy) {
    wuHandleSideCollision(this, enemy);
  }

  /**
   * Checks if character has died and handles death sequence
   * @description Initiates game over sequence when character dies
   */
  checkCharacterDeath() {
    wuCheckCharacterDeath(this);
  }

  /**
   * Checks for collisions between bottles and boss
   * @description Handles bottle hits on the endboss
   */
  checkBossBottleCollision() {
    wuCheckBossBottleCollision(this);
  }

  /**
   * Checks for collisions between bottles and enemies
   * @description Handles bottle hits on regular enemies
   */
  checkEnemyBottleCollision() {
    wuCheckEnemyBottleCollision(this);
  }

  /**
   * Handles bottle hit on enemy
   * @param {Object} bottle - The bottle that hit the enemy
   * @param {number} bottleIndex - Index of the bottle in throwableObject array
   * @param {Object} enemy - The enemy that was hit
   * @description Removes bottle and kills enemy
   */
  handleEnemyBottleHit(bottle, bottleIndex, enemy) {
    wuHandleEnemyBottleHit(this, bottle, bottleIndex, enemy);
  }

  /**
   * Handles bottle hit on boss
   * @param {Object} bottle - The bottle that hit the boss
   * @param {number} index - Index of the bottle in throwableObject array
   * @description Removes bottle and damages boss
   */
  handleBossHit(bottle, index) {
    wuHandleBossHit(this, bottle, index);
  }

  /**
   * Spawns a bottle splash effect at the bottle's impact position
   * @param {ThrowableObject} bottle
   */
  spawnBottleSplash(bottle, target) {
    wuSpawnBottleSplash(this, bottle, target);
  }

  /**
   * Checks if boss has died and handles victory
   * @description Sets game as won when boss energy reaches 0
   */
  checkBossDeath() {
    wuCheckBossDeath(this);
  }

  /**
   * Checks for collisions between character and coins
   * @description Handles coin collection
   */
  checkCoinCollisions() {
    wuCheckCoinCollisions(this);
  }

  /**
   * Collects a coin and updates status bar
   * @param {number} index - Index of the coin to collect
   * @description Removes coin from level and increases coin counter
   */
  collectCoin(index) {
    wuCollectCoin(this, index);
  }

  /**
   * Checks for collisions between character and bottles
   * @description Handles bottle collection
   */
  checkBottleCollisions() {
    wuCheckBottleCollisions(this);
  }

  /**
   * Collects a bottle and updates status bar
   * @param {number} index - Index of the bottle to collect
   * @description Removes bottle from level and increases bottle counter
   */
  collectBottle(index) {
    wuCollectBottle(this, index);
  }

  /**
   * Stops the animation loop
   * @description Cancels the current animation frame and resets frame timing
   */
  stopAnimation() {
    this.lastFrameTime = null;
    if (this.currentAnimationFrame) {
      cancelAnimationFrame(this.currentAnimationFrame);
      this.currentAnimationFrame = null;
    }
  }

  /**
   * Manages frame rate for smooth animation
   * @returns {boolean} True if frame should be drawn, false otherwise
   * @description Ensures consistent 60 FPS animation
   */
  handleFrameRate() {
    const now = performance.now();
    if (!this.lastFrameTime) {
      this.lastFrameTime = now;
    }
    
    const deltaTime = now - this.lastFrameTime;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    
    if (deltaTime < frameInterval) {
      if (!window.goToStartScreenCalled) {
        this.currentAnimationFrame = requestAnimationFrame(() => this.draw());
      }
      return false;
    }
    
    this.lastFrameTime = now - (deltaTime % frameInterval);
    return true;
  }

  /**
   * Clears canvas and sets up camera translation
   * @description Prepares canvas for drawing with camera offset
   */
  clearAndSetupCanvas() {
    wuClearAndSetupCanvas(this);
  }

  /**
   * Draws all game objects on the canvas
   * @description Renders background, enemies, collectibles, and characters
   */
  drawGameObjects() {
    wuDrawGameObjects(this);
  }

  /**
   * Draws UI elements on the canvas
   * @description Renders status bars and mobile controls
   */
  drawUIElements() {
    wuDrawUIElements(this);
  }

  /**
   * Handles victory screen display
   * @returns {boolean} True if victory screen is shown, false otherwise
   * @description Shows victory screen and schedules return to start screen
   */
  handleVictoryScreen() {
    return wuHandleVictoryScreen(this);
  }

  /**
   * Handles game over screen display
   * @description Shows appropriate game over screen based on game state
   */
  handleGameOverScreen() {
    wuHandleGameOverScreen(this);
  }

  /**
   * Stops all audio when game over occurs
   * @description Stops walking, snoring, background, and boss sounds
   */
  stopGameOverAudio() {
    wuStopGameOverAudio();
  }

  /**
   * Main drawing loop for the game
   * @description Orchestrates the entire rendering process
   */
  draw() {
    if (!this.handleFrameRate()) {
      return;
    }

    if (!this.endBoss.isDead) {
      this.enforceEndbossBlocking();
    }

    this.clearAndSetupCanvas();
    this.drawGameObjects();
    this.drawUIElements();

    if (this.handleVictoryScreen()) {
      return;
    }

    this.handleGameOverScreen();

    if (!this.victoryScreenShown && !this.showGameOver && typeof gameRunning !== 'undefined' && gameRunning && world && !window.goToStartScreenCalled) {
      this.currentAnimationFrame = requestAnimationFrame(() => this.draw());
    }
  }

  /**
   * Prevents the character from passing the endboss horizontally
   */
  enforceEndbossBlocking() {
    wuEnforceEndbossBlocking(this);
  }

  /**
   * Adds multiple objects to the game map
   * @param {Array} objects - Array of objects to add to the map
   */
  addObjectsToMap(objects) {
    wuAddObjectsToMap(this, objects);
  }

  /**
   * Adds a single object to the game map
   * @param {DrawableObject} mo - The object to add to the map
   * @description Handles object drawing and direction flipping
   */
  addToMap(mo) {
    wuAddToMap(this, mo);
  }

  /**
   * Flips an image horizontally
   * @param {DrawableObject} mo - The object to flip
   */
  flipImage(mo) {
    wuFlipImage(this, mo);
  }

  /**
   * Restores an image to its original orientation
   * @param {DrawableObject} mo - The object to restore
   */
  flipImageBack(mo) {
    wuFlipImageBack(this, mo);
  }

  /**
   * Creates and throws a bottle
   * @description Creates a new throwable bottle if the character has bottles available
   */
  throwBottle() {
    wuThrowBottle(this);
  }
}