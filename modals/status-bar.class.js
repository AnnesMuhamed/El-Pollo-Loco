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
    } else if(this.percentage >= 60) {
        index = 3;  
    } else if(this.percentage >= 40) {
        index = 2; 
    } else if(this.percentage >= 20) {
        index = 1;  
    } else {
        index = 0;  
    }
    return index;
  }
}
