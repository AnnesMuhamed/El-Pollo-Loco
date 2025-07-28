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

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
    this.x = 30;
    this.y = 0;
    this.height = 40;
    this.width = 200;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCash[path];
  }

  resolveImageIndex() {
    let index;
    if (this.percentage == 100) {
      index = 5;  // 100.png (Index 5)
    } else if (this.percentage >= 80) {
        index = 4;  // 80.png (Index 4)
    } else if(this.percentage >= 60) {
        index = 3;  // 60.png (Index 3)
    } else if(this.percentage >= 40) {
        index = 2;  // 40.png (Index 2)
    } else if(this.percentage >= 20) {
        index = 1;  // 20.png (Index 1)
    } else {
        index = 0;  // 0.png (Index 0)
    }
    return index;
  }
}
