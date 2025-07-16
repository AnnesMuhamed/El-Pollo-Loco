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
    if (typeof gameRunning !== 'undefined' && gameRunning) {
      this.animate();
    } else {
      setTimeout(() => {
        this.startAnimation();
      }, 100);
    }
  }

    animate() {
        setInterval(() => {
            if (gameRunning) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }
}