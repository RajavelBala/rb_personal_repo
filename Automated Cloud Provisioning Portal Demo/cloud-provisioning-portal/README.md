# ABC Corp — Automated Cloud Provisioning Portal

Interactive, browser-only prototype expanding the provided HTML/CSS starting point and aligned to the CIS 675 project proposal dated October 10, 2026.

## Run
Open `index.html` in a current web browser. Keep `index.html`, `styles.css`, and `app.js` in the same directory. No Node server, cloud account, API key, build step, or password is required. Fonts use Google Fonts when available and fall back to system fonts when offline.

## Demo walkthrough
1. Sign in as Alex Morgan (Developer), select a blueprint, provide a name and project, and launch an inexpensive environment.
2. Submit a Kubernetes environment (estimated $675/month) to see the $500/month illustrative approval threshold.
3. Sign out and choose Taylor Brooks (Budget Manager) to approve the pending request.
4. Return as Alex to view or extend accessible resources, or decommission an active resource.
5. Submit a request with **Allow public inbound access** checked to demonstrate an enforced security denial.
6. Sign in as Security Admin to review demo controls and simulate/clear a drift event.
7. Open Audit trail to export a CSV; use **Advance 30 days** to demonstrate TTL expiry.

## Proposal alignment
- US-01 catalog, US-02 simulated provisioning, US-03 cost estimates and approval routing
- US-04 simulated SSO / role-scoped UI, US-05 TTL scheduler, US-06 enforced public ingress check
- US-07 resource inventory, US-08 7-day extension, US-10 simulated drift alert
- US-11 teardown, US-12 downloadable local audit records
- US-09 secret vault management is represented only as a future integration, not a functioning secret vault.

## Important limitations
This is a **front-end demonstration, not a production cloud portal**. No AWS, Azure, GCP, enterprise SSO, IaC runtime, Vault, database, or external policy engine is connected. Data is persisted in the browser's `localStorage` and can be reset. UI access controls are illustrative and should not be treated as backend authorization. Cloud costs are illustrative, not live prices. The $500/month approval gate comes from the proposal workflow diagram; the proposal prose has an incomplete threshold placeholder. The 85% and 100 hours/month metrics are business targets rather than achieved results. TTL expiry is processed when the page is next opened or updated rather than by a background scheduler.

## Original input
The original uploaded `index.html` and `styles.css` have been preserved as `original-index.html` and `original-styles.css` in the working folder but are not necessary to run the demo and are not included in the distribution zip.
