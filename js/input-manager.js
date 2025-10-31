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
    if (isOverAnyClickable(canvasX, canvasY)) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
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
    if (gameStarted && window.settingsDropdownVisible && window.inGameDropdownButtonCoords) {
        let hoveredButton = null;
        for (const [action, coords] of Object.entries(window.inGameDropdownButtonCoords)) {
            if (canvasX >= coords.x && canvasX <= coords.x + coords.width &&
                canvasY >= coords.y && canvasY <= coords.y + coords.height) {
                hoveredButton = action;
                break;
            }
        }
        if (hoveredButton !== window.hoveredInGameDropdownButton) {
            window.hoveredInGameDropdownButton = hoveredButton;
        }
    }
}

/**
 * Checks if the mouse is over any clickable element on the canvas
 * @param {number} canvasX
 * @param {number} canvasY
 * @returns {boolean}
 */
// moved to input-utils.js: isOverAnyClickable

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
// moved to input-utils.js: calculateCanvasCoordinates

/**
 * Checks if start button was clicked
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if start button was clicked
 * @description Handles start button click detection
 */
// moved to input-utils.js: handleStartButtonClick

/**
 * Checks if game over buttons were clicked
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if game over button was clicked
 * @description Handles restart and home button click detection
 */
// moved to input-utils.js: handleGameOverButtonClick

/**
 * Checks if settings button was clicked
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if settings button was clicked
 * @description Handles settings button click detection
 */
// moved to input-utils.js: handleSettingsButtonClick

/**
 * Handles dropdown button clicks
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if a dropdown button was clicked
 * @description Detects clicks on dropdown menu buttons
 */
// moved to input-utils.js: handleDropdownButtonClick

/**
 * Checks if in-game settings button was clicked
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if in-game settings button was clicked
 * @description Handles in-game settings button click detection
 */
// moved to input-utils.js: handleInGameSettingsButtonClick

/**
 * Handles in-game dropdown button clicks
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {boolean} True if a dropdown button was clicked
 * @description Detects clicks on in-game dropdown menu buttons
 */
function handleInGameDropdownButtonClick(canvasX, canvasY) {
    if (gameStarted && window.inGameDropdownButtonCoords && window.settingsDropdownVisible) {
        for (const [action, coords] of Object.entries(window.inGameDropdownButtonCoords)) {
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
// moved to input-utils.js: handleDropdownAction

/**
 * Toggles settings dropdown visibility
 * @description Shows or hides the settings dropdown menu
 */
// moved to input-utils.js: toggleSettingsDropdown

/**
 * Shows settings dropdown menu
 * @description Displays the settings dropdown on canvas
 */
// moved to input-utils.js: showSettingsDropdown

/**
 * Hides settings dropdown menu
 * @description Hides the settings dropdown and redraws start screen
 */
// moved to input-utils.js: hideSettingsDropdown

/**
 * Processes mobile button press detection
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @returns {string|null} The pressed button type or null
 * @description Detects which mobile button was pressed
 */
// moved to input-utils.js: detectMobileButtonPress

/**
 * Updates keyboard state based on button press
 * @param {string} buttonPressed - The type of button pressed
 * @description Sets the appropriate keyboard key to true
 */
// moved to input-utils.js: updateKeyboardOnPress

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
    
    if (handleInGameSettingsButtonClick(canvasX, canvasY)) {
        return;
    }
    
    if (handleDropdownButtonClick(canvasX, canvasY)) {
        return;
    }
    
    if (handleInGameDropdownButtonClick(canvasX, canvasY)) {
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
// moved to input-utils.js: handleTouchButtonRelease

/**
 * Handles mouse button release logic
 * @param {number} canvasX - X coordinate on canvas
 * @param {number} canvasY - Y coordinate on canvas
 * @description Processes mouse button release and updates keyboard state
 */
// moved to input-utils.js: handleMouseButtonRelease

/**
 * Updates keyboard state based on button release
 * @param {string} buttonReleased - The type of button released
 * @description Sets the appropriate keyboard key to false
 */
// moved to input-utils.js: updateKeyboardOnRelease

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