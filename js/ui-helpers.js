/**
 * Provides coordinates for the start button.
 * @returns {{x:number,y:number,width:number,height:number}} The start button rectangle.
 */
function resolveStartButtonCoords() {
    return { x: 20, y: 20, width: 120, height: 40 };
}

/**
 * Provides coordinates for the settings button.
 * @returns {{x:number,y:number,width:number,height:number}} The settings button rectangle.
 */
function resolveSettingsButtonCoords() {
    return { x: canvas.width - 60, y: 20, width: 40, height: 40 };
}

/**
 * Draws the settings dropdown menu on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function drawSettingsDropdown(ctx) {
    const metrics = getSettingsDropdownMetrics();
    drawDropdownBackground(ctx, metrics);
    drawSettingsDropdownButtons(ctx, metrics);
}

/**
 * Provides layout metrics for the settings dropdown.
 * @returns {{x:number,y:number,width:number,height:number,buttonHeight:number,spacing:number}} Dropdown metrics.
 */
function getSettingsDropdownMetrics() {
    return { x: canvas.width - 150, y: 70, width: 130, height: 150, buttonHeight: 35, spacing: 8 };
}

/**
 * Draws the dropdown container.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{x:number,y:number,width:number,height:number}} metrics - Dropdown metrics.
 */
function drawDropdownBackground(ctx, metrics) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(metrics.x, metrics.y, metrics.width, metrics.height);
    strokeRect(ctx, metrics, '#4A90E2', 2);
}

/**
 * Draws the dropdown buttons for the settings menu.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{x:number,y:number,width:number,buttonHeight:number,spacing:number}} metrics - Dropdown metrics.
 */
function drawSettingsDropdownButtons(ctx, metrics) {
    const innerWidth = metrics.width - 20;
    let currentY = metrics.y + 15;
    const soundText = resolveSoundToggleText();
    drawDropdownButton(ctx, metrics.x + 10, currentY, innerWidth, metrics.buttonHeight, soundText, 'sound');
    currentY += metrics.buttonHeight + metrics.spacing;
    drawDropdownButton(ctx, metrics.x + 10, currentY, innerWidth, metrics.buttonHeight, 'ℹ️ Info', 'info');
    currentY += metrics.buttonHeight + metrics.spacing;
    drawDropdownButton(ctx, metrics.x + 10, currentY, innerWidth, metrics.buttonHeight, '⛶ Fullscreen', 'fullscreen');
}

/**
 * Resolves the sound toggle button text.
 * @returns {string} The label for the sound toggle.
 */
function resolveSoundToggleText() {
    if (typeof audioManager === 'undefined' || !audioManager) return '🔊 Sound';
    return audioManager.soundEnabled ? '🔊 Sound' : '🔇 Muted';
}

/**
 * Draws a dropdown button for the start screen menu.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Button width.
 * @param {number} height - Button height.
 * @param {string} text - Button label.
 * @param {string} action - Action key.
 */
function drawDropdownButton(ctx, x, y, width, height, text, action) {
    const coords = { x, y, width, height };
    const colors = resolveDropdownColors(window.hoveredDropdownButton === action);
    fillGradientRect(ctx, coords, colors);
    strokeRect(ctx, coords, '#2E5A8A', 1);
    drawDropdownLabel(ctx, coords, text);
    storeDropdownCoords(action, coords);
}

/**
 * Resolves gradient colors for dropdown buttons.
 * @param {boolean} isHovered - Hover state.
 * @returns {string[]} Gradient colors.
 */
function resolveDropdownColors(isHovered) {
    return isHovered ? ['#5A9FE2', '#4A90E2'] : ['#4A90E2', '#357ABD'];
}

/**
 * Draws the dropdown button text.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{x:number,y:number,width:number,height:number}} coords - Button rectangle.
 * @param {string} text - Button label.
 */
function drawDropdownLabel(ctx, coords, text) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, coords.x + 10, coords.y + coords.height / 2);
}

/**
 * Stores dropdown button coordinates for hit detection.
 * @param {string} action - Action key.
 * @param {{x:number,y:number,width:number,height:number}} coords - Button rectangle.
 */
function storeDropdownCoords(action, coords) {
    ensureDropdownCoords();
    window.dropdownButtonCoords[action] = coords;
}

/**
 * Ensures the dropdown coordinate store exists.
 */
function ensureDropdownCoords() {
    if (!window.dropdownButtonCoords) {
        window.dropdownButtonCoords = {};
    }
}

/**
 * Draws the in-game settings dropdown.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function drawInGameSettingsDropdown(ctx) {
    if (!shouldShowInGameSettingsButton()) return;
    const metrics = getInGameDropdownMetrics(ctx);
    drawDropdownBackground(ctx, metrics);
    drawInGameDropdownButtons(ctx, metrics);
}

/**
 * Provides layout metrics for the in-game dropdown.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {{x:number,y:number,width:number,height:number,buttonHeight:number,spacing:number}} Dropdown metrics.
 */
function getInGameDropdownMetrics(ctx) {
    return { x: ctx.canvas.width / 2 - 65, y: 70, width: 130, height: 150, buttonHeight: 35, spacing: 8 };
}

/**
 * Draws the dropdown buttons for the in-game menu.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{x:number,y:number,width:number,buttonHeight:number,spacing:number}} metrics - Dropdown metrics.
 */
function drawInGameDropdownButtons(ctx, metrics) {
    const innerWidth = metrics.width - 20;
    let currentY = metrics.y + 15;
    const soundText = resolveSoundToggleText();
    drawInGameDropdownButton(ctx, metrics.x + 10, currentY, innerWidth, metrics.buttonHeight, soundText, 'sound');
    currentY += metrics.buttonHeight + metrics.spacing;
    drawInGameDropdownButton(ctx, metrics.x + 10, currentY, innerWidth, metrics.buttonHeight, 'ℹ️ Info', 'info');
    currentY += metrics.buttonHeight + metrics.spacing;
    drawInGameDropdownButton(ctx, metrics.x + 10, currentY, innerWidth, metrics.buttonHeight, '⛶ Fullscreen', 'fullscreen');
}

/**
 * Draws a dropdown button for the in-game menu.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Button width.
 * @param {number} height - Button height.
 * @param {string} text - Button label.
 * @param {string} action - Action key.
 */
function drawInGameDropdownButton(ctx, x, y, width, height, text, action) {
    const coords = { x, y, width, height };
    const colors = resolveDropdownColors(window.hoveredInGameDropdownButton === action);
    fillGradientRect(ctx, coords, colors);
    strokeRect(ctx, coords, '#2E5A8A', 1);
    drawDropdownLabel(ctx, coords, text);
    storeInGameDropdownCoords(action, coords);
}

/**
 * Stores in-game dropdown button coordinates for hit detection.
 * @param {string} action - Action key.
 * @param {{x:number,y:number,width:number,height:number}} coords - Button rectangle.
 */
function storeInGameDropdownCoords(action, coords) {
    ensureInGameDropdownCoords();
    window.inGameDropdownButtonCoords[action] = coords;
}

/**
 * Ensures the in-game dropdown coordinate store exists.
 */
function ensureInGameDropdownCoords() {
    if (!window.inGameDropdownButtonCoords) {
        window.inGameDropdownButtonCoords = {};
    }
}

/**
 * Determines whether canvas-based mobile controls should be skipped.
 * @returns {boolean} True when drawing should be skipped.
 */
function shouldSkipCanvasControls() {
    if (window.domMobileControlsEnabled) return true;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return true;
    if (!gameRunning || world.showGameOver || world.gameWon) return true;
    return window.innerWidth >= 1025;
}

/**
 * Resolves layout information for mobile controls.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {{size:number,coords:Object}} Layout data.
 */
function resolveMobileControlLayout(ctx) {
    const size = 40;
    const margin = 20;
    const bottom = ctx.canvas.height - size - margin;
    const left = { x: margin, y: bottom, width: size, height: size };
    const right = { x: margin + size + 10, y: bottom, width: size, height: size };
    const throwBtn = { x: ctx.canvas.width - size - margin, y: bottom, width: size, height: size };
    const jump = { x: throwBtn.x - size - 10, y: bottom, width: size, height: size };
    return { size, coords: { left, right, jump, throw: throwBtn } };
}

/**
 * Renders all mobile control buttons.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{size:number,coords:Object}} layout - Layout data.
 */
function renderMobileControlButtons(ctx, layout) {
    const size = layout.size;
    drawControlButton(ctx, layout.coords.left.x, layout.coords.left.y, size, '<', '#FFD700', '#FFA500');
    drawControlButton(ctx, layout.coords.right.x, layout.coords.right.y, size, '>', '#FFD700', '#FFA500');
    drawControlButton(ctx, layout.coords.jump.x, layout.coords.jump.y, size, '⬆', '#FFD700', '#FFA500');
    drawControlButton(ctx, layout.coords.throw.x, layout.coords.throw.y, size, '💥', '#FFD700', '#FFA500');
}

/**
 * Provides layout metrics for game over buttons.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {{coords:Object}} Button metrics.
 */
function resolveGameOverButtonMetrics(ctx) {
    const width = 120;
    const height = 40;
    const centerX = ctx.canvas.width / 2;
    const y = ctx.canvas.height - 80;
    const restart = { x: centerX - width - 20, y, width, height };
    const home = { x: centerX + 20, y, width, height };
    return { coords: { restart, home } };
}

/**
 * Renders both game over buttons.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{coords:Object}} metrics - Button metrics.
 */
function renderGameOverButtons(ctx, metrics) {
    const restart = metrics.coords.restart;
    const home = metrics.coords.home;
    drawGameOverButton(ctx, restart.x, restart.y, restart.width, restart.height, 'RESTART');
    drawGameOverButton(ctx, home.x, home.y, home.width, home.height, 'HOME');
}

/**
 * Provides the canvas rendering context.
 * @returns {CanvasRenderingContext2D|null} The canvas context.
 */
function getCanvasContext() {
    if (!canvas) return null;
    return canvas.getContext('2d');
}

/**
 * Clears the entire canvas area.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function clearCanvasArea(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Fills a rectangle using a gradient.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{x:number,y:number,width:number,height:number}} coords - Rectangle dimensions.
 * @param {string[]} colors - Gradient colors.
 */
function fillGradientRect(ctx, coords, colors) {
    ctx.fillStyle = createLinearGradient(ctx, coords, colors);
    ctx.fillRect(coords.x, coords.y, coords.width, coords.height);
}

/**
 * Strokes a rectangle with the given color and width.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{x:number,y:number,width:number,height:number}} coords - Rectangle dimensions.
 * @param {string} color - Stroke color.
 * @param {number} lineWidth - Stroke width.
 */
function strokeRect(ctx, coords, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(coords.x, coords.y, coords.width, coords.height);
}

/**
 * Creates a linear gradient for a rectangle.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{x:number,y:number,width:number,height:number}} coords - Rectangle dimensions.
 * @param {string[]} colors - Gradient colors.
 * @returns {CanvasGradient} The configured gradient.
 */
function createLinearGradient(ctx, coords, colors) {
    const gradient = ctx.createLinearGradient(coords.x, coords.y, coords.x + coords.width, coords.y + coords.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    return gradient;
}

/**
 * Draws centered text inside a rectangle.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {{x:number,y:number,width:number,height:number}} coords - Rectangle dimensions.
 * @param {string} text - Text content.
 * @param {string} font - CSS font value.
 * @param {string} color - Text color.
 */
function drawCenteredText(ctx, coords, text, font, color) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, coords.x + coords.width / 2, coords.y + coords.height / 2);
}
