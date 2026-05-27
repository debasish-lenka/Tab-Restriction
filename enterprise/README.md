# Enterprise Deployment Notes

This folder contains example policy files for managed Chrome and Microsoft Edge deployments on organization-owned devices.

## What enterprise policy can do

- Force-install the extension for managed users.
- Prevent users from disabling or uninstalling it through the browser UI.
- Keep the extension updated from the configured update URL.
- Keep the extension visible in the toolbar with `toolbar_state: force_shown`.

## What enterprise policy cannot do here

- It cannot make a GitHub folder auto-install as a browser extension by itself.
- In Chrome on Windows, macOS, and Linux, force-install does not automatically enable the extension in Incognito mode.
- In Edge, use your management console or extension settings to control managed rollout, but do not assume Incognito/InPrivate is auto-enabled without validating in your exact environment.

## Typical deployment path

1. Publish the extension to the Chrome Web Store and/or Microsoft Edge Add-ons.
2. Get the stable extension ID from the store listing.
3. Replace `EXTENSION_ID` in the sample files.
4. Apply the policy with Group Policy, Intune, an MDM, or your browser management console.

## Files

- `chrome-force-install.reg`: Example Windows registry policy for Google Chrome.
- `edge-force-install.reg`: Example Windows registry policy for Microsoft Edge.
- `chrome-extension-settings.example.json`: Example Chrome `ExtensionSettings` payload.
- `edge-extension-settings.example.json`: Example Edge `ExtensionSettings` payload.
- `install-managed-policies.ps1`: Writes the Chrome and Edge registry policies directly on Windows managed devices.

## Self-hosted deployment

If you do not want to publish through the browser stores, see [hosting/README.md](/d:/Tab%20Restriction/hosting/README.md).
That folder includes an example `update.xml`, self-hosted `ExtensionSettings` payloads, and a packaging checklist for using your own HTTPS host.

## Locking behavior

The force-install policy is the supported enterprise way to lock the extension in normal browsing mode:

- The browser installs it automatically.
- Users cannot remove it from the browser UI while the policy remains applied.
- Users cannot disable it from the browser UI while the policy remains applied.

## Windows deployment examples

### Option 1: Import a `.reg` file

1. Publish the extension and get its final store ID.
2. Replace `EXTENSION_ID` in the `.reg` file.
3. Deploy that file through Group Policy, Intune, ManageEngine, or another endpoint tool.

### Option 2: Run the PowerShell script

Use `install-managed-policies.ps1` on a managed Windows device:

```powershell
powershell -ExecutionPolicy Bypass -File .\enterprise\install-managed-policies.ps1 -ChromeExtensionId "YOUR_CHROME_ID" -EdgeExtensionId "YOUR_EDGE_ID"
```

After policy refresh, verify in:

- `chrome://policy`
- `edge://policy`
- `chrome://extensions`
- `edge://extensions`

## Important incognito note

The extension manifest includes `"incognito": "split"` so the extension can run in Incognito when the browser allows it. That does not itself enable Incognito access.
