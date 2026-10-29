(() => {
  "use strict";

  const STORAGE_KEY = "abc-cloud-launchpad-demo-v1";
  const COST_GOVERNANCE_LIMIT = 250;
  const users = [
    { id: "ava", name: "Jim Halpert", role: "Developer", team: "Team Atlas", initials: "JH" },
    { id: "ron", name: "Oscar Martinez", role: "Developer", team: "Team Atlas", initials: "OM" },
    { id: "casey", name: "Michael Scott", role: "Manager", team: "Team Atlas", initials: "MS" },
    { id: "noah", name: "Pam Beesly", role: "Developer", team: "Team Nova", initials: "PB" },
    { id: "andy", name: "Andy Bernard", role: "Manager", team: "Team Nova", initials: "AB" },
    { id: "sam", name: "Dwight Schrute", role: "Security Administrator", team: "Enterprise Security", initials: "DS" }
  ];

  const templates = [
    { id: "node", name: "Node.js API Service", icon: "JS", kind: "node", description: "Node.js 20 · API starter · Sandbox", defaultDays: 30, maxDays: 90 },
    { id: "python", name: "Python Microservice", icon: "Py", kind: "python", description: "Python 3.12 · FastAPI starter · Test", defaultDays: 30, maxDays: 90 },
    { id: "kubernetes", name: "Kubernetes Namespace", icon: "K8", kind: "kubernetes", description: "Isolated namespace · Container-ready · Test", defaultDays: 30, maxDays: 90 }
  ];

  const providers = {
    aws: {
      name: "AWS",
      regions: [
        { id: "us-east-1", name: "US East (N. Virginia)" },
        { id: "us-west-2", name: "US West (Oregon)" },
        { id: "eu-west-1", name: "EU West (Ireland)" }
      ],
      dailyRates: { node: 4.82, python: 8.64, kubernetes: 12.48 }
    },
    azure: {
      name: "Azure",
      regions: [
        { id: "eastus", name: "East US (Virginia)" },
        { id: "westus2", name: "West US 2 (Washington)" },
        { id: "westeurope", name: "West Europe (Netherlands)" }
      ],
      dailyRates: { node: 5.06, python: 9.12, kubernetes: 13.02 }
    },
    gcp: {
      name: "GCP",
      regions: [
        { id: "us-east1", name: "US East (South Carolina)" },
        { id: "us-west1", name: "US West (Oregon)" },
        { id: "europe-west1", name: "Europe West (Belgium)" }
      ],
      dailyRates: { node: 4.61, python: 8.27, kubernetes: 11.93 }
    }
  };

  const resourceInventories = {
    node: [
      { name: "Virtual machines", detail: "1 × small application instance" },
      { name: "Application containers", detail: "1 API container" },
      { name: "Block storage", detail: "30 GB SSD volume" },
      { name: "Virtual network", detail: "1 isolated VPC / VNet" },
      { name: "Security groups", detail: "1 application security group" }
    ],
    python: [
      { name: "Virtual machines", detail: "2 × small application instances" },
      { name: "Application replicas", detail: "2 FastAPI containers" },
      { name: "Block storage", detail: "50 GB SSD volume" },
      { name: "Virtual network", detail: "1 isolated VPC / VNet" },
      { name: "Security groups", detail: "2 application security groups" }
    ],
    kubernetes: [
      { name: "Kubernetes cluster", detail: "1 managed demo cluster" },
      { name: "Worker virtual machines", detail: "2 × small worker nodes" },
      { name: "Pods", detail: "3 application pods" },
      { name: "Persistent storage", detail: "20 GB storage claim" },
      { name: "Virtual network", detail: "1 isolated VPC / VNet" }
    ]
  };

  const defaultPolicies = [
    { id: "block-public-ingress", name: "Block public inbound access", category: "Network security", description: "Prevent public inbound access on demo environments.", enabled: true },
    { id: "approved-regions", name: "Approved cloud regions", category: "Compliance", description: "Provision only in approved provider regions.", enabled: true },
    { id: "environment-ttl", name: "Maximum environment lifetime", category: "Lifecycle", description: "Limit sandbox and test environment lifetime to 90 days.", enabled: true },
    { id: "cost-governance", name: "Selected-TTL cost limit", category: "Compliance", description: "Block requests whose illustrative cost for the selected lifetime exceeds $250.", enabled: true },
    { id: "team-access", name: "Team-scoped access", category: "Access control", description: "Limit developer access to resources belonging to their assigned team.", enabled: true },
    { id: "encrypted-storage", name: "Encrypt environment storage", category: "Data protection", description: "Require encryption for attached and persistent storage.", enabled: true }
  ];
  const policyCategories = ["Access control", "Network security", "Data protection", "Lifecycle", "Compliance"];

  const el = (id) => document.getElementById(id);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  function loadPolicies(savedPolicies) {
    const savedById = new Map(
      (Array.isArray(savedPolicies) ? savedPolicies : [])
        .filter((policy) => policy && typeof policy.id === "string")
        .map((policy) => [policy.id, policy])
    );
    const normalize = (policy, saved) => ({
      ...policy,
      name: typeof saved?.name === "string" && saved.name.trim() ? saved.name.trim().slice(0, 60) : policy.name,
      category: policyCategories.includes(saved?.category) ? saved.category : policy.category,
      description: typeof saved?.description === "string" && saved.description.trim()
        ? saved.description.trim().slice(0, 240)
        : policy.description,
      enabled: typeof saved?.enabled === "boolean" ? saved.enabled : policy.enabled
    });
    const policies = defaultPolicies.map((policy) => normalize(policy, savedById.get(policy.id)));
    const defaultIds = new Set(defaultPolicies.map((policy) => policy.id));
    for (const saved of savedById.values()) {
      if (defaultIds.has(saved.id) || typeof saved.name !== "string" || !saved.name.trim()) continue;
      policies.push(normalize({
        id: saved.id,
        name: saved.name.trim().slice(0, 60),
        category: policyCategories.includes(saved.category) ? saved.category : "Compliance",
        description: typeof saved.description === "string" && saved.description.trim()
          ? saved.description.trim().slice(0, 240)
          : "No description provided.",
        enabled: typeof saved.enabled === "boolean" ? saved.enabled : true
      }, saved));
    }
    return policies;
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        currentUserId: users.some((user) => user.id === parsed.currentUserId) ? parsed.currentUserId : null,
        selectedTemplateId: templates.some((template) => template.id === parsed.selectedTemplateId) ? parsed.selectedTemplateId : "node",
        selectedProviderId: providers[parsed.selectedProviderId] ? parsed.selectedProviderId : "aws",
        policies: loadPolicies(parsed.policies),
        environments: Array.isArray(parsed.environments) ? parsed.environments.filter((item) =>
          item && typeof item.id === "string" && typeof item.name === "string" &&
          templates.some((template) => template.id === item.templateId) &&
          users.some((user) => user.id === item.ownerId) &&
          ["provisioning", "provisioned", "blocked", "decommissioned"].includes(item.status))
        .map((item) => ({
          ...item,
          status: item.status === "provisioning" ? "provisioned" : item.status,
          providerId: providers[item.providerId] ? item.providerId : "aws",
          dailyCost: Number.isFinite(item.dailyCost) ? item.dailyCost : providers.aws.dailyRates[item.templateId],
          resources: Array.isArray(item.resources) ? item.resources : item.status === "blocked" ? [] : resourceInventories[item.templateId],
          policyReasons: Array.isArray(item.policyReasons) ? item.policyReasons.filter((reason) => typeof reason === "string") : []
        })) : [],
        clockOffsetMs: Number.isFinite(parsed.clockOffsetMs) && parsed.clockOffsetMs >= 0 ? parsed.clockOffsetMs : 0,
        policyMessage: null
      };
    } catch (error) {
      console.error("Unable to load saved demo data.", error);
      return { currentUserId: null, selectedTemplateId: "node", selectedProviderId: "aws", policies: loadPolicies([]), environments: [], clockOffsetMs: 0, policyMessage: null };
    }
  }

  let state = loadState();
  let notice = null;
  let editingPolicyId = null;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentUserId: state.currentUserId,
        selectedTemplateId: state.selectedTemplateId,
        selectedProviderId: state.selectedProviderId,
        policies: state.policies,
        environments: state.environments,
        clockOffsetMs: state.clockOffsetMs
      }));
    } catch (error) {
      console.error("Unable to save demo data in this browser.", error);
      setNotice("Demo data could not be saved in browser storage. The current session can continue, but progress may not persist.", "warning");
    }
  }

  function setNotice(message, type = "info") {
    notice = { message, type };
    renderNotice();
  }

  function renderNotice() {
    el("notice-area").innerHTML = notice
      ? `<div class="notice notice-${escapeHTML(notice.type)}">${escapeHTML(notice.message)}</div>`
      : "";
  }

  function currentUser() {
    return users.find((user) => user.id === state.currentUserId) || null;
  }

  function selectedTemplate() {
    return templates.find((template) => template.id === state.selectedTemplateId) || templates[0];
  }

  function canRequest(user) {
    return Boolean(user && user.role === "Developer");
  }

  function visibleEnvironments(user) {
    if (user.role === "Security Administrator") {
      return [...state.environments];
    }
    return state.environments.filter((environment) => environment.team === user.team);
  }

  function environmentOwner(environment) {
    return users.find((user) => user.id === environment.ownerId);
  }

  function templateById(templateId) {
    return templates.find((template) => template.id === templateId);
  }

  function lifecycleStatus(environment) {
    if (environment.status !== "provisioned") return environment.status;
    const expiresAt = new Date(environment.expiresAt).getTime();
    const now = Date.now() + state.clockOffsetMs;
    if (now >= expiresAt) return "decommissioned";
    if (expiresAt - now <= 24 * 60 * 60 * 1000) return "expiring";
    return "provisioned";
  }

  function reconcileLifecycle() {
    let expired = 0;
    let alerts = 0;
    const now = Date.now() + state.clockOffsetMs;
    for (const environment of state.environments) {
      if (environment.status !== "provisioned") continue;
      const remaining = new Date(environment.expiresAt).getTime() - now;
      if (remaining <= 0) {
        environment.status = "decommissioned";
        environment.decommissionedAt = new Date(now).toISOString();
        expired += 1;
      } else if (remaining <= 24 * 60 * 60 * 1000 && !environment.expirationAlerted) {
        environment.expirationAlerted = true;
        alerts += 1;
      }
    }
    if (expired || alerts) saveState();
    if (expired || alerts) {
      const messages = [];
      if (alerts) messages.push(`${alerts} environment${alerts === 1 ? "" : "s"} approaching TTL received an expiration alert.`);
      if (expired) messages.push(`${expired} expired environment${expired === 1 ? "" : "s"} automatically decommissioned.`);
      setNotice(messages.join(" "), expired ? "warning" : "info");
    }
  }

  function renderLogin() {
    const accountSelect = el("account-select");
    accountSelect.innerHTML = users.map((user) =>
      `<option value="${escapeHTML(user.id)}">${escapeHTML(user.name)} — ${escapeHTML(user.role)} · ${escapeHTML(user.team)}</option>`
    ).join("");
    accountSelect.value = users.some((user) => user.id === state.currentUserId) ? state.currentUserId : users[0].id;
    el("login-button").onclick = () => {
      state.currentUserId = accountSelect.value;
      state.policyMessage = null;
      notice = null;
      saveState();
      render();
    };
  }

  function renderSession(user) {
    el("session-area").innerHTML = user
      ? `<div class="session-user"><span class="avatar">${escapeHTML(user.initials)}</span><span><strong>${escapeHTML(user.name)}</strong><small>${escapeHTML(user.role)} · ${escapeHTML(user.team)}</small></span><button id="sign-out" type="button">Switch user</button></div>`
      : "";
    const signOut = el("sign-out");
    if (signOut) signOut.onclick = () => {
      state.currentUserId = null;
      state.policyMessage = null;
      notice = null;
      saveState();
      render();
    };
  }

  function renderCatalog(user) {
    el("catalog-list").innerHTML = templates.map((template) =>
      `<button type="button" class="catalog-card ${template.id === state.selectedTemplateId ? "selected" : ""}" data-template="${escapeHTML(template.id)}" aria-pressed="${template.id === state.selectedTemplateId}">
        <span class="template-icon ${escapeHTML(template.kind)}">${escapeHTML(template.icon)}</span>
        <span class="template-info"><strong>${escapeHTML(template.name)}</strong><small>${escapeHTML(template.description)}</small></span>
        <span class="template-arrow" aria-hidden="true">›</span>
      </button>`
    ).join("");

    el("catalog-list").querySelectorAll("[data-template]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedTemplateId = button.dataset.template;
        saveState();
        renderWorkspace(user);
      });
    });

    const template = selectedTemplate();
    el("selected-template").textContent = `${template.name} · Approved blueprint`;
    const providerSelect = el("cloud-provider");
    providerSelect.value = state.selectedProviderId;
    renderRegions();
    const lifetime = el("lifetime");
    lifetime.innerHTML = [30, 60, 90].filter((days) => days <= template.maxDays)
      .map((days) => `<option value="${days}" ${days === template.defaultDays ? "selected" : ""}>${days} day${days === 1 ? "" : "s"}</option>`).join("");
    updateCostEstimate();
  }

  function renderRegions() {
    const regionSelect = el("region");
    const regions = providers[state.selectedProviderId].regions;
    const currentRegion = regionSelect.value;
    regionSelect.innerHTML = regions.map((region) =>
      `<option value="${escapeHTML(region.id)}">${escapeHTML(region.name)}</option>`
    ).join("");
    regionSelect.value = regions.some((region) => region.id === currentRegion) ? currentRegion : regions[0].id;
  }

  function updateCostEstimate() {
    const template = selectedTemplate();
    const provider = providers[state.selectedProviderId];
    const days = Number(el("lifetime").value) || template.defaultDays;
    const dailyCost = provider.dailyRates[template.id];
    el("daily-estimate").innerHTML = `$${dailyCost.toFixed(2)} <small>/ day</small>`;
    el("total-estimate").textContent = `$${(dailyCost * days).toFixed(2)} estimated for ${days} days`;
    const costPolicy = state.policies.find((policy) => policy.id === "cost-governance");
    el("cost-governance-note").textContent = costPolicy?.enabled
      ? `Demo estimate · $${COST_GOVERNANCE_LIMIT} max per selected TTL`
      : "Demo estimate · cost limit policy disabled";
  }

  function renderPolicyResult() {
    const result = state.policyMessage;
    el("policy-flash").innerHTML = result
      ? `<div class="policy-result ${result.pass ? "policy-pass" : "policy-fail"}"><strong>${result.pass ? "✓ Policy checks passed" : "✕ Request blocked by policy"}</strong>${result.messages.map(escapeHTML).join("<br>")}</div>`
      : "";
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
  }

  function renderEnvironments(user) {
    const environments = visibleEnvironments(user).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    el("environment-heading").textContent = user.role === "Developer" ? "Your team environments" : "Environment requests";
    el("environment-count").textContent = `${environments.length} ENVIRONMENT${environments.length === 1 ? "" : "S"}`;
    if (!environments.length) {
      el("environment-list").innerHTML = `<div class="empty-state"><strong>No environments yet</strong>Choose a blueprint above to launch your first demo environment.</div>`;
      return;
    }

    const rows = environments.map((environment) => {
      const template = templateById(environment.templateId);
      const provider = providers[environment.providerId] || providers.aws;
      const owner = environmentOwner(environment);
      const status = lifecycleStatus(environment);
      const statusLabels = {
        provisioning: "Provisioning", provisioned: "Provisioned", blocked: "Blocked",
        expiring: "Expiring soon", decommissioned: "Decommissioned"
      };
      const detail = status === "blocked"
        ? environment.policyReasons.join("; ")
        : status === "decommissioned"
          ? `Expired ${formatDate(environment.decommissionedAt)}`
          : `Expires ${formatDate(environment.expiresAt)}`;
      const resources = environment.resources || [];
      const resourceDetails = status === "blocked"
        ? `<div class="resource-empty">No resources created; the policy gate blocked this request.</div>`
        : `<details class="resource-details">
            <summary>View resources (${resources.length})</summary>
            <ul>${resources.map((resource) => `<li><strong>${escapeHTML(resource.name)}</strong><span>${escapeHTML(resource.detail)}</span></li>`).join("")}</ul>
          </details>`;
      return `<tr>
        <td><span class="env-name">${escapeHTML(environment.name)}</span><span class="env-meta">${escapeHTML(provider.name)} · ${escapeHTML(template.name)} · ${escapeHTML(environment.region)}</span></td>
        <td><span class="status-badge status-${escapeHTML(status)}">${escapeHTML(statusLabels[status])}</span><span class="env-meta">${escapeHTML(detail)}</span></td>
        <td class="owner-cell">${escapeHTML(owner ? owner.name : "Unknown")}<span class="env-meta">${escapeHTML(environment.team)}</span></td>
        <td>${escapeHTML(environment.lifetimeDays)} days<span class="env-meta">$${Number(environment.dailyCost).toFixed(2)} / day</span></td>
        <td>${resourceDetails}</td>
      </tr>`;
    }).join("");

    el("environment-list").innerHTML = `<div class="table-scroll"><table class="environment-table">
      <thead><tr><th>Environment</th><th>Status / lifecycle</th><th>Owner / team</th><th>TTL / estimate</th><th>Resources</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  }

  function renderSecurityPolicies(user) {
    const section = el("security-policy-section");
    const isSecurityAdmin = user.role === "Security Administrator";
    section.classList.toggle("hidden", !isSecurityAdmin);
    if (!isSecurityAdmin) return;

    el("policy-count").textContent = `${state.policies.length} POLIC${state.policies.length === 1 ? "Y" : "IES"}`;
    el("security-policy-list").innerHTML = state.policies.map((policy) =>
      `<article class="security-policy-card">
        <div class="security-policy-copy">
          <div class="security-policy-heading"><h3>${escapeHTML(policy.name)}</h3><span class="policy-category">${escapeHTML(policy.category)}</span></div>
          <p>${escapeHTML(policy.description)}</p>
          <span class="policy-state ${policy.enabled ? "policy-enabled" : "policy-disabled"}">${policy.enabled ? "Enabled" : "Disabled"}${policy.id === "block-public-ingress" ? " · enforced during provisioning" : ""}</span>
        </div>
        <div class="security-policy-actions">
          <button class="text-button policy-edit-button" type="button" data-edit-policy="${escapeHTML(policy.id)}">Edit</button>
          <label class="policy-toggle" for="policy-toggle-${escapeHTML(policy.id)}">
            <input id="policy-toggle-${escapeHTML(policy.id)}" type="checkbox" data-toggle-policy="${escapeHTML(policy.id)}" ${policy.enabled ? "checked" : ""}>
            <span>${policy.enabled ? "On" : "Off"}</span>
          </label>
        </div>
      </article>`
    ).join("");

    el("security-policy-list").querySelectorAll("[data-toggle-policy]").forEach((control) => {
      control.addEventListener("change", () => {
        if (currentUser()?.role !== "Security Administrator") return;
        const policy = state.policies.find((item) => item.id === control.dataset.togglePolicy);
        if (!policy) return;
        policy.enabled = control.checked;
        saveState();
        renderCatalog(currentUser());
        renderSecurityPolicies(currentUser());
      });
    });

    el("security-policy-list").querySelectorAll("[data-edit-policy]").forEach((button) => {
      button.addEventListener("click", () => {
        if (currentUser()?.role !== "Security Administrator") return;
        const policy = state.policies.find((item) => item.id === button.dataset.editPolicy);
        if (!policy) return;
        editingPolicyId = policy.id;
        el("policy-name").value = policy.name;
        el("policy-category").value = policy.category;
        el("policy-description").value = policy.description;
        el("policy-form-heading").textContent = "Update policy";
        el("policy-submit").textContent = "Save changes";
        el("policy-cancel").classList.remove("hidden");
        el("policy-name").focus();
      });
    });
  }

  function resetPolicyEditor() {
    editingPolicyId = null;
    el("policy-form").reset();
    el("policy-form-heading").textContent = "Add a policy";
    el("policy-submit").textContent = "Add policy";
    el("policy-cancel").classList.add("hidden");
  }

  function handlePolicySubmit(event) {
    event.preventDefault();
    if (currentUser()?.role !== "Security Administrator") {
      setNotice("Only the Security Administrator can manage security and compliance policies.", "warning");
      return;
    }

    const name = el("policy-name").value.trim();
    const description = el("policy-description").value.trim();
    const category = el("policy-category").value;
    if (!name || !description || !policyCategories.includes(category)) return;

    const wasEditing = Boolean(editingPolicyId);
    if (wasEditing) {
      const policy = state.policies.find((item) => item.id === editingPolicyId);
      if (!policy) {
        setNotice("The policy being edited could not be found. Please select it again.", "warning");
        resetPolicyEditor();
        return;
      }
      policy.name = name;
      policy.description = description;
      policy.category = category;
    } else {
      state.policies.push({
        id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `custom-${Date.now()}-${Math.random()}`,
        name,
        description,
        category,
        enabled: true
      });
    }

    saveState();
    resetPolicyEditor();
    renderSecurityPolicies(currentUser());
    setNotice(wasEditing ? "Policy updated." : "Policy added and enabled.", "success");
  }

  function runPolicyChecks(data, user, template) {
    const messages = [];
    if (!canRequest(user)) messages.push("Only a Developer role can submit provisioning requests.");
    if (!template || !templates.some((approved) => approved.id === template.id)) messages.push("The selected blueprint is not in the approved catalog.");
    if (!/^[a-z][a-z0-9-]{1,31}$/.test(data.name)) messages.push("Environment name must use lowercase letters, numbers, or hyphens and start with a letter.");
    const provider = providers[data.providerId];
    if (!provider) messages.push("Selected cloud provider is not supported.");
    else if (!provider.regions.some((region) => region.id === data.region)) messages.push("Selected region is not approved for this cloud provider.");
    if (!Number.isInteger(data.lifetimeDays) || !template || data.lifetimeDays < 1 || data.lifetimeDays > template.maxDays) {
      messages.push(`Lifetime must be between 1 and ${template ? template.maxDays : 90} days for this blueprint.`);
    }
    const ingressPolicy = state.policies.find((policy) => policy.id === "block-public-ingress");
    if (data.publicIngress && ingressPolicy?.enabled) {
      messages.push(`${ingressPolicy.name} policy prevents public inbound access.`);
    }
    const costPolicy = state.policies.find((policy) => policy.id === "cost-governance");
    const dailyCost = provider?.dailyRates[template?.id];
    const selectedTtlCost = dailyCost * data.lifetimeDays;
    if (costPolicy?.enabled && Number.isFinite(selectedTtlCost) && selectedTtlCost > COST_GOVERNANCE_LIMIT) {
      messages.push(`${costPolicy.name} policy limits the selected TTL estimate to $${COST_GOVERNANCE_LIMIT}; this request is estimated at $${selectedTtlCost.toFixed(2)}.`);
    }
    return { pass: messages.length === 0, messages: messages.length ? messages : ["Approved blueprint, provider region, naming, and lifetime rules verified."] };
  }

  function handleRequestSubmit(event) {
    event.preventDefault();
    const user = currentUser();
    if (!canRequest(user)) {
      state.policyMessage = { pass: false, messages: ["Only a Developer role can submit provisioning requests."] };
      renderPolicyResult();
      return;
    }

    const data = {
      name: el("environment-name").value.trim(),
      providerId: el("cloud-provider").value,
      region: el("region").value,
      lifetimeDays: Number(el("lifetime").value),
      publicIngress: el("public-ingress").checked
    };
    const template = selectedTemplate();
    const result = runPolicyChecks(data, user, template);
    state.policyMessage = result;

    if (!result.pass) {
      const record = {
        id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        name: data.name || "unnamed-request",
        templateId: template.id,
        providerId: data.providerId,
        region: data.region,
        lifetimeDays: Number.isFinite(data.lifetimeDays) ? data.lifetimeDays : 0,
        dailyCost: providers[data.providerId]?.dailyRates[template.id] || 0,
        resources: [],
        ownerId: user.id,
        team: user.team,
        createdAt: new Date(Date.now() + state.clockOffsetMs).toISOString(),
        expiresAt: new Date(Date.now() + state.clockOffsetMs).toISOString(),
        status: "blocked",
        publicIngress: data.publicIngress,
        policyReasons: result.messages.filter((message) => !message.startsWith("Only a Developer"))
      };
      state.environments.push(record);
      saveState();
      renderWorkspace(user);
      el("policy-flash").scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    const createdAt = Date.now() + state.clockOffsetMs;
    const environment = {
      id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      name: data.name,
      templateId: template.id,
      providerId: data.providerId,
      region: data.region,
      lifetimeDays: data.lifetimeDays,
      dailyCost: providers[data.providerId].dailyRates[template.id],
      resources: resourceInventories[template.id],
      ownerId: user.id,
      team: user.team,
      createdAt: new Date(createdAt).toISOString(),
      expiresAt: new Date(createdAt + data.lifetimeDays * 24 * 60 * 60 * 1000).toISOString(),
      status: "provisioning",
      publicIngress: data.publicIngress,
      expirationAlerted: false
    };
    state.environments.push(environment);
    saveState();
    renderWorkspace(user);
    el("request-form").reset();
    el("environment-name").value = "";
    el("public-ingress").checked = false;
    window.setTimeout(() => {
      const pending = state.environments.find((item) => item.id === environment.id);
      if (pending && pending.status === "provisioning") {
        pending.status = "provisioned";
        saveState();
        reconcileLifecycle();
        const activeUser = currentUser();
        if (activeUser) renderWorkspace(activeUser);
      }
    }, 950);
  }

  function renderWorkspace(user) {
    renderSession(user);
    el("login-screen").classList.add("hidden");
    el("workspace").classList.remove("hidden");
    el("welcome-title").textContent = canRequest(user) ? "Your environments" : "Platform workspace";
    el("welcome-subtitle").textContent = `${user.role === "Manager" ? "Manager" : user.role} · ${user.team}${canRequest(user) ? " · Team-scoped access" : " · Team-scoped read-only view"}`;
    renderCatalog(user);
    renderPolicyResult();
    renderEnvironments(user);
    renderSecurityPolicies(user);
    renderNotice();
    el("demo-clock").textContent = `Demo time: ${new Date(Date.now() + state.clockOffsetMs).toLocaleString()}`;
    const form = el("request-form");
    const requestAllowed = canRequest(user);
    form.querySelectorAll("input, select, button").forEach((control) => { control.disabled = !requestAllowed; });
    el("catalog-list").querySelectorAll("button").forEach((button) => { button.disabled = !requestAllowed; });
    if (!requestAllowed) {
      el("selected-template").textContent = "Select an approved blueprint (Developer access required to request)";
      el("request-form").querySelectorAll("label, .field-hint, .form-row, .checkbox-label").forEach((node) => {
        node.style.opacity = "0.58";
      });
    } else {
      el("request-form").querySelectorAll("label, .field-hint, .form-row, .checkbox-label").forEach((node) => {
        node.style.opacity = "";
      });
    }
    el("reset-button").onclick = () => {
      if (!window.confirm("Reset saved demo accounts, requests, and simulated time?")) return;
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      notice = null;
      render();
    };
    el("advance-clock-button").onclick = () => {
      state.clockOffsetMs += 30 * 24 * 60 * 60 * 1000;
      saveState();
      render();
    };
  }

  function render() {
    renderLogin();
    const user = currentUser();
    if (user) {
      reconcileLifecycle();
      renderWorkspace(user);
    } else {
      el("login-screen").classList.remove("hidden");
      el("workspace").classList.add("hidden");
      renderSession(null);
      renderNotice();
    }
  }

  el("request-form").addEventListener("submit", handleRequestSubmit);
  el("policy-form").addEventListener("submit", handlePolicySubmit);
  el("policy-cancel").addEventListener("click", resetPolicyEditor);
  el("cloud-provider").addEventListener("change", () => {
    state.selectedProviderId = el("cloud-provider").value;
    renderRegions();
    updateCostEstimate();
    saveState();
  });
  el("lifetime").addEventListener("change", updateCostEstimate);
  render();
})();
