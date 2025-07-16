class Chicken extends MovableObject {

    y = 353;
    height = 80;
    width = 80;
    isDead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.offset = { top: 10, left: 10, right: 10, bottom: 10 };
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        if (Math.random() < 0.7) {
            this.x = 200 + Math.random() * (719 * 2);
        } else {
            this.x = 1438 + Math.random() * 719;
        }
        this.speed = Math.random() * 0.5;
        this.startAnimation();
    }

    startAnimation() {
        if (typeof gameRunning !== 'undefined' && gameRunning) {
            this.animate();
        } else {
            setTimeout(() => {
                this.startAnimation();
            }, 100);
        }
    }

    animate() {
        if (!this.isDead) {
            setInterval(() => {
                if (gameRunning && !world.showGameOver) {
                    this.moveLeft();
                }
            }, 1000 / 60);
        }
        
        setInterval(() => {
            if (world.showGameOver) {
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