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
  hitEnemies = new Set();

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
    // Finde nächstgelegenen Enemy im Jump-Bereich
    let closestEnemy = null;
    let closestDistance = Infinity;
    let jumpKillOccurred = false;

    for (let enemy of this.level.enemies) {
      if (enemy.isDead) continue;
      
      // Prüfe ob Character auf Enemy springt
      if (this.character.isJumpingOnEnemy(enemy)) {
        let distance = Math.abs(this.character.x - enemy.x);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      }
    }

    // Nur den nächstgelegenen Enemy treffen
    if (closestEnemy) {
      this.handleJumpKillCollision(closestEnemy);
      jumpKillOccurred = true;
    }

    // Side-Collisions nur prüfen wenn kein Jump-Kill stattfand
    if (!jumpKillOccurred) {
      for (let enemy of this.level.enemies) {
        if (enemy.isDead) continue;
        this.handleSideCollision(enemy);
      }
    }
    
    // Endboss Kollision prüfen (ohne Hurt-Animation Einschränkung für kontinuierlichen Schaden)
    if (!this.endBoss.isDead) {
      const bossCollisionActive = this.handleBossCollision();
      // Blocking nur wenn keine Kollision aktiv ist
      if (!bossCollisionActive) {
        this.enforceEndbossBlocking();
      }
    }
  }

  /**
   * Handles collision between character and boss
   * @description Manages boss attacks and character damage
   */
  handleBossCollision() {
    if (this.character.isColliding(this.endBoss)) {
      if (!this.endBoss.isPlayingAttackAnimation) {
        this.character.hit();
        this.statusBar.setPercentage((this.character.energy / 100) * 100);
        this.checkCharacterDeath();
        this.endBoss.startAttackAnimation();
      }
      // Während Kollision: Kein Blocking, Character kann Schaden nehmen
      return true; // Kollision aktiv
    }
    return false; // Keine Kollision
  }

  /**
   * Handles Mario-style jump-kill collision
   * @param {Object} enemy - The enemy to check collision with
   * @returns {boolean} True if jump-kill occurred, false otherwise
   * @description Kills enemy when character jumps on them
   */
  handleJumpKillCollision(enemy) {
      if (this.character.isJumpingOnEnemy(enemy)) {
        enemy.isDead = true;
        audioManager.playEnemyHitSound();
      
      // Character springt nach Jump-Kill wieder hoch (niedriger als normaler Sprung)
      this.character.speedY = 20;  // Niedriger als Space-Sprung (30)
      this.character.jumpStartY = this.character.y;
      this.character.isJumpingUp = true;
      this.character.isJumpingDown = false;
      this.character.currentImage = 0;  // Reset Jump-Animation
      
      return true;
    }
    return false;
  }

  /**
   * Handles side collision between character and enemy
   * @param {Object} enemy - The enemy to check collision with
   * @description Manages character damage on side collision with enemies
   */
  handleSideCollision(enemy) {
    const distance = Math.abs(this.character.x - enemy.x);
    
    if (distance < 200 && this.character.isColliding(enemy) && !this.hitEnemies.has(enemy)) {
        this.character.hit();
      const percentage = (this.character.energy / 100) * 100;
      this.statusBar.setPercentage(percentage);
      this.checkCharacterDeath();
      this.hitEnemies.add(enemy);
    }
  }

  /**
   * Checks if character has died and handles death sequence
   * @description Initiates game over sequence when character dies
   */
  checkCharacterDeath() {
        if (this.character.isDead() && !this.characterDeathTime) {
          this.characterDeathTime = new Date().getTime();
          this.gameOverScreenShown = false;
      setTimeout(() => { this.showGameOver = true; }, 3000);
        }
  }

  /**
   * Checks for collisions between bottles and boss
   * @description Handles bottle hits on the endboss
   */
  checkBossBottleCollision() {
    for (let i = this.throwableObject.length - 1; i >= 0; i--) {
      let bottle = this.throwableObject[i];
      if (bottle.isColliding(this.endBoss)) {
        this.handleBossHit(bottle, i);
      }
    }
  }

  /**
   * Checks for collisions between bottles and enemies
   * @description Handles bottle hits on regular enemies
   */
  checkEnemyBottleCollision() {
    for (let i = this.throwableObject.length - 1; i >= 0; i--) {
      let bottle = this.throwableObject[i];
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead && bottle.isColliding(enemy)) {
          this.handleEnemyBottleHit(bottle, i, enemy);
        }
      });
    }
  }

  /**
   * Handles bottle hit on enemy
   * @param {Object} bottle - The bottle that hit the enemy
   * @param {number} bottleIndex - Index of the bottle in throwableObject array
   * @param {Object} enemy - The enemy that was hit
   * @description Removes bottle and kills enemy
   */
  handleEnemyBottleHit(bottle, bottleIndex, enemy) {
    this.throwableObject.splice(bottleIndex, 1); 
    enemy.isDead = true;
    audioManager.playEnemyHitSound();  
    this.spawnBottleSplash(bottle, enemy);
  }

  /**
   * Handles bottle hit on boss
   * @param {Object} bottle - The bottle that hit the boss
   * @param {number} index - Index of the bottle in throwableObject array
   * @description Removes bottle and damages boss
   */
  handleBossHit(bottle, index) {
    this.throwableObject.splice(index, 1);
        this.endBoss.hit();
        audioManager.playBossHitSound();
        if (Math.abs(this.character.x - this.endBoss.x) < 400) {
          audioManager.playBossSquawkSound();
        }
        this.statusBarEndboss.setEndbossStatusbarPercentage(this.endBoss.energy);
    this.checkBossDeath();
    this.spawnBottleSplash(bottle, this.endBoss);
  }

  /**
   * Spawns a bottle splash effect at the bottle's impact position
   * @param {ThrowableObject} bottle
   */
  spawnBottleSplash(bottle, target) {
    const splashWidth = 60;
    const splashHeight = 60;
    const insideOverlap = 16; // stärker in die Hitbox hinein

    let x;
    let y;

    if (target && typeof bottle.speed === 'number') {
      const oLeft = (target.offset && target.offset.left) ? target.offset.left : 0;
      const oRight = (target.offset && target.offset.right) ? target.offset.right : 0;
      const oTop = (target.offset && target.offset.top) ? target.offset.top : 0;
      const oBottom = (target.offset && target.offset.bottom) ? target.offset.bottom : 0;

      const hitboxLeft = target.x + oLeft;
      const hitboxRight = target.x + target.width - oRight;
      const hitboxTop = target.y + oTop;
      const hitboxBottom = target.y + target.height - oBottom;
      const impactCenterY = bottle.y + bottle.height * 0.5;
      const clampedImpactTop = Math.max(hitboxTop, Math.min(impactCenterY - splashHeight * 0.5, hitboxBottom - splashHeight));

      // Horizontal exakt an der Zielkante ausrichten
      if (bottle.speed > 0) {
        // Bottle kam von links -> Splash rechte Kante an Hitbox-Left, dann insideOverlap in das Ziel
        x = hitboxLeft - splashWidth + insideOverlap;
      } else if (bottle.speed < 0) {
        // Bottle kam von rechts -> Splash linke Kante an Hitbox-Right, dann insideOverlap in das Ziel
        x = hitboxRight - insideOverlap;
      } else {
        // Fallback: mittig um die Bottle
        x = bottle.x + bottle.width * 0.5 - splashWidth * 0.5;
      }
      // Vertikal an der Impact-Höhe ausrichten (innerhalb der Hitbox clampen)
      y = clampedImpactTop;
    } else {
      // Fallback ohne Ziel: um die Bottle zentrieren
      x = bottle.x + bottle.width * 0.5 - splashWidth * 0.5;
      y = bottle.y + bottle.height * 0.5 - splashHeight * 0.5;
    }

    const splash = new BottleSplash(x, y);
    this.splashes.push(splash);
    setTimeout(() => {
      const idx = this.splashes.indexOf(splash);
      if (idx !== -1) this.splashes.splice(idx, 1);
    }, 500);
  }

  /**
   * Checks if boss has died and handles victory
   * @description Sets game as won when boss energy reaches 0
   */
  checkBossDeath() {
        if (this.endBoss.energy <= 0) {
          this.endBoss.isDead = true;
          if (audioManager.bossSquawkSound) {
            audioManager.bossSquawkSound.pause();
            audioManager.bossSquawkSound.currentTime = 0;
          }
          this.gameWon = true;
          audioManager.playBossDeathSound();
    }
  }

  /**
   * Checks for collisions between character and coins
   * @description Handles coin collection
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.collectCoin(index);
      }
    });
  }

  /**
   * Collects a coin and updates status bar
   * @param {number} index - Index of the coin to collect
   * @description Removes coin from level and increases coin counter
   */
  collectCoin(index) {
    this.level.coins.splice(index, 1);
    this.statusBarCoin.setCoinStatusbarPercentage(this.statusBarCoin.coinStatusbarPercentage + 1);
    audioManager.playCollectCoinsSound();
  }

  /**
   * Checks for collisions between character and bottles
   * @description Handles bottle collection
   */
  checkBottleCollisions() {
    this.level.bottle.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.collectBottle(index);
      }
    });
  }

  /**
   * Collects a bottle and updates status bar
   * @param {number} index - Index of the bottle to collect
   * @description Removes bottle from level and increases bottle counter
   */
  collectBottle(index) {
    this.level.bottle.splice(index, 1);
    this.statusBarBottle.setBottleStatusbarPercentage(this.statusBarBottle.bottleStatusbarPercentage + 1);
    audioManager.playCollectBottleSound();
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }

  /**
   * Draws all game objects on the canvas
   * @description Renders background, enemies, collectibles, and characters
   */
  drawGameObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottle);
    this.addObjectsToMap(this.throwableObject);
    
    this.addToMap(this.character);
    this.addToMap(this.endBoss);
    this.addObjectsToMap(this.splashes);
  }

  /**
   * Draws UI elements on the canvas
   * @description Renders status bars and mobile controls
   */
  drawUIElements() {
    this.ctx.translate(-this.camera_x, 0);
    
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarEndboss);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);

    if (typeof drawMobileControls === 'function') {
        drawMobileControls(this.ctx);
    }

    // Settings Button auch im Spiel anzeigen
    if (typeof drawInGameSettingsButton === 'function') {
        drawInGameSettingsButton(this.ctx);
    }
    
    // Settings Dropdown im Spiel anzeigen
    if (window.settingsDropdownVisible && typeof drawInGameSettingsDropdown === 'function') {
        drawInGameSettingsDropdown(this.ctx);
    }
  }

  /**
   * Handles victory screen display
   * @returns {boolean} True if victory screen is shown, false otherwise
   * @description Shows victory screen and schedules return to start screen
   */
  handleVictoryScreen() {
    if (this.endBoss.isDead && this.youWonImage.complete) {
      this.addToMap(this.endBoss);
      this.ctx.drawImage(this.youWonImage, 0, 0, this.canvas.width, this.canvas.height);
      
      if (!this.victoryScreenShown) {
        this.victoryScreenShown = true;
        this.gameWon = true;
        setTimeout(() => {
          if (typeof window.goToStartScreen === 'function' && !window.goToStartScreenCalled) {
            window.goToStartScreen();
          }
        }, 5000);
      }
      
      if (world && !window.goToStartScreenCalled) {
        this.currentAnimationFrame = requestAnimationFrame(() => this.draw());
      }
      return true;
    }
    return false;
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
    } else if (this.character.isDead() && this.characterDeathTime) {
        const timeSinceDeath = new Date().getTime() - this.characterDeathTime;
        
        if (timeSinceDeath < 3000 && this.youLostImage.complete) {
            this.ctx.drawImage(this.youLostImage, 0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  /**
   * Stops all audio when game over occurs
   * @description Stops walking, snoring, background, and boss sounds
   */
  stopGameOverAudio() {
    if (window.audioManager) {
      window.audioManager.stopWalkingSound();
      window.audioManager.stopSnoringSound();
      window.audioManager.stopBackgroundSound();
      if (window.audioManager.bossSquawkSound) {
        window.audioManager.bossSquawkSound.pause();
        window.audioManager.bossSquawkSound.currentTime = 0;
      }
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
    if (this.character && this.endBoss) {
      // Berücksichtige Offsets für präzise Bild-zu-Bild Kollision
      const charRightOffset = this.character.offset ? this.character.offset.right : 0;
      const bossLeftOffset = this.endBoss.offset ? this.endBoss.offset.left : 0;
      
      const maxCharacterX = this.endBoss.x + bossLeftOffset - this.character.width + charRightOffset;
      if (this.character.x > maxCharacterX) {
        this.character.x = maxCharacterX;
      }
    }
  }

  /**
   * Adds multiple objects to the game map
   * @param {Array} objects - Array of objects to add to the map
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the game map
   * @param {DrawableObject} mo - The object to add to the map
   * @description Handles object drawing and direction flipping
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips an image horizontally
   * @param {DrawableObject} mo - The object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores an image to its original orientation
   * @param {DrawableObject} mo - The object to restore
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Creates and throws a bottle
   * @description Creates a new throwable bottle if the character has bottles available
   */
  throwBottle() {
    if (this.statusBarBottle.bottleStatusbarPercentage > 0) {
      let bottle = new ThrowableObject();
      bottle.x = this.character.x + 50;
      bottle.y = this.character.y + 100;
      
      if (this.character.otherDirection) {
        bottle.speed = -2;
      } else {
        bottle.speed = 2;
      }
      
      this.throwableObject.push(bottle);
      this.statusBarBottle.setBottleStatusbarPercentage(this.statusBarBottle.bottleStatusbarPercentage - 1);
      audioManager.playThrowSound();
    }
  }
}