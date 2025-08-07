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
 * Handles ESC key press for modals
 * @description Closes modals when ESC key is pressed
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const impressumModal = document.getElementById('impressumModal');
        const infoModal = document.getElementById('infoModal');
        
        if (impressumModal && !impressumModal.classList.contains('hidden')) {
            hide('impressumModal');
        } else if (infoModal && !infoModal.classList.contains('hidden')) {
            hide('infoModal');
        }
    }
}); 