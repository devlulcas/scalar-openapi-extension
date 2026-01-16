import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';
import { useEffect, useState } from 'react';
import { IconXCircle } from '../components/icons';
import { Loader } from '../components/loader';
import css from './viewer.module.css';

export function Viewer() {
  const [specUrl, setSpecUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');

    if (!url || !URL.canParse(url)) {
      setError('No OpenAPI specification URL provided');
      return;
    }

    setSpecUrl(url);
    document.title = `API Reference - ${new URL(url).hostname}`;
  }, []);

  if (error) {
    return (
      <div className={css.errorContainer}>
        <div className={css.errorCard}>
          <IconXCircle className={css.errorIcon} />
          <h1>Unable to load API Reference</h1>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.close()}
            className={css.closeButton}
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  if (specUrl) {
    return (
      <div className={css.viewerContainer}>
        <ApiReferenceReact
          configuration={{
            url: specUrl,
            theme: 'alternate',
            hideDownloadButton: false,
            showSidebar: true,
          }}
        />
      </div>
    );
  }

  return (
    <div className={css.loadingContainer}>
      <Loader />
    </div>
  );
}
