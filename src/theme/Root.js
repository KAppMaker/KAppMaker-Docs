import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

// Docusaurus renders markdown task lists (`- [ ]` / `- [x]`) as
// `<input type="checkbox" disabled>`, so readers can't tick them off.
// This Root wrapper enables those checkboxes inside doc content and persists
// each one's state in localStorage, keyed by page path + position. It runs on
// every client-side navigation. No per-page markup change is required.
function enhanceCheckboxes(pathname) {
  if (typeof document === 'undefined') return;

  const boxes = document.querySelectorAll(
    '.markdown li.task-list-item > input[type="checkbox"]',
  );
  if (!boxes.length) return;

  boxes.forEach((box, index) => {
    if (box.dataset.persistInit === 'true') return;
    box.dataset.persistInit = 'true';

    const key = `doc-checklist:${pathname}:${index}`;
    box.disabled = false;
    box.style.cursor = 'pointer';

    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) box.checked = saved === '1';
    } catch (_) {
      /* localStorage unavailable (private mode) — degrade to non-persistent */
    }

    box.addEventListener('change', () => {
      try {
        window.localStorage.setItem(key, box.checked ? '1' : '0');
      } catch (_) {
        /* ignore */
      }
    });
  });
}

export default function Root({children}) {
  const location = useLocation();

  useEffect(() => {
    // Wait a tick for the markdown content to mount, then enhance. A short
    // MutationObserver window also catches lazily-rendered content.
    const run = () => enhanceCheckboxes(location.pathname);
    const raf = requestAnimationFrame(run);

    const observer = new MutationObserver(run);
    observer.observe(document.body, {childList: true, subtree: true});
    const stop = setTimeout(() => observer.disconnect(), 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(stop);
      observer.disconnect();
    };
  }, [location.pathname]);

  return <>{children}</>;
}
