# Automated Cloud Provisioning Portal Demo

## Sprint 2 additions

- **US-03 Cost estimation & approval:** lifecycle projections update as blueprint and TTL change; requests over the simulated $200 total lifecycle budget route to the requester's team manager.
- **US-07 Centralized operations:** the Application Owner dashboard supports cloud, health, and free-text environment/owner/team filtering, with estimated daily and 30-day cost context.
- **US-09 Secret management:** provisioning simulates database/API credential generation and encrypted vault injection. Developers can choose a path inside their own team namespace and must keep least-privilege workload access enabled. After provisioning, the environment owner sees a read-only reference, pipeline result, UTC generation time, encryption summary, and simulated rotation schedule. Owners and Security Administrators can run a permission-only access test. No credential values are generated, displayed, persisted, logged, or exported.
- **US-12 Audit reporting:** the Compliance Auditor role can filter immutable simulated events and export complete CSV or JSON reports. Audit payloads intentionally omit secret values.

A local, dependency-free browser demo of US-01 through US-07 plus Sprint 2 additions US-09 and US-12. It simulates identity, policy checks, multi-cloud provisioning, lifecycle-cost approval routing, vault-reference injection, resource expiration, operations visibility, and audit reporting. It does not connect to an identity provider, cloud account, or secret vault.

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

1. Start with **Jim Halpert (Developer, Team Atlas)**. Select **Node.js API Service**, enter a compliant environment name, and review the daily, monthly, 30-day, and expandable cost breakdown.
2. Confirm the green routing banner: the $144.60 Node.js 30-day projection is **Auto-approved** because it is within the simulated $200 lifecycle budget. Provision it and wait for the simulated deployment to complete.
3. In the created environment row, show the simulated generation/injection status, read-only vault reference, UTC generation time, encryption summary, and 30-day rotation schedule. Select **Test vault access** to demonstrate connectivity and workload-scope validation without retrieving a credential.
4. Return to the catalog and select **Python Microservice**. Its $259.20 30-day projection changes the main action to **Submit for approval** and names **Michael Scott** as the Team Atlas approver. Submit it, then sign in as Michael to approve or reject it.
5. As Jim, submit a request with **Public inbound access** enabled. The enforced policy blocks it before simulated deployment.
6. Use **Advance 30 days** to demonstrate TTL expiry and automatic decommissioning. The audit log records the lifecycle outcome.
7. Sign in as **Robert California (Application Owner)** to review the centralized multi-cloud dashboard. Filter its active inventory by provider, health, and free-text environment, owner, or team terms; review daily run-rate and 30-day forecast values.
8. Sign in as **Angela Martin (Compliance Auditor)** to review chronologically ordered audit events. Filter by action, team, date, and resource/actor text, then export the complete simulated evidence set as **CSV** or **JSON**.
9. Sign in as **Dwight Schrute (Security Administrator)** to demonstrate policy administration and enterprise-wide read-only visibility. **Pam Beesly** and **Oscar Martinez** can be used to demonstrate team-scoped developer access; **Andy Bernard** is Team Nova's manager.

## Current build and changes since Sprint 1

The current build retains the Sprint 1 catalog, simulated provisioning, RBAC, public-ingress policy gate, TTL lifecycle, and multi-cloud environment visibility. Sprint 2 changes the review story in five practical ways:

- **Lifecycle-cost governance (US-03):** Approval now uses the selected blueprint and duration's total projected lifecycle cost, with a simulated $200 auto-approval threshold. The UI exposes the routing decision, approver, dynamic primary action, and cost breakdown before submission.
- **Operations visibility (US-07):** The Application Owner dashboard now includes health and free-text filtering alongside provider filtering, plus daily and 30-day estimated cost context.
- **Secret-management simulation (US-09):** A developer selects a team-scoped vault path; least-privilege access is required by request validation. Provisioning displays connection, simulated generation/encryption/injection, a read-only owner-scoped reference, UTC generation time, an encryption summary, and a simulated 30-day rotation schedule. The owner or Security Administrator can test connectivity and scope without retrieving a credential. No actual credential values are generated or stored.
- **Compliance evidence (US-12):** The Compliance Auditor role has a system-wide audit dashboard with filtered, chronological lifecycle evidence and CSV/JSON export. Records are append-only in browser storage and should not be treated as production-grade tamper-proof storage.

## Included user stories

- **US-01 — Service Catalog:** Three pre-approved sample environment blueprints.
- **US-02 — Provisioning:** Validated requests and simulated asynchronous deployment.
- **US-03 — Cost Estimation & Approval Routing:** Show daily, monthly, and selected-lifetime cost estimates before submission. With the budget approval policy enabled, requests above the $200 total lifecycle demo threshold wait for approval by their own team's manager; lower-cost requests provision without additional approval. Managers can approve to start provisioning or reject without creating resources.
- **US-04 — RBAC & Enterprise SSO Gateway:** Seeded mock identities and roles, team-scoped developer access, and restricted actions.
- **US-06 — Compliance Scanning:** A pre-deployment policy gate with explainable pass/fail results.
- **US-05 — TTL & Cost Governance:** Select a 30-, 60-, or 90-day lifetime, see daily and selected-TTL cost estimates, review expiration warnings, and demonstrate automatic decommissioning with simulated clock advancement.
- **US-07 — Centralized Resource Management Dashboard:** Application Owners see all active environments across AWS, Azure, and GCP, including simulated cloud-account labels, lifecycle health, owner/team details, daily running costs, and a 30-day cost forecast. Provider, health, and free-text filters update the inventory view.
- Requests can select AWS, Azure, or GCP; provider-specific sample regions and catalog-based cost estimates update before submission. Estimates are illustrative fixed demo rates, not live cloud pricing. Python Microservice at 30 days is intentionally above the $200 lifecycle threshold so the approval workflow can be demonstrated.
- Expand a created environment's **View resources** row to see its simulated compute, storage, network, and related resource inventory.
- Sign in as **Dwight Schrute** to review, add, edit, and enable/disable security and compliance policy records. The public-ingress policy is wired to the demo provisioning gate; the other entries are illustrative policy records.
- **US-09 — Automated Secret & Credential Management:** The provisioning flow simulates database/API credential generation and encrypted injection, shows the owner a read-only team/environment vault reference after completion, records generation/injection metadata, and displays an illustrative encryption and rotation summary. Least-privilege access is mandatory; the test action records only simulated connection/permission results. The browser never creates, displays, stores, logs, or exports credential values, and no real vault service is connected.
- **US-12 — System Audit Logging & Compliance Reporting:** Compliance Auditors can filter chronological event records and export complete simulated CSV or JSON reports for review.

Other stories are shown as future capabilities in `architecture.drawio`; they are not implemented in this demo.

## Editable architecture diagram

Open `architecture.drawio` in draw.io / diagrams.net (for example, **File → Open from Device**). The component boxes, story labels, and connectors are editable. The diagram maps all 12 proposal stories and highlights the six implemented demo stories.
