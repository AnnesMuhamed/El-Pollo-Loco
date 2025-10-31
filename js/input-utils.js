/**
 * Calculates canvas coordinates from event coordinates
 * @param {Event} e
 * @returns {{canvasX:number, canvasY:number}}
 */
function calculateCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    return { canvasX, canvasY };
}

/**
 * Checks if pointer is over start or settings buttons before game
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function isOverPreGameButtons(canvasX, canvasY) {
    if (!gameStarted && window.startButtonCoords) {
        const b = window.startButtonCoords;
        if (canvasX >= b.x && canvasX <= b.x + b.width && canvasY >= b.y && canvasY <= b.y + b.height) return true;
    }
    if (!gameStarted && window.settingsButtonCoords) {
        const b = window.settingsButtonCoords;
        if (canvasX >= b.x && canvasX <= b.x + b.width && canvasY >= b.y && canvasY <= b.y + b.height) return true;
    }
    return false;
}

/**
 * Checks if pointer is over in-game settings button
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function isOverInGameSettings(canvasX, canvasY) {
    if (gameStarted && window.inGameSettingsButtonCoords) {
        const b = window.inGameSettingsButtonCoords;
        if (canvasX >= b.x && canvasX <= b.x + b.width && canvasY >= b.y && canvasY <= b.y + b.height) return true;
    }
    return false;
}

/**
 * Checks if pointer is over any dropdown button
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function isOverDropdownButtons(canvasX, canvasY) {
    if (!window.settingsDropdownVisible) return false;
    if (!gameStarted && window.dropdownButtonCoords) {
        for (const coords of Object.values(window.dropdownButtonCoords)) {
            if (canvasX >= coords.x && canvasX <= coords.x + coords.width && canvasY >= coords.y && canvasY <= coords.y + coords.height) return true;
        }
    }
    if (gameStarted && window.inGameDropdownButtonCoords) {
        for (const coords of Object.values(window.inGameDropdownButtonCoords)) {
            if (canvasX >= coords.x && canvasX <= coords.x + coords.width && canvasY >= coords.y && canvasY <= coords.y + coords.height) return true;
        }
    }
    return false;
}

/**
 * Checks if pointer is over game over screen buttons
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function isOverGameOverButtons(canvasX, canvasY) {
    if (world && world.showGameOver && window.gameOverButtonCoords) {
        const r = window.gameOverButtonCoords.restart;
        const h = window.gameOverButtonCoords.home;
        if (r && canvasX >= r.x && canvasX <= r.x + r.width && canvasY >= r.y && canvasY <= r.y + r.height) return true;
        if (h && canvasX >= h.x && canvasX <= h.x + h.width && canvasY >= h.y && canvasY <= h.y + h.height) return true;
    }
    return false;
}

/**
 * Checks if pointer is over any mobile control button
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function isOverMobileControls(canvasX, canvasY) {
    if (!gameRunning || !window.mobileButtonCoords) return false;
    const m = window.mobileButtonCoords;
    if (m.left && canvasX >= m.left.x && canvasX <= m.left.x + m.left.width && canvasY >= m.left.y && canvasY <= m.left.y + m.left.height) return true;
    if (m.right && canvasX >= m.right.x && canvasX <= m.right.x + m.right.width && canvasY >= m.right.y && canvasY <= m.right.y + m.right.height) return true;
    if (m.jump && canvasX >= m.jump.x && canvasX <= m.jump.x + m.jump.width && canvasY >= m.jump.y && canvasY <= m.jump.y + m.jump.height) return true;
    if (m.throw && canvasX >= m.throw.x && canvasX <= m.throw.x + m.throw.width && canvasY >= m.throw.y && canvasY <= m.throw.y + m.throw.height) return true;
    return false;
}

/**
 * Checks if pointer is over any clickable element on canvas
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function isOverAnyClickable(canvasX, canvasY) {
    if (isOverPreGameButtons(canvasX, canvasY)) return true;
    if (isOverInGameSettings(canvasX, canvasY)) return true;
    if (isOverDropdownButtons(canvasX, canvasY)) return true;
    if (isOverGameOverButtons(canvasX, canvasY)) return true;
    if (isOverMobileControls(canvasX, canvasY)) return true;
    return false;
}

/**
 * Detects which mobile control was pressed
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {string|null}
 */
function detectMobileButtonPress(canvasX, canvasY) {
    if (!gameRunning || !window.mobileButtonCoords) return null;
    const buttons = window.mobileButtonCoords;
    if (canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width && canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) return 'left';
    if (canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width && canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) return 'right';
    if (canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width && canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) return 'jump';
    if (canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width && canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) return 'throw';
    return null;
}

/**
 * Sets keyboard state to pressed for a control
 * @param {string} buttonPressed
 */
function updateKeyboardOnPress(buttonPressed) {
    switch (buttonPressed) {
        case 'left': keyboard.LEFT = true; break;
        case 'right': keyboard.RIGHT = true; break;
        case 'jump': keyboard.SPACE = true; break;
        case 'throw': keyboard.D = true; break;
    }
}

/**
 * Sets keyboard state to released for a control
 * @param {string} buttonReleased
 */
function updateKeyboardOnRelease(buttonReleased) {
    switch (buttonReleased) {
        case 'left': keyboard.LEFT = false; break;
        case 'right': keyboard.RIGHT = false; break;
        case 'jump': keyboard.SPACE = false; break;
        case 'throw': keyboard.D = false; break;
    }
}

/**
 * Handles mouse button release hit-testing
 * @param {number} canvasX
 * @param {number} canvasY
 */
function handleMouseButtonRelease(canvasX, canvasY) {
    const buttonPressed = detectMobileButtonPress(canvasX, canvasY);
    if (buttonPressed) {
        window.activeButtons.delete(buttonPressed);
        updateKeyboardOnRelease(buttonPressed);
    }
}

/**
 * Releases a touch-tracked button if needed
 * @param {number} touchId
 */
function handleTouchButtonRelease(touchId) {
    const buttonToRelease = window.touchPoints.get(touchId);
    if (buttonToRelease) {
        window.activeButtons.delete(buttonToRelease);
        window.touchPoints.delete(touchId);
        if (!window.activeButtons.has(buttonToRelease)) {
            updateKeyboardOnRelease(buttonToRelease);
        }
    }
}

/**
 * Checks if touch is still on same button
 * @param {string} currentButton
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function isTouchStillOnButton(currentButton, canvasX, canvasY) {
    if (!gameRunning || !window.mobileButtonCoords) return false;
    const buttons = window.mobileButtonCoords;
    if (currentButton === 'left' && canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width && canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) return true;
    if (currentButton === 'right' && canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width && canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) return true;
    if (currentButton === 'jump' && canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width && canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) return true;
    if (currentButton === 'throw' && canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width && canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) return true;
    return false;
}

/**
 * Updates tracked touch position and releases if moved off
 * @param {Touch} touch
 * @param {number} touchId
 */
function updateTouchPosition(touch, touchId) {
    const { canvasX, canvasY } = calculateCanvasCoordinates(touch);
    let touchPoints = new Map();
    const currentButton = touchPoints.get(touchId);
    const stillOnButton = isTouchStillOnButton(currentButton, canvasX, canvasY);
    if (!stillOnButton && currentButton) {
        let activeButtons = new Set();
        activeButtons.delete(currentButton);
        touchPoints.delete(touchId);
        if (!activeButtons.has(currentButton)) {
            updateKeyboardOnRelease(currentButton);
        }
    }
}

/**
 * Handles start button click
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function handleStartButtonClick(canvasX, canvasY) {
    if (!gameStarted && window.startButtonCoords) {
        const btn = window.startButtonCoords;
        if (canvasX >= btn.x && canvasX <= btn.x + btn.width && canvasY >= btn.y && canvasY <= btn.y + btn.height) {
            if (!window.firstSoundPlayed) { setupAudio(); window.firstSoundPlayed = true; }
            startGame();
            return true;
        }
    }
    return false;
}

/**
 * Handles game over buttons click
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function handleGameOverButtonClick(canvasX, canvasY) {
    if (world && world.showGameOver && window.gameOverButtonCoords) {
        const restartBtn = window.gameOverButtonCoords.restart;
        const homeBtn = window.gameOverButtonCoords.home;
        if (canvasX >= restartBtn.x && canvasX <= restartBtn.x + restartBtn.width && canvasY >= restartBtn.y && canvasY <= restartBtn.y + restartBtn.height) { restartGame(); return true; }
        if (canvasX >= homeBtn.x && canvasX <= homeBtn.x + homeBtn.width && canvasY >= homeBtn.y && canvasY <= homeBtn.y + homeBtn.height) { goHome(); return true; }
    }
    return false;
}

/**
 * Handles settings button click
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function handleSettingsButtonClick(canvasX, canvasY) {
    if (!gameStarted && window.settingsButtonCoords) {
        const btn = window.settingsButtonCoords;
        if (canvasX >= btn.x && canvasX <= btn.x + btn.width && canvasY >= btn.y && canvasY <= btn.y + btn.height) { toggleSettingsDropdown(); return true; }
    }
    return false;
}

/**
 * Handles in-game settings button click
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function handleInGameSettingsButtonClick(canvasX, canvasY) {
    if (gameStarted && window.inGameSettingsButtonCoords) {
        const btn = window.inGameSettingsButtonCoords;
        if (canvasX >= btn.x && canvasX <= btn.x + btn.width && canvasY >= btn.y && canvasY <= btn.y + btn.height) { toggleSettingsDropdown(); return true; }
    }
    return false;
}

/**
 * Handles dropdown button clicks
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function handleDropdownButtonClick(canvasX, canvasY) {
    if (!gameStarted && window.dropdownButtonCoords && window.settingsDropdownVisible) {
        for (const [action, coords] of Object.entries(window.dropdownButtonCoords)) {
            if (canvasX >= coords.x && canvasX <= coords.x + coords.width && canvasY >= coords.y && canvasY <= coords.y + coords.height) { handleDropdownAction(action); return true; }
        }
    }
    return false;
}

/**
 * Executes dropdown action
 * @param {string} action
 */
function handleDropdownAction(action) {
    switch (action) {
        case 'sound': toggleSound(); hideSettingsDropdown(); break;
        case 'info': hideSettingsDropdown(); setTimeout(() => show('infoModal'), 100); break;
        case 'fullscreen': toggleFullscreen(); hideSettingsDropdown(); break;
    }
}

/**
 * Toggles dropdown visibility
 */
function toggleSettingsDropdown() {
    if (window.settingsDropdownVisible) { hideSettingsDropdown(); } else { showSettingsDropdown(); }
}

/**
 * Shows settings dropdown
 */
function showSettingsDropdown() {
    window.settingsDropdownVisible = true;
    drawStartScreen();
}

/**
 * Hides settings dropdown
 */
function hideSettingsDropdown() {
    window.settingsDropdownVisible = false;
    window.hoveredDropdownButton = null;
    drawStartScreen();
}