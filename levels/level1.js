const level1 = new Level(
    [
        // Erster Abschnitt (-719)
        new Chicken(),
        new Chicken(),
        new smallChicken(),
        new smallChicken(),
        // Zweiter Abschnitt (0)
        new Chicken(),
        new Chicken(),
        new smallChicken(),
        new smallChicken(),
        // Dritter Abschnitt (719)
        new Chicken(),
        new Chicken(),
        new smallChicken(),
        new smallChicken()
        // Vierter Abschnitt (719*2, 719*3) - nur Endboss, keine anderen Gegner
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
        // Erster Abschnitt (-719)
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        // Zweiter Abschnitt (0)
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        // Dritter Abschnitt (719)
        new coins(),
        new coins(),
        new coins(),
        new coins(),
        new coins()
        // Vierter Abschnitt (719*2, 719*3) - keine Coins
    ],

    [
        // Erster Abschnitt (-719)
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        // Zweiter Abschnitt (0)
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        // Dritter Abschnitt (719)
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle()
        // Vierter Abschnitt (719*2, 719*3) - keine Bottles
    ]
);