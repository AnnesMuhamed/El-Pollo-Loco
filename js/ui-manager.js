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
 * Draws mobile control buttons on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @description Renders touch controls for mobile devices (left, right, jump, throw buttons)
 */
function drawMobileControls(ctx) {
    if (!gameRunning) return;
    if (window.innerWidth >= 760) return;
    
    const buttonSize = 60;
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