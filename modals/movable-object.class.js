class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 2.5;
  otherDirection = false;
  energy = 100;
  lastHit = 0;
  hitCooldown = 1000; // 1 Sekunde Cooldown zwischen Treffern

  /**
   * Applies gravity to the object
   * Updates vertical position and speed based on acceleration
   * Runs every 40ms (1000/25)
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above ground level
   * @returns {boolean} True if object is above ground (y < 225), false otherwise
   */
  isAboveGround() {
    return this.y < 225;
  }

  /**
   * Checks for collision with another movable object
   * @param {MovableObject} mo - The object to check collision with
   * @returns {boolean} True if objects are colliding, false otherwise
   * @description Handles special cases for character-enemy collisions
   */
  isColliding(mo) {
    // Wenn der Character von oben auf einen Enemy springt, keine Kollision
    if (this instanceof Character && (mo instanceof Chicken || mo instanceof smallChicken)) {
      if (this.isJumpingOnEnemy(mo)) {
        return false;
      }
    }
    // Wenn ein Enemy tot ist, keine Kollision
    if ((mo instanceof Chicken || mo instanceof smallChicken) && mo.isDead) {
      return false;
    }
    
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Reduces energy when object is hit
   * Updates lastHit timestamp
   * Ensures energy doesn't go below 0
   * Implements a cooldown between hits
   */
  hit() {
    let timepassed = new Date().getTime() - this.lastHit;
    if (timepassed > this.hitCooldown) { // Nur Schaden verursachen, wenn der Cooldown vorbei ist
      this.energy -= 20; // Reduziert von 5 auf 20 Leben pro Treffer
      if (this.energy < 0) {
        this.energy = 0;
      }
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if object is in hurt state
   * @returns {boolean} True if object was hit in the last 0.5 seconds
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  /**
   * Checks if object is dead
   * @returns {boolean} True if energy is 0, false otherwise
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays animation sequence
   * @param {string[]} images - Array of image paths for animation
   * @description Cycles through images based on currentImage counter
   */
  playAnimation(images) {
    let i = this.currentImage % images.length; // Modulu % Der Mathematische Rest. let i = 0 % 6 =>, Rest 0 (0 / 6 = 0, 0 ist rest). i = 0,1,2,3,4,5,0
    let path = images[i];
    this.img = this.imageCash[path];
    this.currentImage++;
  }

  /**
   * Moves object to the right
   * Updates x position based on speed
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves object to the left
   * Updates x position based on speed
   */
  moveLeft() {
    this.x -= this.speed; // Px
  }

  /**
   * Makes object jump
   * Sets initial upward velocity
   */
  jump() {
    this.speedY = 30;
  }
}
