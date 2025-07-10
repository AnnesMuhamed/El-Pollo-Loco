class coins extends CollectibleObjects {
  x = 200;
  y = 120;

  IMAGES_COINS = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor() {
    super().loadImage(this.IMAGES_COINS[0]);
    this.loadImages(this.IMAGES_COINS);
    this.offset = { top: 5, left: 5, right: 5, bottom: 5 };

    // Münzen werden über die ersten 3 Bildschirme verteilt (nicht im Endboss-Bereich)
    this.x = 200 + Math.random() * (719 * 2); // 0 bis 1438
    this.height = 80;
    this.width = 80;

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

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COINS);
    }, 200);
  }
}
