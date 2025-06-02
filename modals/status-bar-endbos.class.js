class StatusBarEndboss extends DrawableObject {
    IMAGES_ENDBOSS_STATUSBAR = [
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png"
    ];

    endbossStatusbarPercentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSS_STATUSBAR);
        this.setEndbossStatusbarPercentage(100);
        this.x = 490;
        this.y = 0;
        this.height = 40;
        this.width = 200;
    }

    setEndbossStatusbarPercentage(endbossStatusbarPercentage) {
        this.endbossStatusbarPercentage = endbossStatusbarPercentage;
        let path = this.IMAGES_ENDBOSS_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCash[path];
    }

    resolveImageIndex() {
        if (this.endbossStatusbarPercentage == 100) {
            return 0;
        } else if (this.endbossStatusbarPercentage > 80) {
            return 1;
        } else if(this.endbossStatusbarPercentage > 60) {
            return 2;
        } else if(this.endbossStatusbarPercentage > 40) {
            return 3;
        } else if(this.endbossStatusbarPercentage > 20) {
            return 4;
        } else {
            return 5;
        }
    }
}