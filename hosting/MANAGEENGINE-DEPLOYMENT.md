# ManageEngine (Endpoint Central) step-by-step deployment: self-hosted enterprise install (Chrome + Edge)

This guide assumes:
- Your organization manages devices and browsers via **ManageEngine Endpoint Central** (or a similar ManageEngine product).
- You want to **avoid Chrome Web Store fee** by using **self-hosted** extension updates over HTTPS.
- You will deploy the required managed policies via **Registry** (recommended) or scripted file deployment.

> The extension itself does not change—this is purely about packaging/hosting and pushing the correct browser policy.

---

## Overview (what must be in place)

1. **Stable Extension ID**
   - You must pack the `.crx` using the **same private key** every time.
   - The Extension ID is derived from the private key + extension contents.

2. **HTTPS hosting (publicly reachable)**
   - Serve:
     - `tab-limiter.crx`
     - `update.xml`

3. **Enterprise policy payload**
   - Chrome:
     - `ExtensionInstallForcelist`
     - `ExtensionSettings` (with `installation_mode` + `update_url`)
   - Edge:
     - same concepts, different registry path

4. **Deploy policy through ManageEngine**
   - Use a registry deployment (Computer Configuration → Registry/Policy) or run the provided PowerShell script.

---

## Step 1: Create a self-hosted `.crx`

1. On your build machine (can be any Windows machine):
   - Open Chrome or Edge → `chrome://extensions` (or `edge://extensions`).
   - Turn on Developer mode.
   - Choose **Pack extension**.
   - Select this folder as the extension root:
     - `D:\Tab Restriction`
2. When prompted, **generate a new private key `.pem` only once**.
3. **Reuse the same `.pem`** for all future updates.
4. Record:
   - The produced `.crx` filename
   - The resulting **extension ID** (shown in extension details after packing, or in the packaging output).

---

## Step 2: Create and publish `update.xml`

Use `hosting/update.xml.example` as the template.

1. Copy `hosting/update.xml.example` → create `hosting/update.xml`.
2. Replace placeholders:
   - `YOUR_EXTENSION_ID` → your actual extension ID
   - Hosted CRX URL → your hosted CRX URL
   - Hosted update manifest URL should match what you put into policy.
3. Publish both files to your HTTPS web server.

Example hosted URLs (replace domain + paths):
- `https://your-domain.example.com/tab-limiter/tab-limiter.crx`
- `https://your-domain.example.com/tab-limiter/update.xml`

### Required response headers

Serve with:
- CRX:
  - `Content-Type: application/x-chrome-extension`
- XML:
  - `Content-Type: application/xml`

---

## Step 3: Prepare policy values (Chrome and Edge)

You will deploy these managed policy registry values:

### Chrome policy concepts
- Registry base:
  - `HKLM\SOFTWARE\Policies\Google\Chrome`
- Keys:
  - `ExtensionInstallForcelist`
  - `ExtensionSettings`

### Edge policy concepts
- Registry base:
  - `HKLM\SOFTWARE\Policies\Microsoft\Edge`
- Keys:
  - `ExtensionInstallForcelist`
  - `ExtensionSettings`

The repo already includes **examples**:
- `enterprise/chrome-force-install.reg`
- `enterprise/edge-force-install.reg`

But for self-hosted updates (your own `update.xml`), use the `hosting/*-selfhosted.example.json` examples as the source of truth:
- `hosting/chrome-extension-settings-selfhosted.example.json`
- `hosting/edge-extension-settings-selfhosted.example.json`

**You must replace `YOUR_EXTENSION_ID`** with your real extension ID.

---

## Step 4: Deploy via ManageEngine Endpoint Central (registry-based)

### 4A) Create two registry deployments
Create two items in your ManageEngine console:
1. Chrome policy deployment
2. Edge policy deployment

### 4B) Use the correct registry paths/values
Build the final `.reg` content by replacing placeholders inside these files:
- `enterprise/chrome-force-install.reg`
- `enterprise/edge-force-install.reg`

#### Chrome: what to set
- `ExtensionInstallForcelist` value format:
  - `"1"="EXTENSION_ID;CRX_DOWNLOAD_URL"`
- `ExtensionSettings` JSON (string value):
  - `{"installation_mode":"force_installed","update_url":"UPDATE_XML_URL","toolbar_state":"force_shown"}`

Where:
- `CRX_DOWNLOAD_URL` = your hosted `.crx`
- `UPDATE_XML_URL` = `https://.../tab-limiter/update.xml`

#### Edge: what to set
- `ExtensionInstallForcelist`:
  - `"1"="EXTENSION_ID;CRX_DOWNLOAD_URL"`
- `ExtensionSettings` JSON:
  - `{"installation_mode":"force_installed","update_url":"UPDATE_XML_URL","override_update_url":true,"toolbar_state":"force_shown"}`

> Note: `override_update_url: true` is included in the repo’s Edge self-hosted example.

### 4C) Target scope
Assign the deployments to:
- All managed systems (or your desired device group)
- Include both Chrome and Edge managed browsers (as applicable)

---

## Step 5: Force policy refresh + validate

1. On a test machine:
   - Run policy refresh / reboot (depending on your Endpoint Central policy cadence).
   - Verify:
     - Chrome: `chrome://policy`
     - Edge: `edge://policy`
     - Chrome: `chrome://extensions`
     - Edge: `edge://extensions`
2. Confirm:
   - Extension appears under **Installed by policy**
   - The update URL matches your hosted `update.xml`

---

## Step 6: Publish updates later (repeat safely)

For each new release:
1. Update `manifest.json` version.
2. Repack into a new `.crx` **using the same `.pem`**.
3. Update `update.xml`:
   - Change `version="..."` to match your new manifest version.
4. Upload both:
   - new `.crx`
   - new `update.xml`
5. Refresh policy on endpoints (or wait for periodic update checks).

---

## Common troubleshooting

- **Extension ID mismatch**
  - Symptom: policy doesn’t install or update fails.
  - Fix: ensure you always pack with the same `.pem`.

- **Wrong Content-Type on hosting**
  - Symptom: update downloads fail.
  - Fix: set `Content-Type` headers for `.crx` and `update.xml`.

- **Update doesn’t change after publishing**
  - Symptom: installed version doesn’t advance.
  - Fix: update `update.xml` version and republish; also refresh policy.

---

## Files you will edit/use

- `hosting/update.xml.example` → becomes your real `update.xml`
- `hosting/manifest.self-hosted.example.json` → reference for `update_url`
- `hosting/*-extension-settings-selfhosted.example.json` → reference policy values
- `enterprise/*-force-install.reg` → deployable policy skeleton (replace update URLs + extension IDs)


