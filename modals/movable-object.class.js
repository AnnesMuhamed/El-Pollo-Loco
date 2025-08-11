class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object
   * Updates vertical position and speed based on acceleration
   * Runs every 40ms (1000/25)
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if ((this.isAboveGround() || this.speedY > 0) && !window.goToStartScreenCalled) {
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
  checkCharacterEnemyCollision(mo) {
    if (this instanceof Character && (mo instanceof Chicken || mo instanceof smallChicken)) {
      // Nur Jump-Kill wenn Character von oben kommt, sonst normale Kollision
      const jumpKillResult = this.isJumpingOnEnemy(mo);
      if (jumpKillResult) {
        return true; // Jump-Kill erfolgreich
      }
      return this.checkBasicCollision(mo); // Normale Kollision prüfen
    }
    return true;
  }

  /**
   * Checks if dead enemies should be ignored in collision detection
   * @param {MovableObject} mo - The object to check
   * @returns {boolean} True if collision should be checked, false if enemy is dead
   * @description Prevents collision with dead enemies and handles throwable objects
   */
  checkDeadEnemyCollision(mo) {
    if ((mo instanceof Chicken || mo instanceof smallChicken) && mo.isDead) {
      return false;
    }
    if (this instanceof ThrowableObject) {
      return true;
    }
    return true;
  }

  /**
   * Checks collision between throwable objects and boss
   * @param {MovableObject} mo - The object to check collision with
   * @returns {boolean|null} True if colliding, false if not, null if not applicable
   * @description Special collision check for bottles hitting the endboss
   */
  checkThrowableBossCollision(mo) {
    if (this instanceof ThrowableObject && mo instanceof Endboss) {
      return this.x < mo.x + mo.width &&
             this.x + this.width > mo.x &&
             this.y < mo.y + mo.height &&
             this.y + this.height > mo.y;
    }
    return null;
  }

  /**
   * Checks collision with offset consideration
   * @param {MovableObject} mo - The object to check collision with
   * @returns {boolean|null} True if colliding, false if not, null if no offset
   * @description Uses offset values for more precise collision detection
   */
  checkOffsetCollision(mo) {
    if (this.offset && mo.offset) {
      return this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
             this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
             this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom &&
             this.y + this.height - this.offset.bottom > mo.y + mo.offset.top;
    }
    return null;
  }

  /**
   * Performs basic AABB collision detection
   * @param {MovableObject} mo - The object to check collision with
   * @returns {boolean} True if objects are colliding, false otherwise
   * @description Standard axis-aligned bounding box collision check
   */
  checkBasicCollision(mo) {
    return this.x < mo.x + mo.width &&
           this.x + this.width > mo.x &&
           this.y < mo.y + mo.height &&
           this.y + this.height > mo.y;
  }

  /**
   * Comprehensive collision detection system
   * @param {MovableObject} mo - The object to check collision with
   * @returns {boolean} True if objects are colliding, false otherwise
   * @description Handles all types of collisions with proper priority order
   */
  isColliding(mo) {
    if (!this.checkCharacterEnemyCollision(mo)) {
      return false;
    }
    
    if (!this.checkDeadEnemyCollision(mo)) {
      return false;
    }
    
    const throwableBossResult = this.checkThrowableBossCollision(mo);
    if (throwableBossResult !== null) {
      return throwableBossResult;
    }
    
    const offsetResult = this.checkOffsetCollision(mo);
    if (offsetResult !== null) {
      return offsetResult;
    }
    
    return this.checkBasicCollision(mo);
  }

  /**
   * Reduces energy when object is hit
   * Updates lastHit timestamp
   * Ensures energy doesn't go below 0
   * Implements a cooldown between hits
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if object is in hurt state
   * @returns {boolean} True if object was hit in the last 0.5 seconds
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 0.5;
  }

  /**
   * Checks if object is dead
   * @returns {boolean} True if energy is 0, false otherwise
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Plays animation sequence
   * @param {string[]} images - Array of image paths for animation
   * @description Cycles through images based on currentImage counter
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
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
    this.x -= this.speed;
  }

  /**
   * Makes object jump
   * Sets initial upward velocity
   */
  jump() {
    this.speedY = 30;
    if (this instanceof Character) {
      audioManager.playJumpSound();
    }
  }
}

// Make MovableObject class globally available
window.MovableObject = MovableObject;
