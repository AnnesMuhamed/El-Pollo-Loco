/**
 * Clears canvas and applies rounded camera translation
 * @param {World} world
 */
function wuClearAndSetupCanvas(world) {
    world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    world.currentCamX = Math.round(world.camera_x);
    world.ctx.translate(world.currentCamX, 0);
}

/**
 * Draws game objects to canvas
 * @param {World} world
 */
function wuDrawGameObjects(world) {
    wuAddObjectsToMap(world, world.level.backgroundObjects);
    wuAddObjectsToMap(world, world.level.clouds);
    wuAddObjectsToMap(world, world.level.enemies);
    wuAddObjectsToMap(world, world.level.coins);
    wuAddObjectsToMap(world, world.level.bottle);
    wuAddObjectsToMap(world, world.throwableObject);
    wuAddToMap(world, world.character);
    wuAddToMap(world, world.endBoss);
    wuAddObjectsToMap(world, world.splashes);
}

/**
 * Draws UI elements to canvas
 * @param {World} world
 */
function wuDrawUIElements(world) {
    const backCamX = typeof world.currentCamX === 'number' ? world.currentCamX : world.camera_x;
    world.ctx.translate(-backCamX, 0);
    wuAddToMap(world, world.statusBar);
    wuAddToMap(world, world.statusBarEndboss);
    wuAddToMap(world, world.statusBarCoin);
    wuAddToMap(world, world.statusBarBottle);
    if (typeof drawMobileControls === 'function') drawMobileControls(world.ctx);
    if (typeof drawInGameSettingsButton === 'function') drawInGameSettingsButton(world.ctx);
    if (typeof window !== 'undefined' && window.settingsDropdownVisible && typeof drawInGameSettingsDropdown === 'function') drawInGameSettingsDropdown(world.ctx);
}

/**
 * Shows victory screen and schedules return
 * @param {World} world
 * @returns {boolean}
 */
function wuHandleVictoryScreen(world) {
    if (world.endBoss.isDead && world.youWonImage.complete) {
        wuAddToMap(world, world.endBoss);
        world.ctx.drawImage(world.youWonImage, 0, 0, world.canvas.width, world.canvas.height);
        if (!world.victoryScreenShown) {
            world.victoryScreenShown = true;
            world.gameWon = true;
            setTimeout(() => {
                if (typeof world.window !== 'undefined' && world.window && typeof world.window.goToStartScreen === 'function' && !world.window.goToStartScreenCalled) {
                    world.window.goToStartScreen();
                } else if (typeof window !== 'undefined' && typeof window.goToStartScreen === 'function' && !window.goToStartScreenCalled) {
                    window.goToStartScreen();
                }
            }, 5000);
        }
        if (typeof world !== 'undefined' && !window.goToStartScreenCalled) {
            world.currentAnimationFrame = requestAnimationFrame(() => world.draw());
        }
        return true;
    }
    return false;
}

/**
 * Shows game over or lost screen
 * @param {World} world
 */
function wuHandleGameOverScreen(world) {
    if (world.showGameOver && world.gameOverImage.complete) {
        world.ctx.drawImage(world.gameOverImage, 0, 0, world.canvas.width, world.canvas.height);
        if (!world.gameOverScreenShown) {
            world.gameOverScreenShown = true;
            wuStopGameOverAudio();
        }
        drawGameOverButtons(world.ctx);
    } else if (world.character.isDead() && world.characterDeathTime) {
        const timeSinceDeath = new Date().getTime() - world.characterDeathTime;
        if (timeSinceDeath < 3000 && world.youLostImage.complete) {
            world.ctx.drawImage(world.youLostImage, 0, 0, world.canvas.width, world.canvas.height);
        }
    }
}

/**
 * Stops all game over audio
 */
function wuStopGameOverAudio() {
    if (window.audioManager) {
        window.audioManager.stopWalkingSound();
        window.audioManager.stopSnoringSound();
        window.audioManager.stopBackgroundSound();
        if (window.audioManager.bossSquawkSound) {
            window.audioManager.bossSquawkSound.pause();
            window.audioManager.bossSquawkSound.currentTime = 0;
        }
    }
}

/**
 * Adds an array of objects to map
 * @param {World} world
 * @param {Array} objects
 */
function wuAddObjectsToMap(world, objects) {
    objects.forEach(o => wuAddToMap(world, o));
}

/**
 * Adds a single object to map
 * @param {World} world
 * @param {DrawableObject} mo
 */
function wuAddToMap(world, mo) {
    if (mo.otherDirection) wuFlipImage(world, mo);
    mo.draw(world.ctx);
    if (mo.otherDirection) wuFlipImageBack(world, mo);
}

/**
 * Flips an image horizontally
 * @param {World} world
 * @param {DrawableObject} mo
 */
function wuFlipImage(world, mo) {
    world.ctx.save();
    world.ctx.translate(mo.width, 0);
    world.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
}

/**
 * Restores a flipped image
 * @param {World} world
 * @param {DrawableObject} mo
 */
function wuFlipImageBack(world, mo) {
    mo.x = mo.x * -1;
    world.ctx.restore();
}

/**
 * Prevents passing the endboss horizontally
 * @param {World} world
 */
function wuEnforceEndbossBlocking(world) {
    if (world.character && world.endBoss) {
        const charRightOffset = world.character.offset ? world.character.offset.right : 0;
        const bossLeftOffset = world.endBoss.offset ? world.endBoss.offset.left : 0;
        const maxCharacterX = world.endBoss.x + bossLeftOffset - world.character.width + charRightOffset;
        if (world.character.x > maxCharacterX) {
            world.character.x = maxCharacterX;
        }
    }
}

/**
 * Spawns a bottle splash effect at impact
 * @param {World} world
 * @param {ThrowableObject} bottle
 * @param {any} target
 */
function wuSpawnBottleSplash(world, bottle, target) {
    const splashWidth = 60;
    const splashHeight = 60;
    const insideOverlap = 16;
    let x;
    let y;
    if (target && typeof bottle.speed === 'number') {
        const oLeft = (target.offset && target.offset.left) ? target.offset.left : 0;
        const oRight = (target.offset && target.offset.right) ? target.offset.right : 0;
        const oTop = (target.offset && target.offset.top) ? target.offset.top : 0;
        const oBottom = (target.offset && target.offset.bottom) ? target.offset.bottom : 0;
        const hitboxLeft = target.x + oLeft;
        const hitboxRight = target.x + target.width - oRight;
        const hitboxTop = target.y + oTop;
        const hitboxBottom = target.y + target.height - oBottom;
        const impactCenterY = bottle.y + bottle.height * 0.5;
        const clampedImpactTop = Math.max(hitboxTop, Math.min(impactCenterY - splashHeight * 0.5, hitboxBottom - splashHeight));
        if (bottle.speed > 0) x = hitboxLeft - splashWidth + insideOverlap; else if (bottle.speed < 0) x = hitboxRight - insideOverlap; else x = bottle.x + bottle.width * 0.5 - splashWidth * 0.5;
        y = clampedImpactTop;
    } else {
        x = bottle.x + bottle.width * 0.5 - splashWidth * 0.5;
        y = bottle.y + bottle.height * 0.5 - splashHeight * 0.5;
    }
    const splash = new BottleSplash(x, y);
    world.splashes.push(splash);
    setTimeout(() => {
        const idx = world.splashes.indexOf(splash);
        if (idx !== -1) world.splashes.splice(idx, 1);
    }, 500);
}

/**
 * Checks boss bottle collisions
 * @param {World} world
 */
function wuCheckBossBottleCollision(world) {
    for (let i = world.throwableObject.length - 1; i >= 0; i--) {
        let bottle = world.throwableObject[i];
        if (bottle.isColliding(world.endBoss)) {
            wuHandleBossHit(world, bottle, i);
        }
    }
}

/**
 * Handles boss hit by bottle
 * @param {World} world
 * @param {any} bottle
 * @param {number} index
 */
function wuHandleBossHit(world, bottle, index) {
    world.throwableObject.splice(index, 1);
    world.endBoss.hit();
    audioManager.playBossHitSound();
    if (Math.abs(world.character.x - world.endBoss.x) < 400) audioManager.playBossSquawkSound();
    world.statusBarEndboss.setEndbossStatusbarPercentage(world.endBoss.energy);
    wuCheckBossDeath(world);
    wuSpawnBottleSplash(world, bottle, world.endBoss);
}

/**
 * Checks boss death
 * @param {World} world
 */
function wuCheckBossDeath(world) {
    if (world.endBoss.energy <= 0) {
        world.endBoss.isDead = true;
        if (audioManager.bossSquawkSound) {
            audioManager.bossSquawkSound.pause();
            audioManager.bossSquawkSound.currentTime = 0;
        }
        world.gameWon = true;
        audioManager.playBossDeathSound();
    }
}

/**
 * Checks enemy bottle collisions
 * @param {World} world
 */
function wuCheckEnemyBottleCollision(world) {
    for (let i = world.throwableObject.length - 1; i >= 0; i--) {
        let bottle = world.throwableObject[i];
        world.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && bottle.isColliding(enemy)) wuHandleEnemyBottleHit(world, bottle, i, enemy);
        });
    }
}

/**
 * Handles enemy hit by bottle
 * @param {World} world
 * @param {any} bottle
 * @param {number} bottleIndex
 * @param {any} enemy
 */
function wuHandleEnemyBottleHit(world, bottle, bottleIndex, enemy) {
    world.throwableObject.splice(bottleIndex, 1);
    enemy.isDead = true;
    audioManager.playEnemyHitSound();
    wuSpawnBottleSplash(world, bottle, enemy);
}

/**
 * Checks coin collisions
 * @param {World} world
 */
function wuCheckCoinCollisions(world) {
    world.level.coins.forEach((coin, index) => {
        if (world.character.isColliding(coin)) wuCollectCoin(world, index);
    });
}

/**
 * Collects coin and updates UI
 * @param {World} world
 * @param {number} index
 */
function wuCollectCoin(world, index) {
    world.level.coins.splice(index, 1);
    world.statusBarCoin.setCoinStatusbarPercentage(world.statusBarCoin.coinStatusbarPercentage + 1);
    audioManager.playCollectCoinsSound();
}

/**
 * Checks bottle pickups
 * @param {World} world
 */
function wuCheckBottleCollisions(world) {
    world.level.bottle.forEach((bottle, index) => {
        if (world.character.isColliding(bottle)) wuCollectBottle(world, index);
    });
}

/**
 * Collects bottle and updates UI
 * @param {World} world
 * @param {number} index
 */
function wuCollectBottle(world, index) {
    world.level.bottle.splice(index, 1);
    world.statusBarBottle.setBottleStatusbarPercentage(world.statusBarBottle.bottleStatusbarPercentage + 1);
    audioManager.playCollectBottleSound();
}

/**
 * Handles boss collision and damage
 * @param {World} world
 * @returns {boolean}
 */
function wuHandleBossCollision(world) {
    if (world.character.isColliding(world.endBoss)) {
        if (!world.endBoss.isPlayingAttackAnimation) {
            world.character.hit();
            world.statusBar.setPercentage((world.character.energy / 100) * 100);
            wuCheckCharacterDeath(world);
            world.endBoss.startAttackAnimation();
        }
        return true;
    }
    return false;
}

/**
 * Handles jump kill collision against an enemy
 * @param {World} world
 * @param {any} enemy
 * @returns {boolean}
 */
function wuHandleJumpKillCollision(world, enemy) {
    if (world.character.isJumpingOnEnemy(enemy)) {
        enemy.isDead = true;
        audioManager.playEnemyHitSound();
        world.character.speedY = 20;
        world.character.jumpStartY = world.character.y;
        world.character.isJumpingUp = true;
        world.character.isJumpingDown = false;
        world.character.currentImage = 0;
        return true;
    }
    return false;
}

/**
 * Handles side collision against an enemy
 * @param {World} world
 * @param {any} enemy
 */
function wuHandleSideCollision(world, enemy) {
    const distance = Math.abs(world.character.x - enemy.x);
    const timeSinceLastHit = new Date().getTime() - enemy.lastHit;
    if (distance < 200 && world.character.isColliding(enemy) && timeSinceLastHit > 800) {
        world.character.hit();
        const percentage = (world.character.energy / 100) * 100;
        world.statusBar.setPercentage(percentage);
        wuCheckCharacterDeath(world);
        enemy.lastHit = new Date().getTime();
    }
}

/**
 * Checks character death transition
 * @param {World} world
 */
function wuCheckCharacterDeath(world) {
    if (world.character.isDead() && !world.characterDeathTime) {
        world.characterDeathTime = new Date().getTime();
        world.gameOverScreenShown = false;
        setTimeout(() => { world.showGameOver = true; }, 3000);
    }
}

/**
 * Orchestrates enemy collisions for current frame
 * @param {World} world
 */
function wuCheckEnemyCollisions(world) {
    let closestEnemy = null;
    let closestDistance = Infinity;
    let jumpKillOccurred = false;
    for (let enemy of world.level.enemies) {
        if (enemy.isDead) continue;
        if (wuIsStompCandidate(world, enemy)) {
            const distance = Math.abs(world.character.x - enemy.x);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }
    }
    if (closestEnemy) {
        wuHandleJumpKillCollision(world, closestEnemy);
        jumpKillOccurred = true;
    }
    if (!jumpKillOccurred) {
        for (let enemy of world.level.enemies) {
            if (enemy.isDead) continue;
            wuHandleSideCollision(world, enemy);
        }
    }
    if (!world.endBoss.isDead) {
        wuHandleBossCollision(world);
    }
}

/**
 * Checks tolerant stomp candidate against an enemy
 * @param {World} world
 * @param {any} enemy
 * @returns {boolean}
 */
function wuIsStompCandidate(world, enemy) {
    const c = world.character;
    const charBottom = c.y + c.height;
    const charLeft = c.x;
    const charRight = c.x + c.width;
    const enemyTop = enemy.y;
    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.width;
    const verticalOk = charBottom >= enemyTop - 10 && charBottom <= enemyTop + 27;
    const horizontalOk = charRight > enemyLeft && charLeft < enemyRight;
    return c.speedY < 0 && verticalOk && horizontalOk;
}

/**
 * Creates and throws a bottle if available
 * @param {World} world
 */
function wuThrowBottle(world) {
    if (world.statusBarBottle.bottleStatusbarPercentage > 0) {
        let bottle = new ThrowableObject();
        bottle.x = world.character.x + 50;
        bottle.y = world.character.y + 100;
        bottle.speed = world.character.otherDirection ? -2 : 2;
        world.throwableObject.push(bottle);
        world.statusBarBottle.setBottleStatusbarPercentage(world.statusBarBottle.bottleStatusbarPercentage - 1);
        audioManager.playThrowSound();
    }
}