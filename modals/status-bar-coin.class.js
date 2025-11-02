class StatusBarCoin extends DrawableObject {
  IMAGES_COIN_STATUSBAR = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  coinStatusbarPercentage = 0;

  /**
   * Creates a new StatusBarCoin instance
   * @description Initializes coin status bar with images and default position
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COIN_STATUSBAR);
    this.setCoinStatusbarPercentage(0);
    this.x = 30;
    this.y = 80;
    this.height = 40;
    this.width = 200;
  }

  /**
   * Sets the coin status bar percentage
   * @description Updates the displayed image based on coin count
   * @param {number} coinStatusbarPercentage - The coin count (0-10)
   */
  setCoinStatusbarPercentage(coinStatusbarPercentage) {
    this.coinStatusbarPercentage = coinStatusbarPercentage;
    let path = this.IMAGES_COIN_STATUSBAR[this.resolveCoinImageIndex()];
    this.img = this.imageCash[path];
  }

  /**
   * Resolves the image index based on coin percentage
   * @description Maps coin count to status bar image index
   * @returns {number} The index of the status bar image (0-5)
   */
  resolveCoinImageIndex() {
    if (this.coinStatusbarPercentage <= 0) {
      return 0;
    } else if (this.coinStatusbarPercentage <= 2) {
      return 1; 
    } else if (this.coinStatusbarPercentage <= 4) {
      return 2; 
    } else if (this.coinStatusbarPercentage <= 6) {
      return 3; 
    } else if (this.coinStatusbarPercentage <= 8) {
      return 4; 
    } else {
      return 5; 
    }
  }
}
