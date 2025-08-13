const level1 = new Level(
    [
        new Chicken(320, 290),
        new Chicken(420, 290),
        new smallChicken(520, 290),
        new smallChicken(620, 290),
        new Chicken(720, 290),
        new Chicken(820, 290),
        new smallChicken(920, 290),
        new smallChicken(1020, 290),
        new Chicken(1120, 290),
        new Chicken(1220, 290),
        new smallChicken(1320, 290),
        new smallChicken(1420, 290)
    ],

    [
        new Cloud()
    ],

    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/air.png', 719*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3)
    ],

    [
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins()
    ],

    [
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle()
    ]
);