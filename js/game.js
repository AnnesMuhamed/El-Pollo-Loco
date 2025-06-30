let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let gameRunning = false; // Globale Variable für Spielstatus

function init() {
   canvas = document.getElementById('canvas');
   
   // Start-Button Event Listener hinzufügen
   const startButton = document.getElementById('startButton');
   startButton.addEventListener('click', startGame);
   
   // Restart-Button Event Listener hinzufügen
   const restartButton = document.getElementById('restartButton');
   restartButton.addEventListener('click', restartGame);
}

function startGame() {
    // Spiel zurücksetzen falls es bereits läuft
    if (gameStarted) {
        gameStarted = false;
        gameRunning = false;
        world = null;
    }
    
    gameStarted = true;
    gameRunning = true; // Spiel läuft jetzt
    
    // Startbildschirm verstecken (falls sichtbar)
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.add('hidden');
    
    // Spiel initialisieren
    world = new World(canvas, keyboard);
    
    console.log('My Character is', world.character);
}

function restartGame() {
    // Game Over Bildschirm verstecken
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.add('hidden');
    
    // Spiel zurücksetzen
    gameStarted = false;
    gameRunning = false;
    
    // Level neu erstellen und Spiel direkt starten
    resetAndRestartGame();
}

function resetAndRestartGame() {
    // Alle alten Animationen stoppen durch gameRunning = false setzen
    gameRunning = false;
    
    // Kurze Verzögerung, dann Level neu erstellen
    setTimeout(() => {
        // Level1 global überschreiben mit komplett neuen Objekten
        window.level1 = new Level(
            [
                new Chicken(),
                new Chicken(),
                new Chicken(),
                new smallChicken(),
                new smallChicken(),
                new smallChicken()
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
                new coins()
            ],

            [
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle(),
                new bottle()
            ]
        );
        
        // Spiel direkt starten
        startGame();
    }, 200);
}

// Funktion zum Anzeigen des Game Over Bildschirms
function showGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.remove('hidden');
}

window.addEventListener('keydown', (e) => {  // Taste Drücken.
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if(e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if(e.keyCode == 38) {
        keyboard.UP = true;
    }

    if(e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if(e.keyCode == 68) {
        keyboard.D = true;
    }

    console.log(e);
    
});

window.addEventListener('keyup', (e) => { // Taste Loslassen.
    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if(e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if(e.keyCode == 38) {
        keyboard.UP = false;
    }

    if(e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if(e.keyCode == 68) {
        keyboard.D = false;
    }
});