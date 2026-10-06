/**
 * MAHINDRA OPSENTINEL AI - OPS COPILOT ENGINE
 * Intelligent Conversational AI for Operational Decision Support
 * 
 * Enforces structured responses:
 * - FACT
 * - PREDICTION
 * - ASSUMPTION
 * - RECOMMENDATION
 * 
 * Includes:
 * - Executive Analytical Mode vs "Explain like I'm new to supply chain" Mode
 * - Strict Hallucination & Proprietary Data Guardrails
 * - Contextual Action Triggers (Explain Why, Simulate, Risk Chain)
 */

class OpsCopilot {
  constructor(data) {
    this.data = data;
    this.simplifiedMode = false;
    this.chatHistory = [];
  }

  setSimplifiedMode(enabled) {
    this.simplifiedMode = enabled;
  }

  processQuery(rawQuery) {
    const query = rawQuery.trim().toLowerCase();

    // Guardrail: Proprietary / confidential data inquiries
    if (
      query.includes("confidential") ||
      query.includes("real internal data") ||
      query.includes("actual mahindra data") ||
      query.includes("proprietary financials")
    ) {
      return {
        replyType: "guardrail",
        headline: "Data Governance & Confidentiality Notice",
        text: "Mahindra Opsentinel AI operates strictly on a calibrated, high-fidelity synthetic operational model. This demonstration system does not connect to or expose proprietary or confidential internal enterprise data.",
        structured: null,
        confidence: 100,
        actions: []
      };
    }

    // Guardrail: Out of scope or ungrounded queries
    if (
      query.includes("stock market") ||
      query.includes("share price") ||
      query.includes("weather forecast in london") ||
      query.includes("bitcoin")
    ) {
      return {
        replyType: "out_of_scope",
        headline: "Query Out of Operational Scope",
        text: "I don't have enough information in the current operational dataset to answer that confidently. I can assist with suppliers, inventory, plant bottlenecks, transit corridors, customer order delivery risks, and scenario simulations.",
        structured: null,
        confidence: 95,
        actions: []
      };
    }

    // 1. Plant 02 Risk Query
    if (
      query.includes("plant 02") ||
      query.includes("plant 2") ||
      query.includes("nashik at risk")
    ) {
      return this.handlePlant02Query();
    }

    // 2. Inventory Risk Query
    if (
      query.includes("inventory risk") ||
      query.includes("stockout") ||
      query.includes("safety stock breach")
    ) {
      return this.handleInventoryQuery();
    }

    // 3. High Risk Suppliers Query
    if (
      query.includes("which suppliers") ||
      query.includes("high risk suppliers") ||
      query.includes("most risky supplier") ||
      query.includes("supplier risk")
    ) {
      return this.handleHighRiskSuppliersQuery();
    }

    // Specific simulation: What happens if Supplier S102 stops for 10/14 days?
    if (
      query.includes("stops for") ||
      query.includes("unavailable for") ||
      query.includes("s102 stops") ||
      query.includes("what if supplier s102") ||
      query.includes("what happens if")
    ) {
      return this.handleSupplierOutageSimulationQuery();
    }

    // Specific comparison: Compare Suppliers (S102 vs S108)
    if (
      (query.includes("compare") || query.includes("difference")) &&
      (query.includes("s102") || query.includes("s108"))
    ) {
      return this.handleCompareSuppliersQuery();
    }

    // Specific component stoppage query
    if (
      query.includes("which component") ||
      query.includes("next production stoppage") ||
      query.includes("next disruption")
    ) {
      return this.handleComponentStoppageQuery();
    }

    // Supplier S102 Specific Query
    if (
      query.includes("s102") ||
      query.includes("precision auto-cast")
    ) {
      return this.handleSupplierS102Query();
    }

    // 8. Which orders are likely to be delayed?
    if (
      query.includes("which orders") ||
      query.includes("orders delayed") ||
      query.includes("customer orders") ||
      query.includes("sla risk")
    ) {
      return this.handleOrdersDelayedQuery();
    }

    // 9. What should I do first? / Priority Action
    if (
      query.includes("what should i do first") ||
      query.includes("first action") ||
      query.includes("highest priority") ||
      query.includes("immediate action")
    ) {
      return this.handleWhatToDoFirstQuery();
    }

    // 10. Which mitigation action costs the least?
    if (
      query.includes("costs the least") ||
      query.includes("cheapest mitigation") ||
      query.includes("lowest cost")
    ) {
      return this.handleLowestCostMitigationQuery();
    }

    // 11. Summarize today's operational risks
    if (
      query.includes("summarize") ||
      query.includes("summary of risks") ||
      query.includes("overview") ||
      query.includes("today's risks")
    ) {
      return this.handleDailySummaryQuery();
    }

    // 12. Supply Chain Concepts (OTIF, OEE, Days of Supply, Safety Stock)
    if (query.includes("explain otif") || query.includes("what is otif")) {
      return this.handleConceptQuery("OTIF");
    }
    if (query.includes("explain oee") || query.includes("what is oee")) {
      return this.handleConceptQuery("OEE");
    }
    if (query.includes("explain safety stock") || query.includes("safety stock")) {
      return this.handleConceptQuery("Safety Stock");
    }
    if (query.includes("explain risk propagation") || query.includes("propagation")) {
      return this.handleConceptQuery("Risk Propagation");
    }

    // 13. Evidence behind recommendation
    if (
      query.includes("evidence") ||
      query.includes("recommendation") ||
      query.includes("r-1042")
    ) {
      return this.handleRecommendationEvidenceQuery();
    }

    // Default intelligent operational fallback based on keyword match
    return this.handleGeneralOperationalQuery(query);
  }

  // --- HANDLERS ---

  handlePlant02Query() {
    if (this.simplifiedMode) {
      return {
        replyType: "simplified",
        headline: "Why Plant 02 (Nashik) is in danger of stopping (Plain English)",
        text: "Plant 02 builds vehicles like Scorpio-N and XUV700. It is currently at risk because a key supplier in Pune (S102) is running 3 days late delivering the vehicle's engine 'brain' (Component C204 ECU). The factory only has 6 days worth of parts left. If we run out in 6 days, the assembly line will be forced to stop, delaying thousands of customer cars.",
        structured: {
          facts: [
            "We only have 6.2 days of ECU inventory left in the factory warehouse.",
            "Our main supplier S102 has been delivering late (OTIF dropped from 90% to 72%).",
            "The factory line is running at 94% speed with no extra slack."
          ],
          predictions: [
            "The assembly line will likely have to slow down by ~8.4% in 5 to 7 days."
          ],
          assumptions: [
            "Customer orders will keep coming in at the current festive rate."
          ],
          recommendations: [
            "Quickly order extra ECUs from our backup supplier (S108 in Bengaluru) and fly them in."
          ]
        },
        confidence: 89,
        actions: [
          { label: "Explain Why", action: "explain", target: "plant-02" },
          { label: "View Risk Chain", action: "navigate", target: "risk-network" },
          { label: "Simulate Solutions", action: "navigate", target: "scenario-simulator" }
        ]
      };
    }

    return {
      replyType: "analytical",
      headline: "Plant 02 (Nashik) Production Risk Analysis",
      text: "Plant 02 currently exhibits an elevated production risk index of 78/100 (Status: CRITICAL) with an estimated output deficit of 8.4% within 5–7 days.",
      structured: {
        facts: [
          "Component C204 (Engine ECU) inventory coverage has collapsed to 6.2 days (Safety Target: 10.0 days).",
          "Supplier S102 lead time expanded +23% (from 12.0d to 14.8d) while OTIF dropped by 18 points to 72%.",
          "Line 2 Powertrain Assembly capacity utilization is saturated at 96% with zero changeover buffer.",
          "SUV Platform Alpha demand increased +11% due to festive booking acceleration."
        ],
        predictions: [
          "Line 2 output will decline by 8.4% within 5–7 days, causing a monthly schedule shortfall of 1,560 vehicle units.",
          "Estimated financial revenue exposure is ₹1.8 Cr."
        ],
        assumptions: [
          "Supplier S102 will experience continued lead-time drift without direct intervention.",
          "Line 2 scrap and defect rates remain constant at current baseline (0.8%)."
        ],
        recommendations: [
          "Execute AI Recommendation #R-1042: Rebalance 30% procurement volume to qualified secondary Supplier S108.",
          "Expedite in-transit Batch #SH-2048 via dedicated priority cargo."
        ]
      },
      confidence: 89,
      actions: [
        { label: "Explain Calculation", action: "explain", target: "plant-02" },
        { label: "Inspect Evidence", action: "explain", target: "risk-s102" },
        { label: "Run Simulation", action: "navigate", target: "scenario-simulator" },
        { label: "Trace Propagation", action: "navigate", target: "risk-network" }
      ]
    };
  }

  handleInventoryQuery() {
    return {
      replyType: "analytical",
      headline: "Root Causes of Rising Inventory Risk (Score: 84 / 100 — RED)",
      text: "Enterprise Inventory Risk has escalated to 84/100, driven by acute buffer erosion in critical electronics and heavy engine castings.",
      structured: {
        facts: [
          "Component C204 days of supply is 6.2 days against a 10.0-day safety stock target (buffer deficit: -3.8 days).",
          "Component C102 (Crankcase Block) days of supply is 4.1 days at Plant 01 against an 8.0-day safety target.",
          "Total inventory value exposed to stockout disruption is ₹4.2 Cr across 4 key components."
        ],
        predictions: [
          "Component C204 stockout probability is 81% within 6 days.",
          "Component C102 stockout probability is 76% within 8 days."
        ],
        assumptions: [
          "Daily assembly consumption rates remain at 200 units/day (C204) and 150 units/day (C102).",
          "No unscheduled buffer transfers occur without procurement authorization."
        ],
        recommendations: [
          "Authorize emergency safety stock drawdown from Kolhapur auxiliary yard for C102.",
          "Split purchase order for C204 with 60 units/day diversion to Supplier S108."
        ]
      },
      confidence: 92,
      actions: [
        { label: "Explain Inventory Risk", action: "explain", target: "risk-c204" },
        { label: "View Inventory Table", action: "navigate", target: "inventory" },
        { label: "Simulate Safety Stock", action: "navigate", target: "scenario-simulator" }
      ]
    };
  }

  handleHighRiskSuppliersQuery() {
    return {
      replyType: "analytical",
      headline: "Supplier Vulnerability & Reliability Ranking",
      text: "Out of 64 active tier-1 suppliers, 8 are flagged at-risk, with 2 in the Critical/High threshold directly jeopardizing powertrain assembly.",
      structured: {
        facts: [
          "Supplier S102 (Precision Auto-Cast, Pune): Risk Score 82/100 (CRITICAL). OTIF: 72% (↓ 18%), Lead Time: 14.8d (↑ 23%), Capacity: 91%.",
          "Supplier S115 (Bharat Foundry, Coimbatore): Risk Score 76/100 (HIGH). Defect Scrap Rate: 4.8% (Tolerance 1.5%), Lead Time: 16.2d.",
          "Single-Source Fragility: Supplier S102 controls 72% of total supply for critical Engine ECU (Component C204)."
        ],
        predictions: [
          "Supplier S102 has an 82% probability of triggering plant disruption in 5–7 days.",
          "Supplier S115 delivery delays will breach Plant 01 safety buffer in 8 days."
        ],
        assumptions: [
          "Suppliers S102 and S115 lack internal excess tool capacity to recover without customer intervention."
        ],
        recommendations: [
          "Issue volume reallocation directive to qualified secondary Supplier S108 (Apex Microtech, Risk: 24/100).",
          "Dispatch quality metallurgy auditor to Coimbatore foundry (S115)."
        ]
      },
      confidence: 91,
      actions: [
        { label: "Inspect S102 Profile", action: "explain", target: "supplier-s102" },
        { label: "View Concentration Risk", action: "explain", target: "concentration-c204" },
        { label: "Supplier Directory", action: "navigate", target: "suppliers" }
      ]
    };
  }

  handleSupplierS102Query() {
    return {
      replyType: "analytical",
      headline: "Supplier S102 (Precision Auto-Cast Systems) Risk Profile",
      text: "Supplier S102 represents the single highest operational risk in the supply network today due to high capacity saturation and worsening lead-time variance.",
      structured: {
        facts: [
          "OTIF Performance: 72% (historical average 90%, down 18 points over 14 days).",
          "Average Lead Time: 14.8 days vs contractual target of 12.0 days (+23% inflation).",
          "Capacity Utilization: 91%, preventing rapid recovery or surge batches.",
          "Single-Source Concentration: Supplies 72% of Component C204."
        ],
        predictions: [
          "Will fail to deliver scheduled Batch #SH-2048 on time, resulting in a 2.8-day transit slip.",
          "Will trigger an 81% stockout probability at Plant 02 within 6.2 days."
        ],
        assumptions: [
          "Pune foundry furnace maintenance will restrict additional shifts for at least 10 days."
        ],
        recommendations: [
          "Approve Action ACT-501: Shift 30% volume to Supplier S108 (Apex Microtech).",
          "Expedite trailing lot via dedicated air freight (Cost: ₹4.2 Lakh, Protected: ₹1.65 Cr)."
        ]
      },
      confidence: 89,
      actions: [
        { label: "Explain Why S102 is Risky", action: "explain", target: "risk-s102" },
        { label: "Simulate S102 Outage", action: "navigate", target: "scenario-simulator" },
        { label: "Review Action Center", action: "navigate", target: "action-center" }
      ]
    };
  }

  handleCompareSuppliersQuery() {
    return {
      replyType: "analytical",
      headline: "Supplier Comparison: S102 (Incumbent) vs S108 (Alternate)",
      text: "Direct operational evaluation demonstrates that shifting volume to Supplier S108 significantly improves delivery reliability and stabilizes plant inventory.",
      structured: {
        facts: [
          "OTIF: Supplier S102 is at 72% (Declining) vs Supplier S108 at 94% (Stable/Healthy).",
          "Lead Time: S102 is 14.8 days (High variance) vs S108 at 8.5 days (Low variance).",
          "Capacity Headroom: S102 is saturated at 91% vs S108 at 68% (capable of absorbing +30% volume immediately).",
          "Quality Defect Rate: S102 is 2.1% vs S108 at 0.6%."
        ],
        predictions: [
          "Shifting 30% volume to S108 reduces stockout probability from 81% to 14%.",
          "Overall supply chain risk index drops by 68%."
        ],
        assumptions: [
          "Supplier S108 tooling calibration and PPAP qualification are pre-validated."
        ],
        recommendations: [
          "Execute volume rebalancing to 50% S102 / 40% S108 / 10% S115 to establish resilient dual-sourcing."
        ]
      },
      confidence: 94,
      actions: [
        { label: "View Supplier Comparison", action: "navigate", target: "suppliers" },
        { label: "Review Recommendation", action: "navigate", target: "recommendations" }
      ]
    };
  }

  handleComponentStoppageQuery() {
    return {
      replyType: "analytical",
      headline: "Imminent Stoppage Trigger: Component C204",
      text: "Component C204 (Powertrain Engine Control Unit) is the single most vulnerable component in the network, with the shortest time-to-disruption.",
      structured: {
        facts: [
          "Current on-hand inventory: 1,240 units.",
          "Daily production burn rate: 200 units/day.",
          "Days of supply remaining: 6.2 days (Safety Target: 10.0 days).",
          "Primary supplier delivery lead time: 14.8 days."
        ],
        predictions: [
          "Factory inventory will deplete to zero in exactly 6.2 days if no new receipts arrive.",
          "Stockout probability is evaluated at 81%."
        ],
        assumptions: [
          "Nashik Plant 02 maintains planned 2-shift assembly cadence."
        ],
        recommendations: [
          "Approve immediate procurement transfer #ACT-501 to divert 60 units/day to S108."
        ]
      },
      confidence: 93,
      actions: [
        { label: "Explain Component Risk", action: "explain", target: "risk-c204" },
        { label: "View Inventory Balance", action: "navigate", target: "inventory" }
      ]
    };
  }

  handleSupplierOutageSimulationQuery() {
    return {
      replyType: "analytical",
      headline: "Simulation Result: Supplier S102 Outage for 10–14 Days",
      text: "Simulating an unmitigated 14-day outage at Supplier S102 indicates severe operational failure across multiple vehicle programs.",
      structured: {
        facts: [
          "Baseline stock coverage at Plant 02 is 6.2 days.",
          "An outage of 14 days creates a net inventory deficit of 7.8 days of production."
        ],
        predictions: [
          "Plant 02 Line 2 will experience a complete shutdown starting Day 7.",
          "Total delayed finished vehicles: 2,840 units.",
          "Direct revenue exposure: ₹1.8 Cr (with downstream customer cancellation risk exceeding ₹22 Cr)."
        ],
        assumptions: [
          "No inventory reallocation occurs from secondary suppliers."
        ],
        recommendations: [
          "Do not remain in Status Quo. Activate Alternate Supplier S108 mitigation package immediately to avoid shutdown."
        ]
      },
      confidence: 96,
      actions: [
        { label: "Open Scenario Simulator", action: "navigate", target: "scenario-simulator" },
        { label: "Compare Mitigations", action: "navigate", target: "recommendations" }
      ]
    };
  }

  handleOrdersDelayedQuery() {
    return {
      replyType: "analytical",
      headline: "Customer Order Delay & SLA Risk Breakdown",
      text: "A total of 2,840 vehicle orders face imminent delivery delays if Component C204 is not expedited.",
      structured: {
        facts: [
          "Order ORD-89410 (1,250 units of Scorpio-N Z8L, North Zone): Promised Oct 14 vs Projected Oct 21 (+7 days delay). Risk: 84%.",
          "Order ORD-89411 (940 units of XUV700 AX7, West Zone): Promised Oct 16 vs Projected Oct 23 (+7 days delay). Risk: 79%.",
          "Order ORD-89412 (650 units of Thar Earth Edition, South Zone): Promised Oct 18 vs Projected Oct 24 (+6 days delay). Risk: 68%."
        ],
        predictions: [
          "Customer delivery SLA adherence will drop from 92.4% to 78.1% across high-margin SUV lines.",
          "Potential dealer stocking penalty exposure of ₹45 Lakh."
        ],
        assumptions: [
          "Dealer network cannot accommodate split deliveries without customer consent."
        ],
        recommendations: [
          "Prioritize VIN allocation for ORD-89410 immediately upon arrival of expedited Batch #SH-2105."
        ]
      },
      confidence: 88,
      actions: [
        { label: "View Orders Table", action: "navigate", target: "orders" },
        { label: "Review Mitigation", action: "navigate", target: "recommendations" }
      ]
    };
  }

  handleWhatToDoFirstQuery() {
    return {
      replyType: "analytical",
      headline: "Executive Priority: What To Do First",
      text: "The Operations Orchestrator identifies Action ACT-501 as the single highest priority requiring executive authorization within 36 hours.",
      structured: {
        facts: [
          "Action: Shift 30% C204 volume to Supplier S108 + air-expedite in-transit batch.",
          "Urgency: Only 6.2 days of stock left; supplier lead time is 8.5–14.8 days.",
          "Owner: Procurement Manager (Arun S.). Status: Pending Approval."
        ],
        predictions: [
          "Authorizing this action now reduces total enterprise disruption risk by 68% and protects 2,660 vehicle orders.",
          "Delaying authorization by >36 hours renders air-freight arrival too late to prevent line throttling."
        ],
        assumptions: [
          "Secondary Supplier S108 has uncommitted production capacity ready to receive purchase order."
        ],
        recommendations: [
          "Navigate to Action Center and click [Approve] on Action ACT-501."
        ]
      },
      confidence: 95,
      actions: [
        { label: "Go to Action Center", action: "navigate", target: "action-center" },
        { label: "Explain Recommendation", action: "explain", target: "rec-1042" }
      ]
    };
  }

  handleLowestCostMitigationQuery() {
    return {
      replyType: "analytical",
      headline: "Mitigation Cost Analysis & ROI Comparison",
      text: "While throttling low-priority lines has the lowest out-of-pocket cash cost (₹1.5L), shifting volume to S108 (₹4.2L) delivers 4.8x higher risk reduction and protects ₹1.65 Cr in revenue.",
      structured: {
        facts: [
          "Do Nothing: Cost ₹0, but causes ₹1.8 Cr direct revenue loss and 2,840 delayed orders.",
          "Throttle Lower Lines: Cost ₹1.5 Lakh, but delays 1,420 commercial vehicles.",
          "Shift 30% to S108: Cost ₹4.2 Lakh, reduces risk by 68%, protects ₹1.65 Cr revenue.",
          "Pure Air Expedite: Cost ₹11.8 Lakh, reduces risk by 45% (does not solve vendor root cause)."
        ],
        predictions: [
          "Shift to S108 yields the highest Net Protection ROI: ₹39.3 protected per ₹1 spent."
        ],
        assumptions: [
          "Expedited air-cargo charter rates remain locked at quoted ₹4.2 Lakh tariff."
        ],
        recommendations: [
          "Approve Option 2 (Shift to S108) as the optimal economic and operational decision."
        ]
      },
      confidence: 92,
      actions: [
        { label: "Compare All 5 Options", action: "navigate", target: "recommendations" },
        { label: "Open Scenario Simulator", action: "navigate", target: "scenario-simulator" }
      ]
    };
  }

  handleDailySummaryQuery() {
    return {
      replyType: "analytical",
      headline: "Daily Operations Intelligence Summary (Oct 06, 2026)",
      text: "Overall Supply Chain Health is at 78/100 (WATCH). 5 critical risks require management attention, focused primarily on Nashik SUV assembly.",
      structured: {
        facts: [
          "5 Critical Risks active across suppliers, inventory, production, and transit corridors.",
          "Plant 02 (Nashik) is running at 94% utilization with 6.2 days of ECU inventory remaining.",
          "Supplier S102 OTIF declined 18% to 72%; Carrier C12 delayed by 2.8 days on NH-48.",
          "Total exposure: 2,840 customer vehicle orders and ₹4.2 Cr inventory value at risk."
        ],
        predictions: [
          "Without intervention, assembly line throttling is predicted in 5–7 days.",
          "Executing approved mitigation package #R-1042 compresses risk to healthy baseline within 36 hours."
        ],
        assumptions: [
          "Weather delays along Western Ghats highway stabilize within 48 hours."
        ],
        recommendations: [
          "1. Approve Action ACT-501 (Supplier S108 volume rebalance).",
          "2. Monitor Carrier C12 bypass diversion via Solapur (ACT-503).",
          "3. Review quality audit deployment to Supplier S115 (ACT-502)."
        ]
      },
      confidence: 90,
      actions: [
        { label: "View Executive Overview", action: "navigate", target: "overview" },
        { label: "Open Action Center", action: "navigate", target: "action-center" }
      ]
    };
  }

  handleConceptQuery(conceptKey) {
    const item = this.data.glossary[conceptKey];
    if (!item) {
      return {
        replyType: "concept",
        headline: `Supply Chain Concept: ${conceptKey}`,
        text: `Information for ${conceptKey} is currently indexed in the control tower glossary.`,
        structured: null,
        confidence: 85,
        actions: []
      };
    }

    if (this.simplifiedMode) {
      return {
        replyType: "simplified",
        headline: `${item.term} — Explained Simply`,
        text: `${item.definition}\n\nWhy this matters in real life: ${item.whyItMatters}`,
        structured: {
          facts: [`Standard Calculation: ${item.formula}`],
          predictions: ["Tracking this metric warns operations teams weeks before factory lines get interrupted."],
          assumptions: ["Data is logged accurately from supplier manifests and factory dispatch slips."],
          recommendations: ["Check current scores on the Operations Overview page."]
        },
        confidence: 98,
        actions: [{ label: "View Overview", action: "navigate", target: "overview" }]
      };
    }

    return {
      replyType: "analytical",
      headline: item.term,
      text: `${item.definition}\n\n**Operational Significance:** ${item.whyItMatters}`,
      structured: {
        facts: [`Mathematical Formulation: ${item.formula}`],
        predictions: ["Deviations greater than 10% from baseline correlate with an 84% probability of downstream order delivery slippage."],
        assumptions: ["Telemetry feeds and ERP dispatch manifests are synchronized within an 8-minute freshness cycle."],
        recommendations: ["Maintain continuous threshold alerting at ±1.5 standard deviations."]
      },
      confidence: 98,
      actions: [{ label: "View Operational Dashboard", action: "navigate", target: "overview" }]
    };
  }

  handleRecommendationEvidenceQuery() {
    return {
      replyType: "analytical",
      headline: "Evidence Behind AI Recommendation #R-1042",
      text: "The recommendation to shift 30% volume to Supplier S108 is supported by multi-agent empirical evidence across supplier performance, stock burn rates, and capacity models.",
      structured: {
        facts: [
          "Supplier S102 OTIF declined from 90% to 72% (-18 points) over the last 14 days.",
          "Lead time expanded from 12.0 days to 14.8 days (+23% inflation).",
          "Component C204 coverage dropped from 10.0 days to 6.2 days (breaching safety buffer).",
          "Plant 02 Line 2 utilization is at 96% with zero changeover slack."
        ],
        predictions: [
          "Rebalancing 30% volume reduces stockout probability from 81% down to 14%.",
          "Protects ₹1.65 Cr in direct production margin and ensures on-time delivery for 2,660 vehicles."
        ],
        assumptions: [
          "Supplier S108 maintains current 94% OTIF reliability upon receiving additional purchase volume."
        ],
        recommendations: [
          "Procurement Manager approves Action ACT-501 in the Action Center."
        ]
      },
      confidence: 89,
      actions: [
        { label: "Explain Recommendation", action: "explain", target: "rec-1042" },
        { label: "Approve in Action Center", action: "navigate", target: "action-center" }
      ]
    };
  }

  handleGeneralOperationalQuery(query) {
    return {
      replyType: "analytical",
      headline: "Operational Intelligence Query",
      text: `Based on current operational telemetry, the primary driver across your supply chain is the component C204 bottleneck between Supplier S102 and Plant 02.`,
      structured: {
        facts: [
          "Overall health score: 78/100 (WATCH status).",
          "5 critical risks detected across 64 tier-1 suppliers and 4 assembly plants."
        ],
        predictions: [
          "Assembly line throttling at Nashik Plant 02 expected in 5–7 days without intervention."
        ],
        assumptions: [
          "Demand and operational parameters reflect current demo data state."
        ],
        recommendations: [
          "Review Recommendation #R-1042 to mitigate supplier risk, or launch the Scenario Simulator."
        ]
      },
      confidence: 85,
      actions: [
        { label: "View Overview", action: "navigate", target: "overview" },
        { label: "Open Simulator", action: "navigate", target: "scenario-simulator" }
      ]
    };
  }
}

// Export to window
window.OpsCopilot = OpsCopilot;
