class bottle extends CollectibleObjects {
    x = 200;

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_BOTTLE[0]);
        this.loadImages(this.IMAGES_BOTTLE);
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
        this.x = 200 + (Math.random() * 1600) * 1;
        this.height = 50;
        this.width = 40;
        this.y = 380;
        
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 200);
    }
}