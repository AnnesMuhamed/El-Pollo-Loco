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
    setInterval(() => {
      this.checkEnemyCollisions();
      this.checkCoinCollisions();
      this.checkBottleCollisions();
      this.checkBossBottleCollision();
    }, 200);
  }

  /**
   * Checks for collisions between character and enemies
   * @description Handles enemy death when jumped on and character damage on side collision
   */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead) {
        return;
      }

      if (this.character.isJumpingOnEnemy(enemy)) {
        enemy.isDead = true;
        audioManager.playEnemyHitSound();
        return;
      }

      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        
        if (this.character.isDead() && !this.characterDeathTime) {
          this.characterDeathTime = new Date().getTime();
          this.gameOverScreenShown = false;
          setTimeout(() => {
            this.showGameOver = true;
          }, 3000);
        }
      }
    });
  }

  checkBossBottleCollision() {
    for (let i = this.throwableObject.length - 1; i >= 0; i--) {
      let bottle = this.throwableObject[i];
      if (bottle.isColliding(this.endBoss)) {
        this.throwableObject.splice(i, 1);
        this.endBoss.hit();
        audioManager.playBossHitSound();
        if (Math.abs(this.character.x - this.endBoss.x) < 400) {
          audioManager.playBossSquawkSound();
        }
        this.statusBarEndboss.setEndbossStatusbarPercentage(this.endBoss.energy);
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
    }
  }

  /**
   * Checks for collisions between character and coins
   * @description Collects coins and updates coin status bar
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        this.statusBarCoin.setCoinStatusbarPercentage(
          this.statusBarCoin.coinStatusbarPercentage + 20
        );
        audioManager.playCollectCoinsSound();
      }
    });
  }

  /**
   * Checks for collisions between character and bottles
   * @description Collects bottles and updates bottle status bar
   */
  checkBottleCollisions() {
    this.level.bottle.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottle.splice(index, 1);
        this.statusBarBottle.setBottleStatusbarPercentage(
          
          this.statusBarBottle.bottleStatusbarPercentage + 20
        );
        audioManager.playCollectBottleSound();

      }
    });
  }

  /**
   * Main draw loop
   * @description Renders all game objects and updates the display
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottle);
    this.addObjectsToMap(this.throwableObject);
    
    this.addToMap(this.character);
    this.addToMap(this.endBoss);

    this.ctx.translate(-this.camera_x, 0);
    
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarEndboss);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);

    if (this.endBoss.isDead && this.youWonImage.complete) {
      this.ctx.drawImage(this.youWonImage, 0, 0, this.canvas.width, this.canvas.height);
      
      if (!this.victoryScreenShown) {
        this.victoryScreenShown = true;
        setTimeout(() => {
          if (typeof goToStartScreen === 'function') {
            goToStartScreen();
          }
        }, 3000);
      }
    }

    if (this.character.isDead() && this.characterDeathTime) {
        const timeSinceDeath = new Date().getTime() - this.characterDeathTime;
        
        if (timeSinceDeath < 3000 && this.youLostImage.complete) {
            this.ctx.drawImage(this.youLostImage, 0, 0, this.canvas.width, this.canvas.height);
        } else if (this.showGameOver && this.gameOverImage.complete) {
            this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            
            if (typeof showGameOverScreen === 'function' && !this.gameOverScreenShown) {
                showGameOverScreen();
                this.gameOverScreenShown = true;
            }
        }
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
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
    mo.drawFrame(this.ctx);

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
      this.throwableObject.push(bottle);
      this.statusBarBottle.setBottleStatusbarPercentage(this.statusBarBottle.bottleStatusbarPercentage - 20);
      audioManager.playThrowSound();
    }
  }


}
