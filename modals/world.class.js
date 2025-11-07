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
        wuCheckEnemyCollisions(this);
        wuCheckCoinCollisions(this);
        wuCheckBottleCollisions(this);
        wuCheckBossBottleCollision(this);
        wuCheckEnemyBottleCollision(this);
      }
    }, 50); 
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
   * Clears canvas and applies camera translation
   * @description Prepares drawing context with rounded camera offset
   */
  clearAndSetupCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentCamX = Math.round(this.camera_x);
    this.ctx.translate(this.currentCamX, 0);
  }

  /**
   * Draws map and entity layers
   * @description Renders background, enemies, collectibles, and characters
   */
  drawGameObjects() {
    wuAddObjectsToMap(this, this.level.backgroundObjects);
    wuAddObjectsToMap(this, this.level.clouds);
    wuAddObjectsToMap(this, this.level.enemies);
    wuAddObjectsToMap(this, this.level.coins);
    wuAddObjectsToMap(this, this.level.bottle);
    wuAddObjectsToMap(this, this.throwableObject);
    wuAddToMap(this, this.character);
    wuAddToMap(this, this.endBoss);
    wuAddObjectsToMap(this, this.splashes);
  }

  /**
   * Draws UI elements
   * @description Renders status bars and optional overlays
   */
  drawUIElements() {
    const offset = typeof this.currentCamX === 'number' ? this.currentCamX : this.camera_x;
    this.ctx.translate(-offset, 0);
    wuAddToMap(this, this.statusBar);
    wuAddToMap(this, this.statusBarEndboss);
    wuAddToMap(this, this.statusBarCoin);
    wuAddToMap(this, this.statusBarBottle);
    if (typeof drawMobileControls === 'function') drawMobileControls(this.ctx);
    if (typeof drawInGameSettingsButton === 'function') drawInGameSettingsButton(this.ctx);
    if (typeof window !== 'undefined' && window.settingsDropdownVisible && typeof drawInGameSettingsDropdown === 'function') {
      drawInGameSettingsDropdown(this.ctx);
    }
  }

  /**
   * Handles victory screen display
   * @returns {boolean} True if victory screen is shown, false otherwise
   * @description Shows victory screen and schedules return to start screen
   */
  handleVictoryScreen() {
    const victoryReady = this.endBoss.isDead && this.youWonImage.complete;
    if (!victoryReady) return false;
    wuAddToMap(this, this.endBoss);
    this.ctx.drawImage(this.youWonImage, 0, 0, this.canvas.width, this.canvas.height);
    if (!this.victoryScreenShown) {
      this.startVictorySequence();
    }
    if (!window.goToStartScreenCalled) {
      this.queueVictoryFrame();
    }
    return true;
  }

  /**
   * Handles game over screen display
   * @description Shows appropriate game over screen based on game state
   */
  handleGameOverScreen() {
    if (this.showGameOver && this.gameOverImage.complete) {
      this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
      if (!this.gameOverScreenShown) {
        this.gameOverScreenShown = true;
        this.stopGameOverAudio();
      }
      drawGameOverButtons(this.ctx);
      return;
    }
    if (this.character.isDead() && this.characterDeathTime) {
      this.drawYouLostFrame();
    }
  }

  /**
   * Stops all audio when game over occurs
   * @description Stops walking, snoring, background, and boss sounds
   */
  stopGameOverAudio() {
    const manager = this.getAudioManager();
    if (!manager) return;
    manager.stopWalkingSound();
    manager.stopSnoringSound();
    manager.stopBackgroundSound();
    this.resetBossSounds(manager);
  }

  /**
   * Starts victory handling sequence
   * @description Marks victory, stops audio, and schedules return to start screen
   */
  startVictorySequence() {
    this.victoryScreenShown = true;
    this.gameWon = true;
    this.stopVictoryAudio();
    setTimeout(() => {
      this.requestReturnToStart();
    }, 5000);
  }

  /**
   * Requests a return to the start screen
   * @description Tries world-scoped handler first, then global handler
   */
  requestReturnToStart() {
    const worldScope = this.window && typeof this.window.goToStartScreen === 'function' && !this.window.goToStartScreenCalled;
    if (worldScope) {
      this.window.goToStartScreen();
      return;
    }
    if (typeof window !== 'undefined' && typeof window.goToStartScreen === 'function' && !window.goToStartScreenCalled) {
      window.goToStartScreen();
    }
  }

  /**
   * Queues the next frame during victory screen
   * @description Keeps draw loop alive until start screen is shown
   */
  queueVictoryFrame() {
    this.currentAnimationFrame = requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws the "you lost" frame when appropriate
   * @description Shows temporary death screen before main game over
   */
  drawYouLostFrame() {
    const elapsed = new Date().getTime() - this.characterDeathTime;
    if (elapsed < 3000 && this.youLostImage.complete) {
      this.ctx.drawImage(this.youLostImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Stops all audio for victory screen
   * @description Uses shared cleanup to silence audio sources
   */
  stopVictoryAudio() {
    this.stopGameOverAudio();
  }

  /**
   * Resolves the current audio manager instance
   * @returns {AudioManager|null} The active audio manager if available
   */
  getAudioManager() {
    if (typeof window !== 'undefined' && window.audioManager) {
      return window.audioManager;
    }
    if (typeof audioManager !== 'undefined') {
      return audioManager;
    }
    return null;
  }

  /**
   * Resets boss-related audio effects
   * @param {AudioManager} manager - The audio manager to reset
   */
  resetBossSounds(manager) {
    if (manager.bossSquawkSound) {
      manager.bossSquawkSound.pause();
      manager.bossSquawkSound.currentTime = 0;
    }
    if (manager.enemyHitSound) {
      manager.enemyHitSound.pause();
      manager.enemyHitSound.currentTime = 0;
    }
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
      wuEnforceEndbossBlocking(this);
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
   * Creates and throws a bottle
   * @description Creates a new throwable bottle if the character has bottles available
   */
  throwBottle() {
    wuThrowBottle(this);
  }
}