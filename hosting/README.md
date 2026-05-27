# Self-Hosted Enterprise Packaging

This folder prepares the extension for enterprise deployment without using the Chrome Web Store fee path.

## What this supports

- Self-hosted extension updates over HTTPS.
- Force-install on managed Chrome and Edge devices through enterprise policy.
- Automatic updates after you publish a new `.crx` and update the XML manifest.

## Important platform limits

- Chrome on Windows and macOS only allows self-hosted extension installation through enterprise policy on managed devices.
- Chrome force-install does not automatically enable Incognito mode.
- Edge self-hosted updates may require `override_update_url: true` in `ExtensionSettings`.

## Files

- `update.xml.example`: Example update manifest served from your HTTPS host.
- `manifest.self-hosted.example.json`: Example manifest showing the `update_url` field.
- `chrome-extension-settings-selfhosted.example.json`: Example Chrome self-hosted `ExtensionSettings`.
- `edge-extension-settings-selfhosted.example.json`: Example Edge self-hosted `ExtensionSettings`.

## Recommended hosting layout

Host these files on an HTTPS server without authentication:

- `https://your-domain.example.com/tab-limiter/tab-limiter.crx`
- `https://your-domain.example.com/tab-limiter/update.xml`

Serve the `.crx` file with:

- `Content-Type: application/x-chrome-extension`

Serve the XML file with:

- `Content-Type: application/xml`

## Packaging checklist

1. Finalize the extension code in this folder.
2. Generate and keep a persistent private key (`.pem`).
3. Pack the extension into a `.crx` using the same `.pem` every time.
4. Record the resulting extension ID.
5. Add the real `update_url` to `manifest.json` before packing, or use the example manifest as your template.
6. Replace `YOUR_EXTENSION_ID` in `update.xml.example` and the policy examples.
7. Rename `update.xml.example` to `update.xml` when publishing.
8. Upload both the `.crx` and `update.xml` to your HTTPS host.
9. Deploy the matching Chrome or Edge policy through ManageEngine.
10. Verify installation and updates on a pilot machine.

## How to pack the extension

One common admin workflow is:

1. Open `chrome://extensions` or `edge://extensions` on an admin machine.
2. Turn on Developer mode.
3. Use **Pack extension**.
4. Select the extension root folder: `D:\Tab Restriction`
5. For the first build, generate a new private key.
6. For every future update, reuse the same private key file.

Reusing the same key is what keeps the extension ID stable for policy deployment and updates.

## Updating later

When you release version `1.0.1` or later:

1. Increase `version` in `manifest.json`.
2. Repack the `.crx` using the same `.pem`.
3. Update the `version` in `update.xml`.
4. Replace the hosted `.crx` and `update.xml`.
5. Wait for policy-driven update checks or refresh the browser policy on test devices.

## ManageEngine rollout outline

1. Host the `.crx` and `update.xml` on HTTPS.
2. Update the files in `enterprise/` or use the JSON examples here to build your policy values.
3. In Endpoint Central, upload a PowerShell or registry-based policy deployment.
4. Deploy it as a Computer Configuration to managed Windows devices.
5. Validate in:
   - `chrome://policy`
   - `edge://policy`
   - `chrome://extensions`
   - `edge://extensions`
