// Inline theme colors for content script (can't use ES imports in content scripts)
const colors = {
  primary: {
    dark: 'oklch(47% 0.32 154)',
    default: 'oklch(0.8122 0.2088 155.57)',
    light: 'oklch(70% 0.7 138)',
  },
} as const;

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
    min-height: 2lh;
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
  chrome.runtime.sendMessage(
    {
      type: 'OPEN_API_SPEC',
      specUrl,
    },
    (response) => {
      if (response.success) {
        console.log('OpenAPI spec sent to background');
      } else {
        console.error('Failed to send OpenAPI spec to background');
      }
    },
  );
}

function injectViewerButtons(): boolean {
  const swaggerLinks = document.querySelectorAll<HTMLAnchorElement>(
    'a[href$="swagger.json"]:not([data-scalar-injected])',
  );

  if (swaggerLinks.length === 0) {
    return false;
  }

  for (const link of swaggerLinks) {
    link.dataset.scalarInjected = 'true';

    sendOpenApiSpecToBackground(link.href);

    const wrapper = createWrapper();

    const viewerUrl = chrome.runtime.getURL(
      `viewer.html?url=${encodeURIComponent(link.href)}`,
    );

    const scalarLink = createScalarViewerLink(viewerUrl);

    link.parentNode?.insertBefore(wrapper, link);
    wrapper.appendChild(link);
    wrapper.appendChild(scalarLink);
  }

  return true;
}

function retry(
  callback: () => boolean,
  retries: number = 3,
  delay: number = 500,
): void {
  if (callback()) {
    return;
  }

  setTimeout(() => {
    if (retries > 0) {
      retry(callback, retries - 1, delay * 2);
    }
  }, delay);
}

window.addEventListener('load', () => {
  retry(injectViewerButtons, 3, 500);
  
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        injectViewerButtons()
      }
    }
  });
  
  observer.observe(document.documentElement, { childList: true, subtree: true });
});
