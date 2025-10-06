/**
 * Fullscreen utility for cross-browser fullscreen support
 */

/**
 * Check if currently in fullscreen mode
 * @returns {boolean}
 */
export function isFullscreen() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    false
  );
}

/**
 * Toggle fullscreen mode
 * @param {HTMLElement} element - Element to make fullscreen (defaults to document.body)
 * @returns {Promise<void>}
 */
export function toggleFullscreen(element = document.body) {
  const inFullscreen = isFullscreen();

  if (inFullscreen) {
    return exitFullscreen();
  } else {
    return requestFullscreen(element);
  }
}

/**
 * Request fullscreen mode
 * @param {HTMLElement} element - Element to make fullscreen
 * @returns {Promise<void>}
 */
export function requestFullscreen(element) {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    return element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    return element.msRequestFullscreen();
  }
  return Promise.resolve();
}

/**
 * Exit fullscreen mode
 * @returns {Promise<void>}
 */
export function exitFullscreen() {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    return document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    return document.msExitFullscreen();
  }
  return Promise.resolve();
}

/**
 * Add event listener for fullscreen changes
 * @param {Function} callback - Function to call when fullscreen changes
 * @returns {Function} Cleanup function to remove listener
 */
export function onFullscreenChange(callback) {
  const events = [
    "fullscreenchange",
    "webkitfullscreenchange",
    "mozfullscreenchange",
    "MSFullscreenChange"
  ];

  events.forEach(event => document.addEventListener(event, callback));

  // Return cleanup function
  return () => {
    events.forEach(event => document.removeEventListener(event, callback));
  };
}
