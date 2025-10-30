/**
 * Draws the start screen with background image and start button
 * @description Renders the initial game screen with background and interactive start button
 */
function drawStartScreen() {
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!window.startScreenImage) {
        window.startScreenImage = new Image();
        window.startScreenImage.onload = function() {
            drawStartScreen();
        };
        window.startScreenImage.onerror = function() {
            drawStartButton(ctx);
        };
        window.startScreenImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';
        drawStartButton(ctx);
        return;
    }
    
    if (window.startScreenImage.complete) {
        ctx.drawImage(window.startScreenImage, 0, 0, canvas.width, canvas.height);
    }
    
    drawStartButton(ctx);
    drawSettingsButton(ctx);
    
    if (window.settingsDropdownVisible) {
        drawSettingsDropdown(ctx);
    }
}

/**
 * Draws the start button on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @description Creates a styled start button with gradient background and text
 */
function drawStartButton(ctx) {
    const buttonX = 20;
    const buttonY = 20;
    const buttonWidth = 120;
    const buttonHeight = 40;
    
    const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = gradient;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 3;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 16px Play, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', buttonX + buttonWidth/2, buttonY + buttonHeight/2);
    
    window.startButtonCoords = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
}

/**
 * Draws the settings button on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @description Creates a styled settings button with gear icon
 */
function drawSettingsButton(ctx) {
    const buttonX = canvas.width - 60;
    const buttonY = 20;
    const buttonWidth = 40;
    const buttonHeight = 40;
    
    const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(1, '#357ABD');
    ctx.fillStyle = gradient;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#2E5A8A';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚙️', buttonX + buttonWidth/2, buttonY + buttonHeight/2);
    
    window.settingsButtonCoords = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
}

/**
 * Draws the settings dropdown menu on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @description Creates a dropdown menu with sound, info, and fullscreen options
 */
function drawSettingsDropdown(ctx) {
    const menuX = canvas.width - 150;
    const menuY = 70;
    const menuWidth = 130;
    const menuHeight = 150;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(menuX, menuY, menuWidth, menuHeight);
    
    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 2;
    ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);
    
    const buttonHeight = 35;
    const buttonSpacing = 8;
    let currentY = menuY + 15;
    
    // Korrekte audioManager-Referenz verwenden
    const soundOn = (typeof audioManager !== 'undefined' && audioManager) ? audioManager.soundEnabled : true;
    const soundText = soundOn ? '🔊 Sound' : '🔇 Muted';
    drawDropdownButton(ctx, menuX + 10, currentY, menuWidth - 20, buttonHeight, soundText, 'sound');
    currentY += buttonHeight + buttonSpacing;
    
    drawDropdownButton(ctx, menuX + 10, currentY, menuWidth - 20, buttonHeight, 'ℹ️ Info', 'info');
    currentY += buttonHeight + buttonSpacing;
    
    drawDropdownButton(ctx, menuX + 10, currentY, menuWidth - 20, buttonHeight, '⛶ Fullscreen', 'fullscreen');
}

/**
 * Draws a dropdown menu button
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @param {number} x - X coordinate of the button
 * @param {number} y - Y coordinate of the button
 * @param {number} width - Width of the button
 * @param {number} height - Height of the button
 * @param {string} text - Text to display on the button
 * @param {string} action - Action identifier for the button
 * @description Creates a styled dropdown button with hover effect
 */
function drawDropdownButton(ctx, x, y, width, height, text, action) {
    const isHovered = window.hoveredDropdownButton === action;
    
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    if (isHovered) {
        gradient.addColorStop(0, '#5A9FE2');
        gradient.addColorStop(1, '#4A90E2');
    } else {
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(1, '#357ABD');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = '#2E5A8A';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 10, y + height/2);
    
    if (!window.dropdownButtonCoords) {
        window.dropdownButtonCoords = {};
    }
    window.dropdownButtonCoords[action] = { x, y, width, height };
}

/**
 * Draws mobile control buttons on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @description Renders touch controls for mobile devices (left, right, jump, throw buttons)
 */
function drawMobileControls(ctx) {
    if (window.domMobileControlsEnabled) return;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) return;
    if (!gameRunning || world.showGameOver || world.gameWon) return;
    if (window.innerWidth >= 1025) return;
    
    const buttonSize = 40;
    const margin = 20;
    const bottomY = ctx.canvas.height - buttonSize - margin;
    const leftX = margin;
    const rightX = leftX + buttonSize + 10;
    const throwX = ctx.canvas.width - buttonSize - margin;
    const jumpX = throwX - buttonSize - 10;
    
    drawControlButton(ctx, leftX, bottomY, buttonSize, '<', '#FFD700', '#FFA500');
    drawControlButton(ctx, rightX, bottomY, buttonSize, '>', '#FFD700', '#FFA500');
    drawControlButton(ctx, jumpX, bottomY, buttonSize, '⬆', '#FFD700', '#FFA500');
    drawControlButton(ctx, throwX, bottomY, buttonSize, '💥', '#FFD700', '#FFA500');
    
    window.mobileButtonCoords = {
        left: { x: leftX, y: bottomY, width: buttonSize, height: buttonSize },
        right: { x: rightX, y: bottomY, width: buttonSize, height: buttonSize },
        jump: { x: jumpX, y: bottomY, width: buttonSize, height: buttonSize },
        throw: { x: throwX, y: bottomY, width: buttonSize, height: buttonSize }
    };
}

/**
 * Draws the settings button during gameplay
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @description Creates a settings button in the top-right corner during gameplay
 */
function drawInGameSettingsButton(ctx) {
    if (!gameRunning || world.showGameOver || world.gameWon) return;
    
    const buttonX = ctx.canvas.width / 2 - 20; // Mittig horizontal (minus halbe Button-Breite)
    const buttonY = 20;
    const buttonWidth = 40;
    const buttonHeight = 40;
    
    const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(1, '#357ABD');
    ctx.fillStyle = gradient;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#2E5A8A';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚙️', buttonX + buttonWidth/2, buttonY + buttonHeight/2);
    
    window.inGameSettingsButtonCoords = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
}

/**
 * Draws the settings dropdown menu during gameplay
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @description Creates a dropdown menu during gameplay with sound, info, and fullscreen options
 */
function drawInGameSettingsDropdown(ctx) {
    if (!gameRunning || world.showGameOver || world.gameWon) return;
    
    const menuX = ctx.canvas.width / 2 - 65; // Mittig horizontal (minus halbe Menu-Breite)
    const menuY = 70;
    const menuWidth = 130;
    const menuHeight = 150;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(menuX, menuY, menuWidth, menuHeight);
    
    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 2;
    ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);
    
    const buttonHeight = 35;
    const buttonSpacing = 8;
    let currentY = menuY + 15;
    
    // Korrekte audioManager-Referenz verwenden
    const soundOn = (typeof audioManager !== 'undefined' && audioManager) ? audioManager.soundEnabled : true;
    const soundText = soundOn ? '🔊 Sound' : '🔇 Muted';
    drawInGameDropdownButton(ctx, menuX + 10, currentY, menuWidth - 20, buttonHeight, soundText, 'sound');
    currentY += buttonHeight + buttonSpacing;
    
    drawInGameDropdownButton(ctx, menuX + 10, currentY, menuWidth - 20, buttonHeight, 'ℹ️ Info', 'info');
    currentY += buttonHeight + buttonSpacing;
    
    drawInGameDropdownButton(ctx, menuX + 10, currentY, menuWidth - 20, buttonHeight, '⛶ Fullscreen', 'fullscreen');
}

/**
 * Draws a dropdown menu button for in-game settings
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @param {number} x - X coordinate of the button
 * @param {number} y - Y coordinate of the button
 * @param {number} width - Width of the button
 * @param {number} height - Height of the button
 * @param {string} text - Text to display on the button
 * @param {string} action - Action identifier for the button
 * @description Creates a styled dropdown button for in-game settings with hover effect
 */
function drawInGameDropdownButton(ctx, x, y, width, height, text, action) {
    const isHovered = window.hoveredInGameDropdownButton === action;
    
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    if (isHovered) {
        gradient.addColorStop(0, '#5A9FE2');
        gradient.addColorStop(1, '#4A90E2');
    } else {
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(1, '#357ABD');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = '#2E5A8A';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 10, y + height/2);
    
    if (!window.inGameDropdownButtonCoords) {
        window.inGameDropdownButtonCoords = {};
    }
    window.inGameDropdownButtonCoords[action] = { x, y, width, height };
}

/**
 * Draws a control button with gradient background and text
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @param {number} x - X coordinate of the button
 * @param {number} y - Y coordinate of the button
 * @param {number} size - Size of the button (width and height)
 * @param {string} text - Text to display on the button
 * @param {string} color1 - First gradient color
 * @param {string} color2 - Second gradient color
 * @description Creates a styled button with gradient background, border, and centered text
 */
function drawControlButton(ctx, x, y, size, text, color1, color2) {
    const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, size, size);
    
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, size, size);
    
    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 20px Play, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + size/2, y + size/2);
}

/**
 * Draws restart and home buttons on game over screen
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @description Creates restart and home buttons with gradient backgrounds and text
 */
function drawGameOverButtons(ctx) {
    const buttonWidth = 120;
    const buttonHeight = 40;
    const centerX = ctx.canvas.width / 2;
    const buttonY = ctx.canvas.height - 80;
    
    const restartX = centerX - buttonWidth - 20;
    const homeX = centerX + 20;
    
    drawGameOverButton(ctx, restartX, buttonY, buttonWidth, buttonHeight, 'RESTART');
    drawGameOverButton(ctx, homeX, buttonY, buttonWidth, buttonHeight, 'HOME');
    
    window.gameOverButtonCoords = {
        restart: { x: restartX, y: buttonY, width: buttonWidth, height: buttonHeight },
        home: { x: homeX, y: buttonY, width: buttonWidth, height: buttonHeight }
    };
}

/**
 * Draws a game over button with gradient background and text
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @param {number} x - X coordinate of the button
 * @param {number} y - Y coordinate of the button
 * @param {number} width - Width of the button
 * @param {number} height - Height of the button
 * @param {string} text - Text to display on the button
 * @description Creates a styled button with gradient background, border, and centered text
 */
function drawGameOverButton(ctx, x, y, width, height, text) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 16px Play, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width/2, y + height/2);
} 