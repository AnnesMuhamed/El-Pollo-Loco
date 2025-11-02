class coins extends CollectibleObjects {
  x = 200;
  y = 120;

  IMAGES_COINS = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Creates a new coins instance
   * @description Initializes coin with random x position and starts animation
   */
  constructor() {
    super().loadImage(this.IMAGES_COINS[0]);
    this.loadImages(this.IMAGES_COINS);
    this.offset = { top: 0, left: 0, right: 0, bottom: 0 };

    this.x = 200 + Math.random() * (719 * 2);
    this.height = 80;
    this.width = 80;

    this.startAnimation();
  }

  /**
   * Starts the coin animation
   * @description Checks if game is running and starts animation, retries if not
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
   * Animates the coin rotation
   * @description Sets up interval to play coin animation continuously while game is running
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (!window.goToStartScreenCalled) {
        this.playAnimation(this.IMAGES_COINS);
      }
    }, 200);
    }
}
