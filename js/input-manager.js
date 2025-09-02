/**
 * Sets up canvas click and touch event handlers
 * @description Initializes mouse and touch event listeners for game interaction
 */
function setupCanvasClickHandler() {
    window.activeButtons = new Set();
    window.touchPoints = new Map();

    setupMouseEvents();
    setupTouchEvents();
    setupClickOutsideHandler();
}

/**
 * Sets up click outside handler for dropdown
 * @description Closes dropdown when clicking outside of it
 */
function setupClickOutsideHandler() {
    document.addEventListener('click', function(event) {
        if (window.settingsDropdownVisible && !canvas.contains(event.target)) {
            hideSettingsDropdown();
        }
    });
}

/**
 * Sets up mouse event listeners
 * @description Initializes mouse down, up, and leave event handlers
 */
function setupMouseEvents() {
    canvas.addEventListener('mousedown', function(e) {
        handleButtonPress(e, 'mouse');
    });

    canvas.addEventListener('mouseup', function(e) {
        handleButtonRelease(e, 'mouse');
    });

    canvas.addEventListener('mouseleave', function(e) {
        handleButtonRelease(e, 'mouse');
    });

    canvas.addEventListener('mousemove', function(e) {
        handleMouseMove(e);
    });
}

/**
 * Handles mouse move events for hover effects
 * @param {Event} e - The mouse event object
 * @description Updates hover state for dropdown buttons
 */
function handleMouseMove(e) {
    const { canvasX, canvasY } = calculateCanvasCoordinates(e);

    // Cursor-Update je nach Hover-Zustand
    if (isOverAnyClickable(canvasX, canvasY)) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }

    // Bestehende Dropdown-Hover-Logik beibehalten
    if (!gameStarted && window.settingsDropdownVisible && window.dropdownButtonCoords) {
        let hoveredButton = null;
        for (const [action, coords] of Object.entries(window.dropdownButtonCoords)) {
            if (canvasX >= coords.x && canvasX <= coords.x + coords.width &&
                canvasY >= coords.y && canvasY <= coords.y + coords.height) {
                hoveredButton = action;
                break;
            }
        }
        if (hoveredButton !== window.hoveredDropdownButton) {
            window.hoveredDropdownButton = hoveredButton;
            drawStartScreen();
        }
    }
}

/**
 * Checks if the mouse is over any clickable element on the canvas
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
function isOverAnyClickable(canvasX, canvasY) {
    // Start button
    if (!gameStarted && window.startButtonCoords) {
        const b = window.startButtonCoords;
        if (canvasX >= b.x && canvasX <= b.x + b.width && canvasY >= b.y && canvasY <= b.y + b.height) return true;
    }

    // Settings button
    if (!gameStarted && window.settingsButtonCoords) {
        const b = window.settingsButtonCoords;
        if (canvasX >= b.x && canvasX <= b.x + b.width && canvasY >= b.y && canvasY <= b.y + b.height) return true;
    }

    // Dropdown buttons
    if (!gameStarted && window.settingsDropdownVisible && window.dropdownButtonCoords) {
        for (const coords of Object.values(window.dropdownButtonCoords)) {
            if (canvasX >= coords.x && canvasX <= coords.x + coords.width &&
                canvasY >= coords.y && canvasY <= coords.y + coords.height) return true;
        }
    }

    // Game over buttons
    if (world && world.showGameOver && window.gameOverButtonCoords) {
        const r = window.gameOverButtonCoords.restart;
        const h = window.gameOverButtonCoords.home;
        if (r && canvasX >= r.x && canvasX <= r.x + r.width && canvasY >= r.y && canvasY <= r.y + r.height) return true;
        if (h && canvasX >= h.x && canvasX <= h.x + h.width && canvasY >= h.y && canvasY <= h.y + h.height) return true;
    }

    // Mobile controls (während des Spiels)
    if (gameRunning && window.mobileButtonCoords) {
        const m = window.mobileButtonCoords;
        if (m.left && canvasX >= m.left.x && canvasX <= m.left.x + m.left.width && canvasY >= m.left.y && canvasY <= m.left.y + m.left.height) return true;
        if (m.right && canvasX >= m.right.x && canvasX <= m.right.x + m.right.width && canvasY >= m.right.y && canvasY <= m.right.y + m.right.height) return true;
        if (m.jump && canvasX >= m.jump.x && canvasX <= m.jump.x + m.jump.width && canvasY >= m.jump.y && canvasY <= m.jump.y + m.jump.height) return true;
        if (m.throw && canvasX >= m.throw.x && canvasX <= m.throw.x + m.throw.width && canvasY >= m.throw.y && canvasY <= m.throw.y + m.throw.height) return true;
    }

    return false;
}

/**
 * Sets up touch event listeners
 * @description Initializes touch start, end, move, and cancel event handlers
 */
function setupTouchEvents() {
    setupTouchStartEvent();
    setupTouchEndEvent();
    setupTouchMoveEvent();
    setupTouchCancelEvent();
}

/**
 * Sets up touch start event listener
 * @description Handles touch start events for all touch points
 */
function setupTouchStartEvent() {
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            handleButtonPress(touch, 'touch', touch.identifier);
        }
    }, { passive: false });
}

/**
 * Sets up touch end event listener
 * @description Handles touch end events for all released touch points
 */
function setupTouchEndEvent() {
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            handleButtonRelease(touch, 'touch', touch.identifier);
        }
    }, { passive: false });
}

/**
 * Sets up touch move event listener
 * @description Handles touch move events with throttling for performance
 */
function setupTouchMoveEvent() {
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.touches.length > 0) {
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                updateTouchPosition(touch, touch.identifier);
            }
        }
    }, { passive: false });
}

/**
 * Sets up touch cancel event listener
 * @description Handles touch cancel events for all cancelled touch points
 */
function setupTouchCancelEvent() {
    canvas.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            handleButtonRelease(touch, 'touch', touch.identifier);
        }
    }, { passive: false });
}

/**
 * Calculates canvas coordinates from event coordinates
 * @param {Event} e - The event object
 * @returns {Object} Object containing canvasX and canvasY coordinates
 * @description Converts screen coordinates to canvas coordinates
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
 * Checks if start button was clicked
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if start button was clicked
 * @description Handles start button click detection
 */
function handleStartButtonClick(canvasX, canvasY) {
    if (!gameStarted && window.startButtonCoords) {
        const btn = window.startButtonCoords;
        if (canvasX >= btn.x && canvasX <= btn.x + btn.width &&
            canvasY >= btn.y && canvasY <= btn.y + btn.height) {
            startGame();
            return true;
        }
    }
    return false;
}

/**
 * Checks if game over buttons were clicked
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if game over button was clicked
 * @description Handles restart and home button click detection
 */
function handleGameOverButtonClick(canvasX, canvasY) {
    if (world && world.showGameOver && window.gameOverButtonCoords) {
        const restartBtn = window.gameOverButtonCoords.restart;
        const homeBtn = window.gameOverButtonCoords.home;
        
        if (canvasX >= restartBtn.x && canvasX <= restartBtn.x + restartBtn.width &&
            canvasY >= restartBtn.y && canvasY <= restartBtn.y + restartBtn.height) {
            restartGame();
            return true;
        }
        
        if (canvasX >= homeBtn.x && canvasX <= homeBtn.x + homeBtn.width &&
            canvasY >= homeBtn.y && canvasY <= homeBtn.y + homeBtn.height) {
            goHome();
            return true;
        }
    }
    return false;
}

/**
 * Checks if settings button was clicked
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if settings button was clicked
 * @description Handles settings button click detection
 */
function handleSettingsButtonClick(canvasX, canvasY) {
    if (!gameStarted && window.settingsButtonCoords) {
        const btn = window.settingsButtonCoords;
        if (canvasX >= btn.x && canvasX <= btn.x + btn.width &&
            canvasY >= btn.y && canvasY <= btn.y + btn.height) {
            toggleSettingsDropdown();
            return true;
        }
    }
    return false;
}

/**
 * Handles dropdown button clicks
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if a dropdown button was clicked
 * @description Detects clicks on dropdown menu buttons
 */
function handleDropdownButtonClick(canvasX, canvasY) {
    if (!gameStarted && window.dropdownButtonCoords && window.settingsDropdownVisible) {
        for (const [action, coords] of Object.entries(window.dropdownButtonCoords)) {
            if (canvasX >= coords.x && canvasX <= coords.x + coords.width &&
                canvasY >= coords.y && canvasY <= coords.y + coords.height) {
                handleDropdownAction(action);
                return true;
            }
        }
    }
    return false;
}

/**
 * Handles dropdown menu actions
 * @param {string} action - The action to perform
 * @description Executes the selected dropdown menu action
 */
function handleDropdownAction(action) {
    switch (action) {
        case 'sound':
            toggleSound();
            hideSettingsDropdown();
            break;
        case 'info':
            hideSettingsDropdown();
            setTimeout(() => show('infoModal'), 100);
            break;
        case 'fullscreen':
            toggleFullscreen();
            hideSettingsDropdown();
            break;
    }
}

/**
 * Toggles settings dropdown visibility
 * @description Shows or hides the settings dropdown menu
 */
function toggleSettingsDropdown() {
    if (window.settingsDropdownVisible) {
        hideSettingsDropdown();
    } else {
        showSettingsDropdown();
    }
}

/**
 * Shows settings dropdown menu
 * @description Displays the settings dropdown on canvas
 */
function showSettingsDropdown() {
    window.settingsDropdownVisible = true;
    drawStartScreen();
}

/**
 * Hides settings dropdown menu
 * @description Hides the settings dropdown and redraws start screen
 */
function hideSettingsDropdown() {
    window.settingsDropdownVisible = false;
    window.hoveredDropdownButton = null;
    drawStartScreen();
}

/**
 * Processes mobile button press detection
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {string|null} The pressed button type or null
 * @description Detects which mobile button was pressed
 */
function detectMobileButtonPress(canvasX, canvasY) {
    if (!gameRunning || !window.mobileButtonCoords) return null;
    
    const buttons = window.mobileButtonCoords;
    
    if (canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width &&
        canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) {
        return 'left';
    } else if (canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width &&
               canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) {
        return 'right';
    } else if (canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width &&
               canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) {
        return 'jump';
    } else if (canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width &&
               canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) {
        return 'throw';
    }
    
    return null;
}

/**
 * Updates keyboard state based on button press
 * @param {string} buttonPressed - The type of button pressed
 * @description Sets the appropriate keyboard key to true
 */
function updateKeyboardOnPress(buttonPressed) {
    switch (buttonPressed) {
        case 'left':
            keyboard.LEFT = true;
            break;
        case 'right':
            keyboard.RIGHT = true;
            break;
        case 'jump':
            keyboard.SPACE = true;
            break;
        case 'throw':
            keyboard.D = true;
            break;
    }
}

/**
 * Handles button press events for mouse and touch
 * @param {Event} e - The event object
 * @param {string} type - The event type ('mouse' or 'touch')
 * @param {number|null} touchId - The touch identifier for touch events
 * @description Processes button press events and updates keyboard state
 */
function handleButtonPress(e, type, touchId = null) {
    const { canvasX, canvasY } = calculateCanvasCoordinates(e);
    
    if (handleStartButtonClick(canvasX, canvasY)) {
        return;
    }
    
    if (handleGameOverButtonClick(canvasX, canvasY)) {
        return;
    }
    
    if (handleSettingsButtonClick(canvasX, canvasY)) {
        return;
    }
    
    if (handleDropdownButtonClick(canvasX, canvasY)) {
        return;
    }
    
    const buttonPressed = detectMobileButtonPress(canvasX, canvasY);
    
    if (buttonPressed) {
        updateKeyboardOnPress(buttonPressed);
        
        if (type === 'touch' && touchId !== null) {
            window.touchPoints.set(touchId, buttonPressed);
            window.activeButtons.add(buttonPressed);
        } else if (type === 'mouse') {
            window.activeButtons.add(buttonPressed);
        }
    }
}

/**
 * Handles touch button release logic
 * @param {number} touchId - The touch identifier
 * @description Processes touch button release and updates keyboard state
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
 * Handles mouse button release logic
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @description Processes mouse button release and updates keyboard state
 */
function handleMouseButtonRelease(canvasX, canvasY) {
    const buttonPressed = detectMobileButtonPress(canvasX, canvasY);
    
    if (buttonPressed) {
        window.activeButtons.delete(buttonPressed);
        updateKeyboardOnRelease(buttonPressed);
    }
}

/**
 * Updates keyboard state based on button release
 * @param {string} buttonReleased - The type of button released
 * @description Sets the appropriate keyboard key to false
 */
function updateKeyboardOnRelease(buttonReleased) {
    switch (buttonReleased) {
        case 'left':
            keyboard.LEFT = false;
            break;
        case 'right':
            keyboard.RIGHT = false;
            break;
        case 'jump':
            keyboard.SPACE = false;
            break;
        case 'throw':
            keyboard.D = false;
            break;
    }
}

/**
 * Handles button release events for mouse and touch
 * @param {Event} e - The event object
 * @param {string} type - The event type ('mouse' or 'touch')
 * @param {number|null} touchId - The touch identifier for touch events
 * @description Processes button release events and updates keyboard state
 */
function handleButtonRelease(e, type, touchId = null) {
    if (!gameRunning || !window.mobileButtonCoords) return;
    
    if (type === 'touch' && touchId !== null) {
        handleTouchButtonRelease(touchId);
    } else {
        const { canvasX, canvasY } = calculateCanvasCoordinates(e);
        handleMouseButtonRelease(canvasX, canvasY);
    }
}

/**
 * Checks if touch is still on the same button
 * @param {string} currentButton - The current button being pressed
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if touch is still on button
 * @description Determines if touch position is still within button bounds
 */
function isTouchStillOnButton(currentButton, canvasX, canvasY) {
    if (!gameRunning || !window.mobileButtonCoords) return false;
    
    const buttons = window.mobileButtonCoords;
    
    if (currentButton === 'left' && 
        canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width &&
        canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) {
        return true;
    } else if (currentButton === 'right' && 
               canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width &&
               canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) {
        return true;
    } else if (currentButton === 'jump' && 
               canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width &&
               canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) {
        return true;
    } else if (currentButton === 'throw' && 
               canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width &&
               canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) {
        return true;
    }
    
    return false;
}

/**
 * Updates touch position for continuous button pressing
 * @param {Touch} touch - The touch object
 * @param {number} touchId - The touch identifier
 * @description Monitors touch movement and releases buttons when touch moves off them
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