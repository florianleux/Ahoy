/**
 * Fullscreen helpers. The vendor-prefixed forms are not in lib.dom, so they are
 * declared here rather than reached for through any.
 */
interface PrefixedDocument extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface PrefixedElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const prefixedDocument = document as PrefixedDocument;

export function isFullscreen(): boolean {
  return Boolean(
    document.fullscreenElement ||
    prefixedDocument.webkitFullscreenElement ||
    prefixedDocument.mozFullScreenElement ||
    prefixedDocument.msFullscreenElement
  );
}

export function toggleFullscreen(
  element: HTMLElement = document.body
): Promise<void> {
  return isFullscreen() ? exitFullscreen() : requestFullscreen(element);
}

export function requestFullscreen(element: HTMLElement): Promise<void> {
  const prefixed = element as PrefixedElement;

  if (element.requestFullscreen) {
    return element.requestFullscreen();
  }
  if (prefixed.webkitRequestFullscreen) {
    return prefixed.webkitRequestFullscreen();
  }
  if (prefixed.mozRequestFullScreen) {
    return prefixed.mozRequestFullScreen();
  }
  if (prefixed.msRequestFullscreen) {
    return prefixed.msRequestFullscreen();
  }
  return Promise.resolve();
}

export function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  }
  if (prefixedDocument.webkitExitFullscreen) {
    return prefixedDocument.webkitExitFullscreen();
  }
  if (prefixedDocument.mozCancelFullScreen) {
    return prefixedDocument.mozCancelFullScreen();
  }
  if (prefixedDocument.msExitFullscreen) {
    return prefixedDocument.msExitFullscreen();
  }
  return Promise.resolve();
}

// Returns the function that removes the listeners again.
export function onFullscreenChange(callback: () => void): () => void {
  const events = [
    "fullscreenchange",
    "webkitfullscreenchange",
    "mozfullscreenchange",
    "MSFullscreenChange"
  ];

  events.forEach(event => document.addEventListener(event, callback));

  return () => {
    events.forEach(event => document.removeEventListener(event, callback));
  };
}
