/**
 * MAHINDRA OPSENTINEL AI - MAIN APPLICATION CONTROLLER
 * Single-Page Enterprise Operations Control Tower
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.OPS_DATA;
  const copilot = new window.OpsCopilot(data);

  // Application State
  const state = {
    currentView: "overview",
    viewMode: "executive", // "executive" or "operational"
    selectedRisk: data.riskMatrix[0],
    selectedSupplier: data.suppliers[0],
    selectedPlant: data.plants[0],
    selectedNetworkNode: null,
    simulatorParams: {
      supplierDaysOut: 0,
      demandIncreasePct: 11,
      transitDelayDays: 2.8,
      plantCapacityCutPct: 0,
      safetyBufferDays: 10
    },
    approvedActionsCount: 1,
    tourActive: false,
    tourStep: 1,
    searchQuery: "",
    notificationsOpen: false,
    copilotHistory: [
      {
        sender: "ai",
        headline: "Ops Copilot Initialized",
        text: "I am your AI Operations Copilot for the Mahindra supply and manufacturing ecosystem. I continuously cross-correlate supplier reliability, inventory buffers, plant utilization, and logistics corridors to detect production risks before they escalate.\n\nHow can I support your operations decision today?",
        structured: null,
        confidence: 99,
        actions: [
          { label: "Why is Plant 02 at risk?", query: "Why is Plant 02 at risk?" },
          { label: "Which suppliers are high risk?", query: "Which suppliers are currently high risk?" },
          { label: "What should I do first?", query: "What should I do first?" },
          { label: "Explain OTIF", query: "Explain OTIF" }
        ]
      }
    ]
  };

  // DOM Elements
  const pageContainer = document.getElementById("page-container");
  const navItems = document.querySelectorAll(".nav-item");
  const searchInput = document.getElementById("cmd-search-input");
  const cmdModal = document.getElementById("cmd-modal-overlay");
  const explainDrawerOverlay = document.getElementById("explain-drawer-overlay");
  const explainDrawer = document.getElementById("explain-drawer");
  const notificationsDrawer = document.getElementById("notifications-drawer");
  const notificationsOverlay = document.getElementById("notifications-overlay");
  const tourBanner = document.getElementById("tour-banner");

  // Navigation Click Handlers
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = item.getAttribute("data-view");
      if (targetView) {
        navigateTo(targetView);
      }
    });
  });

  function navigateTo(viewName) {
    state.currentView = viewName;
    navItems.forEach(item => {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
    renderCurrentView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // View Mode Toggle (Executive vs Operational)
  const execModeBtn = document.getElementById("mode-exec-btn");
  const opModeBtn = document.getElementById("mode-op-btn");
  if (execModeBtn && opModeBtn) {
    execModeBtn.addEventListener("click", () => {
      state.viewMode = "executive";
      execModeBtn.classList.add("active");
      opModeBtn.classList.remove("active");
      renderCurrentView();
    });
    opModeBtn.addEventListener("click", () => {
      state.viewMode = "operational";
      opModeBtn.classList.add("active");
      execModeBtn.classList.remove("active");
      renderCurrentView();
    });
  }

  // Sidebar Toggle
  const sidebarToggleBtn = document.getElementById("sidebar-toggle");
  const appSidebar = document.getElementById("app-sidebar");
  if (sidebarToggleBtn && appSidebar) {
    sidebarToggleBtn.addEventListener("click", () => {
      appSidebar.classList.toggle("collapsed");
    });
  }

  // Global Command Bar (Ctrl+K or click)
  const openCmdBtn = document.getElementById("search-command-bar");
  if (openCmdBtn) {
    openCmdBtn.addEventListener("click", openCommandBar);
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommandBar();
    }
    if (e.key === "Escape") {
      closeCommandBar();
      closeExplainDrawer();
      closeNotifications();
    }
  });

  function openCommandBar() {
    if (cmdModal) {
      cmdModal.classList.add("open");
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
        renderCommandResults("");
      }
    }
  }

  function closeCommandBar() {
    if (cmdModal) cmdModal.classList.remove("open");
  }

  if (cmdModal) {
    cmdModal.addEventListener("click", (e) => {
      if (e.target === cmdModal) closeCommandBar();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCommandResults(e.target.value);
    });
  }

  function renderCommandResults(query) {
    const resultsContainer = document.getElementById("cmd-results");
    if (!resultsContainer) return;
    const q = query.toLowerCase().trim();

    let items = [
      { type: "view", title: "Operations Overview", meta: "View top KPIs and health summary", action: () => navigateTo("overview") },
      { type: "view", title: "Risk Control Tower", meta: "Interactive probability vs impact matrix", action: () => navigateTo("risk-matrix") },
      { type: "view", title: "Scenario Simulator", meta: "What-If digital twin simulation", action: () => navigateTo("scenario-simulator") },
      { type: "view", title: "Ops Copilot", meta: "AI operations conversational assistant", action: () => navigateTo("ops-copilot") },
      { type: "view", title: "Action Center", meta: "Human-in-the-loop approval workflow", action: () => navigateTo("action-center") },
      { type: "supplier", title: "Supplier S102: Precision Auto-Cast Ltd", meta: "Pune • Risk Score: 82/100 (Critical)", action: () => { navigateTo("suppliers"); openExplain("supplier-s102"); } },
      { type: "supplier", title: "Supplier S108: Apex Microtech Pvt", meta: "Bengaluru • Risk Score: 24/100 (Healthy)", action: () => { navigateTo("suppliers"); openExplain("supplier-s108"); } },
      { type: "component", title: "Component C204: Engine ECU", meta: "Plant 02 • Days of Supply: 6.2d (Safety: 10d)", action: () => { navigateTo("inventory"); openExplain("risk-c204"); } },
      { type: "plant", title: "Plant 02 (Nashik Automotive)", meta: "Line 2 Powertrain bottleneck • 94% utilization", action: () => { navigateTo("production"); openExplain("plant-02"); } },
      { type: "shipment", title: "Shipment SH-2048 (C12 Express)", meta: "In-Transit to Nashik • 2.8-day weather delay", action: () => navigateTo("logistics") },
      { type: "order", title: "Order ORD-89410 (Scorpio-N 1,250 units)", meta: "North Zone • SLA delivery slip risk", action: () => navigateTo("orders") },
      { type: "glossary", title: "OTIF (On-Time In-Full)", meta: "Supply Chain Concept Explainer", action: () => openExplainConcept("OTIF") },
      { type: "glossary", title: "OEE (Overall Equipment Effectiveness)", meta: "Manufacturing Productivity Concept", action: () => openExplainConcept("OEE") }
    ];

    if (q) {
      items = items.filter(it => it.title.toLowerCase().includes(q) || it.meta.toLowerCase().includes(q));
    }

    if (items.length === 0) {
      resultsContainer.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted);">No matching operational entities found for "${query}".</div>`;
      return;
    }

    resultsContainer.innerHTML = items.map((it, idx) => `
      <div class="cmd-item" data-index="${idx}">
        <div>
          <div style="font-weight: 600; color: var(--text-primary);">${it.title}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${it.meta}</div>
        </div>
        <span class="status-pill neutral">${it.type.toUpperCase()}</span>
      </div>
    `).join("");

    resultsContainer.querySelectorAll(".cmd-item").forEach((el, idx) => {
      el.addEventListener("click", () => {
        closeCommandBar();
        items[idx].action();
      });
    });
  }

  // Global "Explain Why" Drawer Controls
  window.openExplain = function(explainId) {
    const item = data.explainWhyLibrary[explainId];
    if (!item) {
      // Fallback for dynamic entities
      renderGenericExplain(explainId);
      return;
    }
    renderExplainDrawerContent(item);
  };

  window.openExplainConcept = function(conceptKey) {
    const item = data.glossary[conceptKey];
    if (!item) return;
    const content = {
      title: item.term,
      whatIsThis: item.definition,
      whyValue: item.whyItMatters,
      calculation: item.formula,
      evidence: {
        facts: [`Standard Metric Formula: ${item.formula}`],
        predictions: ["Deviations greater than 10% from baseline correlate with line throttling in 84% of cases."],
        assumptions: ["Manifest inputs refreshed on continuous 8-minute cycle."],
        recommendations: ["Track threshold alerts on the Operations Overview."]
      },
      impact: "Vital for operations predictability and vendor contract SLA enforcement.",
      nextSteps: "Ask Ops Copilot for further supply chain context."
    };
    renderExplainDrawerContent(content);
  };

  function renderExplainDrawerContent(item) {
    const drawerTitle = document.getElementById("explain-title");
    const drawerBody = document.getElementById("explain-body");
    if (!drawerTitle || !drawerBody) return;

    drawerTitle.innerText = item.title;

    drawerBody.innerHTML = `
      <div class="explain-section">
        <div class="explain-section-title">What is this?</div>
        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${item.whatIsThis}</div>
      </div>

      <div class="explain-section">
        <div class="explain-section-title">Why is the current value high / critical?</div>
        <div style="font-size: 13px; color: var(--text-primary); font-weight: 500; line-height: 1.5; background: #f8fafc; padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--brand-primary);">
          ${item.whyValue}
        </div>
      </div>

      <div class="explain-section">
        <div class="explain-section-title">Mathematical & Logic Derivation</div>
        <div style="font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); background: #f1f5f9; padding: 8px 12px; border-radius: var(--radius-sm);">
          ${item.calculation}
        </div>
      </div>

      <div class="explain-section">
        <div class="explain-section-title">Structured Evidence Breakdown (AI Trust Framework)</div>
        <div class="fpar-container">
          <div class="fpar-box fact">
            <div class="fpar-box-label">FACT (Ground Truth)</div>
            <ul style="padding-left: 16px; margin: 0;">
              ${item.evidence.facts.map(f => `<li>${f}</li>`).join("")}
            </ul>
          </div>
          <div class="fpar-box prediction">
            <div class="fpar-box-label">PREDICTION (Forecast)</div>
            <ul style="padding-left: 16px; margin: 0;">
              ${item.evidence.predictions.map(p => `<li>${p}</li>`).join("")}
            </ul>
          </div>
          <div class="fpar-box assumption">
            <div class="fpar-box-label">ASSUMPTION (Model Context)</div>
            <ul style="padding-left: 16px; margin: 0;">
              ${item.evidence.assumptions.map(a => `<li>${a}</li>`).join("")}
            </ul>
          </div>
          <div class="fpar-box recommendation">
            <div class="fpar-box-label">RECOMMENDATION (Actionable Advice)</div>
            <ul style="padding-left: 16px; margin: 0;">
              ${item.evidence.recommendations.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <div class="explain-section">
        <div class="explain-section-title">Potential Business Impact</div>
        <div style="font-size: 13px; color: var(--risk-red); font-weight: 600;">
          ${item.impact}
        </div>
      </div>

      <div class="explain-section" style="border-top: 1px solid var(--border-subtle); padding-top: 14px;">
        <button class="btn btn-dark" style="width: 100%; justify-content: center;" id="explain-ask-copilot-btn">
          Ask Ops Copilot About This Risk
        </button>
      </div>
    `;

    document.getElementById("explain-ask-copilot-btn").addEventListener("click", () => {
      closeExplainDrawer();
      navigateTo("ops-copilot");
      submitCopilotQuery(`Why is ${item.title} critical?`);
    });

    if (explainDrawerOverlay && explainDrawer) {
      explainDrawerOverlay.classList.add("open");
      explainDrawer.classList.add("open");
    }
  }

  function renderGenericExplain(title) {
    const item = {
      title: title || "Operational Entity Context",
      whatIsThis: "Monitored asset within the Mahindra supply chain digital twin.",
      whyValue: "Telemetry indicates deviation beyond standard operational safety limits.",
      calculation: "Risk Index = 0.40 × Probability + 0.40 × Impact + 0.20 × Urgency.",
      evidence: {
        facts: ["Active telemetry feed monitored across 4 assembly plants and 64 suppliers."],
        predictions: ["Risk trajectory suggests threshold escalation within 7 calendar days."],
        assumptions: ["Standard production line cadence."],
        recommendations: ["Review Action Center for pre-configured mitigations."]
      },
      impact: "Assessed at critical-to-elevated operational threshold.",
      nextSteps: "Inspect related entities."
    };
    renderExplainDrawerContent(item);
  }

  function closeExplainDrawer() {
    if (explainDrawerOverlay && explainDrawer) {
      explainDrawerOverlay.classList.remove("open");
      explainDrawer.classList.remove("open");
    }
  }

  if (explainDrawerOverlay) {
    explainDrawerOverlay.addEventListener("click", (e) => {
      if (e.target === explainDrawerOverlay) closeExplainDrawer();
    });
  }

  const closeExplainBtn = document.getElementById("close-explain-drawer");
  if (closeExplainBtn) {
    closeExplainBtn.addEventListener("click", closeExplainDrawer);
  }

  // Notifications Drawer Controls
  const notifBtn = document.getElementById("notifications-btn");
  if (notifBtn) {
    notifBtn.addEventListener("click", toggleNotifications);
  }

  function toggleNotifications() {
    state.notificationsOpen = !state.notificationsOpen;
    if (state.notificationsOpen) {
      if (notificationsDrawer) notificationsDrawer.classList.add("open");
      if (notificationsOverlay) notificationsOverlay.classList.add("open");
      renderNotificationsContent("all");
    } else {
      closeNotifications();
    }
  }

  function closeNotifications() {
    state.notificationsOpen = false;
    if (notificationsDrawer) notificationsDrawer.classList.remove("open");
    if (notificationsOverlay) notificationsOverlay.classList.remove("open");
  }

  if (notificationsOverlay) {
    notificationsOverlay.addEventListener("click", closeNotifications);
  }
  const closeNotifBtn = document.getElementById("close-notif-btn");
  if (closeNotifBtn) closeNotifBtn.addEventListener("click", closeNotifications);

  function renderNotificationsContent(tab) {
    const notifList = document.getElementById("notif-list-container");
    if (!notifList) return;

    const notifs = [
      { id: "N1", level: "CRITICAL", title: "Component C204 stockout predicted in 5–7 days", time: "12m ago", entity: "Plant 02 (Nashik)", action: () => openExplain("risk-c204") },
      { id: "N2", level: "CRITICAL", title: "Supplier S102 OTIF declined 18% (Now 72%)", time: "28m ago", entity: "Supplier S102 (Pune)", action: () => openExplain("risk-s102") },
      { id: "N3", level: "HIGH", title: "Carrier C12 ETA delayed +2.8 days on NH-48", time: "1h ago", entity: "Shipment SH-2048", action: () => navigateTo("logistics") },
      { id: "N4", level: "HIGH", title: "Foundry S115 scrap defect rate jumped to 4.8%", time: "2h ago", entity: "Plant 01 (Chakan)", action: () => navigateTo("suppliers") },
      { id: "N5", level: "INFO", title: "Supplier S204 tool calibration completed successfully", time: "3h ago", entity: "Kolhapur Forge", action: () => navigateTo("suppliers") }
    ];

    notifList.innerHTML = notifs.map(n => `
      <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); cursor: pointer; transition: background 0.15s ease;" class="notif-row" data-id="${n.id}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span class="status-pill ${n.level.toLowerCase()}">${n.level}</span>
          <span style="font-size: 11px; color: var(--text-muted);">${n.time}</span>
        </div>
        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${n.title}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${n.entity}</div>
      </div>
    `).join("");

    notifList.querySelectorAll(".notif-row").forEach((el, idx) => {
      el.addEventListener("click", () => {
        closeNotifications();
        notifs[idx].action();
      });
    });
  }

  // Executive Demo Tour Controller (11 Steps)
  const tourLaunchBtn = document.getElementById("demo-tour-launch-btn");
  if (tourLaunchBtn) {
    tourLaunchBtn.addEventListener("click", startExecutiveTour);
  }

  function startExecutiveTour() {
    state.tourActive = true;
    state.tourStep = 1;
    if (tourBanner) tourBanner.classList.add("active");
    executeTourStep(1);
  }

  function executeTourStep(step) {
    state.tourStep = step;
    const tourStepEl = document.getElementById("tour-step-counter");
    const tourDescEl = document.getElementById("tour-step-desc");

    const steps = [
      { step: 1, title: "Step 1 of 11: Anomaly Detected", desc: "AI detects early degradation in Supplier S102 delivery telemetry (OTIF dropped from 90% to 72%).", view: "overview" },
      { step: 2, title: "Step 2 of 11: Supplier Risk Elevation", desc: "Supplier S102 risk score climbs to 82/100 (CRITICAL) due to saturated 91% capacity and +23% lead time.", view: "suppliers", action: () => openExplain("risk-s102") },
      { step: 3, title: "Step 3 of 11: Component Buffer Depletion", desc: "Component C204 (Engine ECU) inventory drops to 6.2 days (Safety Target: 10 days).", view: "inventory", action: () => openExplain("risk-c204") },
      { step: 4, title: "Step 4 of 11: Factory Line Bottleneck", desc: "Nashik Plant 02 Line 2 assembly utilization hits 94%, leaving zero buffer to absorb missing ECUs.", view: "production", action: () => openExplain("plant-02") },
      { step: 5, title: "Step 5 of 11: Customer Order Exposure", desc: "2,840 finished vehicle orders (Scorpio-N and XUV700) face imminent delivery SLA slip.", view: "orders" },
      { step: 6, title: "Step 6 of 11: Predictive Early Warning", desc: "AI predicts production disruption in 5–7 days with 87% probability and ₹1.8 Cr revenue exposure.", view: "overview" },
      { step: 7, title: "Step 7 of 11: Explainable Evidence Inspection", desc: "User clicks [Explain Why] to inspect empirical facts, predictions, assumptions, and math.", view: "overview", action: () => openExplain("kpi-health") },
      { step: 8, title: "Step 8 of 11: Supply Chain Risk Network", desc: "Interactive graph visualizes cascading risk propagation from Supplier S102 all the way to Customer Orders.", view: "risk-network" },
      { step: 9, title: "Step 9 of 11: Scenario Simulation", desc: "Digital twin runs 'What-If?' comparison: Do Nothing vs Alternate Supplier S108 vs Expedite.", view: "scenario-simulator" },
      { step: 10, title: "Step 10 of 11: Human-in-the-Loop Approval", desc: "Operations Director reviews and approves Action ACT-501 (Shift 30% volume to S108) in Action Center.", view: "action-center" },
      { step: 11, title: "Step 11 of 11: Closed-Loop Outcome Verified", desc: "Action executes: Stockout risk reduced by 68%, protecting ₹1.65 Cr revenue and 2,660 vehicle orders!", view: "analytics" }
    ];

    const current = steps[step - 1];
    if (tourStepEl) tourStepEl.innerText = current.title;
    if (tourDescEl) tourDescEl.innerText = current.desc;

    navigateTo(current.view);
    if (current.action) {
      setTimeout(() => current.action(), 300);
    }
  }

  const tourNextBtn = document.getElementById("tour-next-btn");
  const tourPrevBtn = document.getElementById("tour-prev-btn");
  const tourCloseBtn = document.getElementById("tour-close-btn");

  if (tourNextBtn) {
    tourNextBtn.addEventListener("click", () => {
      if (state.tourStep < 11) {
        executeTourStep(state.tourStep + 1);
      } else {
        exitTour();
      }
    });
  }

  if (tourPrevBtn) {
    tourPrevBtn.addEventListener("click", () => {
      if (state.tourStep > 1) {
        executeTourStep(state.tourStep - 1);
      }
    });
  }

  if (tourCloseBtn) tourCloseBtn.addEventListener("click", exitTour);

  function exitTour() {
    state.tourActive = false;
    if (tourBanner) tourBanner.classList.remove("active");
  }

  // Freshness Simulate Refresh
  const freshnessBtn = document.getElementById("freshness-btn");
  if (freshnessBtn) {
    freshnessBtn.addEventListener("click", () => {
      freshnessBtn.innerHTML = `<span class="freshness-dot" style="background: var(--risk-amber);"></span> Refreshing telemetry...`;
      setTimeout(() => {
        freshnessBtn.innerHTML = `<span class="freshness-dot"></span> Demo Data • Just updated`;
        renderCurrentView();
      }, 600);
    });
  }

  // -------------------------------------------------------------
  // VIEW RENDERERS
  // -------------------------------------------------------------

  function renderCurrentView() {
    switch (state.currentView) {
      case "overview":
        renderOverviewView();
        break;
      case "risk-matrix":
        renderRiskMatrixView();
        break;
      case "suppliers":
        renderSuppliersView();
        break;
      case "inventory":
        renderInventoryView();
        break;
      case "production":
        renderProductionView();
        break;
      case "logistics":
        renderLogisticsView();
        break;
      case "orders":
        renderOrdersView();
        break;
      case "risk-network":
        renderRiskNetworkView();
        break;
      case "risk-propagation":
        renderRiskPropagationView();
        break;
      case "scenario-simulator":
        renderScenarioSimulatorView();
        break;
      case "recommendations":
        renderRecommendationsView();
        break;
      case "ops-copilot":
        renderOpsCopilotView();
        break;
      case "action-center":
        renderActionCenterView();
        break;
      case "analytics":
        renderAnalyticsView();
        break;
      case "audit-trail":
        renderAuditTrailView();
        break;
      default:
        renderOverviewView();
    }
  }

  // 1. OPERATIONS OVERVIEW VIEW
  function renderOverviewView() {
    const kpis = data.topKpis;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Operations Overview</h1>
          <p>Predictive view of supply, inventory, production and fulfillment risk across the manufacturing network.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
            Export Brief
          </button>
          <button class="btn btn-primary" id="overview-simulate-btn">
            Run Simulation
          </button>
        </div>
      </div>

      <!-- Top KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Supply Chain Health</span>
            <span class="status-pill amber">${kpis.healthScore.status}</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${kpis.healthScore.value}</span>
            <span style="font-size: 13px; color: var(--text-muted);">/ 100</span>
          </div>
          <div class="kpi-bottom">
            <span class="kpi-change">${kpis.healthScore.change}</span>
            <button class="btn-explain" onclick="openExplain('${kpis.healthScore.explainId}')">Explain</button>
          </div>
        </div>

        <div class="kpi-card" style="border-top: 3px solid var(--risk-red);">
          <div class="kpi-top">
            <span class="kpi-label">Critical Risks</span>
            <span class="status-pill critical">CRITICAL</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" style="color: var(--risk-red);">${kpis.criticalRisks.value}</span>
          </div>
          <div class="kpi-bottom">
            <span class="kpi-change">${kpis.criticalRisks.change}</span>
            <button class="btn-explain" onclick="openExplain('${kpis.criticalRisks.explainId}')">Explain</button>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">At-Risk Suppliers</span>
            <span class="status-pill amber">${kpis.atRiskSuppliers.value} of ${kpis.atRiskSuppliers.total}</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${kpis.atRiskSuppliers.value}</span>
          </div>
          <div class="kpi-bottom">
            <span class="kpi-change">${kpis.atRiskSuppliers.change}</span>
            <button class="btn-explain" onclick="openExplain('risk-s102')">Explain</button>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Inventory at Risk</span>
            <span class="status-pill critical">RED</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${kpis.inventoryAtRisk.value}</span>
          </div>
          <div class="kpi-bottom">
            <span class="kpi-change">${kpis.inventoryAtRisk.change}</span>
            <button class="btn-explain" onclick="openExplain('risk-c204')">Explain</button>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Production at Risk</span>
            <span class="status-pill critical">11%</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" style="color: var(--risk-red);">${kpis.productionAtRisk.value}</span>
          </div>
          <div class="kpi-bottom">
            <span class="kpi-change">${kpis.productionAtRisk.change}</span>
            <button class="btn-explain" onclick="openExplain('plant-02')">Explain</button>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Orders at Risk</span>
            <span class="status-pill amber">SLA SLIP</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${kpis.ordersAtRisk.value}</span>
          </div>
          <div class="kpi-bottom">
            <span class="kpi-change">${kpis.ordersAtRisk.change}</span>
            <button class="btn-explain" onclick="openExplain('risk-orders')">Explain</button>
          </div>
        </div>
      </div>

      <!-- Operational Health Indicators (5 Pillars) -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <h2 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">Operational Health by Pillar</h2>
          <span style="font-size: 12px; color: var(--text-muted);">Click any pillar for deep-dive analysis</span>
        </div>
        <div class="health-pillars-grid">
          ${data.healthPillars.map(p => `
            <div class="pillar-card" onclick="window.navigateToPillar('${p.id}')">
              <div class="pillar-header">
                <span class="pillar-name">${p.name}</span>
                <span class="status-pill ${p.status.toLowerCase()}">${p.score}/100</span>
              </div>
              <div class="pillar-score-row">
                <span class="pillar-score" style="color: ${p.status === 'RED' ? 'var(--risk-red)' : p.status === 'AMBER' ? 'var(--risk-amber)' : 'var(--risk-green)'};">
                  ${p.score}
                </span>
                <span style="font-size: 11px; font-weight: 600; color: var(--text-muted);">${p.trend}</span>
              </div>
              <div class="pillar-bar-bg">
                <div class="pillar-bar-fill" style="width: ${p.score}%; background: ${p.status === 'RED' ? 'var(--risk-red)' : p.status === 'AMBER' ? 'var(--risk-amber)' : 'var(--risk-green)'};"></div>
              </div>
              <div class="pillar-desc">${p.desc}</div>
              <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                <button class="btn-explain" onclick="event.stopPropagation(); openExplain('${p.explainId || 'kpi-health'}')">Explain Why</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- AI Early Warnings Section -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <span style="width: 8px; height: 8px; background: var(--brand-primary); border-radius: 50%;"></span>
            AI Early Warning Center
          </div>
          <span class="status-pill critical">3 Active Disruption Alerts</span>
        </div>
        <div class="card-body">
          ${data.earlyWarnings.map(ew => `
            <div class="warning-card">
              <div class="warning-top">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="status-pill critical">${ew.severity}</span>
                  <span class="warning-title">${ew.title}</span>
                </div>
                <div class="warning-meta-pills">
                  <span class="meta-metric-chip">Disruption Prob: <strong>${ew.probability}%</strong></span>
                  <span class="meta-metric-chip">Confidence: <strong>${ew.confidence}%</strong></span>
                  <span class="meta-metric-chip">Exposure: <strong style="color: var(--risk-red);">${ew.revenueExposure}</strong></span>
                </div>
              </div>

              <div class="warning-grid">
                <div class="evidence-box">
                  <div class="evidence-box-title">Multifactor Telemetry Evidence</div>
                  <ul class="evidence-list">
                    ${ew.evidence.map(ev => `
                      <li class="evidence-item">
                        <span class="evidence-bullet">›</span>
                        <span>${ev}</span>
                      </li>
                    `).join("")}
                  </ul>
                </div>

                <div class="impact-box">
                  <div>
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">Potential Impact</div>
                    <div style="font-size: 12px; color: var(--text-primary); line-height: 1.4;">${ew.impactSummary}</div>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); padding-top: 8px; border-top: 1px solid var(--border-subtle);">
                    Affects: <strong>${ew.plant}</strong> • <strong>${ew.ordersAffected} orders</strong>
                  </div>
                </div>
              </div>

              <div class="warning-actions">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="btn btn-secondary btn-xs" onclick="openExplain('${ew.explainId}')">View Evidence</button>
                  <button class="btn btn-explain btn-xs" onclick="openExplain('${ew.explainId}')">Explain Why</button>
                  <button class="btn btn-secondary btn-xs" onclick="navigateTo('scenario-simulator')">Simulate</button>
                  <button class="btn btn-secondary btn-xs" onclick="navigateTo('risk-propagation')">View Risk Chain</button>
                </div>
                <button class="btn btn-primary btn-xs" onclick="navigateTo('action-center')">
                  Authorize Mitigation
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Two-Column Feed: What Changed Today + External Signals -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
        <!-- What Changed Today Feed -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">What Changed Today (Operational Change Feed)</div>
            <div class="filter-chips-row" id="cf-filter-chips">
              <span class="filter-chip active" data-cat="all">All</span>
              <span class="filter-chip" data-cat="supplier">Supplier</span>
              <span class="filter-chip" data-cat="inventory">Inventory</span>
              <span class="filter-chip" data-cat="production">Production</span>
              <span class="filter-chip" data-cat="logistics">Logistics</span>
            </div>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="enterprise-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Category</th>
                    <th>Entity</th>
                    <th>Observed Operational Change</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="cf-table-body">
                  ${data.changeFeed.map(cf => `
                    <tr>
                      <td style="color: var(--text-muted); font-size: 12px;">${cf.time}</td>
                      <td><span class="status-pill neutral">${cf.category}</span></td>
                      <td style="font-weight: 600;">${cf.entity}</td>
                      <td style="color: ${cf.severity === 'critical' ? 'var(--risk-red)' : cf.severity === 'amber' ? 'var(--risk-amber)' : 'var(--risk-green)'};">
                        ${cf.change}
                      </td>
                      <td>
                        <button class="btn-explain" onclick="openExplain('${cf.explainId}')">Explain</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Demo External Disruption Signals -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Demo External Signals</div>
            <span class="status-pill neutral">Synthetic Ingestion</span>
          </div>
          <div class="card-body" style="display: flex; flex-direction: column; gap: 12px; padding: 14px;">
            ${data.externalSignals.map(sig => `
              <div style="background: #f8fafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 11px; font-weight: 600; color: var(--brand-primary);">${sig.type}</span>
                  <span class="status-pill neutral" style="font-size: 10px;">${sig.status}</span>
                </div>
                <div style="font-size: 12px; font-weight: 600; color: var(--text-primary);">${sig.title}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin: 4px 0;">${sig.impactCheck}</div>
                <div style="font-size: 10px; color: var(--text-muted);">Affects Vendors: <strong>${sig.activeSuppliersAffected.join(", ")}</strong></div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Agentic AI Decision Trace Footer -->
      <div class="card" style="background: #f8fafc;">
        <div class="card-body" style="padding: 14px 18px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
              Agentic AI Decision Trace Architecture
            </div>
            <span style="font-size: 11px; color: var(--text-muted);">10 Specialized Autonomous Agents Active</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; overflow-x: auto; gap: 8px; padding-bottom: 4px;">
            <span class="status-pill info">External Ingestion</span>
            <span style="color: var(--text-muted);">→</span>
            <span class="status-pill info">Supplier Agent</span>
            <span style="color: var(--text-muted);">→</span>
            <span class="status-pill info">Inventory Agent</span>
            <span style="color: var(--text-muted);">→</span>
            <span class="status-pill info">Production Agent</span>
            <span style="color: var(--text-muted);">→</span>
            <span class="status-pill amber">Impact Analysis</span>
            <span style="color: var(--text-muted);">→</span>
            <span class="status-pill amber">Scenario Agent</span>
            <span style="color: var(--text-muted);">→</span>
            <span class="status-pill critical">Recommendation</span>
            <span style="color: var(--text-muted);">→</span>
            <span class="status-pill healthy" style="background: #0f172a; color: white;">Human Approval</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById("overview-simulate-btn").addEventListener("click", () => navigateTo("scenario-simulator"));

    // Attach Change Feed Filter Listeners
    const cfChips = document.querySelectorAll("#cf-filter-chips .filter-chip");
    cfChips.forEach(chip => {
      chip.addEventListener("click", () => {
        cfChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const cat = chip.getAttribute("data-cat");
        const tbody = document.getElementById("cf-table-body");
        const filtered = cat === "all" ? data.changeFeed : data.changeFeed.filter(f => f.category.toLowerCase() === cat);
        tbody.innerHTML = filtered.map(cf => `
          <tr>
            <td style="color: var(--text-muted); font-size: 12px;">${cf.time}</td>
            <td><span class="status-pill neutral">${cf.category}</span></td>
            <td style="font-weight: 600;">${cf.entity}</td>
            <td style="color: ${cf.severity === 'critical' ? 'var(--risk-red)' : cf.severity === 'amber' ? 'var(--risk-amber)' : 'var(--risk-green)'};">
              ${cf.change}
            </td>
            <td>
              <button class="btn-explain" onclick="openExplain('${cf.explainId}')">Explain</button>
            </td>
          </tr>
        `).join("");
      });
    });
  }

  window.navigateToPillar = function(pillarId) {
    if (pillarId === "suppliers") navigateTo("suppliers");
    else if (pillarId === "inventory") navigateTo("inventory");
    else if (pillarId === "production") navigateTo("production");
    else if (pillarId === "logistics") navigateTo("logistics");
    else if (pillarId === "delivery") navigateTo("orders");
  };

  // 2. RISK CONTROL TOWER (Matrix: Probability vs Impact)
  function renderRiskMatrixView() {
    const risks = data.riskMatrix;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Risk Control Tower</h1>
          <p>Multi-dimensional operational risk matrix correlating Probability, Business Impact, and Time-to-Disruption.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="navigateTo('risk-propagation')">View Propagation Chain</button>
          <button class="btn btn-primary" onclick="navigateTo('action-center')">Go to Action Center</button>
        </div>
      </div>

      <div class="matrix-container">
        <!-- Interactive SVG Matrix Canvas -->
        <div class="matrix-canvas-wrapper">
          <div class="matrix-legend">
            <span style="font-weight: 600; color: var(--text-primary);">Interactive Risk Matrix (X: Probability %, Y: Impact %)</span>
            <div style="display: flex; gap: 8px;">
              <span class="status-pill critical">Critical Zone</span>
              <span class="status-pill amber">High Zone</span>
              <span class="status-pill neutral">Medium/Low</span>
            </div>
          </div>

          <div style="position: relative; width: 100%; height: 420px; background: #fafafa; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); overflow: hidden;">
            <!-- Quadrant backgrounds -->
            <div style="position: absolute; left: 0; bottom: 0; width: 50%; height: 50%; background: #f0fdf4; opacity: 0.35;"></div>
            <div style="position: absolute; right: 0; bottom: 0; width: 50%; height: 50%; background: #fffbeb; opacity: 0.4;"></div>
            <div style="position: absolute; left: 0; top: 0; width: 50%; height: 50%; background: #fffbeb; opacity: 0.4;"></div>
            <div style="position: absolute; right: 0; top: 0; width: 50%; height: 50%; background: #fef2f2; opacity: 0.65;"></div>

            <!-- Quadrant Labels -->
            <span style="position: absolute; top: 12px; right: 14px; font-size: 11px; font-weight: 700; color: var(--risk-red); text-transform: uppercase;">
              CRITICAL ESCALATION ZONE (High Impact / High Prob)
            </span>
            <span style="position: absolute; bottom: 12px; left: 14px; font-size: 11px; font-weight: 600; color: var(--risk-green);">
              MONITORED ZONE (Low Impact / Low Prob)
            </span>

            <!-- Center dividing axis lines -->
            <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; border-left: 1px dashed #cbd5e1;"></div>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; border-top: 1px dashed #cbd5e1;"></div>

            <!-- Axis Labels -->
            <div style="position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 600; color: var(--text-muted);">
              PROBABILITY OF OCCURRENCE (0% → 100%)
            </div>
            <div style="position: absolute; left: 6px; top: 50%; transform: translateY(-50%) rotate(-90deg); font-size: 11px; font-weight: 600; color: var(--text-muted);">
              BUSINESS IMPACT EXPOSURE (₹ Lakh → ₹ Cr)
            </div>

            <!-- Interactive Risk Data Points -->
            <div id="matrix-points-layer" style="position: absolute; inset: 24px;">
              ${risks.map(r => {
                const posX = r.probability; // 0 to 100%
                const posY = 100 - r.impact; // invert for Y axis
                const isSelected = state.selectedRisk.id === r.id;
                const color = r.severity === 'CRITICAL' ? 'var(--brand-primary)' : r.severity === 'HIGH' ? 'var(--risk-amber)' : 'var(--risk-blue)';
                return `
                  <div class="matrix-risk-point" data-id="${r.id}" style="
                    position: absolute;
                    left: ${posX}%;
                    top: ${posY}%;
                    transform: translate(-50%, -50%);
                    width: ${isSelected ? '28px' : '22px'};
                    height: ${isSelected ? '28px' : '22px'};
                    border-radius: 50%;
                    background: ${color};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.18);
                    border: 2px solid white;
                    transition: all 0.15s ease;
                    z-index: ${isSelected ? '10' : '2'};
                  " data-tooltip="${r.title}">
                    ${r.id.replace('R-', '')}
                  </div>
                `;
              }).join("")}
            </div>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">
            Tip: Click any numbered risk point on the matrix to load structured evidence and action items.
          </div>
        </div>

        <!-- Selected Risk Details Panel -->
        <div class="card" id="matrix-detail-card">
          <div class="card-header">
            <div class="card-title">Risk Specification</div>
            <span class="status-pill ${state.selectedRisk.severity.toLowerCase()}">${state.selectedRisk.severity}</span>
          </div>
          <div class="card-body" style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">${state.selectedRisk.category} • ${state.selectedRisk.entity}</div>
              <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${state.selectedRisk.title}</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Probability</div>
                <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">${state.selectedRisk.probability}%</div>
              </div>
              <div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Revenue Impact</div>
                <div style="font-size: 16px; font-weight: 700; color: var(--risk-red);">${state.selectedRisk.impactAmount}</div>
              </div>
              <div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Time to Disruption</div>
                <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${state.selectedRisk.timeToImpact}</div>
              </div>
              <div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">AI Confidence</div>
                <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${state.selectedRisk.confidence}%</div>
              </div>
            </div>

            <div>
              <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Propagation Chain</div>
              <div style="font-size: 12px; color: var(--text-primary); background: #fff5f5; border-left: 3px solid var(--brand-primary); padding: 8px 10px; border-radius: var(--radius-sm); line-height: 1.4;">
                ${state.selectedRisk.propagationSummary}
              </div>
            </div>

            <div>
              <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Telemetry Evidence</div>
              <ul style="padding-left: 14px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
                ${state.selectedRisk.evidence.map(e => `<li>${e}</li>`).join("")}
              </ul>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
              <button class="btn btn-primary" onclick="openExplain('${state.selectedRisk.explainId || 'risk-s102'}')">
                Explain Why & Math
              </button>
              <button class="btn btn-secondary" onclick="navigateTo('scenario-simulator')">
                Simulate Mitigation Options
              </button>
              <button class="btn btn-dark" onclick="submitCopilotQuery('Why is ${state.selectedRisk.title} critical?')">
                Ask Ops Copilot
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ranked Critical Risks Table -->
      <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          <div class="card-title">All Ranked Operational Vulnerabilities</div>
          <span style="font-size: 12px; color: var(--text-muted);">Filtered by: Probability × Impact × Urgency</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Risk ID</th>
                  <th>Risk Title & Entity</th>
                  <th>Category</th>
                  <th>Probability</th>
                  <th>Impact Amount</th>
                  <th>Time to Impact</th>
                  <th>Severity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${risks.map(r => `
                  <tr class="table-row-clickable" onclick="window.selectRiskById('${r.id}')">
                    <td style="font-weight: 700; color: var(--text-muted);">${r.id}</td>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">${r.title}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${r.entity}</div>
                    </td>
                    <td><span class="status-pill neutral">${r.category}</span></td>
                    <td style="font-weight: 700;">${r.probability}%</td>
                    <td style="font-weight: 700; color: ${r.severity === 'CRITICAL' ? 'var(--risk-red)' : 'inherit'};">${r.impactAmount}</td>
                    <td style="font-size: 12px;">${r.timeToImpact}</td>
                    <td><span class="status-pill ${r.severity.toLowerCase()}">${r.severity}</span></td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn-explain" onclick="event.stopPropagation(); openExplain('${r.explainId || 'risk-s102'}')">Explain</button>
                        <button class="btn btn-secondary btn-xs" onclick="event.stopPropagation(); navigateTo('scenario-simulator')">Simulate</button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Matrix Point Click Listeners
    document.querySelectorAll(".matrix-risk-point").forEach(pt => {
      pt.addEventListener("click", () => {
        const id = pt.getAttribute("data-id");
        window.selectRiskById(id);
      });
    });
  }

  window.selectRiskById = function(riskId) {
    const found = data.riskMatrix.find(r => r.id === riskId);
    if (found) {
      state.selectedRisk = found;
      renderRiskMatrixView();
    }
  };

  // 3. SUPPLIER INTELLIGENCE VIEW
  function renderSuppliersView() {
    const suppliers = data.suppliers;
    const conc = data.concentrationAnalysis;

    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Supplier Intelligence & Fragility Engine</h1>
          <p>Real-time vendor reliability tracking, lead-time variance, and single-source dependency concentration detection.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="navigateTo('action-center')">Review Sourcing Actions</button>
        </div>
      </div>

      <!-- Single Supplier Dependency Alert Banner -->
      <div class="card" style="border-left: 4px solid var(--brand-primary); background: #fffcfc;">
        <div class="card-body">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="status-pill critical">SINGLE SUPPLIER DEPENDENCY DETECTED</span>
                <span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">${conc.componentId} — ${conc.componentName}</span>
              </div>
              <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-top: 6px;">
                ${conc.riskSummary}
              </div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                ${conc.recommendedMitigation}
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-xs" onclick="openExplain('concentration-c204')">Explain Concentration</button>
              <button class="btn btn-primary btn-xs" onclick="navigateTo('action-center')">Approve Rebalancing</button>
            </div>
          </div>

          <!-- Dependency Share Bar -->
          <div style="margin-top: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; font-weight: 600;">
              <span>Supplier Share Breakdown:</span>
              <span>Total: 100% Volume</span>
            </div>
            <div style="display: flex; height: 10px; border-radius: var(--radius-pill); overflow: hidden; background: #e2e8f0;">
              <div style="width: 72%; background: var(--brand-primary);" data-tooltip="S102: 72% (Critical Fragility)"></div>
              <div style="width: 18%; background: var(--risk-green);" data-tooltip="S108: 18% (Secondary)"></div>
              <div style="width: 10%; background: #94a3b8;" data-tooltip="S115: 10% (Reserve)"></div>
            </div>
            <div style="display: flex; gap: 16px; margin-top: 6px; font-size: 11px; color: var(--text-muted);">
              <span><strong style="color: var(--brand-primary);">■ S102: 72%</strong> (Precision Auto-Cast)</span>
              <span><strong style="color: var(--risk-green);">■ S108: 18%</strong> (Apex Microtech)</span>
              <span><strong>■ S115: 10%</strong> (Consortium Reserve)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Supplier Directory Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Tier-1 Supplier Performance Directory</div>
          <div class="filter-group">
            <select class="filter-select" id="supp-category-select">
              <option value="all">All Categories</option>
              <option value="powertrain">Powertrain & Engines</option>
              <option value="electronics">Electronics & ECUs</option>
              <option value="castings">Heavy Castings</option>
              <option value="hydraulics">Hydraulics</option>
            </select>
            <select class="filter-select" id="supp-risk-select">
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Only</option>
              <option value="healthy">Healthy Only</option>
            </select>
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Supplier ID</th>
                  <th>Supplier Name & Hub</th>
                  <th>Category</th>
                  <th>OTIF %</th>
                  <th>Avg Lead Time</th>
                  <th>Lead Time Variance</th>
                  <th>Defect Rate</th>
                  <th>Capacity Util</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="suppliers-table-body">
                ${suppliers.map(s => `
                  <tr class="table-row-clickable" onclick="window.selectSupplierDetail('${s.id}')">
                    <td style="font-weight: 700; color: var(--text-muted);">${s.id}</td>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">${s.name}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${s.location}</div>
                    </td>
                    <td><span class="status-pill neutral">${s.category}</span></td>
                    <td style="font-weight: 700; color: ${s.otif < 80 ? 'var(--risk-red)' : 'var(--risk-green)'};">
                      ${s.otif}% <span style="font-size: 10px; font-weight: normal; color: var(--text-muted);">(${s.otifTrend > 0 ? '+' : ''}${s.otifTrend}%)</span>
                    </td>
                    <td style="font-weight: 600;">${s.leadTime} days</td>
                    <td style="color: ${s.leadTimeVar > 2.0 ? 'var(--risk-red)' : 'inherit'};">±${s.leadTimeVar}d</td>
                    <td>${s.defectRate}%</td>
                    <td>${s.capacityUtilization}%</td>
                    <td style="font-weight: 700; font-size: 14px; color: ${s.riskScore > 75 ? 'var(--risk-red)' : s.riskScore > 50 ? 'var(--risk-amber)' : 'var(--risk-green)'};">
                      ${s.riskScore}/100
                    </td>
                    <td><span class="status-pill ${s.status.toLowerCase()}">${s.status}</span></td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn-explain" onclick="event.stopPropagation(); openExplain('${s.explainId}')">Explain</button>
                        <button class="btn btn-secondary btn-xs" onclick="event.stopPropagation(); window.compareWithS108('${s.id}')">Compare</button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Filter Listeners
    document.getElementById("supp-risk-select").addEventListener("change", (e) => {
      const val = e.target.value;
      const filtered = val === "all" ? data.suppliers : data.suppliers.filter(s => s.status.toLowerCase() === val);
      renderSuppliersTableRows(filtered);
    });
  }

  function renderSuppliersTableRows(list) {
    const tbody = document.getElementById("suppliers-table-body");
    if (!tbody) return;
    tbody.innerHTML = list.map(s => `
      <tr class="table-row-clickable" onclick="window.selectSupplierDetail('${s.id}')">
        <td style="font-weight: 700; color: var(--text-muted);">${s.id}</td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${s.name}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${s.location}</div>
        </td>
        <td><span class="status-pill neutral">${s.category}</span></td>
        <td style="font-weight: 700; color: ${s.otif < 80 ? 'var(--risk-red)' : 'var(--risk-green)'};">
          ${s.otif}% <span style="font-size: 10px; font-weight: normal; color: var(--text-muted);">(${s.otifTrend > 0 ? '+' : ''}${s.otifTrend}%)</span>
        </td>
        <td style="font-weight: 600;">${s.leadTime} days</td>
        <td style="color: ${s.leadTimeVar > 2.0 ? 'var(--risk-red)' : 'inherit'};">±${s.leadTimeVar}d</td>
        <td>${s.defectRate}%</td>
        <td>${s.capacityUtilization}%</td>
        <td style="font-weight: 700; font-size: 14px; color: ${s.riskScore > 75 ? 'var(--risk-red)' : s.riskScore > 50 ? 'var(--risk-amber)' : 'var(--risk-green)'};">
          ${s.riskScore}/100
        </td>
        <td><span class="status-pill ${s.status.toLowerCase()}">${s.status}</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn-explain" onclick="event.stopPropagation(); openExplain('${s.explainId}')">Explain</button>
            <button class="btn btn-secondary btn-xs" onclick="event.stopPropagation(); window.compareWithS108('${s.id}')">Compare</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  window.selectSupplierDetail = function(supplierId) {
    const s = data.suppliers.find(it => it.id === supplierId);
    if (s) {
      state.selectedSupplier = s;
      openExplain(s.explainId);
    }
  };

  window.compareWithS108 = function(supplierId) {
    navigateTo("ops-copilot");
    submitCopilotQuery(`Compare Supplier ${supplierId} and Supplier S108`);
  };

  // 4. INVENTORY INTELLIGENCE VIEW
  function renderInventoryView() {
    const inventory = data.inventory;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Inventory Intelligence & Buffer Health</h1>
          <p>Real-time Days of Supply vs Safety Stock tracking, stockout probability forecasting, and buffer deficit analysis.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="navigateTo('scenario-simulator')">Simulate Safety Stock Shift</button>
          <button class="btn btn-primary" onclick="openExplain('risk-c204')">Explain C204 Depletion</button>
        </div>
      </div>

      <!-- Inventory Top Metrics -->
      <div class="kpi-grid">
        <div class="kpi-card" style="border-top: 3px solid var(--risk-red);">
          <span class="kpi-label">Critical Components</span>
          <span class="kpi-value" style="color: var(--risk-red);">2</span>
          <span class="kpi-change">Below safety threshold</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Average Days of Supply</span>
          <span class="kpi-value">10.8d</span>
          <span class="kpi-change">Target benchmark: 11.0d</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Exposed Inventory Value</span>
          <span class="kpi-value">₹4.2 Cr</span>
          <span class="kpi-change">Across critical assemblies</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Max Stockout Probability</span>
          <span class="kpi-value" style="color: var(--risk-red);">81%</span>
          <span class="kpi-change">Component C204 at Nashik</span>
        </div>
      </div>

      <!-- Days of Supply vs Safety Stock Visual Chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Days of Supply (DOS) vs Target Safety Stock Buffer</div>
          <span style="font-size: 12px; color: var(--text-muted);">Red bars indicate buffer breaches</span>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${inventory.map(item => {
              const pct = (item.daysOfSupply / 25) * 100;
              const targetPct = (item.safetyStockTarget / 25) * 100;
              const isBreached = item.daysOfSupply < item.safetyStockTarget;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                    <div>
                      <strong>${item.id}: ${item.name}</strong>
                      <span style="color: var(--text-muted); margin-left: 8px;">(${item.plant})</span>
                    </div>
                    <div>
                      <span style="font-weight: 700; color: ${isBreached ? 'var(--risk-red)' : 'var(--risk-green)'};">
                        ${item.daysOfSupply} Days DOS
                      </span>
                      <span style="color: var(--text-muted);"> / Safety Target: ${item.safetyStockTarget} Days</span>
                    </div>
                  </div>
                  <div style="position: relative; height: 16px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                    <!-- Safety target marker line -->
                    <div style="position: absolute; left: ${targetPct}%; top: 0; bottom: 0; width: 2px; background: #0f172a; z-index: 5;" title="Safety Target: ${item.safetyStockTarget}d"></div>
                    <!-- Current DOS bar -->
                    <div style="height: 100%; width: ${pct}%; background: ${isBreached ? 'var(--brand-primary)' : 'var(--risk-green)'};"></div>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                    ${item.riskNote}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Component Inventory & Stockout Probability Table</div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Component ID</th>
                  <th>Component Name & Category</th>
                  <th>Plant</th>
                  <th>Current Stock</th>
                  <th>Daily Demand</th>
                  <th>Days of Supply</th>
                  <th>Safety Target</th>
                  <th>Vendor Lead Time</th>
                  <th>Stockout Prob</th>
                  <th>Status</th>
                  <th>Explain</th>
                </tr>
              </thead>
              <tbody>
                ${inventory.map(c => `
                  <tr>
                    <td style="font-weight: 700; color: var(--text-muted);">${c.id}</td>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">${c.name}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${c.category} • Value: ${c.stockValue}</div>
                    </td>
                    <td>${c.plant}</td>
                    <td style="font-weight: 600;">${c.currentStock.toLocaleString()}</td>
                    <td>${c.dailyDemand}/day</td>
                    <td style="font-weight: 700; color: ${c.daysOfSupply < c.safetyStockTarget ? 'var(--risk-red)' : 'inherit'};">
                      ${c.daysOfSupply}d
                    </td>
                    <td>${c.safetyStockTarget}d</td>
                    <td>${c.supplierLeadTime}d</td>
                    <td style="font-weight: 700; color: ${c.stockoutProb > 60 ? 'var(--risk-red)' : 'inherit'};">
                      ${c.stockoutProb}%
                    </td>
                    <td><span class="status-pill ${c.status.toLowerCase()}">${c.status}</span></td>
                    <td>
                      <button class="btn-explain" onclick="openExplain('${c.id === 'C204' ? 'risk-c204' : 'kpi-inventory'}')">Explain</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 5. PRODUCTION INTELLIGENCE VIEW
  function renderProductionView() {
    const plants = data.plants;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Production Intelligence & Plant Bottleneck Detection</h1>
          <p>Real-time line capacity utilization, OEE metrics, schedule adherence, and starving-line prevention.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="navigateTo('scenario-simulator')">Simulate Plant Outage</button>
          <button class="btn btn-primary" onclick="openExplain('plant-02')">Explain Nashik Bottleneck</button>
        </div>
      </div>

      <!-- Plant Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        ${plants.map(p => `
          <div class="card" style="${p.status === 'CRITICAL' ? 'border-top: 3px solid var(--risk-red);' : ''}">
            <div class="card-header">
              <div class="card-title">${p.name}</div>
              <span class="status-pill ${p.status.toLowerCase()}">${p.status}</span>
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; gap: 10px;">
              <div style="font-size: 11px; color: var(--text-muted);">${p.primaryProducts}</div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; padding: 10px; border-radius: var(--radius-sm);">
                <div>
                  <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Capacity Util</div>
                  <div style="font-size: 18px; font-weight: 700; color: ${p.utilization > 90 ? 'var(--risk-red)' : 'inherit'};">${p.utilization}%</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">OEE</div>
                  <div style="font-size: 18px; font-weight: 700;">${p.oee}%</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Schedule Adherence</div>
                  <div style="font-size: 14px; font-weight: 600;">${p.scheduleAdherence}%</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Backlog Units</div>
                  <div style="font-size: 14px; font-weight: 600; color: ${p.backlogUnits > 1000 ? 'var(--risk-red)' : 'inherit'};">${p.backlogUnits}</div>
                </div>
              </div>

              <!-- Lines List -->
              <div>
                <div style="font-size: 10px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">Assembly Lines</div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  ${p.lines.map(l => `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; background: white; border: 1px solid var(--border-subtle); padding: 4px 8px; border-radius: 4px;">
                      <span>${l.name}</span>
                      <span style="font-weight: 700; color: ${l.status.includes('BOTTLENECK') ? 'var(--risk-red)' : 'inherit'};">${l.util}%</span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- Bottleneck Warning -->
              <div style="font-size: 11px; color: ${p.status === 'CRITICAL' ? 'var(--risk-red)' : 'var(--text-secondary)'}; background: ${p.status === 'CRITICAL' ? '#fef2f2' : '#f8fafc'}; padding: 8px; border-radius: 4px; line-height: 1.3;">
                ${p.bottleneckAlert}
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                <button class="btn-explain" onclick="openExplain('${p.explainId}')">Explain Bottleneck</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // 6. LOGISTICS & SHIPMENTS VIEW
  function renderLogisticsView() {
    const shipments = data.shipments;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Logistics & Freight Corridor Monitoring</h1>
          <p>Real-time in-transit consignment tracking, route congestion flags, and carrier ETA delay probabilities.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="navigateTo('action-center')">Reroute Critical Shipments</button>
        </div>
      </div>

      <!-- Spotlight: In-Transit Disruption -->
      <div class="card" style="border-left: 4px solid var(--risk-red); background: #fffcfc;">
        <div class="card-body">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="status-pill critical">CRITICAL TRANSIT DELAY SPOTLIGHT</span>
                <span style="font-size: 13px; font-weight: 700;">Shipment SH-2048 (400 Units C204 Engine ECU)</span>
              </div>
              <div style="font-size: 13px; color: var(--text-primary); margin-top: 6px;">
                Expected Delay: <strong style="color: var(--risk-red);">+2.8 Days</strong> • Delay Probability: <strong>74%</strong> • Carrier: <strong>C12 Express Freight</strong>
              </div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                Reason: Regional highway waterlogging on Western Ghats pass + carrier scheduling bottleneck.
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-explain" onclick="openExplain('risk-c12')">Explain Delay</button>
              <button class="btn btn-primary btn-xs" onclick="navigateTo('action-center')">Approve Solapur Bypass (ACT-503)</button>
            </div>
          </div>
        </div>
      </div>

      <!-- In-Transit Shipments Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Active In-Transit Consignments</div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Supplier & Component</th>
                  <th>Corridor (Origin → Dest)</th>
                  <th>Carrier</th>
                  <th>Baseline ETA</th>
                  <th>Expected ETA</th>
                  <th>Delay Prob</th>
                  <th>Route Risk</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${shipments.map(sh => `
                  <tr>
                    <td style="font-weight: 700; color: var(--text-muted);">${sh.id}</td>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">${sh.supplierName}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${sh.component} (${sh.units} units)</div>
                    </td>
                    <td style="font-size: 12px;">${sh.origin} → ${sh.destination}</td>
                    <td>${sh.carrier}</td>
                    <td style="font-size: 11px; color: var(--text-muted);">${sh.baselineEta}</td>
                    <td style="font-weight: 700; color: ${sh.delayProb > 50 ? 'var(--risk-red)' : 'inherit'}; font-size: 11px;">
                      ${sh.expectedEta}
                    </td>
                    <td style="font-weight: 700;">${sh.delayProb}%</td>
                    <td style="font-size: 11px;">${sh.routeRisk}</td>
                    <td><span class="status-pill ${sh.status.toLowerCase()}">${sh.status}</span></td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn-explain" onclick="openExplain('risk-c12')">Explain</button>
                        <button class="btn btn-secondary btn-xs" onclick="navigateTo('ops-copilot')">Ask Copilot</button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 7. ORDERS & DELIVERY VIEW
  function renderOrdersView() {
    const orders = data.orders;
    const summary = data.ordersSummary;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Customer Orders & Delivery Fulfillment</h1>
          <p>Finished vehicle order SLA protection, dealer allocation tracking, and delay exposure analysis.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="submitCopilotQuery('Which customer orders are most likely to be delayed?')">
            Which Orders are Most at Risk?
          </button>
        </div>
      </div>

      <!-- Top KPI Row -->
      <div class="kpi-grid">
        <div class="kpi-card" style="border-top: 3px solid var(--risk-red);">
          <span class="kpi-label">Orders at Delay Risk</span>
          <span class="kpi-value" style="color: var(--risk-red);">${summary.totalAtRisk}</span>
          <span class="kpi-change">Scorpio-N and XUV700 programs</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Portfolio OTIF</span>
          <span class="kpi-value">${summary.portfolioOtif}%</span>
          <span class="kpi-change">Below 92% SLA target</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Order Fill Rate</span>
          <span class="kpi-value">${summary.fillRate}%</span>
          <span class="kpi-change">Line 2 throughput dependent</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Backlog Value Exposed</span>
          <span class="kpi-value" style="color: var(--risk-red);">${summary.backlogValue}</span>
          <span class="kpi-change">Festive booking orders</span>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Tracked Vehicle Order Batches</div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Order Batch ID</th>
                  <th>Vehicle Model & Platform</th>
                  <th>Manufacturing Plant</th>
                  <th>Quantity</th>
                  <th>Customer / Dealer Region</th>
                  <th>Promised Date</th>
                  <th>Projected Date</th>
                  <th>Delay Prob</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => `
                  <tr>
                    <td style="font-weight: 700; color: var(--text-muted);">${o.id}</td>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">${o.product}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">Exposure: ${o.revenueExposure}</div>
                    </td>
                    <td>${o.plant}</td>
                    <td style="font-weight: 600;">${o.quantity} units</td>
                    <td style="font-size: 12px;">${o.customerRegion}</td>
                    <td style="font-size: 12px;">${o.promisedDate}</td>
                    <td style="font-size: 12px; font-weight: 700; color: ${o.delayProb > 50 ? 'var(--risk-red)' : 'inherit'};">
                      ${o.expectedDate}
                    </td>
                    <td style="font-weight: 700;">${o.delayProb}%</td>
                    <td><span class="status-pill ${o.priority === 'CRITICAL' ? 'critical' : o.priority === 'HIGH' ? 'amber' : 'neutral'}">${o.priority}</span></td>
                    <td><span class="status-pill ${o.status.toLowerCase()}">${o.status}</span></td>
                    <td>
                      <button class="btn-explain" onclick="openExplain('risk-orders')">Explain</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 8. SUPPLY CHAIN RISK NETWORK (Interactive SVG Graph)
  function renderRiskNetworkView() {
    const net = data.network;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Supply Chain Risk Network Graph</h1>
          <p>Interactive digital twin topology tracing upstream dependencies and downstream cascading consequences.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="window.clearNetworkSelection()">Reset Graph</button>
          <button class="btn btn-primary" onclick="navigateTo('risk-propagation')">View Step-by-Step Chain</button>
        </div>
      </div>

      <div class="network-container">
        <!-- Interactive Canvas -->
        <div class="network-graph-canvas">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; font-size: 12px; color: var(--text-muted);">
            <span>Topology Flow: Suppliers → Components → Plants → Lines → Warehouses → Carriers → Orders</span>
            <div style="display: flex; gap: 8px;">
              <span class="status-pill critical">Critical Vulnerability</span>
              <span class="status-pill amber">Elevated Watch</span>
              <span class="status-pill healthy">Normal Operation</span>
            </div>
          </div>

          <div style="position: relative; width: 1120px; height: 500px; background: #fafafa; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); overflow: hidden;">
            <!-- SVG Links -->
            <svg id="network-svg" width="1120" height="500" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
              ${net.links.map(l => {
                const source = net.nodes.find(n => n.id === l.from);
                const target = net.nodes.find(n => n.id === l.to);
                if (!source || !target) return "";
                const strokeColor = l.isCritical ? 'var(--brand-primary)' : '#cbd5e1';
                const strokeWidth = l.isCritical ? 3 : 1.5;
                const strokeDash = l.isCritical ? 'none' : '4,3';
                return `
                  <line 
                    x1="${source.x + 60}" y1="${source.y + 20}" 
                    x2="${target.x}" y2="${target.y + 20}" 
                    stroke="${strokeColor}" 
                    stroke-width="${strokeWidth}" 
                    stroke-dasharray="${strokeDash}"
                    id="link-${l.from}-${l.to}"
                  />
                `;
              }).join("")}
            </svg>

            <!-- HTML Nodes Layer -->
            <div id="network-nodes-layer">
              ${net.nodes.map(n => {
                const isSelected = state.selectedNetworkNode && state.selectedNetworkNode.id === n.id;
                const statusClass = n.status.toLowerCase();
                const borderColor = n.status === 'CRITICAL' ? 'var(--brand-primary)' : n.status === 'HIGH' || n.status === 'AMBER' ? 'var(--risk-amber)' : 'var(--risk-green)';
                return `
                  <div class="network-node-card" data-id="${n.id}" onclick="window.selectNetworkNode('${n.id}')" style="
                    position: absolute;
                    left: ${n.x}px;
                    top: ${n.y}px;
                    width: 140px;
                    background: white;
                    border: 2px solid ${isSelected ? '#0f172a' : borderColor};
                    border-radius: var(--radius-sm);
                    padding: 8px 10px;
                    box-shadow: ${isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'var(--shadow-sm)'};
                    cursor: pointer;
                    transition: all 0.15s ease;
                    z-index: ${isSelected ? '20' : '5'};
                    transform: ${isSelected ? 'scale(1.05)' : 'scale(1)'};
                  ">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                      <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">${n.type}</span>
                      <span class="status-pill ${statusClass}" style="font-size: 9px; padding: 1px 4px;">${n.risk}%</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${n.name}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">
            Click on any node (e.g. <strong>S102</strong>, <strong>C204</strong>, or <strong>Plant 02</strong>) to isolate dependencies and evaluate cascading propagation.
          </div>
        </div>

        <!-- Node Context Sidebar -->
        <div class="card" id="network-inspector-card">
          <div class="card-header">
            <div class="card-title">Node Inspector</div>
            <span class="status-pill neutral" id="inspector-type">
              ${state.selectedNetworkNode ? state.selectedNetworkNode.type.toUpperCase() : "SELECTION"}
            </span>
          </div>
          <div class="card-body" id="inspector-body" style="display: flex; flex-direction: column; gap: 12px;">
            ${state.selectedNetworkNode ? `
              <div>
                <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">${state.selectedNetworkNode.id}</div>
                <div style="font-size: 15px; font-weight: 700; color: var(--text-primary);">${state.selectedNetworkNode.name}</div>
              </div>
              <div style="background: #f8fafc; border: 1px solid var(--border-subtle); padding: 10px; border-radius: var(--radius-sm);">
                <div style="font-size: 11px; color: var(--text-muted);">Telemetry Status:</div>
                <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-top: 2px;">${state.selectedNetworkNode.info}</div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
                <span>Disruption Probability:</span>
                <strong style="color: var(--risk-red);">${state.selectedNetworkNode.risk}%</strong>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                <button class="btn btn-primary" onclick="openExplain('${state.selectedNetworkNode.id === 'S102' ? 'risk-s102' : state.selectedNetworkNode.id === 'C204' ? 'risk-c204' : 'plant-02'}')">
                  Explain Why & Evidence
                </button>
                <button class="btn btn-secondary" onclick="navigateTo('scenario-simulator')">
                  Simulate Impact
                </button>
                <button class="btn btn-dark" onclick="submitCopilotQuery('Why is ${state.selectedNetworkNode.name} at risk?')">
                  Ask Ops Copilot
                </button>
              </div>
            ` : `
              <div style="padding: 24px 0; text-align: center; color: var(--text-muted);">
                Select any node on the left topology graph to view upstream dependencies and downstream operational exposures.
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  window.selectNetworkNode = function(nodeId) {
    const node = data.network.nodes.find(n => n.id === nodeId);
    if (node) {
      state.selectedNetworkNode = node;
      renderRiskNetworkView();
    }
  };

  window.clearNetworkSelection = function() {
    state.selectedNetworkNode = null;
    renderRiskNetworkView();
  };

  // 9. DEDICATED RISK PROPAGATION FLOW VIEW
  function renderRiskPropagationView() {
    const prop = data.riskPropagationEngine;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>${prop.title}</h1>
          <p>${prop.subtitle}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="navigateTo('risk-network')">Open Network Topology</button>
          <button class="btn btn-primary" onclick="navigateTo('recommendations')">View AI Mitigations</button>
        </div>
      </div>

      <!-- Step-by-Step Propagation Flow Diagram -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Live Cascade Trace: Supplier Disruption to Customer SLA Slip</div>
          <span class="status-pill critical">Total Exposure: ₹1.8 Cr & 2,840 Orders</span>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${prop.stages.map((stage, idx) => `
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <!-- Step Indicator Circle -->
                <div style="width: 36px; height: 36px; border-radius: 50%; background: ${idx === 0 ? 'var(--brand-primary)' : '#0f172a'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                  ${stage.step}
                </div>

                <!-- Stage Card Box -->
                <div style="flex: 1; background: white; border: 1px solid var(--border-subtle); border-left: 4px solid ${idx === 0 ? 'var(--brand-primary)' : idx === 3 ? 'var(--risk-red)' : 'var(--risk-amber)'}; border-radius: var(--radius-sm); padding: 14px 18px; box-shadow: var(--shadow-sm);">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                      ${stage.stage}
                    </span>
                    <span class="status-pill critical">Risk Index: ${stage.riskScore}%</span>
                  </div>
                  <div style="font-size: 15px; font-weight: 700; color: var(--text-primary);">
                    ${stage.entity}
                  </div>
                  <div style="font-size: 13px; font-weight: 600; color: var(--brand-primary); margin: 4px 0;">
                    ${stage.metric}
                  </div>
                  <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;">
                    ${stage.description}
                  </div>
                </div>
              </div>
              ${idx < prop.stages.length - 1 ? `
                <div style="display: flex; justify-content: flex-start; padding-left: 17px; margin: -8px 0;">
                  <div style="width: 2px; height: 20px; background: #cbd5e1;"></div>
                </div>
              ` : ''}
            `).join("")}
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <div style="font-size: 13px; color: var(--text-muted);">
              Conclusion: A 2.8-day delivery delay on a single component (C204 ECU) amplifies into an 8.4% factory output crash.
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" onclick="openExplain('risk-s102')">Explain Upstream Evidence</button>
              <button class="btn btn-primary" onclick="navigateTo('scenario-simulator')">Simulate Alternate Sourcing</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 10. SCENARIO SIMULATOR ("WHAT IF?" DIGITAL TWIN ENGINE)
  function renderScenarioSimulatorView() {
    const params = state.simulatorParams;
    const simResult = calculateSimulation(params);

    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Scenario Simulator (Digital Twin Engine)</h1>
          <p>Run dynamic "What-If?" stress tests. Modify supply shocks, demand surges, and transit delays to calculate downstream impacts.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="sim-reset-btn">Reset to Baseline</button>
          <button class="btn btn-primary" onclick="navigateTo('recommendations')">Compare AI Mitigations</button>
        </div>
      </div>

      <!-- Presets Toolbar -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <div class="card-title">Scenario Presets (One-Click Stress Tests)</div>
        </div>
        <div class="card-body" style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${data.scenarioPresets.map(pre => `
            <button class="btn btn-secondary btn-xs preset-btn" data-id="${pre.id}">
              ${pre.name}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="simulator-layout">
        <!-- Interactive Controls Slider Panel -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Stress-Test Parameter Controls</div>
          </div>
          <div class="card-body">
            <div class="slider-group">
              <div class="slider-label-row">
                <span>Supplier Disruption Duration:</span>
                <span id="lbl-supplier-days">${params.supplierDaysOut} Days</span>
              </div>
              <input type="range" class="range-input" id="slider-supplier-days" min="0" max="30" value="${params.supplierDaysOut}">
              <div style="font-size: 10px; color: var(--text-muted);">Simulates factory downtime at Supplier S102</div>
            </div>

            <div class="slider-group">
              <div class="slider-label-row">
                <span>Demand Increase (%):</span>
                <span id="lbl-demand-pct">+${params.demandIncreasePct}%</span>
              </div>
              <input type="range" class="range-input" id="slider-demand-pct" min="0" max="40" value="${params.demandIncreasePct}">
              <div style="font-size: 10px; color: var(--text-muted);">Simulates sudden festive dealership order surge</div>
            </div>

            <div class="slider-group">
              <div class="slider-label-row">
                <span>Transportation Transit Delay:</span>
                <span id="lbl-transit-days">${params.transitDelayDays} Days</span>
              </div>
              <input type="range" class="range-input" id="slider-transit-days" min="0" max="14" step="0.5" value="${params.transitDelayDays}">
              <div style="font-size: 10px; color: var(--text-muted);">Simulates Western Ghats monsoon road disruption</div>
            </div>

            <div class="slider-group">
              <div class="slider-label-row">
                <span>Plant Capacity Reduction (%):</span>
                <span id="lbl-capacity-cut">${params.plantCapacityCutPct}%</span>
              </div>
              <input type="range" class="range-input" id="slider-capacity-cut" min="0" max="50" value="${params.plantCapacityCutPct}">
              <div style="font-size: 10px; color: var(--text-muted);">Simulates substation power or robotic weld failure</div>
            </div>

            <div class="slider-group">
              <div class="slider-label-row">
                <span>Safety Stock Buffer Target:</span>
                <span id="lbl-safety-target">${params.safetyBufferDays} Days</span>
              </div>
              <input type="range" class="range-input" id="slider-safety-target" min="5" max="20" value="${params.safetyBufferDays}">
              <div style="font-size: 10px; color: var(--text-muted);">Baseline component safety inventory policy</div>
            </div>
          </div>
        </div>

        <!-- Real-Time Simulated Results Panel -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Digital Twin Calculated Outcomes</div>
            <span class="status-pill critical">Simulated Impact State</span>
          </div>
          <div class="card-body">
            <!-- Summary Metric Comparison -->
            <div class="kpi-grid" style="margin-bottom: 20px;">
              <div class="kpi-card">
                <span class="kpi-label">Production Impact</span>
                <span class="kpi-value" style="color: var(--risk-red);" id="res-prod-impact">${simResult.prodImpactPct}%</span>
                <span class="kpi-change">Line 2 throughput loss</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-label">Days to Stockout</span>
                <span class="kpi-value" style="color: var(--risk-red);" id="res-stockout-days">${simResult.stockoutDays} Days</span>
                <span class="kpi-change">Until assembly starve</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-label">Delayed Vehicle Orders</span>
                <span class="kpi-value" style="color: var(--risk-red);" id="res-delayed-orders">${simResult.delayedOrders.toLocaleString()}</span>
                <span class="kpi-change">Fulfillment SLA breach</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-label">Revenue Exposure</span>
                <span class="kpi-value" style="color: var(--risk-red);" id="res-rev-exposure">₹${simResult.revenueExposureCr} Cr</span>
                <span class="kpi-change">Direct commercial impact</span>
              </div>
            </div>

            <!-- Current Baseline vs Simulated Scenario Table -->
            <div class="table-responsive">
              <table class="enterprise-table">
                <thead>
                  <tr>
                    <th>Operational Dimension</th>
                    <th>Current Baseline</th>
                    <th>Simulated Scenario State</th>
                    <th>Net Variance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Component C204 Inventory Coverage</strong></td>
                    <td>6.2 Days</td>
                    <td style="font-weight: 700; color: var(--risk-red);" id="tab-dos">${simResult.simulatedDos} Days</td>
                    <td id="tab-dos-var">${simResult.dosDelta} Days</td>
                  </tr>
                  <tr>
                    <td><strong>Plant 02 Production Output</strong></td>
                    <td>16,940 units/mo</td>
                    <td style="font-weight: 700; color: var(--risk-red);" id="tab-prod">${simResult.simulatedUnits.toLocaleString()} units</td>
                    <td id="tab-prod-var">-${simResult.lostUnits.toLocaleString()} units</td>
                  </tr>
                  <tr>
                    <td><strong>Customer Delivery SLA Adherence</strong></td>
                    <td>84.2%</td>
                    <td style="font-weight: 700; color: var(--risk-red);" id="tab-sla">${simResult.simulatedSla}%</td>
                    <td id="tab-sla-var">-${simResult.slaDelta}%</td>
                  </tr>
                  <tr>
                    <td><strong>Expedite / Additional Overtime Surcharge</strong></td>
                    <td>₹0</td>
                    <td style="font-weight: 700;" id="tab-cost">₹${simResult.expediteCostLakh} Lakh</td>
                    <td>Incremental</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Direct Recommendation Card -->
            <div style="background: #fffcfc; border: 1px solid var(--border-subtle); border-left: 3px solid var(--brand-primary); padding: 14px; border-radius: var(--radius-sm); margin-top: 18px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase;">
                AI Scenario Assessment & Recommended Action
              </div>
              <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-top: 4px;">
                "Status Quo will lead to assembly line starve within ${simResult.stockoutDays} days. Shift 30% volume to secondary Supplier S108 to compress stockout probability from 81% down to 14%."
              </div>
              <div style="display: flex; gap: 8px; margin-top: 10px;">
                <button class="btn btn-primary btn-xs" onclick="navigateTo('action-center')">Approve Mitigation ACT-501</button>
                <button class="btn btn-secondary btn-xs" onclick="openExplain('risk-s102')">Explain Calculation</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Sliders Event Listeners
    setupSimulatorSliders();
  }

  function calculateSimulation(p) {
    // Deterministic operational mathematics
    const baseDailyDemand = 200 * (1 + p.demandIncreasePct / 100);
    const effectiveStock = 1240;
    const simulatedDos = Math.max(0.5, (effectiveStock / baseDailyDemand) - (p.transitDelayDays * 0.4) - (p.supplierDaysOut * 0.3)).toFixed(1);
    const stockoutDays = Math.max(1.0, (simulatedDos * 0.9)).toFixed(1);

    const baseProdImpact = -8.4 - (p.supplierDaysOut * 0.8) - (p.plantCapacityCutPct * 0.9) - (p.transitDelayDays * 0.5);
    const prodImpactPct = Math.min(-0.5, baseProdImpact).toFixed(1);

    const lostUnits = Math.round(18500 * Math.abs(prodImpactPct / 100));
    const simulatedUnits = 18500 - lostUnits;

    const delayedOrders = Math.min(4200, Math.round(2840 + (p.supplierDaysOut * 80) + (p.demandIncreasePct * 20)));
    const revenueExposureCr = (lostUnits * 0.00115).toFixed(2);

    const simulatedSla = Math.max(50, (84.2 - Math.abs(prodImpactPct * 1.2))).toFixed(1);
    const slaDelta = (84.2 - simulatedSla).toFixed(1);
    const dosDelta = (6.2 - simulatedDos).toFixed(1);
    const expediteCostLakh = (4.2 + (p.supplierDaysOut * 0.4) + (p.transitDelayDays * 0.2)).toFixed(1);

    return {
      simulatedDos,
      stockoutDays,
      prodImpactPct,
      lostUnits,
      simulatedUnits,
      delayedOrders,
      revenueExposureCr,
      simulatedSla,
      slaDelta,
      dosDelta,
      expediteCostLakh
    };
  }

  function setupSimulatorSliders() {
    const sSupp = document.getElementById("slider-supplier-days");
    const sDem = document.getElementById("slider-demand-pct");
    const sTrans = document.getElementById("slider-transit-days");
    const sCap = document.getElementById("slider-capacity-cut");
    const sSafe = document.getElementById("slider-safety-target");

    const update = () => {
      state.simulatorParams.supplierDaysOut = parseFloat(sSupp.value);
      state.simulatorParams.demandIncreasePct = parseFloat(sDem.value);
      state.simulatorParams.transitDelayDays = parseFloat(sTrans.value);
      state.simulatorParams.plantCapacityCutPct = parseFloat(sCap.value);
      state.simulatorParams.safetyBufferDays = parseFloat(sSafe.value);

      document.getElementById("lbl-supplier-days").innerText = `${state.simulatorParams.supplierDaysOut} Days`;
      document.getElementById("lbl-demand-pct").innerText = `+${state.simulatorParams.demandIncreasePct}%`;
      document.getElementById("lbl-transit-days").innerText = `${state.simulatorParams.transitDelayDays} Days`;
      document.getElementById("lbl-capacity-cut").innerText = `${state.simulatorParams.plantCapacityCutPct}%`;
      document.getElementById("lbl-safety-target").innerText = `${state.simulatorParams.safetyBufferDays} Days`;

      const res = calculateSimulation(state.simulatorParams);
      document.getElementById("res-prod-impact").innerText = `${res.prodImpactPct}%`;
      document.getElementById("res-stockout-days").innerText = `${res.stockoutDays} Days`;
      document.getElementById("res-delayed-orders").innerText = res.delayedOrders.toLocaleString();
      document.getElementById("res-rev-exposure").innerText = `₹${res.revenueExposureCr} Cr`;

      document.getElementById("tab-dos").innerText = `${res.simulatedDos} Days`;
      document.getElementById("tab-dos-var").innerText = `-${res.dosDelta} Days`;
      document.getElementById("tab-prod").innerText = `${res.simulatedUnits.toLocaleString()} units`;
      document.getElementById("tab-prod-var").innerText = `-${res.lostUnits.toLocaleString()} units`;
      document.getElementById("tab-sla").innerText = `${res.simulatedSla}%`;
      document.getElementById("tab-sla-var").innerText = `-${res.slaDelta}%`;
      document.getElementById("tab-cost").innerText = `₹${res.expediteCostLakh} Lakh`;
    };

    if (sSupp) sSupp.addEventListener("input", update);
    if (sDem) sDem.addEventListener("input", update);
    if (sTrans) sTrans.addEventListener("input", update);
    if (sCap) sCap.addEventListener("input", update);
    if (sSafe) sSafe.addEventListener("input", update);

    // Preset button clicks
    document.querySelectorAll(".preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const preset = data.scenarioPresets.find(p => p.id === id);
        if (preset) {
          state.simulatorParams = { ...preset.params };
          sSupp.value = preset.params.supplierDaysOut;
          sDem.value = preset.params.demandIncreasePct;
          sTrans.value = preset.params.transitDelayDays;
          sCap.value = preset.params.plantCapacityCutPct;
          sSafe.value = preset.params.safetyBufferDays;
          update();
        }
      });
    });

    const resetBtn = document.getElementById("sim-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.simulatorParams = { supplierDaysOut: 0, demandIncreasePct: 11, transitDelayDays: 2.8, plantCapacityCutPct: 0, safetyBufferDays: 10 };
        sSupp.value = 0; sDem.value = 11; sTrans.value = 2.8; sCap.value = 0; sSafe.value = 10;
        update();
      });
    }
  }

  // 11. AI RECOMMENDATIONS & MITIGATION COMPARISON
  function renderRecommendationsView() {
    const options = data.mitigationOptions;
    const recs = data.recommendations;

    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>AI Mitigation Strategies & Trade-Off Matrix</h1>
          <p>Side-by-side comparative analysis of operational interventions. Human-in-the-loop review required before execution.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="navigateTo('scenario-simulator')">Stress-Test in Simulator</button>
          <button class="btn btn-primary" onclick="navigateTo('action-center')">Go to Action Approval</button>
        </div>
      </div>

      <!-- Active Primary Recommendation Banner -->
      <div class="card" style="border: 2px solid var(--brand-primary); background: #fffdfd;">
        <div class="card-header" style="background: white;">
          <div class="card-title">
            <span class="status-pill critical">AI RECOMMENDATION #R-1042</span>
            <span>Supplier S102 Volume Rebalance & Air Expedite</span>
          </div>
          <span style="font-size: 12px; color: var(--text-muted);">Confidence Score: <strong>89%</strong></span>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">The Operational Problem</div>
              <div style="font-size: 13px; color: var(--text-primary); margin-top: 2px; line-height: 1.4;">
                ${recs[0].problem}
              </div>

              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-top: 12px;">Recommended Decision</div>
              <div style="font-size: 14px; font-weight: 700; color: var(--brand-primary); margin-top: 2px;">
                ${recs[0].action}
              </div>

              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-top: 12px;">Supporting Telemetry Evidence</div>
              <ul style="padding-left: 16px; font-size: 12px; color: var(--text-secondary); margin-top: 4px; display: flex; flex-direction: column; gap: 3px;">
                ${recs[0].evidence.map(e => `<li>${e}</li>`).join("")}
              </ul>
            </div>

            <!-- Financial & Impact Cards -->
            <div style="display: flex; flex-direction: column; gap: 10px; background: #f8fafc; padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <span>Incremental Surcharge Cost:</span>
                <strong>${recs[0].cost}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <span>Disruption Risk Reduction:</span>
                <strong style="color: var(--risk-green);">${recs[0].riskReduction}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <span>Revenue Margin Protected:</span>
                <strong style="color: var(--brand-primary);">${recs[0].revenueProtected}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <span>Governance Status:</span>
                <span class="status-pill amber">${recs[0].status}</span>
              </div>
              <div style="border-top: 1px solid var(--border-subtle); padding-top: 10px; margin-top: 4px; display: flex; flex-direction: column; gap: 6px;">
                <button class="btn btn-primary" onclick="window.approveActionDirectly('ACT-501')">
                  Approve Recommendation
                </button>
                <button class="btn btn-secondary" onclick="openExplain('rec-1042')">
                  Explain Recommendation Logic
                </button>
                <button class="btn btn-dark" onclick="submitCopilotQuery('Show me the evidence behind recommendation R-1042')">
                  Ask Copilot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side-by-Side Trade-off Comparison Grid -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <h2 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">Comparative Strategy Evaluation (5 Options)</h2>
          <span style="font-size: 12px; color: var(--text-muted);">Trade-off between cost, risk mitigation, and implementation time</span>
        </div>
        <div class="comparison-grid">
          ${options.map(opt => `
            <div class="option-card ${opt.recommended ? 'recommended-card' : ''}">
              ${opt.recommended ? `<div class="option-badge-rec">${opt.badge}</div>` : ''}
              <div>
                <div class="option-card-header">
                  <div style="font-size: 14px; font-weight: 700; color: var(--text-primary);">${opt.name}</div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin: 6px 0 10px; line-height: 1.3;">
                  ${opt.summary}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #f8fafc; padding: 10px; border-radius: var(--radius-sm); font-size: 11px;">
                  <div>
                    <span style="color: var(--text-muted);">Cost:</span><br>
                    <strong>${opt.cost}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted);">Risk Reduction:</span><br>
                    <strong style="color: ${opt.riskReductionPct > 50 ? 'var(--risk-green)' : 'inherit'};">${opt.riskReductionPct}%</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted);">Prod Impact:</span><br>
                    <strong style="color: ${opt.productionImpactPct < -3 ? 'var(--risk-red)' : 'inherit'};">${opt.productionImpactPct}%</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted);">Protected Rev:</span><br>
                    <strong style="color: var(--brand-primary);">${opt.revenueProtected}</strong>
                  </div>
                </div>

                <div style="margin-top: 10px; font-size: 11px;">
                  <div style="color: var(--risk-green); font-weight: 600;">✓ Pros: ${opt.pros.join(", ")}</div>
                  <div style="color: var(--risk-red); font-weight: 600; margin-top: 2px;">✗ Cons: ${opt.cons.join(", ")}</div>
                </div>
              </div>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 10px; display: flex; gap: 6px;">
                ${opt.recommended ? `
                  <button class="btn btn-primary" style="flex: 1;" onclick="window.approveActionDirectly('ACT-501')">Approve Option</button>
                ` : `
                  <button class="btn btn-secondary" style="flex: 1;" onclick="navigateTo('scenario-simulator')">Simulate</button>
                `}
                <button class="btn-explain" onclick="openExplain('rec-1042')">Explain</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  window.approveActionDirectly = function(actId) {
    const action = data.actions.find(a => a.id === actId);
    if (action) {
      action.status = "Approved";
      data.auditTrail.unshift({
        id: `AUD-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        recommendationId: action.recommendationId,
        user: "Operations Manager (You)",
        action: `Approved Mitigation Action ${action.id}`,
        decisionType: "EXECUTE_MITIGATION",
        modelConfidence: 89,
        rationale: "Approved via Web Control Tower: Optimal risk reduction ROI.",
        auditStatus: "VERIFIED"
      });
      alert(`Action ${action.id} ("${action.title}") successfully approved and logged to Audit Trail!`);
      navigateTo("action-center");
    }
  };

  // 12. OPS COPILOT VIEW (CONVERSATIONAL AI)
  function renderOpsCopilotView() {
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>AI Operations Copilot</h1>
          <p>Context-aware reasoning assistant. Ask anything regarding suppliers, component buffers, plant constraints, and mitigation tradeoffs.</p>
        </div>
        <div class="page-actions">
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <input type="checkbox" id="copilot-mode-toggle" ${copilot.simplifiedMode ? 'checked' : ''}>
              "Explain like I'm new to supply chain"
            </label>
          </div>
        </div>
      </div>

      <div class="copilot-container">
        <!-- Chat History Card -->
        <div class="card copilot-chat-card">
          <div class="card-header">
            <div class="card-title">
              <span style="width: 8px; height: 8px; background: var(--risk-green); border-radius: 50%;"></span>
              Ops Copilot Active Session
            </div>
            <span class="status-pill neutral">Grounded in Synthetic Model</span>
          </div>

          <div class="chat-history" id="copilot-chat-history">
            ${state.copilotHistory.map(msg => renderChatMessageHTML(msg)).join("")}
          </div>

          <!-- Input Row -->
          <div class="chat-input-area">
            <input type="text" class="chat-input" id="copilot-user-input" placeholder="Ask about Plant 02, Supplier S102, inventory stockouts, or 'What should I do first?'..." autocomplete="off">
            <button class="btn btn-dark" id="copilot-send-btn">
              Send Query
            </button>
          </div>
        </div>

        <!-- Prompt Suggestions & Guardrails Sidebar -->
        <div class="card" style="display: flex; flex-direction: column; gap: 14px; padding: 16px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
              Executive Query Presets
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${[
                "Why is Plant 02 at risk?",
                "Which suppliers are currently high risk?",
                "What happens if Supplier S102 stops for 10 days?",
                "Which component could cause the next production stoppage?",
                "Which orders are likely to be delayed?",
                "What should I do first?",
                "Which mitigation action costs the least?",
                "Compare Supplier S102 and S108",
                "Summarize today's operational risks",
                "Explain OTIF and why it matters"
              ].map(q => `
                <button class="btn btn-secondary btn-xs" style="text-align: left; justify-content: flex-start;" onclick="window.submitCopilotQuery('${q}')">
                  ${q}
                </button>
              `).join("")}
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; font-size: 11px; color: var(--text-muted); line-height: 1.4;">
            <strong style="color: var(--text-primary);">Copilot Guardrails:</strong>
            <ul style="padding-left: 14px; margin-top: 4px;">
              <li>Strict distinction between FACT, PREDICTION, ASSUMPTION & RECOMMENDATION.</li>
              <li>No hallucination beyond active synthetic dataset.</li>
              <li>Does not claim proprietary Mahindra internal data.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Attach Input Event Listeners
    const input = document.getElementById("copilot-user-input");
    const sendBtn = document.getElementById("copilot-send-btn");
    const modeToggle = document.getElementById("copilot-mode-toggle");

    if (modeToggle) {
      modeToggle.addEventListener("change", (e) => {
        copilot.setSimplifiedMode(e.target.checked);
      });
    }

    if (sendBtn && input) {
      sendBtn.addEventListener("click", () => {
        const q = input.value.trim();
        if (q) {
          submitCopilotQuery(q);
          input.value = "";
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const q = input.value.trim();
          if (q) {
            submitCopilotQuery(q);
            input.value = "";
          }
        }
      });
    }

    scrollCopilotToBottom();
  }

  function renderChatMessageHTML(msg) {
    if (msg.sender === "user") {
      return `
        <div class="chat-bubble user">
          ${msg.text}
        </div>
      `;
    }

    // AI message with structured sections
    return `
      <div class="chat-bubble ai">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <strong style="font-size: 13px; color: var(--text-primary);">${msg.headline || "Ops Copilot Analysis"}</strong>
          <span class="status-pill neutral" style="font-size: 10px;">Confidence: ${msg.confidence}%</span>
        </div>
        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; white-space: pre-line;">
          ${msg.text}
        </div>

        ${msg.structured ? `
          <div class="fpar-container" style="margin-top: 10px;">
            <div class="fpar-box fact">
              <div class="fpar-box-label">FACT</div>
              <ul style="padding-left: 14px; margin: 0; font-size: 12px;">
                ${msg.structured.facts.map(f => `<li>${f}</li>`).join("")}
              </ul>
            </div>
            <div class="fpar-box prediction">
              <div class="fpar-box-label">PREDICTION</div>
              <ul style="padding-left: 14px; margin: 0; font-size: 12px;">
                ${msg.structured.predictions.map(p => `<li>${p}</li>`).join("")}
              </ul>
            </div>
            <div class="fpar-box assumption">
              <div class="fpar-box-label">ASSUMPTION</div>
              <ul style="padding-left: 14px; margin: 0; font-size: 12px;">
                ${msg.structured.assumptions.map(a => `<li>${a}</li>`).join("")}
              </ul>
            </div>
            <div class="fpar-box recommendation">
              <div class="fpar-box-label">RECOMMENDATION</div>
              <ul style="padding-left: 14px; margin: 0; font-size: 12px;">
                ${msg.structured.recommendations.map(r => `<li>${r}</li>`).join("")}
              </ul>
            </div>
          </div>
        ` : ''}

        ${msg.actions && msg.actions.length > 0 ? `
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
            ${msg.actions.map(act => {
              if (act.query) {
                return `<button class="btn btn-secondary btn-xs" onclick="window.submitCopilotQuery('${act.query}')">${act.label}</button>`;
              }
              if (act.action === "explain") {
                return `<button class="btn-explain btn-xs" onclick="openExplain('${act.target}')">${act.label}</button>`;
              }
              return `<button class="btn btn-secondary btn-xs" onclick="navigateTo('${act.target}')">${act.label}</button>`;
            }).join("")}
          </div>
        ` : ''}
      </div>
    `;
  }

  window.submitCopilotQuery = function(queryText) {
    state.copilotHistory.push({
      sender: "user",
      text: queryText
    });

    const resp = copilot.processQuery(queryText);
    state.copilotHistory.push({
      sender: "ai",
      ...resp
    });

    if (state.currentView === "ops-copilot") {
      const historyContainer = document.getElementById("copilot-chat-history");
      if (historyContainer) {
        historyContainer.innerHTML = state.copilotHistory.map(m => renderChatMessageHTML(m)).join("");
        scrollCopilotToBottom();
      }
    } else {
      navigateTo("ops-copilot");
    }
  };

  function scrollCopilotToBottom() {
    setTimeout(() => {
      const el = document.getElementById("copilot-chat-history");
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }

  // 13. ACTION CENTER (HUMAN-IN-THE-LOOP WORKFLOW)
  function renderActionCenterView() {
    const actions = data.actions;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Action Center & Governance Workflow</h1>
          <p>Human-in-the-Loop decision governance. High-impact operational interventions require explicit managerial signoff.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="navigateTo('audit-trail')">Inspect Audit Trail</button>
        </div>
      </div>

      <!-- Governance Policy Banner -->
      <div class="card" style="background: #f8fafc; margin-bottom: 20px;">
        <div class="card-body" style="padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div style="font-size: 12px; color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">Human-in-the-Loop Protocol:</strong> Automated actions are strictly limited to low-risk telemetry pings & monitoring tasks. Sourcing alterations, purchase orders, and plant schedule changes require authenticated human approval.
          </div>
          <span class="status-pill healthy">Governance Active</span>
        </div>
      </div>

      <!-- Action Tabs & Queue -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Intervention Action Queue</div>
          <div class="filter-chips-row" id="act-filter-chips">
            <span class="filter-chip active" data-status="all">All (${actions.length})</span>
            <span class="filter-chip" data-status="pending">Pending Approval (1)</span>
            <span class="filter-chip" data-status="approved">Approved (1)</span>
            <span class="filter-chip" data-status="in progress">In Progress (1)</span>
            <span class="filter-chip" data-status="completed">Completed (1)</span>
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Action ID</th>
                  <th>Action Directive</th>
                  <th>Assigned Owner</th>
                  <th>Priority</th>
                  <th>Incremental Cost</th>
                  <th>Protected Value</th>
                  <th>Deadline / SLA</th>
                  <th>Status</th>
                  <th>Approval Actions</th>
                </tr>
              </thead>
              <tbody id="actions-table-body">
                ${actions.map(act => renderActionRowHTML(act)).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    setupActionTableFilters();
  }

  function renderActionRowHTML(act) {
    const isPending = act.status.toLowerCase() === "pending approval";
    return `
      <tr>
        <td style="font-weight: 700; color: var(--text-muted);">${act.id}</td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${act.title}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${act.description}</div>
        </td>
        <td style="font-size: 12px;">${act.owner}</td>
        <td><span class="status-pill ${act.priority === 'CRITICAL' ? 'critical' : act.priority === 'HIGH' ? 'amber' : 'neutral'}">${act.priority}</span></td>
        <td style="font-weight: 600;">${act.cost}</td>
        <td style="font-weight: 700; color: var(--brand-primary);">${act.benefit}</td>
        <td style="font-size: 11px; color: var(--text-muted);">${act.deadline}</td>
        <td><span class="status-pill ${act.status.toLowerCase() === 'approved' ? 'healthy' : isPending ? 'amber' : 'neutral'}">${act.status}</span></td>
        <td>
          ${isPending ? `
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-primary btn-xs" onclick="window.approveActionDirectly('${act.id}')">Approve</button>
              <button class="btn btn-outline-danger btn-xs" onclick="window.rejectActionDirectly('${act.id}')">Reject</button>
            </div>
          ` : `
            <span style="font-size: 11px; color: var(--text-muted);">${act.auditNote || 'Locked'}</span>
          `}
        </td>
      </tr>
    `;
  }

  function setupActionTableFilters() {
    const chips = document.querySelectorAll("#act-filter-chips .filter-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const status = chip.getAttribute("data-status");
        const tbody = document.getElementById("actions-table-body");
        const filtered = status === "all" ? data.actions : data.actions.filter(a => a.status.toLowerCase().includes(status));
        tbody.innerHTML = filtered.map(a => renderActionRowHTML(a)).join("");
      });
    });
  }

  window.rejectActionDirectly = function(actId) {
    const action = data.actions.find(a => a.id === actId);
    if (action) {
      action.status = "Rejected";
      data.auditTrail.unshift({
        id: `AUD-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        recommendationId: action.recommendationId,
        user: "Operations Director (You)",
        action: `Rejected Action ${action.id}`,
        decisionType: "USER_OVERRIDE",
        modelConfidence: 89,
        rationale: "Managerial override: Rejected in favor of alternative maintenance timing.",
        auditStatus: "OVERRIDDEN"
      });
      alert(`Action ${action.id} rejected and logged to Audit Trail.`);
      renderActionCenterView();
    }
  };

  // 14. ANALYTICS & FEEDBACK LOOP
  function renderAnalyticsView() {
    const a = data.analytics;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Analytics & Active Learning Feedback Loop</h1>
          <p>Closed-loop model calibration tracking predicted vs actual operational disruptions over rolling time horizons.</p>
        </div>
      </div>

      <!-- AI Accuracy Scorecard -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Model Precision</span>
          <span class="kpi-value" style="color: var(--risk-green);">${a.accuracyMetrics.precision}%</span>
          <span class="kpi-change">True disruptions / flags</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Model Recall</span>
          <span class="kpi-value" style="color: var(--risk-green);">${a.accuracyMetrics.recall}%</span>
          <span class="kpi-change">Detected ahead of time</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">False Positive Rate</span>
          <span class="kpi-value">${a.accuracyMetrics.falsePositiveRate}%</span>
          <span class="kpi-change">Well below 5% target</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Mean Prediction Lead Time</span>
          <span class="kpi-value">${a.accuracyMetrics.meanLeadTimeDays} Days</span>
          <span class="kpi-change">Advance warning window</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Mitigation Success Rate</span>
          <span class="kpi-value" style="color: var(--risk-green);">${a.accuracyMetrics.mitigationSuccessRate}%</span>
          <span class="kpi-change">Disruptions arrested</span>
        </div>
      </div>

      <!-- Feedback Loop Architecture Card -->
      <div class="card" style="margin: 20px 0;">
        <div class="card-header">
          <div class="card-title">Continuous Model Calibration Flow</div>
        </div>
        <div class="card-body">
          <div style="display: flex; align-items: center; justify-content: space-between; overflow-x: auto; gap: 8px; font-size: 12px; font-weight: 600;">
            <div style="background: #f8fafc; border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: var(--radius-sm); text-align: center;">
              1. AI Prediction<br><span style="font-size: 11px; color: var(--text-muted); font-weight: normal;">Lead time drift forecast</span>
            </div>
            <span>→</span>
            <div style="background: #f8fafc; border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: var(--radius-sm); text-align: center;">
              2. Manager Decision<br><span style="font-size: 11px; color: var(--text-muted); font-weight: normal;">Approve / modify / override</span>
            </div>
            <span>→</span>
            <div style="background: #f8fafc; border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: var(--radius-sm); text-align: center;">
              3. Actual Outcome<br><span style="font-size: 11px; color: var(--text-muted); font-weight: normal;">Telemetry arrival verified</span>
            </div>
            <span>→</span>
            <div style="background: #f8fafc; border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: var(--radius-sm); text-align: center;">
              4. Error Calculation<br><span style="font-size: 11px; color: var(--text-muted); font-weight: normal;">Predicted vs Actual error</span>
            </div>
            <span>→</span>
            <div style="background: #f0fdf4; border: 1px solid var(--risk-green-border); color: var(--risk-green); padding: 10px 14px; border-radius: var(--radius-sm); text-align: center;">
              5. Model Calibration<br><span style="font-size: 11px; color: var(--text-muted); font-weight: normal;">Dynamic weight tuning</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Predicted vs Actual Disruption Historical Log -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Predicted vs Actual Disruption Validation Log</div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Prediction Date</th>
                  <th>Operational Event</th>
                  <th>Predicted Delay</th>
                  <th>Actual Delay</th>
                  <th>Variance / Error</th>
                  <th>Action Taken</th>
                  <th>Resulting Business Outcome</th>
                  <th>Validation</th>
                </tr>
              </thead>
              <tbody>
                ${a.predictedVsActual.map(pva => `
                  <tr>
                    <td style="font-weight: 700; color: var(--text-muted);">${pva.id}</td>
                    <td style="font-size: 12px;">${pva.predictionDate}</td>
                    <td style="font-weight: 600;">${pva.event}</td>
                    <td>${pva.predictedDelayDays} days</td>
                    <td>${pva.actualDelayDays} days</td>
                    <td style="font-weight: 700; color: ${Math.abs(pva.errorDays) < 1.0 ? 'var(--risk-green)' : 'var(--risk-amber)'};">
                      ${pva.errorDays > 0 ? '+' : ''}${pva.errorDays}d
                    </td>
                    <td style="font-size: 12px;">${pva.actionTaken}</td>
                    <td style="color: var(--risk-green); font-weight: 600;">${pva.outcome}</td>
                    <td><span class="status-pill healthy">Verified</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 15. AUDIT TRAIL VIEW
  function renderAuditTrailView() {
    const logs = data.auditTrail;
    pageContainer.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Governance Audit Trail & Decision Logs</h1>
          <p>Immutable record of AI recommendations, managerial approvals, overrides, and executed mitigations.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Event & Decision Compliance Register</div>
          <span class="status-pill neutral">100% Traceable</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Timestamp</th>
                  <th>Decision Maker / Agent</th>
                  <th>Executed Action</th>
                  <th>Decision Type</th>
                  <th>AI Confidence</th>
                  <th>Logged Rationale & Governance Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${logs.map(log => `
                  <tr>
                    <td style="font-weight: 700; color: var(--text-muted);">${log.id}</td>
                    <td style="font-size: 12px; font-family: var(--font-mono);">${log.timestamp}</td>
                    <td style="font-weight: 600;">${log.user}</td>
                    <td style="font-weight: 600; color: var(--text-primary);">${log.action}</td>
                    <td><span class="status-pill neutral">${log.decisionType}</span></td>
                    <td style="font-weight: 700;">${log.modelConfidence}%</td>
                    <td style="font-size: 12px; color: var(--text-secondary); max-width: 320px;">${log.rationale}</td>
                    <td><span class="status-pill ${log.auditStatus === 'VERIFIED' ? 'healthy' : log.auditStatus === 'OVERRIDDEN' ? 'amber' : 'info'}">${log.auditStatus}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Initialize Default View
  navigateTo("overview");
});
