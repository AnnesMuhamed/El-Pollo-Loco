/**
 * Draws the start screen with background image and start button.
 * @description Renders the initial game screen with background and interactive start button.
 */
function drawStartScreen() {
    const ctx = getCanvasContext();
    if (!ctx) return;
    clearCanvasArea(ctx);
    if (!ensureStartScreenBackground(ctx)) return;
    renderStartInterface(ctx);
}

/**
 * Ensures the start screen image is available and rendered.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {boolean} True when the background can be drawn.
 */
function ensureStartScreenBackground(ctx) {
    if (!window.startScreenImage) {
        setupStartScreenImage(ctx);
        return false;
    }
    if (window.startScreenImage.complete) {
        ctx.drawImage(window.startScreenImage, 0, 0, canvas.width, canvas.height);
    }
    return true;
}

/**
 * Initiates loading of the start screen image.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function setupStartScreenImage(ctx) {
    window.startScreenImage = new Image();
    window.startScreenImage.onload = drawStartScreen;
    window.startScreenImage.onerror = () => drawStartButton(ctx);
    window.startScreenImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';
    drawStartButton(ctx);
}

/**
 * Renders all start screen interface elements.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function renderStartInterface(ctx) {
    drawStartButton(ctx);
    drawSettingsButton(ctx);
    renderSettingsDropdown(ctx);
}

/**
 * Renders the settings dropdown when visible.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function renderSettingsDropdown(ctx) {
    if (!window.settingsDropdownVisible) return;
    drawSettingsDropdown(ctx);
}

/**
 * Draws the start button on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function drawStartButton(ctx) {
    const coords = resolveStartButtonCoords();
    fillGradientRect(ctx, coords, ['#FFD700', '#FFA500']);
    strokeRect(ctx, coords, '#FF8C00', 3);
    drawCenteredText(ctx, coords, 'START', 'bold 16px Play, Arial, sans-serif', '#8B4513');
    window.startButtonCoords = coords;
}

/**
 * Draws the settings button on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function drawSettingsButton(ctx) {
    const coords = resolveSettingsButtonCoords();
    fillGradientRect(ctx, coords, ['#4A90E2', '#357ABD']);
    strokeRect(ctx, coords, '#2E5A8A', 2);
    drawCenteredText(ctx, coords, '⚙️', 'bold 20px Arial, sans-serif', '#FFFFFF');
    window.settingsButtonCoords = coords;
}

/**
 * Draws mobile control buttons on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function drawMobileControls(ctx) {
    if (shouldSkipCanvasControls()) return;
    const layout = resolveMobileControlLayout(ctx);
    renderMobileControlButtons(ctx, layout);
    window.mobileButtonCoords = layout.coords;
}

/**
 * Draws the settings button during gameplay.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function drawInGameSettingsButton(ctx) {
    if (!shouldShowInGameSettingsButton()) return;
    const coords = resolveInGameSettingsButtonCoords(ctx);
    fillGradientRect(ctx, coords, ['#4A90E2', '#357ABD']);
    strokeRect(ctx, coords, '#2E5A8A', 2);
    drawCenteredText(ctx, coords, '⚙️', 'bold 20px Arial, sans-serif', '#FFFFFF');
    window.inGameSettingsButtonCoords = coords;
}

/**
 * Determines whether the in-game settings button should be displayed.
 * @returns {boolean} True when the button should be drawn.
 */
function shouldShowInGameSettingsButton() {
    if (!gameRunning) return false;
    if (world.showGameOver) return false;
    return !world.gameWon;
}

/**
 * Resolves coordinates for the in-game settings button.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {{x:number,y:number,width:number,height:number}} Button rectangle.
 */
function resolveInGameSettingsButtonCoords(ctx) {
    const x = ctx.canvas.width / 2 - 20;
    return { x, y: 20, width: 40, height: 40 };
}

/**
 * Draws a control button with gradient background and text.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} size - Button size.
 * @param {string} text - Button label.
 * @param {string} color1 - Gradient start color.
 * @param {string} color2 - Gradient end color.
 */
function drawControlButton(ctx, x, y, size, text, color1, color2) {
    const coords = { x, y, width: size, height: size };
    fillGradientRect(ctx, coords, [color1, color2]);
    strokeRect(ctx, coords, '#FF8C00', 3);
    drawCenteredText(ctx, coords, text, 'bold 20px Play, Arial, sans-serif', '#8B4513');
}

/**
 * Draws restart and home buttons on the game over screen.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function drawGameOverButtons(ctx) {
    const metrics = resolveGameOverButtonMetrics(ctx);
    renderGameOverButtons(ctx, metrics);
    window.gameOverButtonCoords = metrics.coords;
}
function drawGameOverButton(ctx, x, y, width, height, text) {
    const coords = { x, y, width, height };
    fillGradientRect(ctx, coords, ['#FFD700', '#FFA500']);
    strokeRect(ctx, coords, '#FF8C00', 3);
    drawCenteredText(ctx, coords, text, 'bold 16px Play, Arial, sans-serif', '#8B4513');
}
