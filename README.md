# Tab Limiter Extension

This folder contains a Chrome/Chromium-compatible extension that limits how many browser tabs can stay open.

## What it does

- Lets the user choose a maximum number of open tabs.
- Optionally ignores pinned tabs.
- Automatically closes an extra tab when the limit is exceeded.
- Includes a popup and a settings page.

## Files

- `manifest.json`: Extension manifest for Manifest V3 browsers.
- `background.js`: Enforces the tab limit.
- `popup.html` and `popup.js`: Shows current tab usage.
- `options.html` and `options.js`: Lets the user change settings.
- `styles.css`: Shared styling.
- `enterprise/`: Sample managed-browser deployment policy files.
- `hosting/`: Self-hosted update examples for enterprise rollout without store publishing.

## How to load it locally

1. Open `chrome://extensions/` in Chrome, Edge, or another Chromium browser.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder: `D:\Tab Restriction`

## Incognito mode

Incognito access is not enabled automatically for regular users. The manifest is configured to support Incognito, but whether it runs there depends on browser policy and platform support.

Important: Google Chrome's `ExtensionInstallForcelist` policy does not automatically enable the extension in Incognito mode on standard desktop platforms. As of May 27, 2026, managed deployment can force-install the extension, but not silently flip the Incognito toggle for normal Chrome desktop users.

## Publishing

To distribute this widely, publish it through the Chrome Web Store or use managed browser policies in an organization-owned environment.

## Enterprise deployment

See [enterprise/README.md](/d:/Tab%20Restriction/enterprise/README.md) for sample Chrome and Edge managed deployment files, including force-install and lock-down examples for managed Windows devices.

## Self-hosted enterprise deployment

If you want to avoid store publishing and deploy only to organization-managed browsers, use [hosting/README.md](/d:/Tab%20Restriction/hosting/README.md). It includes:

- an example `update.xml`,
- example self-hosted Chrome and Edge policy payloads,
- a manifest example with `update_url`,
- a packaging checklist for `.crx` updates.
