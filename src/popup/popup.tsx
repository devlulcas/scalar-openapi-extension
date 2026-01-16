import { useCallback, useEffect, useState } from 'react';
import {
  IconAlert,
  IconCheck,
  IconChevronRight,
  IconExtension,
  IconTrash,
} from '../components/icons';
import { Loader } from '../components/loader';
import { checkSwagger, type SwaggerStatus } from '../lib/check-swagger';
import {
  addToHistory,
  extractTitleFromUrl,
  getHistory,
  type HistoryItem,
  removeFromHistory,
} from '../lib/history';
import css from './popup.module.css';

function useOpenApiSpecStatus({ onStatusChange }: { onStatusChange: (status: SwaggerStatus) => void }) {
  const [status, setStatus] = useState<SwaggerStatus>(checkSwagger(null));

  const changeStatus = useCallback((status: SwaggerStatus) => {
      setStatus((prev) => {
        if (status.state === 'success' && status.url !== prev.url) {
          onStatusChange(status);
          return status;
        }

        if (prev.state === 'success' && status.url === prev.url) {
          onStatusChange(status);
          return prev;
        }

        return status;
      } );
  }, [onStatusChange]);

  const fetchStatus = useCallback(async (tabId?: number) => {
    try {
      let targetTabId = tabId;

      if (!targetTabId) {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        targetTabId = tab?.id;
      }

      if (!targetTabId) return;

      const response: SwaggerStatus | null = await chrome.runtime.sendMessage({
        type: 'GET_OPEN_API_SPEC_STATUS',
        tabId: targetTabId,
      });

      if (response) {
        changeStatus(response);
      }
    } catch {
      // Ignore errors - background might not have status yet
    }
  }, [changeStatus]);

  // Fetch status when popup opens
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Refetch when user switches tabs
  useEffect(() => {
    const handleTabActivated = (activeInfo: chrome.tabs.TabActiveInfo) => {
      fetchStatus(activeInfo.tabId);
    };

    chrome.tabs.onActivated.addListener(handleTabActivated);

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabActivated);
    };
  }, [fetchStatus]);

  // Listen for messages from the background script
  useEffect(() => {
    const messageListener = (message: {
      type: string;
      status: SwaggerStatus;
    }) => {
      if (message.type === 'SET_OPEN_API_SPEC_STATUS') {
        changeStatus(message.status);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [changeStatus]);

  console.log('status', status);

  return { status };
}

function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const refresh = useCallback(async () => {
    const items = await getHistory();
    setHistory(items);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (url: string, title?: string) => {
      await addToHistory(url, title ?? extractTitleFromUrl(url));
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (url: string) => {
      await removeFromHistory(url);
      await refresh();
    },
    [refresh],
  );

  return { history, add, remove };
}

export function Popup() {
  const {
    history,
    add: addToHistory,
    remove: removeFromHistory,
  } = useHistory();

  const { status } = useOpenApiSpecStatus({
    onStatusChange: (status) => {
      if (status.state === 'success') {
        addToHistory(status.url, extractTitleFromUrl(status.url));
      }
    },
  });

  return (
    <div className={css.container}>
      <Header />

      <main className={css.content}>
        {status.state === 'success' ? (
          <div className={css.found}>
            <OpenApiSpecFoundBadge status={status} />
            <OpenApiReferenceButton status={status} onOpen={addToHistory} />
          </div>
        ) : status.state === 'error' ? (
          <NotFound status={status} />
        ) : (
          <Loader />
        )}

        <EnterSpecUrlManually onOpen={addToHistory} />
      </main>

      {history.length > 0 && (
        <History
          items={history}
          onRemove={removeFromHistory}
          onOpen={addToHistory}
        />
      )}

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

function OpenApiReferenceButton({
  status,
  onOpen,
}: {
  status: SwaggerStatus;
  onOpen: (url: string, title?: string) => void;
}) {
  const handleOpenViewer = () => {
    if (!status.url) return;
    const viewerUrl = chrome.runtime.getURL(
      `viewer.html?url=${encodeURIComponent(status.url)}`,
    );
    onOpen(status.url);
    chrome.tabs.create({ url: viewerUrl });
  };

  return (
    <>
      <p className={css.url}>{status.url}</p>
      {status.type === 'index' && (
        <p className={css.url}>
          Search the API documentation for the "Open in Scalar" button
        </p>
      )}
      <button
        type="button"
        onClick={handleOpenViewer}
        className={css.primaryButton}
      >
        Open API Reference
      </button>
    </>
  );
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

function EnterSpecUrlManually({
  onOpen,
}: {
  onOpen: (url: string, title?: string) => void;
}) {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleOpenManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    const url = manualUrl.trim();
    const viewerUrl = chrome.runtime.getURL(
      `viewer.html?url=${encodeURIComponent(url)}`,
    );
    onOpen(url);
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

function History({
  items,
  onRemove,
  onOpen,
}: {
  items: HistoryItem[];
  onRemove: (url: string) => void;
  onOpen: (url: string, title?: string) => void;
}) {
  const handleOpen = (item: HistoryItem) => {
    const viewerUrl = chrome.runtime.getURL(
      `viewer.html?url=${encodeURIComponent(item.url)}`,
    );
    onOpen(item.url, item.title);
    chrome.tabs.create({ url: viewerUrl });
  };

  const handleRemove = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    onRemove(url);
  };

  return (
    <section className={css.history}>
      <h3 className={css.historyTitle}>Recent</h3>
      <ul className={css.historyList}>
        {items.map((item) => (
          <li key={item.url} className={css.historyItem}>
            <button
              type="button"
              className={css.historyButton}
              onClick={() => handleOpen(item)}
            >
              <span className={css.historyItemTitle}>{item.title}</span>
              <span className={css.historyItemUrl}>{item.url}</span>
            </button>
            <button
              type="button"
              className={css.historyDeleteButton}
              onClick={(e) => handleRemove(e, item.url)}
              aria-label="Remove from history"
            >
              <IconTrash className={css.historyDeleteIcon} />
            </button>
          </li>
        ))}
      </ul>
    </section>
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
