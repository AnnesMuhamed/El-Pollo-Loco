class coins extends CollectibleObjects {
  x = 200;
  y = 120;

  IMAGES_COINS = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor() {
    super().loadImage(this.IMAGES_COINS[0]);
    this.loadImages(this.IMAGES_COINS);
    this.offset = { top: 5, left: 5, right: 5, bottom: 5 };

    // Münzen werden zwischen 200 und 1800 platziert, mit mindestens 200px Abstand zum Endboss
    this.x = 200 + Math.random() * 1600 * 1;
    this.height = 80;
    this.width = 80;

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COINS);
    }, 200);
  }
}
