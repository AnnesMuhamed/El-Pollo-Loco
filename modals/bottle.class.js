class bottle extends CollectibleObjects {
    x = 200;

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES_BOTTLE);


        this.x = 200 + (Math.random() * 1600) * 1;
        this.height = 50;
        this.width = 40;
        this.y = 380;
    }
}