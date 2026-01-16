export interface HistoryItem {
  url: string;
  title: string;
  addedAt: number;
}

const STORAGE_KEY = 'openapi-history';

export async function getHistory(): Promise<HistoryItem[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] ?? [];
}

export async function addToHistory(url: string, title: string): Promise<void> {
  const history = await getHistory();

  // Remove existing entry with same URL
  const filtered = history.filter((item) => item.url !== url);

  // Add new entry at the beginning
  const newHistory: HistoryItem[] = [
    { url, title, addedAt: Date.now() },
    ...filtered,
  ].slice(0, 20); // Keep max 20 items

  await chrome.storage.local.set({ [STORAGE_KEY]: newHistory });
}

export async function removeFromHistory(url: string): Promise<void> {
  const history = await getHistory();
  const filtered = history.filter((item) => item.url !== url);
  await chrome.storage.local.set({ [STORAGE_KEY]: filtered });
}

export function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'Unknown API';
  }
}
