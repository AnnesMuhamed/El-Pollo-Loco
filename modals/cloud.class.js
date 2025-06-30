class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    constructor (){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500;
        this.startAnimation();
    }

    startAnimation() {
        // Animation nur starten, wenn das Spiel läuft
        if (typeof gameRunning !== 'undefined' && gameRunning) {
            this.animate();
        } else {
            // Prüfe alle 100ms, ob das Spiel gestartet wurde
            setTimeout(() => {
                this.startAnimation();
            }, 100);
        }
    }

    animate() { // Wolken bewegen.
        setInterval(() => {
            if (gameRunning) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }
}