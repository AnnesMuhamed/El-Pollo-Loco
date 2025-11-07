class StatusBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  percentage = 100;

  /**
   * Creates a new StatusBar instance
   * @description Initializes health status bar with images and default position
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
    this.x = 30;
    this.y = 0;
    this.height = 40;
    this.width = 200;
  }

  /**
   * Sets the status bar percentage
   * @description Updates the displayed image based on health percentage
   * @param {number} percentage - The health percentage (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCash[path];
  }

  /**
   * Resolves the image index based on percentage
   * @description Maps health percentage to status bar image index
   * @returns {number} The index of the status bar image (0-5)
   */
  resolveImageIndex() {
    let index;
    if (this.percentage == 100) {
      index = 5;
    } else if (this.percentage >= 80) {
      index = 4;
    } else if (this.percentage >= 60) {
      index = 3;
    } else if (this.percentage >= 40) {
      index = 2;
    } else if (this.percentage >= 20) {
      index = 1;
    } else {
      index = 0;
    }
    return index;
  }
}

class StatusBarBottle extends DrawableObject {
  IMAGES_BOTTLE_STATUSBAR = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  bottleStatusbarPercentage = 0;

  /**
   * Creates a new StatusBarBottle instance
   * @description Initializes bottle status bar with images and default position
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE_STATUSBAR);
    this.setBottleStatusbarPercentage(0);
    this.x = 30;
    this.y = 40;
    this.height = 40;
    this.width = 200;
  }

  /**
   * Sets the bottle status bar percentage
   * @description Updates the displayed image based on bottle count
   * @param {number} bottleStatusbarPercentage - The bottle count (0-10)
   */
  setBottleStatusbarPercentage(bottleStatusbarPercentage) {
    this.bottleStatusbarPercentage = bottleStatusbarPercentage;
    let path = this.IMAGES_BOTTLE_STATUSBAR[this.resolveBottleImageIndex()];
    this.img = this.imageCash[path];
  }

  /**
   * Resolves the image index based on bottle percentage
   * @description Maps bottle count to status bar image index
   * @returns {number} The index of the status bar image (0-5)
   */
  resolveBottleImageIndex() {
    if (this.bottleStatusbarPercentage <= 0) {
      return 0;
    } else if (this.bottleStatusbarPercentage <= 2) {
      return 1;
    } else if (this.bottleStatusbarPercentage <= 4) {
      return 2;
    } else if (this.bottleStatusbarPercentage <= 6) {
      return 3;
    } else if (this.bottleStatusbarPercentage <= 8) {
      return 4;
    }
    return 5;
  }
}

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
    }
    return 5;
  }
}

class StatusBarEndboss extends DrawableObject {
  IMAGES_ENDBOSS_STATUSBAR = [
    "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
  ];

  endbossStatusbarPercentage = 100;

  /**
   * Creates a new StatusBarEndboss instance
   * @description Initializes endboss status bar with images and default position
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_ENDBOSS_STATUSBAR);
    this.setEndbossStatusbarPercentage(100);
    this.x = 490;
    this.y = 0;
    this.height = 40;
    this.width = 200;
  }

  /**
   * Sets the endboss status bar percentage
   * @description Updates the displayed image based on endboss energy
   * @param {number} endbossStatusbarPercentage - The endboss energy (0-100)
   */
  setEndbossStatusbarPercentage(endbossStatusbarPercentage) {
    this.endbossStatusbarPercentage = endbossStatusbarPercentage;
    let path = this.IMAGES_ENDBOSS_STATUSBAR[this.resolveImageIndex()];
    this.img = this.imageCash[path];
  }

  /**
   * Resolves the image index based on endboss percentage
   * @description Maps endboss energy to status bar image index
   * @returns {number} The index of the status bar image (0-5)
   */
  resolveImageIndex() {
    if (this.endbossStatusbarPercentage == 100) {
      return 0;
    } else if (this.endbossStatusbarPercentage >= 80) {
      return 1;
    } else if (this.endbossStatusbarPercentage >= 60) {
      return 2;
    } else if (this.endbossStatusbarPercentage >= 40) {
      return 3;
    } else if (this.endbossStatusbarPercentage >= 20) {
      return 4;
    }
    return 5;
  }
}

