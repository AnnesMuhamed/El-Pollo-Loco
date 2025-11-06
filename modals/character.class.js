class Character extends MovableObject {
  y = 180;
  height = 200;
  width = 100;
  speed = 10;
  canThrowBottle = true;
  lastMovementTime = Date.now();
  isIdle = false;
  isLongIdle = false;
  isWalkingSoundPlaying = false;
  lastShouldPlayWalkingSound = false;
  isSnoringSoundPlaying = false;
  
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING_UP = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png"
  ];

  IMAGES_JUMPING_DOWN = [
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  currentImage = 0;
  world;

  isJumpingUp = false;
  isJumpingDown = false;
  jumpStartY = 0;

  /**
   * Creates a new Character instance
   * Initializes the character with walking, jumping, dead and hurt animations
   * Applies gravity and starts the animation loop
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.offset = { top: 120, left: 20, right: 35, bottom: 5 };
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING_UP);
    this.loadImages(this.IMAGES_JUMPING_DOWN);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.startAnimation();
  }

  /**
   * Starts the character animation loop
   * @description Begins animation if game is running, otherwise retries after 100ms
   */
  startAnimation() {
    if (typeof gameRunning !== 'undefined' && gameRunning) {
      this.animate();
    } else {
      setTimeout(() => {
        this.startAnimation();
      }, 100);
    }
  }

  /**
   * Handles all character animations and movements
   * @returns {boolean} True if character moved, false otherwise
   * @description Updates camera position based on character movement and processes keyboard input
   */
  handleMovement() {
    let hasMoved = false;
    
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      hasMoved = true;
    }

    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      hasMoved = true;
    }
    
    return hasMoved;
  }

  /**
   * Manages character idle states and animations
   * @param {boolean} hasMoved - Whether the character has moved recently
   * @description Handles transitions between idle, long idle, and active states
   */
  handleIdleState(hasMoved) {
    const touchingBoss = this.world && this.world.endBoss && this.isColliding(this.world.endBoss);
    const shouldStopLongIdle = hasMoved || (this.world.keyboard.D && this.canThrowBottle) || this.isHurt() || touchingBoss;
    
    if (shouldStopLongIdle) {
      this.lastMovementTime = Date.now();
      this.isIdle = false;
      this.isLongIdle = false;
      if (this.isSnoringSoundPlaying) {
        audioManager.stopSnoringSound();
        this.isSnoringSoundPlaying = false;
      }
    } else {
      this.updateIdleTimers();
    }
  }

  /**
   * Updates idle timers and manages idle state transitions
   * @description Controls when character enters idle or long idle states
   */
  updateIdleTimers() {
    const currentTime = Date.now();
    const idleTime = currentTime - this.lastMovementTime;
    
    if (idleTime > 10000 && !this.world.gameWon) {
      this.isLongIdle = true;
      this.isIdle = false;
      if (!this.isSnoringSoundPlaying) {
        audioManager.playSnoringSound();
        this.isSnoringSoundPlaying = true;
      }
    } else if (idleTime > 3000) {
      this.isIdle = true;
      this.isLongIdle = false;
    } else {
      this.isIdle = false;
      this.isLongIdle = false;
    }
  }

  /**
   * Manages walking sound playback
   * @description Starts and stops walking sound based on movement and game state
   */
  handleWalkingSound() {
    if (this.world.showGameOver || this.world.gameWon) {
        if (this.isWalkingSoundPlaying) {
            audioManager.stopWalkingSound();
            this.isWalkingSoundPlaying = false;
        }
        return;
    }
    const shouldPlayWalkingSound = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isDead() && !this.world.showGameOver && !this.world.endBoss.isDead && !this.isAboveGround();
    
    if (shouldPlayWalkingSound !== this.lastShouldPlayWalkingSound) {
        this.lastShouldPlayWalkingSound = shouldPlayWalkingSound;
    }
    
    if (shouldPlayWalkingSound && !this.isWalkingSoundPlaying) {
        audioManager.playWalkingSound();
        this.isWalkingSoundPlaying = true;
    } else if (!shouldPlayWalkingSound && this.isWalkingSoundPlaying) {
        audioManager.stopWalkingSound();
        this.isWalkingSoundPlaying = false;
    }
  }

  /**
   * Handles jumping and bottle throwing mechanics
   * @description Processes space key for jumping and D key for bottle throwing
   */
  handleJumpAndThrow() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }

    if (this.world.keyboard.D && this.canThrowBottle) {
      this.world.throwBottle();
      this.canThrowBottle = false;
      setTimeout(() => {
        this.canThrowBottle = true;
      }, 500);
    }
  }

  /**
   * Manages character animation states
   * @description Determines which animation to play based on character state
   */
  handleAnimation() {
    if (this.world.showGameOver) {
      return;
    }
    
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      if (gameRunning) {
        audioManager.playhurtCharacterSound();
      }
    } else if (this.isAboveGround()) {
      this.handleJumpAnimation();
    } else if (this.world.endBoss.isDead) {
      this.img = this.imageCash[this.IMAGES_WALKING[0]];
    } else if (this.isLongIdle) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else if (this.isIdle) {
      this.playAnimation(this.IMAGES_IDLE);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Handles jump animation phases
   * @description Determines whether to play up or down jump animation
   */
  handleJumpAnimation() {
    if (this.isJumpingUp) {
      this.playAnimation(this.IMAGES_JUMPING_UP);
    } else if (this.isJumpingDown) {
      this.playAnimation(this.IMAGES_JUMPING_DOWN);
    } else {
      this.playAnimation(this.IMAGES_JUMPING_UP);
    }
  }

  /**
   * Main animation loop for character
   * @description Handles movement, jumping, bottle throwing and animation states
   */
  animate() {
    this.movementInterval = setInterval(() => {
      if (gameRunning && !window.goToStartScreenCalled) {
        this.world.camera_x = -this.x + 100;
        if (!this.isDead() && !this.world.gameWon) {
          const hasMoved = this.handleMovement();
          this.handleIdleState(hasMoved);
          this.handleWalkingSound();
          this.handleJumpAndThrow();
        }
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (this.world.showGameOver || window.goToStartScreenCalled) {
        return;
      }
      
      this.updateJumpPhase();
      this.handleAnimation();
    }, 100);
  }

  /**
   * Makes character jump with phase tracking
   * @description Initiates jump and sets up phase tracking
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 30;
      this.jumpStartY = this.y;
      this.isJumpingUp = true;
      this.isJumpingDown = false;
      this.currentImage = 0;
      audioManager.playJumpSound();
      this.lastMovementTime = Date.now();
      this.isIdle = false;
      this.isLongIdle = false;
      if (this.isSnoringSoundPlaying) {
        audioManager.stopSnoringSound();
        this.isSnoringSoundPlaying = false;
      }
    }
  }

  /**
   * Updates jump phase based on vertical movement
   * @description Tracks whether character is going up or down during jump
   */
  updateJumpPhase() {
    if (this.isAboveGround()) {
      if (this.speedY > 0) {
        this.isJumpingUp = true;
        this.isJumpingDown = false;
      } else {
        this.isJumpingUp = false;
        this.isJumpingDown = true;
      }
    } else {
      this.isJumpingUp = false;
      this.isJumpingDown = false;
    }
  }

  /**
   * Checks if the character is jumping on top of an enemy (Mario-style)
   * @param {Object} enemy - The enemy object to check collision with
   * @returns {boolean} True if character is jumping on enemy, false otherwise
   * @description Mario-style jump-kill: Character falls and hits enemy with precise image-to-image contact
   */
  isJumpingOnEnemy(enemy) {
    const charBottom = this.y + this.height;
    const charLeft = this.x;
    const charRight = this.x + this.width;
    const enemyTop = enemy.y;
    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.width;
    const verticalCollision = charBottom >= enemyTop - 8 && charBottom <= enemyTop + 25;
    const horizontalOverlap = charRight > enemyLeft && charLeft < enemyRight;
    const isFalling = this.speedY < 0;
    return verticalCollision && horizontalOverlap && isFalling;
  }
}

