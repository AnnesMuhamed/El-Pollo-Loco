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

  constructor() {
    super();
    this.loadImages(this.IMAGES_COIN_STATUSBAR);
    this.setCoinStatusbarPercentage(0);
    this.x = 30;
    this.y = 80;
    this.height = 40;
    this.width = 200;
  }

  setCoinStatusbarPercentage(coinStatusbarPercentage) {
    this.coinStatusbarPercentage = coinStatusbarPercentage;
    let path = this.IMAGES_COIN_STATUSBAR[this.resolveCoinImageIndex()];
    this.img = this.imageCash[path];
  }

  resolveCoinImageIndex() {
    if (this.coinStatusbarPercentage == 0) {
      return 0;
    } else if (this.coinStatusbarPercentage < 20) {
      return 1;
    } else if (this.coinStatusbarPercentage < 40) {
      return 2;
    } else if (this.coinStatusbarPercentage < 60) {
      return 3;
    } else if (this.coinStatusbarPercentage < 80) {
      return 4;
    } else {
      return 5;
    }
  }
}
