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
    const coords = wuResolveSplashCoordinates(bottle, target);
    const splash = new BottleSplash(coords.x, coords.y);
    world.splashes.push(splash);
    setTimeout(() => wuRemoveSplash(world, splash), 500);
}

/**
 * Resolves splash coordinates based on hit target
 * @param {ThrowableObject} bottle
 * @param {any} target
 * @returns {{x:number,y:number}}
 */
function wuResolveSplashCoordinates(bottle, target) {
    const width = 60;
    const height = 60;
    if (target && typeof bottle.speed === 'number') {
        return wuResolveTargetSplashCoords(bottle, target, width, height);
    }
    return wuResolveFreeSplashCoords(bottle, width, height);
}

/**
 * Resolves splash coordinates when hitting a target
 * @param {ThrowableObject} bottle
 * @param {any} target
 * @param {number} width
 * @param {number} height
 * @returns {{x:number,y:number}}
 */
function wuResolveTargetSplashCoords(bottle, target, width, height) {
    const offsets = target.offset || {};
    const hitboxLeft = target.x + (offsets.left || 0);
    const hitboxRight = target.x + target.width - (offsets.right || 0);
    const hitboxTop = target.y + (offsets.top || 0);
    const hitboxBottom = target.y + target.height - (offsets.bottom || 0);
    const centerY = bottle.y + bottle.height * 0.5;
    const y = Math.max(hitboxTop, Math.min(centerY - height * 0.5, hitboxBottom - height));
    const x = wuResolveHorizontalSplash(bottle, hitboxLeft, hitboxRight, width);
    return { x, y };
}

/**
 * Resolves default splash coordinates when no target is hit
 * @param {ThrowableObject} bottle
 * @param {number} width
 * @param {number} height
 * @returns {{x:number,y:number}}
 */
function wuResolveFreeSplashCoords(bottle, width, height) {
    const x = bottle.x + bottle.width * 0.5 - width * 0.5;
    const y = bottle.y + bottle.height * 0.5 - height * 0.5;
    return { x, y };
}

/**
 * Resolves horizontal splash alignment
 * @param {ThrowableObject} bottle
 * @param {number} hitboxLeft
 * @param {number} hitboxRight
 * @param {number} width
 * @returns {number}
 */
function wuResolveHorizontalSplash(bottle, hitboxLeft, hitboxRight, width) {
    const overlap = 16;
    if (bottle.speed > 0) return hitboxLeft - width + overlap;
    if (bottle.speed < 0) return hitboxRight - overlap;
    return bottle.x + bottle.width * 0.5 - width * 0.5;
}

/**
 * Removes splash object after animation completes
 * @param {World} world
 * @param {BottleSplash} splash
 */
function wuRemoveSplash(world, splash) {
    const index = world.splashes.indexOf(splash);
    if (index !== -1) {
        world.splashes.splice(index, 1);
    }
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
        if (typeof world.stopGameOverAudio === 'function') {
            world.stopGameOverAudio();
        }
        setTimeout(() => { world.showGameOver = true; }, 3000);
    }
}

/**
 * Orchestrates enemy collisions for current frame
 * @param {World} world
 */
function wuCheckEnemyCollisions(world) {
    const stompTarget = wuFindClosestStompCandidate(world);
    const stomped = wuAttemptJumpKill(world, stompTarget);
    if (!stomped) {
        wuResolveSideCollisions(world);
    }
    if (!world.endBoss.isDead) {
        wuHandleBossCollision(world);
    }
}

/**
 * Finds the closest stompable enemy
 * @param {World} world
 * @returns {any|null}
 */
function wuFindClosestStompCandidate(world) {
    let closest = null;
    let bestDistance = Infinity;
    world.level.enemies.forEach((enemy) => {
        if (enemy.isDead || !wuIsStompCandidate(world, enemy)) return;
        const distance = Math.abs(world.character.x - enemy.x);
        if (distance < bestDistance) {
            closest = enemy;
            bestDistance = distance;
        }
    });
    return closest;
}

/**
 * Attempts a jump kill on the provided enemy
 * @param {World} world
 * @param {any|null} enemy
 * @returns {boolean}
 */
function wuAttemptJumpKill(world, enemy) {
    if (!enemy) return false;
    return wuHandleJumpKillCollision(world, enemy);
}

/**
 * Resolves side collisions for all enemies
 * @param {World} world
 */
function wuResolveSideCollisions(world) {
    world.level.enemies.forEach((enemy) => {
        if (!enemy.isDead) {
            wuHandleSideCollision(world, enemy);
        }
    });
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