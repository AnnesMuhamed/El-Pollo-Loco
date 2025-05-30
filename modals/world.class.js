class World {
  character = new Character(); // Innerhalb eines Objekts braucht man keine let - var- const.
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = -0;
  statusBar = new StatusBar();
  statusBarBottle = new StatusBarBottle();
  statusBarCoin = new StatusBarCoin();
  throwableObject = [];  // Leeres Array für geworfene Flaschen

  /**
   * Creates a new World instance
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on
   * @param {Keyboard} keyboard - The keyboard input handler
   * @description Initializes the game world, sets up canvas context and starts game loops
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas; // Varibale wird in parameter geschrieben obwohl das die gleiche schreibweise ist.
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
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
        this.character.y = enemy.y - this.character.height;
        this.character.speedY = 10;
        return;
      }

      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
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

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottle);
    this.addObjectsToMap(this.throwableObject);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarCoin);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarBottle);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

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
    }
  }
}
