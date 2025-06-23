class AudioManager {
    static walkingSound = new Audio('audio/footsteps-tap-35682.mp3');
    static jumpSound = new Audio('audio/cartoon-jump-6462.mp3');

    static init() {
        this.walkingSound.loop = true;
        this.walkingSound.volume = 0.5;

        this.jumpSound.volume = 0.5;
    }

    static playWalkingSound() {
        if (this.walkingSound.paused) {
            this.walkingSound.play();
        }
    }

    static stopWalkingSound() {
        this.walkingSound.pause();
    }

    static playJumpSound() {
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();
    }
} 