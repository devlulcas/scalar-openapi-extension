import { useEffect, useState } from 'react';
import {
  IconAlert,
  IconCheck,
  IconChevronRight,
  IconExtension,
} from '../components/icons';
import { Loader } from '../components/loader';
import { checkSwagger, type SwaggerStatus } from '../lib/check-swagger';
import css from './popup.module.css';

function useOpenApiSpecStatusFromTab() {
  const [status, setStatus] = useState<SwaggerStatus>(checkSwagger(null));

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        setStatus(checkSwagger(tab.url ?? null));
      } catch (error) {
        console.error('Failed to get swagger status:', error);
        setStatus(checkSwagger(null));
      }
    };

    const ms = 200;
    const interval = setInterval(() => {
      if (status.state !== 'idle') return;
      checkStatus();
    }, ms);

    return () => clearInterval(interval);
  }, [status.state]);

  return { status, setStatus };
}

function useOpenApiSpecStatusFromBackground() {
  const [status, setStatus] = useState<SwaggerStatus>(checkSwagger(null));
  console.log('fromBackground', status);
  useEffect(() => {
    const sendMessage = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const status: SwaggerStatus | undefined =
        await chrome.runtime.sendMessage({
          type: 'GET_OPEN_API_SPEC_STATUS',
          tabId: tab?.id,
        });

      setStatus(status ?? checkSwagger(null));
    };

    sendMessage();
  }, []);

  return { status, setStatus };
}

export function Popup() {
  const fromTab = useOpenApiSpecStatusFromTab();
  const fromBackground = useOpenApiSpecStatusFromBackground();

  console.log('fromTab', fromTab);
  console.log('fromBackground', fromBackground);

  const possibleStatuses = [fromTab.status, fromBackground.status].sort(
    (a, b) => (a.state === 'success' ? 1 : b.state === 'success' ? -1 : 0),
  );

  const status = possibleStatuses[0];

  return (
    <div className={css.container}>
      <Header />

      <main className={css.content}>
        {status.state === 'success' ? (
          <div className={css.found}>
            <OpenApiSpecFoundBadge status={status} />
            <OpenApiReferenceButton status={status} />
          </div>
        ) : status.state === 'error' ? (
          <NotFound status={status} />
        ) : (
          <Loader />
        )}

        <EnterSpecUrlManually />
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className={css.header}>
      <div className={css.logo}>
        <IconExtension className={css.logoIcon} />
        <span>Scalar OpenAPI</span>
      </div>
    </header>
  );
}

function OpenApiSpecFoundBadge({ status }: { status: SwaggerStatus }) {
  return (
    <div className={css.badge}>
      <IconCheck className={css.checkIcon} />
      <span>
        {status.type === 'swagger'
          ? 'OpenAPI spec detected'
          : 'API documentation detected'}
      </span>
    </div>
  );
}

function OpenApiReferenceButton({ status }: { status: SwaggerStatus }) {
  const handleOpenViewer = () => {
    if (!status.url) return;
    const viewerUrl = chrome.runtime.getURL(
      `viewer.html?url=${encodeURIComponent(status.url)}`,
    );
    chrome.tabs.create({ url: viewerUrl });
  };

  if (status.type === 'swagger') {
    return <p className={css.url}>{status.url}</p>;
  }

  if (status.type === 'index') {
    return (
      <p className={css.url}>
        Search the API documentation for the "Open in Scalar" button
      </p>
    );
  }

  if (status.type === 'swagger') {
    return (
      <button
        type="button"
        onClick={handleOpenViewer}
        className={css.primaryButton}
      >
        Open API Reference
      </button>
    );
  }
}

function NotFound({ status }: { status: SwaggerStatus }) {
  const handleManualCheck = () => {
    if (!status.url) return;
    const newStatus = checkSwagger(status.url);
    if (newStatus.state !== 'success') return;
    const viewerUrl = chrome.runtime.getURL(
      `viewer.html?url=${encodeURIComponent(newStatus.url)}`,
    );
    chrome.tabs.create({ url: viewerUrl });
  };

  return (
    <div className={css.notFound}>
      <div className={css.badge} data-variant="warning">
        <IconAlert className={css.alertIcon} />
        <span>No OpenAPI spec found</span>
      </div>
      <p className={css.hint}>{status.error}</p>

      {status.url && (
        <button
          type="button"
          onClick={handleManualCheck}
          className={css.secondaryButton}
        >
          Try anyway
        </button>
      )}
    </div>
  );
}

function EnterSpecUrlManually() {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleOpenManualUrl = () => {
    if (!manualUrl.trim()) return;
    const viewerUrl = chrome.runtime.getURL(
      `viewer.html?url=${encodeURIComponent(manualUrl.trim())}`,
    );
    chrome.tabs.create({ url: viewerUrl });
  };

  return (
    <details
      className={css.details}
      open={isManualOpen}
      onToggle={(e) => setIsManualOpen(e.currentTarget.open)}
    >
      <summary className={css.summary}>
        <IconChevronRight className={css.chevron} data-open={isManualOpen} />
        <span>Enter spec URL manually</span>
      </summary>
      <form className={css.detailsContent} onSubmit={handleOpenManualUrl}>
        <input
          type="url"
          className={css.input}
          placeholder="https://example.com/openapi.json"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
        />
        <button
          type="submit"
          className={css.primaryButton}
          disabled={!manualUrl.trim()}
        >
          Open in Viewer
        </button>
      </form>
    </details>
  );
}

function Footer() {
  return (
    <footer className={css.footer}>
      <span>Powered by</span>
      <a href="https://scalar.com" target="_blank" rel="noopener noreferrer">
        Scalar
      </a>
    </footer>
  );
}
