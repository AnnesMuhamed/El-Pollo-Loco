class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    energy = 100;
    lastHit = 0;
    isDead = false;
    speed = 1.1;  // Langsamer als vorher (2)
    isActivated = false;  // Boss wird erst nach erstem Treffer aktiv
    
    isPlayingHurtAnimation = false;
    hurtAnimationTimer = null;
    isPlayingAttackAnimation = false;  // Neue Variable für Attack-Animation
    currentAnimationFrame = 0;
    currentWalkingFrame = 0;
    currentDeadFrame = 0;
    currentAttackFrame = 0;  // Neue Variable für Attack-Frame
    animationInterval = null;
    walkingInterval = null;
    deadInterval = null;
    attackInterval = null;  // Neue Variable für Attack-Interval
    movementInterval = null;  // Neue Variable für Bewegung

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png'
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
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.startAnimation();
        this.startMovement();  // Bewegung starten
    }

    startAnimation() {
        if (typeof gameRunning !== 'undefined' && gameRunning) {
            this.animate();
        } else {
            setTimeout(() => {
                this.startAnimation();
            }, 100);
        }
    }

    startMovement() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
        }
        
        this.movementInterval = setInterval(() => {
            if (!this.isDead && !this.isPlayingHurtAnimation && !this.isPlayingAttackAnimation && gameRunning && this.isActivated) {
                this.moveLeft();  // Boss läuft nur nach links wenn aktiviert
            }
        }, 1000 / 60);  // 60 FPS für flüssige Bewegung
    }

    animate() {
        if (!this.isDead && !this.isPlayingHurtAnimation && !this.walkingInterval) {
            this.startWalkingAnimation();
        }
    }

    startWalkingAnimation() {
        this.stopAllAnimations();
        
        if (this.isDead) {
            return;
        }

        this.img = this.imageCash[this.IMAGES_WALKING[0]];
        this.currentWalkingFrame = 0;
        this.walkingInterval = setInterval(() => {
            if (!this.isDead && !this.isPlayingHurtAnimation && this.isActivated) {
                this.img = this.imageCash[this.IMAGES_WALKING[this.currentWalkingFrame]];  // Walk-Animation nur wenn Boss aktiviert ist (sich bewegt)
                this.currentWalkingFrame = (this.currentWalkingFrame + 1) % this.IMAGES_WALKING.length;
            } else if (!this.isDead && !this.isPlayingHurtAnimation && !this.isActivated) {
                this.img = this.imageCash[this.IMAGES_WALKING[0]];  // Stehende Animation wenn Boss noch nicht aktiviert ist
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
        this.stopAttackAnimation();
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.deadInterval) {
            clearInterval(this.deadInterval);
            this.deadInterval = null;
        }
    }

    startAttackAnimation() {
        if (this.isDead) {
            return;
        }

        this.stopAllAnimations();
        this.isPlayingAttackAnimation = true;
        
        this.img = this.imageCash[this.IMAGES_ATTACK[0]];
        this.currentAttackFrame = 0;
        this.attackInterval = setInterval(() => {
            if (this.currentAttackFrame < this.IMAGES_ATTACK.length) {
                this.img = this.imageCash[this.IMAGES_ATTACK[this.currentAttackFrame]];
                this.currentAttackFrame++;
            } else {
                clearInterval(this.attackInterval);
                this.attackInterval = null;
                this.isPlayingAttackAnimation = false;
                if (!this.isDead) {
                    this.startWalkingAnimation();
                }
            }
        }, 100);
    }

    stopAttackAnimation() {
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
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

        if (!this.isActivated) {
            this.isActivated = true;  // Boss beim ersten Treffer aktivieren
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