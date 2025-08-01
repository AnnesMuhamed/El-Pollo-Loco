class bottle extends CollectibleObjects {
    x = 200;

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a new bottle collectible instance
     * @description Initializes bottle with random position and starts animation
     */
    constructor() {
        super().loadImage(this.IMAGES_BOTTLE[0]);
        this.loadImages(this.IMAGES_BOTTLE);
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
        this.x = 200 + Math.random() * (719 * 2);
        this.height = 50;
        this.width = 40;
        this.y = 380;
        
        this.startAnimation();
    }

    /**
     * Starts the bottle animation loop
     * @description Begins animation if game is running, otherwise retries after 100ms
     */
    startAnimation() {
        if (typeof gameRunning !== 'undefined' && gameRunning) {
            this.animate();
        } else {
            setTimeout(() => {
                this.startAnimation();
            }, 100);
        }
    }

    /**
     * Main animation loop for bottle collectible
     * @description Cycles through bottle images every 200ms
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 200);
    }
}

// Make bottle class globally available
window.bottle = bottle;