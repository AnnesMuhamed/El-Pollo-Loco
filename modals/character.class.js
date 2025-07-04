class Character extends MovableObject {
  y = 180;
  height = 200;
  width = 90;
  speed = 10;
  canThrowBottle = true; // Neue Variable für den Cooldown
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
    this.applyGravity();
    this.startAnimation();
  }

  startAnimation() {
    // Animation nur starten, wenn das Spiel läuft
    if (typeof gameRunning !== 'undefined' && gameRunning) {
      this.animate();
    } else {
      // Prüfe alle 100ms, ob das Spiel gestartet wurde
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
        // Alle Aktionen nur, wenn der Charakter lebt
        if (!this.isDead()) {
          if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
          }

          if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
          }

          // Sound für Laufen abspielen/stoppen
          if (!this.isAboveGround() && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isDead()) {
              audioManager.playWalkingSound();
          } else {
              audioManager.stopWalkingSound();
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
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        if (gameRunning) {
          audioManager.playhurtCharacterSound();
        }
      } else if (this.isAboveGround()) {
        //Jump animation
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          //Walk animation
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 50);
  }

  /**
   * Checks if the character is jumping on top of an enemy
   * @param {Object} enemy - The enemy object to check collision with
   * @returns {boolean} True if character is jumping on enemy, false otherwise
   * @description Determines if the character is landing on an enemy by checking:
   * - Character's bottom position relative to enemy's top
   * - Character's center position relative to enemy's width
   * - Character's falling state (speedY)
   */
  isJumpingOnEnemy(enemy) {
    const characterBottom = this.y + this.height;
    const prevCharacterBottom = this.y + this.height - this.speedY;
    const enemyTop = enemy.y;
    const characterLeft = this.x;
    const characterRight = this.x + this.width;
    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.width;
    const isFalling = this.speedY > 0.3; 
    const tolerance = 50;

    const wasAbove = prevCharacterBottom <= enemyTop + tolerance;
    const isNowBelow = characterBottom >= enemyTop + 1;
    const horizontalOverlap = characterRight > enemyLeft && characterLeft < enemyRight;

    return isFalling && wasAbove && isNowBelow && horizontalOverlap;
  }
}
