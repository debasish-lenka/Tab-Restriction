const DEFAULT_SETTINGS = {
  maxTabs: 10,
  exemptPinnedTabs: true
};

function visibleTabCount(tabs, exemptPinnedTabs) {
  if (!exemptPinnedTabs) {
    return tabs.length;
  }

  return tabs.filter((tab) => !tab.pinned).length;
}

async function renderPopup() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  const tabs = await chrome.tabs.query({});
  const count = visibleTabCount(tabs, settings.exemptPinnedTabs);

  document.getElementById("openTabs").textContent = String(count);
  document.getElementById("maxTabs").textContent = String(settings.maxTabs);

  const summary = document.getElementById("summary");
  if (count > settings.maxTabs) {
    summary.textContent = "The tab limit has been exceeded. Extra tabs will be closed automatically.";
    return;
  }

  const remaining = settings.maxTabs - count;
  summary.textContent =
    remaining === 0
      ? "You are exactly at your tab limit."
      : `You can still open ${remaining} more tab${remaining === 1 ? "" : "s"}.`;
}

renderPopup().catch((error) => {
  console.error("[Tab Limiter] Failed to render popup", error);
});
