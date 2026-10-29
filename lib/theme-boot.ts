// Plain module (not "use client") so the server layout can inline the string.
export const THEME_KEY = "qc:theme";

/** Inline script run before paint so the first frame already has the right theme. */
export const themeBootScript = `(function(){try{var c=localStorage.getItem('${THEME_KEY}')||'system';var d=c==='dark'||(c==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='dark';}})();`;

