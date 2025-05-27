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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas; // Varibale wird in parameter geschrieben obwohl das die gleiche schreibweise ist.
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
    setInterval(() => {
      this.checkEnemyCollisions();
      this.checkCoinCollisions();
      this.checkBottleCollisions();
    }, 200);
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

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

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Löscht das vorherige bild.

    this.ctx.translate(this.camera_x, 0); // bild verschiebt sich nach links wenn sich der charackter bewegt.
    this.addObjectsToMap(this.level.backgroundObjects);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottle);
    this.addObjectsToMap(this.throwableObject);

    this.ctx.translate(-this.camera_x, 0);
    // Space for fixed Objects
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    // Space for fixed Objects
    this.addToMap(this.statusBarCoin);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    // Space for fixed Objects
    this.addToMap(this.statusBarBottle);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      // Häufig Aufrufen.
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  throwBottle() {
    if (this.statusBarBottle.bottleStatusbarPercentage > 0) {
      let bottle = new ThrowableObject();
      bottle.x = this.character.x + 100;
      bottle.y = this.character.y + 100;
      this.throwableObject.push(bottle);
      this.statusBarBottle.setBottleStatusbarPercentage(this.statusBarBottle.bottleStatusbarPercentage - 20);
    }
  }
}
