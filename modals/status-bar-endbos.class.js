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
        } else if(this.endbossStatusbarPercentage >= 60) {
            return 2;  
        } else if(this.endbossStatusbarPercentage >= 40) {
            return 3; 
        } else if(this.endbossStatusbarPercentage >= 20) {
            return 4;  
        } else {
            return 5; 
        }
    }
}