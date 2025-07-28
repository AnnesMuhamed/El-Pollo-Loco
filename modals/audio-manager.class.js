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
    bossSquawkSound;
    snoringSound;
    backgroundSound;
    soundEnabled;

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
        this.bossSquawkSound = new Audio('audio/chicken-squawk-72188.mp3');
        this.snoringSound = new Audio('audio/snoring.mp3');
        this.backgroundSound = new Audio('audio/background-sound.mp3');
        
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
        this.bossSquawkSound.volume = 0.5;
        this.snoringSound.volume = 0.5;
        this.backgroundSound.volume = 0.3;
        this.backgroundSound.loop = true;
        this.soundEnabled = true;
    }

    playWalkingSound() {
        this.playAudioSafely(this.walkingSound, 'Walking sound');
    }

    stopWalkingSound() {
        this.pauseAudioSafely(this.walkingSound, 'Stop walking sound');
    }

    playJumpSound() {
        this.playAudioSafely(this.jumpSound, 'Jump sound');
    }

    playThrowSound() {
        this.playAudioSafely(this.throwSound, 'Throw sound');
    }

    playCollectBottleSound() {
        this.playAudioSafely(this.collectBottleSound, 'Collect bottle sound');
    }
    
    playCollectCoinsSound() {
        this.playAudioSafely(this.collectCoinsSound, 'Collect coins sound');
    }

    playhurtCharacterSound () {
        this.playAudioSafely(this.hurtCharacterSound, 'Hurt character sound');
    }

    playEnemyHitSound () {
        this.playAudioSafely(this.enemyHitSound, 'Enemy hit sound');
    }

    playBossDeathSound() {
        this.playAudioSafely(this.bossDeathSound, 'Boss death sound');
    }

    playBossSquawkSound() {
        this.bossSquawkSound.currentTime = 0;
        this.playAudioSafely(this.bossSquawkSound, 'Boss squawk sound');
    }

    playBossHitSound() {
        this.bossHitSound.currentTime = 0;
        this.playAudioSafely(this.bossHitSound, 'Boss hit sound');
    }

    playSnoringSound() {
        this.playAudioSafely(this.snoringSound, 'Snoring sound');
    }

    stopSnoringSound() {
        this.pauseAudioSafely(this.snoringSound, 'Stop snoring sound');
    }

    playBackgroundSound() {
        this.playAudioSafely(this.backgroundSound, 'Background sound');
    }

    stopBackgroundSound() {
        this.pauseAudioSafely(this.backgroundSound, 'Stop background sound');
    }

    stopAllSounds() {
        this.pauseAudioSafely(this.walkingSound, 'Stop walking sound');
        this.pauseAudioSafely(this.snoringSound, 'Stop snoring sound');
        this.pauseAudioSafely(this.bossSquawkSound, 'Stop boss squawk sound');
        this.pauseAudioSafely(this.bossHitSound, 'Stop boss hit sound');
        this.pauseAudioSafely(this.bossDeathSound, 'Stop boss death sound');
        this.pauseAudioSafely(this.backgroundSound, 'Stop background sound');
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const button = document.getElementById('soundToggleButton');
        if (this.soundEnabled) {
            button.textContent = '🔊';
            this.enableAllSounds();
        } else {
            button.textContent = '🔇';
            this.disableAllSounds();
        }
        
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.focus();
        }
    }

    enableAllSounds() {
        this.walkingSound.volume = 0.5;
        this.jumpSound.volume = 0.5;
        this.throwSound.volume = 0.5;
        this.collectBottleSound.volume = 0.5;
        this.collectCoinsSound.volume = 0.5;
        this.enemyHitSound.volume = 0.5;
        this.hurtCharacterSound.volume = 0.5;
        this.bossHitSound.volume = 0.5;
        this.bossDeathSound.volume = 0.5;
        this.backgroundSound.volume = 0.3;
        this.snoringSound.volume = 0.5;
    }

    disableAllSounds() {
        this.walkingSound.volume = 0;
        this.jumpSound.volume = 0;
        this.throwSound.volume = 0;
        this.collectBottleSound.volume = 0;
        this.collectCoinsSound.volume = 0;
        this.enemyHitSound.volume = 0;
        this.hurtCharacterSound.volume = 0;
        this.bossHitSound.volume = 0;
        this.bossDeathSound.volume = 0;
        this.snoringSound.volume = 0;
        this.backgroundSound.volume = 0;
    }

    // Hilfsmethoden für sicheres Audio
    async playAudioSafely(audio, name) {
        try {
            audio.currentTime = 0;
            await audio.play();
        } catch (error) {
            console.log(`${name} error:`, error);
        }
    }

    pauseAudioSafely(audio, name) {
        try {
            audio.pause();
        } catch (error) {
            console.log(`${name} error:`, error);
        }
    }
} 