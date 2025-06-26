class AudioManager {
    walkingSound;
    jumpSound;
    throwSound;
    collectBottleSound;
    collectCoinsSound;
    enemyHitSound;
    hurtCharacterSound;
    bossHitSound;
    bossDeathSound;

    constructor() {
        this.walkingSound = new Audio('audio/footsteps-tap-35682.mp3');
        this.jumpSound = new Audio('audio/cartoon-jump-6462.mp3');
        this.throwSound = new Audio('audio/throw.mp3');
        this.collectBottleSound = new Audio('audio/get-bottle-351945.mp3');
        this.collectCoinsSound = new Audio('audio/coin-pick-up-38258.mp3');
        this.enemyHitSound = new Audio('audio/video-game-hit-noise-001-135821.mp3');
        this.hurtCharacterSound = new Audio('audio/male_hurt7-48124.mp3');
        this.bossHitSound = new Audio('audio/boss_hit.mp3');
        this.bossDeathSound = new Audio('audio/boss_death.mp3');
        
        this.walkingSound.loop = true;
        this.walkingSound.volume = 0.5;

        this.jumpSound.volume = 0.5;
        this.throwSound.volume = 0.5;
        this.collectBottleSound.volume = 0.5;
        this.collectCoinsSound.volume = 0.5;
        this.enemyHitSound.volume = 0.5;
        this.hurtCharacterSound.volume = 0.5;
        this.bossHitSound.volume = 0.5;
        this.bossDeathSound.volume = 0.5;
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

    playEnemyHitSound () {
        this.enemyHitSound.currentTime = 0;
        this.enemyHitSound.play();
    }

    playBossHitSound() {
        this.bossHitSound.currentTime = 0;
        this.bossHitSound.play();
    }

    playBossDeathSound() {
        this.bossDeathSound.currentTime = 0;
        this.bossDeathSound.play();
    }
} 