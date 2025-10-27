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
        
        // Angepasste Offsets für sichtbare Bildteile der Flasche (ohne transparente Bereiche)
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
        
        this.x = 100;
        this.y = 100;
        this.height = 50;
        this.width = 40;
        this.speed = 0.5;  // Noch langsamer horizontal für längeren Bogen
<<<<<<< HEAD
        this.speedY = 20;  // Viel stärkere initiale Geschwindigkeit nach oben
=======
        this.speedY = 24;  // Viel stärkere initiale Geschwindigkeit nach oben
>>>>>>> de83683 (The thrown bottle's vertical trajectory height has been increased.)
        this.acceleration = 1.5;  // Noch langsamere Gravitation für längeren Bogen
        this.applyGravity();  // Gravitation anwenden
        this.animate();
    }

    isAboveGround() {
        return true;  
    }

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
