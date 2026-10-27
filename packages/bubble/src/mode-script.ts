/** The stored theme choice, and the script that applies it before the
    first paint. Plain values, safe to import from server code. */

export const MODE_KEY = "yazhi-mode";

/** Inline this in the page head (or first in the body) so a chosen mode
    applies before the first paint, with no flash of the other theme. */
export const MODE_SCRIPT = `try{var m=localStorage.getItem("${MODE_KEY}");if(m==="light"||m==="dark")document.documentElement.dataset.mode=m}catch(e){}`;
