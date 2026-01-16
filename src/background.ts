import { checkSwagger, type SwaggerStatus } from './lib/check-swagger';

const tabSwaggerStatus = new Map<number, SwaggerStatus>();

function updateBadge(tabId: number, status: SwaggerStatus): void {
  if (status.state === 'success') {
    chrome.action.setBadgeText({ tabId, text: '✓' });
    chrome.action.setBadgeBackgroundColor({ tabId, color: '#3abe00' });
  } else {
    chrome.action.setBadgeText({ tabId, text: '' });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const status = checkSwagger(tab.url);
    tabSwaggerStatus.set(tabId, status);
    updateBadge(tabId, status);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabSwaggerStatus.delete(tabId);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_API_SPEC' && sender.tab?.id) {
    const status = checkSwagger(message.specUrl);
    tabSwaggerStatus.set(sender.tab.id, status);
    updateBadge(sender.tab.id, status);

    // Send response to the content script
    sendResponse({ success: true });
  }

  if (message.type === 'GET_OPEN_API_SPEC_STATUS' && message.tabId) {
    const status = tabSwaggerStatus.get(message.tabId);
    sendResponse({ status });
  }
});
