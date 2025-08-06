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

    /**
     * Creates a new AudioManager instance
     * @description Initializes all audio files with proper volume settings
     */
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
        
        this.loadSoundState();
    }

    /**
     * Loads sound state from localStorage
     * @description Initializes sound enabled state from browser storage
     */
    loadSoundState() {
        const savedState = localStorage.getItem('soundEnabled');
        this.soundEnabled = savedState === null ? true : savedState === 'true';
        
        if (!this.soundEnabled) {
            this.disableAllSounds();
        }
    }

    /**
     * Plays walking sound effect
     * @description Plays footsteps sound when character moves
     */
    playWalkingSound() {
        this.playAudioSafely(this.walkingSound, 'Walking sound');
    }

    /**
     * Stops walking sound effect
     * @description Pauses footsteps sound when character stops moving
     */
    stopWalkingSound() {
        this.pauseAudioSafely(this.walkingSound, 'Stop walking sound');
    }

    /**
     * Plays jump sound effect
     * @description Plays jump sound when character jumps
     */
    playJumpSound() {
        this.playAudioSafely(this.jumpSound, 'Jump sound');
    }

    /**
     * Plays throw sound effect
     * @description Plays sound when character throws bottle
     */
    playThrowSound() {
        this.playAudioSafely(this.throwSound, 'Throw sound');
    }

    /**
     * Plays bottle collection sound effect
     * @description Plays sound when character collects bottle
     */
    playCollectBottleSound() {
        this.playAudioSafely(this.collectBottleSound, 'Collect bottle sound');
    }
    
    /**
     * Plays coin collection sound effect
     * @description Plays sound when character collects coin
     */
    playCollectCoinsSound() {
        this.playAudioSafely(this.collectCoinsSound, 'Collect coins sound');
    }

    /**
     * Plays character hurt sound effect
     * @description Plays sound when character takes damage
     */
    playhurtCharacterSound () {
        this.playAudioSafely(this.hurtCharacterSound, 'Hurt character sound');
    }

    /**
     * Plays enemy hit sound effect
     * @description Plays sound when enemy is hit by bottle or jump
     */
    playEnemyHitSound () {
        this.playAudioSafely(this.enemyHitSound, 'Enemy hit sound');
    }

    /**
     * Plays boss death sound effect
     * @description Plays sound when boss is defeated
     */
    playBossDeathSound() {
        this.playAudioSafely(this.bossDeathSound, 'Boss death sound');
    }

    /**
     * Plays boss squawk sound effect
     * @description Plays boss squawk sound when boss is near character
     */
    playBossSquawkSound() {
        this.bossSquawkSound.currentTime = 0;
        this.playAudioSafely(this.bossSquawkSound, 'Boss squawk sound');
    }

    /**
     * Plays boss hit sound effect
     * @description Plays sound when boss is hit by bottle
     */
    playBossHitSound() {
        this.bossHitSound.currentTime = 0;
        this.playAudioSafely(this.bossHitSound, 'Boss hit sound');
    }

    /**
     * Plays snoring sound effect
     * @description Plays sound when character is idle for long time
     */
    playSnoringSound() {
        this.playAudioSafely(this.snoringSound, 'Snoring sound');
    }

    /**
     * Stops snoring sound effect
     * @description Pauses snoring sound when character becomes active
     */
    stopSnoringSound() {
        this.pauseAudioSafely(this.snoringSound, 'Stop snoring sound');
    }

    /**
     * Plays background sound effect
     * @description Plays background music
     */
    playBackgroundSound() {
        this.playAudioSafely(this.backgroundSound, 'Background sound');
    }

    /**
     * Stops background sound effect
     * @description Pauses background music
     */
    stopBackgroundSound() {
        this.pauseAudioSafely(this.backgroundSound, 'Stop background sound');
    }

    /**
     * Stops all audio sounds
     * @description Pauses all currently playing audio files
     */
    stopAllSounds() {
        this.pauseAudioSafely(this.walkingSound, 'Stop walking sound');
        this.pauseAudioSafely(this.snoringSound, 'Stop snoring sound');
        this.pauseAudioSafely(this.bossSquawkSound, 'Stop boss squawk sound');
        this.pauseAudioSafely(this.bossHitSound, 'Stop boss hit sound');
        this.pauseAudioSafely(this.bossDeathSound, 'Stop boss death sound');
        this.pauseAudioSafely(this.backgroundSound, 'Stop background sound');
    }

    /**
     * Toggles sound on/off
     * @description Switches between sound enabled and disabled states
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled.toString());
        
        if (this.soundEnabled) {
            this.enableAllSounds();
            if (gameRunning && gameStarted) {
                this.playBackgroundSound();
            }
        } else {
            this.disableAllSounds();
        }
        
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.focus();
        }
    }

    /**
     * Enables all sounds
     * @description Sets volume to normal levels for all audio files
     */
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
        this.bossSquawkSound.volume = 0.5;
        this.snoringSound.volume = 0.5;
        this.backgroundSound.volume = 0.3;
    }

    /**
     * Disables all sounds
     * @description Sets volume to 0 for all audio files
     */
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
        this.bossSquawkSound.volume = 0;
        this.snoringSound.volume = 0;
        this.backgroundSound.volume = 0;
    }

    /**
     * Safely plays audio with error handling
     * @param {HTMLAudioElement} audio - The audio element to play
     * @param {string} name - Name of the audio for error logging
     * @description Attempts to play audio with proper error handling
     */
    async playAudioSafely(audio, name) {
        if (this.soundEnabled) {
            try {
                await audio.play();
            } catch (error) {
                console.log(`Failed to play ${name}:`, error);
            }
        }
    }

    /**
     * Safely pauses audio with error handling
     * @param {HTMLAudioElement} audio - The audio element to pause
     * @param {string} name - Name of the audio for error logging
     * @description Attempts to pause audio with proper error handling
     */
    pauseAudioSafely(audio, name) {
        try {
            audio.pause();
            audio.currentTime = 0;
        } catch (error) {
            console.log(`Failed to pause ${name}:`, error);
        }
    }
} 