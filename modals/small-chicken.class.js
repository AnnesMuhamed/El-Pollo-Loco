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

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 200 + Math.random() * 500;
        this.speed = Math.random() * 1;
        this.startAnimation();
    }

    startAnimation() {
        // Bewegung nur starten, wenn das Spiel läuft
        if (typeof gameRunning !== 'undefined' && gameRunning) {
            this.animate();
        } else {
            // Prüfe alle 100ms, ob das Spiel gestartet wurde
            setTimeout(() => {
                this.startAnimation();
            }, 100);
        }
    }

    animate() {
        if (!this.isDead) {
            setInterval(() => {
                if (gameRunning) {
                    this.moveLeft();
                }
            }, 1000 / 60);
        }
        
        setInterval(() => {
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