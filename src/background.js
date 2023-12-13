'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

const domainName = document.getElementById("getDomain");

domainName.onclick = function() {
  // Use chrome.tabs.query to get information about the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length > 0) {
      const currentTab = tabs[0];

      openHistory(getHostname(currentTab.url));
    }
  });
};

const titleName =document.getElementById("getTitle");
titleName.onclick = function(){
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length > 0) {
      const currentTab = tabs[0];
      
      openHistory(getTabName(currentTab));
    }
  });

}




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




const openHistory = (query) => {
  chrome.tabs.create({ url: `chrome://history/?q="${query}"` });
};

const getHostname = (url) => {
  const currentUrl = new URL(url);
  return currentUrl.hostname;
};

const getTabName = (tab) => {
  return tab.title;
};


