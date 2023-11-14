'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setBadgeText') {
    chrome.history.search(
      { text: `"${getHostname(sender.tab.url)}"`, maxResults: 0 },
      (historyItems) => {
        const totalVisitCount = historyItems.length;
        chrome.action.setBadgeText({
          text: String(totalVisitCount),
          tabId: sender.tab.id,
        });
      }
    );
  }
});

chrome.action.onClicked.addListener((tab) => {
  openHistory(getHostname(tab.url));
});

const openHistory = (query) => {
  chrome.tabs.create({ url: `chrome://history/?q="${query}"` });
};

const getHostname = (url) => {
  const currentUrl = new URL(url);
  return currentUrl.hostname;
};
