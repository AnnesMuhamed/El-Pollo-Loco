class AudioManager {
    walkingSound;
    jumpSound;
    throwSound;
    collectBottleSound;
    collectCoinsSound;
    hurtCharacterSound;

    constructor() {
        this.walkingSound = new Audio('audio/footsteps-tap-35682.mp3');
        this.jumpSound = new Audio('audio/cartoon-jump-6462.mp3');
        this.throwSound = new Audio('audio/throw.mp3');
        this.collectBottleSound = new Audio('audio/get-bottle-351945.mp3');
        this.collectCoinsSound = new Audio('audio/coin-pick-up-38258.mp3');
        this.hurtCharacterSound = new Audio('audio/male_hurt7-48124.mp3');
        
        this.walkingSound.loop = true;
        this.walkingSound.volume = 0.5;

        this.jumpSound.volume = 0.5;
        this.throwSound.volume = 0.5;
        this.collectBottleSound.volume = 0.5;
        this.collectCoinsSound.volume = 0.5;
        this.hurtCharacterSound.volume = 0.5;
    }

    playWalkingSound() {
        if (this.walkingSound.paused) {
            this.walkingSound.play();
        }
    }

    stopWalkingSound() {
        this.walkingSound.pause();
    }

    playJumpSound() {
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();
    }

    playThrowSound() {
        this.throwSound.currentTime = 0;
        this.throwSound.play();
    }

    playCollectBottleSound() {
        this.collectBottleSound.currentTime = 0;
        this.collectBottleSound.play();
    }
    
    playCollectCoinsSound() {
        this.collectCoinsSound.currentTime = 0;
        this.collectCoinsSound.play();
    }

    playhurtCharacterSound () {
        this.hurtCharacterSound.currentTime = 0;
        this.hurtCharacterSound.play();
    }
} 