class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    energy = 100;
    lastHit = 0;
    isDead = false;
    
    // Flags für Animationen
    isPlayingHurtAnimation = false;
    hurtAnimationTimer = null;
    currentAnimationFrame = 0;
    currentWalkingFrame = 0;
    currentDeadFrame = 0;
    animationInterval = null;
    walkingInterval = null;
    deadInterval = null;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Handles boss animations: Shows hurt animation when hit and dead animation when energy reaches 0.
     * Walking animation is displayed by default and stops during hurt/dead states.
     */
    constructor () {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.animate();
    }

    animate() {
        // Walking-Animation nur starten, wenn der Boss lebt und keine andere Animation läuft
        if (!this.isDead && !this.isPlayingHurtAnimation && !this.walkingInterval) {
            this.startWalkingAnimation();
        }
    }

    startWalkingAnimation() {
        // Stoppe alle anderen Animationen
        this.stopAllAnimations();
        
        if (this.isDead) {
            return;
        }

        this.img = this.imageCash[this.IMAGES_WALKING[0]];
        this.currentWalkingFrame = 0;
        this.walkingInterval = setInterval(() => {
            if (!this.isDead && !this.isPlayingHurtAnimation) {
                this.img = this.imageCash[this.IMAGES_WALKING[this.currentWalkingFrame]];
                this.currentWalkingFrame = (this.currentWalkingFrame + 1) % this.IMAGES_WALKING.length;
            } else {
                this.stopWalkingAnimation();
            }
        }, 200);
    }

    stopWalkingAnimation() {
        if (this.walkingInterval) {
            clearInterval(this.walkingInterval);
            this.walkingInterval = null;
        }
    }

    stopAllAnimations() {
        this.stopWalkingAnimation();
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.deadInterval) {
            clearInterval(this.deadInterval);
            this.deadInterval = null;
        }
    }

    startDeadAnimation() {
        this.stopAllAnimations();
        this.isDead = true;
        this.isPlayingHurtAnimation = false;
        
        this.img = this.imageCash[this.IMAGES_DEAD[0]];
        this.currentDeadFrame = 0;
        this.deadInterval = setInterval(() => {
            if (this.currentDeadFrame < this.IMAGES_DEAD.length) {
                this.img = this.imageCash[this.IMAGES_DEAD[this.currentDeadFrame]];
                this.currentDeadFrame++;
            } else {
                clearInterval(this.deadInterval);
                this.deadInterval = null;
            }
        }, 200);
    }

    startHurtAnimation() {
        if (this.isDead) {
            return;
        }

        this.stopAllAnimations();
        this.isPlayingHurtAnimation = true;
        
        this.img = this.imageCash[this.IMAGES_HURT[0]];
        this.currentAnimationFrame = 0;
        this.animationInterval = setInterval(() => {
            if (this.currentAnimationFrame < this.IMAGES_HURT.length) {
                this.img = this.imageCash[this.IMAGES_HURT[this.currentAnimationFrame]];
                this.currentAnimationFrame++;
            } else {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.isPlayingHurtAnimation = false;
                if (!this.isDead) {
                    this.startWalkingAnimation();
                }
            }
        }, 100);
    }

    hit() {
        if (this.isDead) {
            return;
        }

        this.energy -= 20;
        if (this.energy <= 0) {
            this.energy = 0;
            this.startDeadAnimation();
        } else {
            this.startHurtAnimation();
        }
        this.lastHit = new Date().getTime();
    }
}