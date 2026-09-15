/**
 * Coordinates the first-load choreography: the preloader announces when it has
 * cleared the screen, and above-the-fold animations wait for that signal.
 */
const EVENT = "crayora:intro-done";

declare global {
  interface Window {
    __crayoraIntroDone?: boolean;
  }
}

export function markIntroDone() {
  window.__crayoraIntroDone = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onIntroDone(cb: () => void): () => void {
  if (window.__crayoraIntroDone) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
