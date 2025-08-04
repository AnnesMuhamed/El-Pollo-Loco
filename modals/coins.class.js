class coins extends CollectibleObjects {
  x = 200;
  y = 120;

  IMAGES_COINS = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor() {
    super().loadImage(this.IMAGES_COINS[0]);
    this.loadImages(this.IMAGES_COINS);
    this.offset = { top: 5, left: 5, right: 5, bottom: 5 };

    this.x = 200 + Math.random() * (719 * 2);
    this.height = 80;
    this.width = 80;

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

  animate() {
    this.animationInterval = setInterval(() => {
      if (!window.goToStartScreenCalled) {
        this.playAnimation(this.IMAGES_COINS);
      }
    }, 200);
  }
}

// Make coins class globally available
window.coins = coins;
