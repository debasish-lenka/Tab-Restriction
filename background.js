const DEFAULT_SETTINGS = {
  maxTabs: 10,
  exemptPinnedTabs: true,
  closeNewestTab: true,
  notifyInConsole: true
};

async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}

async function ensureDefaults() {
  const current = await chrome.storage.sync.get(null);
  if (!Object.keys(current).length) {
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
  }
}

function countTabs(tabs, exemptPinnedTabs) {
  if (!exemptPinnedTabs) {
    return tabs.length;
  }

  return tabs.filter((tab) => !tab.pinned).length;
}

async function findTabToClose(tabs, settings, createdTabId) {
  if (settings.closeNewestTab && createdTabId) {
    const newestTab = tabs.find((tab) => tab.id === createdTabId);
    if (newestTab && (!settings.exemptPinnedTabs || !newestTab.pinned)) {
      return newestTab;
    }
  }

  const candidates = tabs
    .filter((tab) => !settings.exemptPinnedTabs || !tab.pinned)
    .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));

  return candidates[0];
}

async function enforceTabLimit(createdTabId = null) {
  const settings = await getSettings();
  const tabs = await chrome.tabs.query({});
  const openTabCount = countTabs(tabs, settings.exemptPinnedTabs);

  if (openTabCount <= settings.maxTabs) {
    return;
  }

  const tabToClose = await findTabToClose(tabs, settings, createdTabId);
  if (!tabToClose?.id) {
    return;
  }

  await chrome.tabs.remove(tabToClose.id);

  if (settings.notifyInConsole) {
    const label = tabToClose.title || tabToClose.url || `Tab ${tabToClose.id}`;
    console.info(`[Tab Limiter] Closed tab because the limit was exceeded: ${label}`);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await ensureDefaults();
  await enforceTabLimit();
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureDefaults();
  await enforceTabLimit();
});

chrome.tabs.onCreated.addListener(async (tab) => {
  await enforceTabLimit(tab.id);
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== "sync") {
    return;
  }

  const relevantKeys = ["maxTabs", "exemptPinnedTabs", "closeNewestTab"];
  const hasRelevantChange = relevantKeys.some((key) => key in changes);
  if (hasRelevantChange) {
    await enforceTabLimit();
  }
});
