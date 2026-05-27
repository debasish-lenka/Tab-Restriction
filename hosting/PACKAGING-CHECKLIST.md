# Self-hosted enterprise packaging checklist (for ManageEngine)

Use this checklist to publish a `.crx` + `update.xml` and deploy the correct enterprise policy.

---

## A) One-time prerequisites

- [ ] You have a **stable, organization-controlled HTTPS host**.
- [ ] Your HTTPS URLs are reachable from managed endpoints.
- [ ] You will publish:
  - [ ] `/<your-path>/tab-limiter.crx`
  - [ ] `/<your-path>/update.xml`

---

## B) Pack `.crx` (critical: stable Extension ID)

- [ ] Pack the extension using Chrome/Edge **Pack extension**.
- [ ] Generate a private key (`.pem`) **once**.
- [ ] Reuse the **same `.pem`** for all future updates.
- [ ] Record the final **Extension ID**.

---

## C) Create `update.xml`

- [ ] Copy `hosting/update.xml.example` → create your real `hosting/update.xml`.
- [ ] Replace:
  - [ ] `YOUR_EXTENSION_ID` with the recorded Extension ID
  - [ ] `codebase` (CRX URL) with your hosted `.crx` URL
- [ ] Ensure `update.xml` `version="..."` matches your `manifest.json` `version`.

---

## D) Confirm hosting headers

- [ ] Serve `.crx` with `Content-Type: application/x-chrome-extension`
- [ ] Serve `update.xml` with `Content-Type: application/xml`

---

## E) Build ManageEngine policy values

- [ ] Update policy registry values to include:
  - [ ] `installation_mode: force_installed`
  - [ ] `update_url: https://.../update.xml`
  - [ ] `toolbar_state: force_shown`
- [ ] Chrome: use Chrome policy registry paths
- [ ] Edge: use Edge policy registry paths, and include `override_update_url: true` (as in `hosting/edge-extension-settings-selfhosted.example.json`)

---

## F) Deploy via ManageEngine

- [ ] Create/assign a deployment for Chrome policy to your device group.
- [ ] Create/assign a deployment for Edge policy to your device group.
- [ ] Apply policy / refresh policy on endpoints.

---

## G) Validate (pilot machine first)

- [ ] Confirm extension shows as **Installed by policy**.
- [ ] Confirm update source points to your hosted `update.xml`.
- [ ] Reboot (if your org policy refresh cycle requires it) and re-check:
  - [ ] `chrome://policy`
  - [ ] `edge://policy`
  - [ ] `chrome://extensions`
  - [ ] `edge://extensions`

---

## H) Future updates

For each new release:
- [ ] Increment `manifest.json` `version`
- [ ] Repack `.crx` using the **same** `.pem`
- [ ] Update `update.xml version` to match
- [ ] Upload the new `.crx` + `update.xml`
- [ ] Refresh policy on endpoints

