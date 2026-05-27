const DEFAULT_SETTINGS = {
  maxTabs: 10,
  exemptPinnedTabs: true,
  closeNewestTab: true,
  notifyInConsole: true
};

function showStatus(message) {
  const status = document.getElementById("status");
  status.textContent = message;

  window.clearTimeout(showStatus.timeoutId);
  showStatus.timeoutId = window.setTimeout(() => {
    status.textContent = "";
  }, 2500);
}

async function loadSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  document.getElementById("maxTabs").value = String(settings.maxTabs);
  document.getElementById("exemptPinnedTabs").checked = Boolean(settings.exemptPinnedTabs);
  document.getElementById("closeNewestTab").checked = Boolean(settings.closeNewestTab);
  document.getElementById("notifyInConsole").checked = Boolean(settings.notifyInConsole);
}

async function saveSettings(event) {
  event.preventDefault();

  const maxTabsInput = document.getElementById("maxTabs");
  const maxTabs = Number.parseInt(maxTabsInput.value, 10);
  if (!Number.isFinite(maxTabs) || maxTabs < 1) {
    showStatus("Enter a valid tab limit greater than 0.");
    maxTabsInput.focus();
    return;
  }

  await chrome.storage.sync.set({
    maxTabs,
    exemptPinnedTabs: document.getElementById("exemptPinnedTabs").checked,
    closeNewestTab: document.getElementById("closeNewestTab").checked,
    notifyInConsole: document.getElementById("notifyInConsole").checked
  });

  showStatus("Settings saved.");
}

document.getElementById("settingsForm").addEventListener("submit", (event) => {
  saveSettings(event).catch((error) => {
    console.error("[Tab Limiter] Failed to save settings", error);
    showStatus("Unable to save settings.");
  });
});

loadSettings().catch((error) => {
  console.error("[Tab Limiter] Failed to load settings", error);
  showStatus("Unable to load settings.");
});
