class ThrowableObject extends MovableObject {
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor() {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATION);
        
        this.x = 100;
        this.y = 100;
        this.height = 50;
        this.width = 50;
        this.speed = 15;
        this.speedY = 0;
        this.acceleration = 0;
        this.animate();
    }

    animate() {
        // Rotation der Flasche
        setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 100);

        // Wurfbewegung
        setInterval(() => {
            this.x += this.speed;
        }, 1000 / 60);
    }
}