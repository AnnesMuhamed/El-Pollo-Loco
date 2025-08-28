class BottleSplash extends MovableObject {
  IMAGES_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
  ];

  /**
   * Creates a bottle splash animation at impact position
   * @param {number} x - X coordinate of impact
   * @param {number} y - Y coordinate of impact
   */
  constructor(x, y) {
    super();
    this.loadImages(this.IMAGES_SPLASH);
    this.img = this.imageCash[this.IMAGES_SPLASH[0]];
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.startAnimation();
  }

  /** Starts the splash animation and loops once */
  startAnimation() {
    let frameIndex = 0;
    const interval = setInterval(() => {
      this.img = this.imageCash[this.IMAGES_SPLASH[frameIndex]];
      frameIndex++;
      if (frameIndex >= this.IMAGES_SPLASH.length) {
        clearInterval(interval);
      }
    }, 60);
  }
}


