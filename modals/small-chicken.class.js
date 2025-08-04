class smallChicken extends MovableObject {

    y = 380;
    height = 40;
    width = 40;
    isDead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a new smallChicken enemy instance
     * @description Initializes small chicken with random position and starts animation
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        if (Math.random() < 0.7) {
            this.x = 200 + Math.random() * (719 * 2);
        } else {
            this.x = 1438 + Math.random() * 719;
        }
        this.speed = Math.random() * 1;
        this.startAnimation();
    }

    /**
     * Starts the small chicken animation loop
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
     * Main animation loop for small chicken enemy
     * @description Handles movement and animation states (walking, dead)
     */
    animate() {
        if (!this.isDead) {
            this.movementInterval = setInterval(() => {
                if (gameRunning && !world.showGameOver && !window.goToStartScreenCalled) {
                    this.moveLeft();
                }
            }, 1000 / 60);
        }
        
        this.animationInterval = setInterval(() => {
            if (world && world.showGameOver || window.goToStartScreenCalled) {
                return;
            }
            
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD);
                setTimeout(() => {
                    this.y = 999;
                }, 500);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);   
    }

}