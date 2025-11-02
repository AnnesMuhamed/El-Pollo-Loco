class ThrowableObject extends MovableObject {
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /**
     * Creates a new ThrowableObject instance
     * @description Initializes throwable object with rotation images, physics and animation
     */
    constructor() {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATION);
        
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
        
        this.x = 100;
        this.y = 100;
        this.height = 50;
        this.width = 40;
        this.speed = 0.5; 
        this.speedY = 24;  
        this.acceleration = 1.5;  
        this.applyGravity();  
        this.animate();
    }

    /**
     * Checks if object is above ground
     * @description Always returns true for throwable objects
     * @returns {boolean} Always returns true
     */
    isAboveGround() {
        return true;  
    }

    /**
     * Animates the throwable object
     * @description Plays rotation animation and updates horizontal movement
     */
    animate() {
        this.animationInterval = setInterval(() => {
            if (!window.goToStartScreenCalled) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);

        this.movementInterval = setInterval(() => {
            if (!window.goToStartScreenCalled) {
                this.x += this.speed;
            }
        }, 1000 / 60);
    }
}
