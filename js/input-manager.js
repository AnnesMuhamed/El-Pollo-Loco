function setupCanvasClickHandler() {
    let activeButtons = new Set();
    let touchPoints = new Map(); // Track touch points by ID

    canvas.addEventListener('mousedown', function(e) {
        handleButtonPress(e, 'mouse');
    });

    canvas.addEventListener('mouseup', function(e) {
        handleButtonRelease(e, 'mouse');
    });

    canvas.addEventListener('mouseleave', function(e) {
        handleButtonRelease(e, 'mouse');
    });

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            handleButtonPress(touch, 'touch', touch.identifier);
        }
    }, { passive: false });

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            handleButtonRelease(touch, 'touch', touch.identifier);
        }
    }, { passive: false });

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

    canvas.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        activeButtons.clear();
        touchPoints.clear();
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        keyboard.SPACE = false;
        keyboard.D = false;
    }, { passive: false });

    function handleButtonPress(e, type, touchId = null) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;
        
        if (!gameStarted && window.startButtonCoords) {
            const btn = window.startButtonCoords;
            if (canvasX >= btn.x && canvasX <= btn.x + btn.width &&
                canvasY >= btn.y && canvasY <= btn.y + btn.height) {
                startGame();
                return;
            }
        }
        
        if (!gameRunning || !window.mobileButtonCoords) return;
        
        const buttons = window.mobileButtonCoords;
        let buttonPressed = null;
        
        if (canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width &&
            canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) {
            buttonPressed = 'left';
            keyboard.LEFT = true;
        } else if (canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width &&
                   canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) {
            buttonPressed = 'right';
            keyboard.RIGHT = true;
        } else if (canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width &&
                   canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) {
            buttonPressed = 'jump';
            keyboard.SPACE = true;
        } else if (canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width &&
                   canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) {
            buttonPressed = 'throw';
            keyboard.D = true;
        }
        
        if (buttonPressed) {
            activeButtons.add(buttonPressed);
            if (type === 'touch' && touchId !== null) {
                touchPoints.set(touchId, buttonPressed);
            }
        }
    }

    function handleButtonRelease(e, type, touchId = null) {
        if (!gameRunning || !window.mobileButtonCoords) return;
        
        if (type === 'touch' && touchId !== null) {
            const buttonToRelease = touchPoints.get(touchId);
            if (buttonToRelease) {
                activeButtons.delete(buttonToRelease);
                touchPoints.delete(touchId);
                
                if (!activeButtons.has(buttonToRelease)) {
                    switch (buttonToRelease) {
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
            }
        } else {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const canvasX = x * scaleX;
            const canvasY = y * scaleY;
            
            const buttons = window.mobileButtonCoords;
            
            if (canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width &&
                canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) {
                activeButtons.delete('left');
                keyboard.LEFT = false;
            } else if (canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width &&
                       canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) {
                activeButtons.delete('right');
                keyboard.RIGHT = false;
            } else if (canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width &&
                       canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) {
                activeButtons.delete('jump');
                keyboard.SPACE = false;
            } else if (canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width &&
                       canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) {
                activeButtons.delete('throw');
                keyboard.D = false;
            }
        }
    }

    function updateTouchPosition(touch, touchId) {
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;
        
        if (!gameRunning || !window.mobileButtonCoords) return;
        
        const buttons = window.mobileButtonCoords;
        const currentButton = touchPoints.get(touchId);
        
        let stillOnButton = false;
        if (currentButton === 'left' && 
            canvasX >= buttons.left.x && canvasX <= buttons.left.x + buttons.left.width &&
            canvasY >= buttons.left.y && canvasY <= buttons.left.y + buttons.left.height) {
            stillOnButton = true;
        } else if (currentButton === 'right' && 
                   canvasX >= buttons.right.x && canvasX <= buttons.right.x + buttons.right.width &&
                   canvasY >= buttons.right.y && canvasY <= buttons.right.y + buttons.right.height) {
            stillOnButton = true;
        } else if (currentButton === 'jump' && 
                   canvasX >= buttons.jump.x && canvasX <= buttons.jump.x + buttons.jump.width &&
                   canvasY >= buttons.jump.y && canvasY <= buttons.jump.y + buttons.jump.height) {
            stillOnButton = true;
        } else if (currentButton === 'throw' && 
                   canvasX >= buttons.throw.x && canvasX <= buttons.throw.x + buttons.throw.width &&
                   canvasY >= buttons.throw.y && canvasY <= buttons.throw.y + buttons.throw.height) {
            stillOnButton = true;
        }
        
        if (!stillOnButton && currentButton) {
            activeButtons.delete(currentButton);
            touchPoints.delete(touchId);
            
            if (!activeButtons.has(currentButton)) {
                switch (currentButton) {
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
        }
    }
} 