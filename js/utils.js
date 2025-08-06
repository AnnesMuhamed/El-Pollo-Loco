/**
 * Enters fullscreen mode for the specified element
 * @param {HTMLElement} element - The element to make fullscreen
 * @description Handles fullscreen API with cross-browser compatibility
 */
function enterFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode
 * @description Handles fullscreen exit with cross-browser compatibility
 */
function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Toggles fullscreen mode for the canvas
 * @description Switches between fullscreen and windowed mode
 */
function toggleFullscreen() {
  const canvas = document.getElementById('canvas');
  
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    enterFullscreen(canvas);
  } else {
    exitFullscreen();
  }
}

/**
 * Toggles sound on/off
 * @description Switches audio state using the audio manager
 */
function toggleSound() {
  if (audioManager) {
    audioManager.toggleSound();
  }
}

/**
 * Shows the info modal with game rules
 * @description Displays the information modal
 */
function showInfo() {
    const infoModal = document.getElementById('infoModal');
    if (infoModal) {
        infoModal.classList.remove('hidden');
    }
}

/**
 * Hides the info modal
 * @description Conceals the information modal
 */
function hideInfo() {
    const infoModal = document.getElementById('infoModal');
    if (infoModal) {
        infoModal.classList.add('hidden');
    }
} 