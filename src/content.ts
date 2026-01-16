// Inline theme colors for content script (can't use ES imports in content scripts)
const colors = {
  primary: {
    dark: 'oklch(47% 0.32 154)',
    default: 'oklch(0.8122 0.2088 155.57)',
    light: 'oklch(70% 0.7 138)',
  },
} as const;

const SELECTOR =
  'a[href$="swagger.json"]:not([data-scalar-injection-status="viewed"])';

function createScalarViewerLink(href: string): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = 'Open in Scalar';
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    min-height: 30px;
    height: 100%;
    background: linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.light} 100%);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: system-ui, sans-serif;
    text-decoration: none;
    transition: background 0.15s ease;
  `;

  anchor.addEventListener('mouseenter', () => {
    anchor.style.background = `linear-gradient(135deg, ${colors.primary.default} 0%, ${colors.primary.dark} 100%)`;
  });

  anchor.addEventListener('mouseleave', () => {
    anchor.style.background = `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.light} 100%)`;
  });

  return anchor;
}

function createWrapper(): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText =
    'display: inline-flex; align-items: center; gap: 8px; margin-block: 4px;';
  return wrapper;
}

function sendOpenApiSpecToBackground(specUrl: string): void {
  chrome.runtime.sendMessage({ type: 'OPEN_API_SPEC', specUrl }, () => {
    // Ignore response - prevents errors if background doesn't respond
    void chrome.runtime.lastError;
  });
}

function injectViewerButtons(): number {
  const swaggerLinks = document.querySelectorAll<HTMLAnchorElement>(SELECTOR);

  for (const link of swaggerLinks) {
    link.dataset.scalarInjectionStatus = 'viewed';

    if (!URL.canParse(link.href)) {
      continue;
    }

    const url = new URL(link.href);

    if (url.hostname === 'validator.swagger.io') {
      continue;
    }

    sendOpenApiSpecToBackground(link.href);

    const wrapper = createWrapper();
    const viewerUrl = chrome.runtime.getURL(
      `viewer.html?url=${encodeURIComponent(link.href)}`,
    );
    const scalarLink = createScalarViewerLink(viewerUrl);

    link.parentNode?.insertBefore(wrapper, link);
    link.style.cssText = 'display: inline-flex; align-items: center;';
    wrapper.appendChild(link);
    wrapper.appendChild(scalarLink);
  }

  return swaggerLinks.length;
}

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

function init(): void {
  // Initial injection
  const found = injectViewerButtons();

  // If we found links immediately, no need to observe
  if (found > 0) return;

  // Debounced handler for mutations
  const debouncedInject = debounce(() => {
    // Check if there are any unprocessed links before doing work
    if (document.querySelector(SELECTOR)) {
      const injected = injectViewerButtons();
      // Disconnect observer once we've found and injected links
      if (injected > 0) {
        observer.disconnect();
      }
    }
  }, 300);

  const observer = new MutationObserver(debouncedInject);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Auto-disconnect after 10 seconds to prevent indefinite observation
  setTimeout(() => observer.disconnect(), 10_000);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
