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
        this.width = 30;
        this.speed = 0.5;  // Noch langsamer horizontal für längeren Bogen
        this.speedY = 20;  // Viel stärkere initiale Geschwindigkeit nach oben
        this.acceleration = 1.2;  // Noch langsamere Gravitation für längeren Bogen
        this.applyGravity();  // Gravitation anwenden
        this.animate();
    }

    // Überschreibe isAboveGround für Flaschen - sie sollen immer Gravitation haben
    isAboveGround() {
        return true;  // Flaschen haben immer Gravitation
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 100);

        setInterval(() => {
            this.x += this.speed;  // Horizontale Bewegung
        }, 1000 / 60);
    }
}
