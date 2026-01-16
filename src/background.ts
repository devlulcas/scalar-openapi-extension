import { checkSwagger, type SwaggerStatus } from './lib/check-swagger';

const tabSwaggerStatus = new Map<number, SwaggerStatus>();

async function setOpenApiSpecStatus(tabId: number, status: SwaggerStatus) {
  const response = await chrome.runtime.sendMessage({
    type: 'SET_OPEN_API_SPEC_STATUS',
    tabId,
    status,
  });
  return response;
}

function updateBadge(tabId: number, status: SwaggerStatus): void {
  if (status.state === 'success') {
    chrome.action.setBadgeText({ tabId, text: '✓' });
    chrome.action.setBadgeBackgroundColor({ tabId, color: '#3abe00' });
  } else {
    chrome.action.setBadgeText({ tabId, text: '' });
  }
}

async function handleUrl(tabId: number, url: string | null) {
  const status = checkSwagger(url);
  tabSwaggerStatus.set(tabId, status);
  updateBadge(tabId, status);
  return setOpenApiSpecStatus(tabId, status);
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    await handleUrl(tabId, tab.url);
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await handleUrl(tabId, null);
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'OPEN_API_SPEC' && sender.tab?.id) {
    await handleUrl(sender.tab.id, message.specUrl);
    return true;
  }

  if (message.type === 'GET_OPEN_API_SPEC_STATUS' && message.tabId) {
    sendResponse(tabSwaggerStatus.get(message.tabId) ?? checkSwagger(null));
    return true;
  }
});
