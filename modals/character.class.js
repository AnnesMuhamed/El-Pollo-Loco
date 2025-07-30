class Character extends MovableObject {
  y = 180;
  height = 200;
  width = 90;
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

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
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

  /**
   * Creates a new Character instance
   * Initializes the character with walking, jumping, dead and hurt animations
   * Applies gravity and starts the animation loop
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.startAnimation();
  }

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
   * Updates camera position based on character movement
   * Processes keyboard input for movement, jumping and bottle throwing
   * Manages animation states (walking, jumping, dead, hurt)
   */
  animate() {
    setInterval(() => {
      if (gameRunning) {
        this.world.camera_x = -this.x + 100;
        if (!this.isDead() && !this.world.gameWon) {
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

          const shouldStopLongIdle = hasMoved || (this.world.keyboard.D && this.canThrowBottle) || this.isHurt();
          
          if (shouldStopLongIdle) {
            this.lastMovementTime = Date.now();
            this.isIdle = false;
            this.isLongIdle = false;
            if (this.isSnoringSoundPlaying) {
              audioManager.stopSnoringSound();
              this.isSnoringSoundPlaying = false;
            }
          } else {
            const currentTime = Date.now();
            const idleTime = currentTime - this.lastMovementTime;
            
            if (idleTime > 15000 && !this.world.gameWon) {
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
      }
    }, 1000 / 60);

    setInterval(() => {
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
        this.playAnimation(this.IMAGES_JUMPING);
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
    }, 50);
  }

  /**
   * Checks if the character is jumping on top of an enemy (Mario-style)
   * @param {Object} enemy - The enemy object to check collision with
   * @returns {boolean} True if character is jumping on enemy, false otherwise
   * @description Mario-style jump-kill: Character falls and hits enemy from any direction
   */
  isJumpingOnEnemy(enemy) {
    const characterBottom = this.y + this.height;  // Untere Kante des Characters
    const characterLeft = this.x;                   // Linke Kante des Characters
    const characterRight = this.x + this.width;    // Rechte Kante des Characters
    const enemyTop = enemy.y;                       // Obere Kante des Enemies
    const enemyLeft = enemy.x;                      // Linke Kante des Enemies
    const enemyRight = enemy.x + enemy.width;      // Rechte Kante des Enemies
    
    const distance = characterBottom - enemyTop;    // Vertikaler Abstand
    const verticalCollision = distance >= -15 && distance <= 25;  // Vertikale Kollision prüfen
    const horizontalOverlap = characterRight > enemyLeft && characterLeft < enemyRight;  // Horizontale Überlappung
    
    return verticalCollision && horizontalOverlap;  // Mario-ähnliche Kollision
  }
}

