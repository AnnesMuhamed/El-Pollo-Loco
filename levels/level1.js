/**
 * @file This file defines the creation of level 1, including differentiation for mobile and desktop versions.
 */

/**
 * Initializes and returns the level1 object.
 * This is the single source of truth for level1 creation.
 * @returns {Level} A new Level object configured for level 1.
 */
function initLevel1() {
    return new Level(
        createEnemiesArray(),
        [new Cloud()],
        createBackgroundObjectsArray(),
        createCoinsArray(),
        createBottlesArray()
    );
}

/**
 * Creates enemies array for the level.
 * @returns {Array<MovableObject>} Array of enemy objects.
 */
function createEnemiesArray() {
    const enemies = [
        new Chicken(), new smallChicken(), new Chicken(), new smallChicken(), new Chicken(), new smallChicken()
    ];
    if (!isMobile) {
        enemies.push(
            new Chicken(), new smallChicken(), new Chicken(), new smallChicken(), new Chicken(), new smallChicken()
        );
    }
    return enemies;
}

/**
 * Creates background objects array for the level.
 * @returns {Array<BackgroundObject>} Array of background objects.
 */
function createBackgroundObjectsArray() {
    return [
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
        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3)
    ];
}

/**
 * Creates coins array for the level.
 * @returns {Array<coins>} Array of coin objects.
 */
function createCoinsArray() {
    const coinsArray = [
        new coins(), new coins(), new coins(), new coins(), new coins()
    ];
    if (!isMobile) {
        coinsArray.push(
            new coins(), new coins(), new coins(), new coins(), new coins()
        );
    }
    return coinsArray;
}

/**
 * Creates bottles array for the level.
 * @returns {Array<bottle>} Array of bottle objects.
 */
function createBottlesArray() {
    const bottlesArray = [
        new bottle(), new bottle(), new bottle(), new bottle(), new bottle()
    ];
    if (!isMobile) {
        bottlesArray.push(
            new bottle(), new bottle(), new bottle(), new bottle(), new bottle()
        );
    }
    return bottlesArray;
}

window.initLevel1 = initLevel1;