class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    /**
     * Creates a new Cloud instance
     * @description Initializes cloud with random x position and starts animation
     */
    constructor (){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500;
        this.startAnimation();
    }

    /**
     * Starts the cloud animation
     * @description Checks if game is running and starts animation, retries if not
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
     * Animates the cloud movement
     * @description Sets up interval to move cloud left continuously while game is running
     */
    animate() {
        this.movementInterval = setInterval(() => {
            if (gameRunning && !window.goToStartScreenCalled) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }
}