class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottle;
    level_end_x = 2200;

    /**
     * Creates a new Level instance
     * @description Initializes level with all game objects
     * @param {Array} enemies - Array of enemy objects
     * @param {Array} clouds - Array of cloud objects
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} coins - Array of coin objects
     * @param {Array} bottle - Array of bottle objects
     */
    constructor (enemies, clouds, backgroundObjects, coins, bottle) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottle = bottle;
    }
}