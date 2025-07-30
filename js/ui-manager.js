function drawStartScreen() {
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawStartButton(ctx);
    
    const startScreenImage = new Image();
    startScreenImage.onload = function() {
        ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
        drawStartButton(ctx);
    };
    startScreenImage.onerror = function() {
    };
    startScreenImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';
}

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