# Automated Cloud Provisioning Portal Demo

A local, dependency-free browser demo of the five highest-priority stories in the project proposal. It simulates identity, policy checks, cloud provisioning, and resource expiration; it does not connect to an identity provider, cloud account, or secret vault.

## Run on Windows

1. Install Python 3 if it is not already available.
2. Double-click `run-demo.bat`.
3. The demo opens at <http://localhost:8000>. Keep the command window open while presenting; close it to stop the local server.

The launcher binds only to your own computer at `127.0.0.1:8000`, then opens the browser. Keep its command window open while presenting; press Ctrl+C to stop the server.

Alternatively, open PowerShell in this folder and run:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Then browse to <http://localhost:8000>.

No packages, cloud credentials, or internet connection are required. Demo state is saved in this browser's local storage. Use **Reset demo data** to restore the seeded state.

## Suggested demo walkthrough

1. Sign in as **Jim Halpert (Team Atlas)** using the mock SSO selector. No password is used.
2. Browse the three approved templates and submit a compliant request. The deployment status changes from queued to provisioned.
3. Submit another request with **Public inbound access** enabled. The policy gate displays the violation and blocks provisioning.
4. Review the environment's expiration time. Sign out and sign in as **Michael Scott (Team Atlas)**, then use **Advance demo clock by 1 day** to demonstrate lifecycle alerts and automatic teardown. Repeat as needed to pass the expiration time.
5. Sign in as **Dwight Schrute** to demonstrate role-based access boundaries, policy administration, and cross-team read-only visibility.
6. Sign in as **Pam Beesly (Team Nova)** to verify team isolation.
7. **Oscar Martinez (Team Atlas)** is another developer account for testing shared team visibility.
8. **Andy Bernard (Team Nova)** is a manager for Team Nova. Managers see requests from their own team only; sign in as Michael and Andy to compare team-scoped views.

## Stories included

- **US-04 — RBAC & SSO:** Seeded mock identities and roles, team-scoped developer access, and restricted actions.
- **US-01 — Service Catalog:** Three pre-approved sample environment blueprints.
- **US-02 — Provisioning:** Validated requests and simulated asynchronous deployment.
- **US-06 — Compliance Scanning:** A pre-deployment policy gate with explainable pass/fail results.
- **US-05 — TTL Lifecycle:** Select a 30-, 60-, or 90-day lifetime, see expiration warnings, and demonstrate automatic decommissioning with simulated clock advancement.
- Requests can select AWS, Azure, or GCP; provider-specific sample regions and catalog-based cost estimates update before submission. Estimates are illustrative fixed demo rates, not live cloud pricing.
- Expand a created environment's **View resources** row to see its simulated compute, storage, network, and related resource inventory.
- Sign in as **Dwight Schrute** to review, add, edit, and enable/disable security and compliance policy records. The public-ingress policy is wired to the demo provisioning gate; the other entries are illustrative policy records.

All other stories are shown as future capabilities in `architecture.drawio`; they are not implemented in this demo.

## Editable architecture diagram

Open `architecture.drawio` in draw.io / diagrams.net (for example, **File → Open from Device**). The component boxes, story labels, and connectors are editable. The diagram maps all 12 proposal stories and highlights the five implemented demo stories.
