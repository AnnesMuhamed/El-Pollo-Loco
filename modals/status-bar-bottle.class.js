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

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE_STATUSBAR);
    this.setBottleStatusbarPercentage(0);
    this.x = 30;
    this.y = 40;
    this.height = 40;
    this.width = 200;
  }

  setBottleStatusbarPercentage(bottleStatusbarPercentage) {
    this.bottleStatusbarPercentage = bottleStatusbarPercentage;
    let path = this.IMAGES_BOTTLE_STATUSBAR[this.resolveBottleImageIndex()];
    this.img = this.imageCash[path];
  }

  resolveBottleImageIndex() {
    if (this.bottleStatusbarPercentage == 0) {
      return 0;
    } else if (this.bottleStatusbarPercentage < 20) {
      return 1;
    } else if (this.bottleStatusbarPercentage < 40) {
      return 2;
    } else if (this.bottleStatusbarPercentage < 60) {
      return 3;
    } else if (this.bottleStatusbarPercentage < 80) {
      return 4;
    } else {
      return 5;
    }
  }
}
