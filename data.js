/**
 * MAHINDRA OPSENTINEL AI
 * Synthetic Operational Dataset & Digital Twin Knowledge Engine
 * 
 * DISCLAIMER: Conceptual prototype with realistic synthetic demo data.
 * Not an official Mahindra & Mahindra product or real proprietary data.
 */

const OPS_DATA = {
  meta: {
    systemName: "Mahindra Opsentinel AI",
    tagline: "Predict disruption. Protect production.",
    dataFreshness: "Demo Data • Updated 8 min ago",
    activeDate: "2026-10-06",
    organization: "Automotive & Farm Equipment Sector (Conceptual Model)",
    mode: "executive" // or "operational"
  },

  // Executive Top KPI Cards
  topKpis: {
    healthScore: { value: 78, max: 100, status: "WATCH", change: "-4 pts vs last week", explainId: "kpi-health" },
    criticalRisks: { value: 5, status: "CRITICAL", change: "+2 vs yesterday", explainId: "kpi-critical" },
    atRiskSuppliers: { value: 8, total: 64, status: "HIGH", change: "+1 in last 24h", explainId: "kpi-suppliers" },
    inventoryAtRisk: { value: "₹4.2 Cr", rawValue: 42000000, status: "HIGH", change: "Across 4 components", explainId: "kpi-inventory" },
    productionAtRisk: { value: "11%", status: "CRITICAL", change: "Plant 02 & Plant 01 exposure", explainId: "kpi-production" },
    ordersAtRisk: { value: "2,840", rawValue: 2840, status: "HIGH", change: "Delivery window in 5–12 days", explainId: "kpi-orders" }
  },

  // Operational Health Indicators
  healthPillars: [
    { id: "suppliers", name: "Suppliers", score: 68, max: 100, status: "AMBER", trend: "Declining", desc: "OTIF degradation across tier-1 casting & electronics", explainId: "pillar-suppliers" },
    { id: "inventory", name: "Inventory", score: 84, max: 100, status: "RED", trend: "High Risk", desc: "Critical buffer breaches on key engine ECUs & housings", explainId: "pillar-inventory" },
    { id: "production", name: "Production", score: 62, max: 100, status: "AMBER", trend: "Constrained", desc: "Line 2 assembly bottleneck in Nashik (Plant 02)", explainId: "pillar-production" },
    { id: "logistics", name: "Logistics", score: 79, max: 100, status: "RED", trend: "Disrupted", desc: "Corridor delay on NH-48 & coastal transit corridor", explainId: "pillar-logistics" },
    { id: "delivery", name: "Delivery", score: 71, max: 100, status: "AMBER", trend: "At Risk", desc: "2,840 customer vehicle orders vulnerable to SLA slip", explainId: "pillar-delivery" }
  ],

  // AI Early Warnings
  earlyWarnings: [
    {
      id: "EW-01",
      severity: "CRITICAL",
      title: "Production disruption predicted in 5–7 days",
      plant: "Plant 02 (Nashik)",
      product: "SUV Platform Alpha (Scorpio-N / XUV700)",
      probability: 87,
      confidence: 89,
      revenueExposure: "₹1.8 Cr",
      ordersAffected: 2840,
      evidence: [
        "Supplier S102 OTIF declined 18% over last 14 days",
        "Lead time increased 23% (from 12.0 to 14.8 days)",
        "Component C204 inventory coverage dropped to 6.2 days (safety target 10 days)",
        "Demand forecast increased 11% due to festive booking surge",
        "Plant 02 capacity utilization reached 94% with zero buffer"
      ],
      impactSummary: "Plant 02 Line 2 assembly output likely to drop by 8.4%, starving final dispatch.",
      recommendedAction: "Shift 30% C204 procurement volume to Supplier S108 and expedite in-transit Batch #SH-2048.",
      explainId: "risk-s102-c204"
    },
    {
      id: "EW-02",
      severity: "HIGH",
      title: "Hydraulic casting stockout risk at Plant 01 (Chakan)",
      plant: "Plant 01 (Chakan)",
      product: "Utility & Commercial Powertrain",
      probability: 74,
      confidence: 82,
      revenueExposure: "₹1.1 Cr",
      ordersAffected: 1420,
      evidence: [
        "Supplier S115 scrap defect rate jumped to 4.8% (tolerance 1.5%)",
        "Component C102 days of supply down to 4.1 days",
        "Reorder cycle delayed by 3.4 days due to raw pig iron price hold"
      ],
      impactSummary: "Line 1 powertrain assembly stoppage in 8 days unless secondary casting lots released.",
      recommendedAction: "Authorize emergency safety stock surge from Kolhapur buffer yard.",
      explainId: "risk-s115-c102"
    },
    {
      id: "EW-03",
      severity: "HIGH",
      title: "Carrier C12 transit corridor bottleneck on Western Highway",
      plant: "Plant 03 (Zaheerabad)",
      product: "Tractor & Farm Equipment Line",
      probability: 71,
      confidence: 85,
      revenueExposure: "₹75 Lakh",
      ordersAffected: 890,
      evidence: [
        "Heavy monsoon waterlogging reported near Panvel-Pune freight bypass",
        "In-transit shipment SH-2048 ETA delayed by 2.8 days",
        "Carrier historical on-time compliance dropped to 68%"
      ],
      impactSummary: "Component deliveries to Zaheerabad sub-assembly delayed beyond shift threshold.",
      recommendedAction: "Reroute trailing consignments via Solapur bypass corridor C-4.",
      explainId: "risk-c12-transit"
    }
  ],

  // What Changed Today Feed
  changeFeed: [
    { id: "CF-1", time: "18m ago", category: "Supplier", entity: "Supplier S102", change: "Average lead time increased +23% (14.8 days)", severity: "critical", explainId: "s102-leadtime" },
    { id: "CF-2", time: "42m ago", category: "Inventory", entity: "Component C204", change: "Inventory dipped below safety stock threshold (6.2d vs 10.0d target)", severity: "critical", explainId: "c204-stock" },
    { id: "CF-3", time: "1h 15m ago", category: "Production", entity: "Plant 02 (Nashik)", change: "Powertrain line utilization climbed to 94% (bottleneck threshold)", severity: "amber", explainId: "plant02-util" },
    { id: "CF-4", time: "2h 04m ago", category: "Logistics", entity: "Carrier C12", change: "Transit time +16% on NH-48 due to weather check-post delays", severity: "amber", explainId: "c12-delay" },
    { id: "CF-5", time: "3h 30m ago", category: "Supplier", entity: "Supplier S204", change: "OTIF improved +8% after tool-die recalibration", severity: "healthy", explainId: "s204-otif" },
    { id: "CF-6", time: "4h 10m ago", category: "Demand", entity: "Scorpio-N Platform", change: "Regional dealer order backlog surged +11% for Q3 festive buffer", severity: "amber", explainId: "demand-surge" }
  ],

  // External Disruption Signals (Synthetic Demo)
  externalSignals: [
    {
      id: "EXT-1",
      type: "Weather Disruption",
      title: "Ghats Highway Waterlogging Alert",
      region: "Western Maharashtra (Lonavala-Khandala belt)",
      severity: "High",
      impactCheck: "Affects NH-48 automotive corridor connecting Pune casting suppliers to Nashik plant.",
      activeSuppliersAffected: ["S102", "S204"],
      status: "Active monitoring"
    },
    {
      id: "EXT-2",
      type: "Port Congestion",
      title: "Nhava Sheva (JNPT) Terminal Dwell Spike",
      region: "Navi Mumbai Port",
      severity: "Medium",
      impactCheck: "Imported microcontroller IC lots facing +3.2 days customs dwell time.",
      activeSuppliersAffected: ["S108", "S402"],
      status: "Advisory"
    },
    {
      id: "EXT-3",
      type: "Commodity Volatility",
      title: "Special Alloy Cast Iron Spot Price Escalation (+9%)",
      region: "Domestic Metal Exchange",
      severity: "Medium",
      impactCheck: "Foundry suppliers experiencing raw material purchase hesitation.",
      activeSuppliersAffected: ["S115"],
      status: "Monitored"
    }
  ],

  // Suppliers Database
  suppliers: [
    {
      id: "S102",
      name: "Precision Auto-Cast Systems Ltd",
      location: "Pune, Maharashtra",
      region: "West",
      category: "Engine & Powertrain Modules",
      capacityUtilization: 91,
      otif: 72,
      otifTrend: -18,
      leadTime: 14.8,
      leadTimeBaseline: 12.0,
      leadTimeVar: 3.4,
      defectRate: 2.1,
      financialRisk: "Low",
      geographicRisk: "Medium (Monsoon Corridor)",
      riskScore: 82,
      status: "CRITICAL",
      componentsSupplied: ["C204", "C108"],
      plantsAffected: ["Plant 02 (Nashik)", "Plant 01 (Chakan)"],
      concentrationShare: 72, // 72% single-source share for C204
      performanceHistory: {
        months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        otif: [92, 90, 88, 81, 75, 72],
        leadTime: [11.8, 12.0, 12.4, 13.2, 14.1, 14.8],
        defect: [1.2, 1.4, 1.3, 1.8, 1.9, 2.1]
      },
      explainId: "supplier-s102"
    },
    {
      id: "S108",
      name: "Apex Microtech & Electronics Pvt",
      location: "Bengaluru, Karnataka",
      region: "South",
      category: "Powertrain Electronics & ECUs",
      capacityUtilization: 68,
      otif: 94,
      otifTrend: +2,
      leadTime: 8.5,
      leadTimeBaseline: 8.2,
      leadTimeVar: 0.9,
      defectRate: 0.6,
      financialRisk: "Very Low",
      geographicRisk: "Low",
      riskScore: 24,
      status: "HEALTHY",
      componentsSupplied: ["C204", "C410"],
      plantsAffected: ["Plant 02 (Nashik)", "Plant 03 (Zaheerabad)"],
      concentrationShare: 18,
      performanceHistory: {
        months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        otif: [93, 92, 94, 93, 95, 94],
        leadTime: [8.4, 8.3, 8.2, 8.5, 8.4, 8.5],
        defect: [0.7, 0.6, 0.6, 0.5, 0.7, 0.6]
      },
      explainId: "supplier-s108"
    },
    {
      id: "S115",
      name: "Bharat Foundry Consortium",
      location: "Coimbatore, Tamil Nadu",
      region: "South",
      category: "Heavy Castings & Blocks",
      capacityUtilization: 88,
      otif: 79,
      otifTrend: -9,
      leadTime: 16.2,
      leadTimeBaseline: 13.5,
      leadTimeVar: 2.8,
      defectRate: 4.8,
      financialRisk: "Medium",
      geographicRisk: "Low",
      riskScore: 76,
      status: "HIGH",
      componentsSupplied: ["C102", "C502"],
      plantsAffected: ["Plant 01 (Chakan)"],
      concentrationShare: 80,
      performanceHistory: {
        months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        otif: [88, 86, 84, 82, 80, 79],
        leadTime: [13.2, 13.5, 14.1, 14.8, 15.6, 16.2],
        defect: [1.8, 2.1, 2.6, 3.2, 4.1, 4.8]
      },
      explainId: "supplier-s115"
    },
    {
      id: "S204",
      name: "Deccan Forge & Machining Works",
      location: "Kolhapur, Maharashtra",
      region: "West",
      category: "Drivetrain Axles & Flanges",
      capacityUtilization: 74,
      otif: 89,
      otifTrend: +8,
      leadTime: 10.1,
      leadTimeBaseline: 11.0,
      leadTimeVar: 1.2,
      defectRate: 1.1,
      financialRisk: "Low",
      geographicRisk: "Low",
      riskScore: 32,
      status: "HEALTHY",
      componentsSupplied: ["C305", "C502"],
      plantsAffected: ["Plant 01 (Chakan)", "Plant 02 (Nashik)"],
      concentrationShare: 65,
      performanceHistory: {
        months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        otif: [82, 81, 83, 85, 87, 89],
        leadTime: [11.2, 11.0, 10.8, 10.5, 10.3, 10.1],
        defect: [1.6, 1.5, 1.4, 1.3, 1.2, 1.1]
      },
      explainId: "supplier-s204"
    },
    {
      id: "S301",
      name: "Sahyadri Precision Hydraulics",
      location: "Nashik, Maharashtra",
      region: "West",
      category: "Tractor Hydraulic Systems",
      capacityUtilization: 86,
      otif: 83,
      otifTrend: -4,
      leadTime: 12.0,
      leadTimeBaseline: 11.2,
      leadTimeVar: 1.9,
      defectRate: 1.8,
      financialRisk: "Medium",
      geographicRisk: "Low",
      riskScore: 58,
      status: "MEDIUM",
      componentsSupplied: ["C305"],
      plantsAffected: ["Plant 03 (Zaheerabad)", "Plant 04 (Haridwar)"],
      concentrationShare: 70,
      performanceHistory: {
        months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        otif: [89, 88, 86, 85, 84, 83],
        leadTime: [11.0, 11.2, 11.5, 11.8, 11.9, 12.0],
        defect: [1.2, 1.3, 1.4, 1.6, 1.7, 1.8]
      },
      explainId: "supplier-s301"
    },
    {
      id: "S402",
      name: "IndoSensors & Telematic Instruments",
      location: "Gurugram, Haryana",
      region: "North",
      category: "ADAS & Cockpit Instrumentation",
      capacityUtilization: 82,
      otif: 85,
      otifTrend: -3,
      leadTime: 9.8,
      leadTimeBaseline: 9.0,
      leadTimeVar: 1.4,
      defectRate: 0.9,
      financialRisk: "Low",
      geographicRisk: "Low",
      riskScore: 48,
      status: "MEDIUM",
      componentsSupplied: ["C410"],
      plantsAffected: ["Plant 01 (Chakan)", "Plant 04 (Haridwar)"],
      concentrationShare: 55,
      performanceHistory: {
        months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        otif: [88, 87, 88, 86, 85, 85],
        leadTime: [8.9, 9.0, 9.2, 9.5, 9.7, 9.8],
        defect: [0.8, 0.8, 0.7, 0.9, 0.9, 0.9]
      },
      explainId: "supplier-s402"
    }
  ],

  // Single Supplier Dependency Deep-Dive
  concentrationAnalysis: {
    componentId: "C204",
    componentName: "Engine Electronic Control Module (Alpha ECU)",
    riskSummary: "High supplier concentration risk (72% on S102). 82% of total supply originates from one geographic region (West Maharashtra).",
    shares: [
      { supplierId: "S102", name: "Precision Auto-Cast Systems", share: 72, status: "CRITICAL", leadTime: 14.8, otif: 72 },
      { supplierId: "S108", name: "Apex Microtech & Electronics", share: 18, status: "HEALTHY", leadTime: 8.5, otif: 94 },
      { supplierId: "S115", name: "Consortium Auxiliary", share: 10, status: "BACKUP", leadTime: 18.0, otif: 80 }
    ],
    recommendedMitigation: "Rebalance allocation to 50% S102 / 40% S108 / 10% S115 to compress single-source fragility by 58%."
  },

  // Inventory Database
  inventory: [
    {
      id: "C204",
      name: "Powertrain Engine Control Module (ECU)",
      category: "Electronics",
      plant: "Plant 02 (Nashik)",
      currentStock: 1240,
      dailyDemand: 200,
      daysOfSupply: 6.2,
      safetyStockTarget: 10.0,
      safetyStockQty: 2000,
      reorderPoint: 2800,
      supplierLeadTime: 14.8,
      stockoutProb: 81,
      stockValue: "₹1.48 Cr",
      status: "RED",
      primarySupplier: "S102",
      riskNote: "Below safety stock by 3.8 days. Stockout projected within 5–7 days without intervention."
    },
    {
      id: "C102",
      name: "Heavy Cylinder Crankcase Casting Block",
      category: "Castings",
      plant: "Plant 01 (Chakan)",
      currentStock: 620,
      dailyDemand: 150,
      daysOfSupply: 4.1,
      safetyStockTarget: 8.0,
      safetyStockQty: 1200,
      reorderPoint: 2200,
      supplierLeadTime: 16.2,
      stockoutProb: 76,
      stockValue: "₹92 Lakh",
      status: "RED",
      primarySupplier: "S115",
      riskNote: "Defect rate at foundry delaying secondary heats; buffer down to 4.1 days."
    },
    {
      id: "C305",
      name: "High-Pressure Hydraulic Cylinder Ram",
      category: "Hydraulics",
      plant: "Plant 03 (Zaheerabad)",
      currentStock: 1100,
      dailyDemand: 120,
      daysOfSupply: 9.2,
      safetyStockTarget: 10.0,
      safetyStockQty: 1200,
      reorderPoint: 1800,
      supplierLeadTime: 12.0,
      stockoutProb: 42,
      stockValue: "₹65 Lakh",
      status: "AMBER",
      primarySupplier: "S301",
      riskNote: "Borderline safety buffer; shipment SH-2048 in transit under carrier delay."
    },
    {
      id: "C410",
      name: "Radar & ADAS Sensor Fusion Module",
      category: "Sensors",
      plant: "Plant 02 (Nashik)",
      currentStock: 2450,
      dailyDemand: 180,
      daysOfSupply: 13.6,
      safetyStockTarget: 12.0,
      safetyStockQty: 2160,
      reorderPoint: 2600,
      supplierLeadTime: 8.5,
      stockoutProb: 14,
      stockValue: "₹1.85 Cr",
      status: "HEALTHY",
      primarySupplier: "S108",
      riskNote: "Adequate buffer coverage. Secondary sourcing active."
    },
    {
      id: "C502",
      name: "High-Tensile Sub-Chassis Crossmember",
      category: "Structural",
      plant: "Plant 04 (Haridwar)",
      currentStock: 3400,
      dailyDemand: 160,
      daysOfSupply: 21.2,
      safetyStockTarget: 14.0,
      safetyStockQty: 2240,
      reorderPoint: 2500,
      supplierLeadTime: 10.1,
      stockoutProb: 6,
      stockValue: "₹88 Lakh",
      status: "EXCESS",
      primarySupplier: "S204",
      riskNote: "Healthy buffer. Slight excess holding (+7.2 days over safety)."
    }
  ],

  // Production Plants Database
  plants: [
    {
      id: "P02",
      name: "Plant 02 — Nashik Automotive Division",
      location: "Nashik, Maharashtra",
      primaryProducts: "Scorpio-N, Thar 4x4, XUV700 Line 2",
      utilization: 94,
      oee: 81.2,
      downtimeHrsMonth: 14.5,
      planUnitsMonth: 18500,
      actualUnitsMonth: 16940,
      scheduleAdherence: 86.4,
      backlogUnits: 1560,
      materialAvailability: 78.4,
      bottleneckAlert: "Plant 02 is likely to miss production plan by 8.4% because Component C204 availability is declining.",
      status: "CRITICAL",
      lines: [
        { name: "Line 1 — Chassis & Body Shell", util: 89, status: "HEALTHY" },
        { name: "Line 2 — Powertrain & Engine Assembly", util: 96, status: "CRITICAL_BOTTLENECK" },
        { name: "Line 3 — Final Trim & QA Testing", util: 88, status: "HEALTHY" }
      ],
      bottleneckReasons: [
        "Component C204 inventory below safety threshold (6.2 days)",
        "Line 2 utilization at 96% with zero changeover headroom",
        "Supplier S102 lead-time deterioration (+23%)"
      ],
      explainId: "plant-02"
    },
    {
      id: "P01",
      name: "Plant 01 — Chakan Heavy Vehicle Facility",
      location: "Chakan, Pune",
      primaryProducts: "XUV700 Platform, Commercial Powertrains",
      utilization: 88,
      oee: 83.5,
      downtimeHrsMonth: 9.8,
      planUnitsMonth: 21000,
      actualUnitsMonth: 20150,
      scheduleAdherence: 91.2,
      backlogUnits: 850,
      materialAvailability: 83.1,
      bottleneckAlert: "Crankcase casting C102 shortage threatening Line 1 assembly rate in next 8 days.",
      status: "AMBER",
      lines: [
        { name: "Line 1 — Engine Machining", util: 91, status: "WATCH" },
        { name: "Line 2 — BIW Robotic Weld", util: 87, status: "HEALTHY" },
        { name: "Line 3 — Final Assembly", util: 86, status: "HEALTHY" }
      ],
      bottleneckReasons: [
        "Supplier S115 casting scrap rates spiked to 4.8%",
        "Buffer inventory C102 down to 4.1 days"
      ],
      explainId: "plant-01"
    },
    {
      id: "P03",
      name: "Plant 03 — Zaheerabad Farm & Utility Facility",
      location: "Zaheerabad, Telangana",
      primaryProducts: "Farm Equipment, Tractors & Utility Transporters",
      utilization: 82,
      oee: 86.0,
      downtimeHrsMonth: 6.2,
      planUnitsMonth: 14000,
      actualUnitsMonth: 13780,
      scheduleAdherence: 94.6,
      backlogUnits: 320,
      materialAvailability: 89.5,
      bottleneckAlert: "Hydraulic cylinder delivery transit watch (Shipment SH-2048).",
      status: "AMBER",
      lines: [
        { name: "Line 1 — Transmission & Axle", util: 80, status: "HEALTHY" },
        { name: "Line 2 — Tractor Assembly", util: 84, status: "WATCH" }
      ],
      bottleneckReasons: [
        "Carrier C12 transit slip due to western corridor monsoon congestion"
      ],
      explainId: "plant-03"
    },
    {
      id: "P04",
      name: "Plant 04 — Haridwar Manufacturing Hub",
      location: "Haridwar, Uttarakhand",
      primaryProducts: "Bolero Neo, Commercial Pickups",
      utilization: 79,
      oee: 88.4,
      downtimeHrsMonth: 4.1,
      planUnitsMonth: 12500,
      actualUnitsMonth: 12410,
      scheduleAdherence: 97.2,
      backlogUnits: 110,
      materialAvailability: 96.0,
      bottleneckAlert: "Operations running smoothly within target tolerances.",
      status: "HEALTHY",
      lines: [
        { name: "Line 1 — Pickup Assembly", util: 78, status: "HEALTHY" },
        { name: "Line 2 — Stamping & Frame", util: 80, status: "HEALTHY" }
      ],
      bottleneckReasons: [],
      explainId: "plant-04"
    }
  ],

  // In-Transit Shipments Database
  shipments: [
    {
      id: "SH-2048",
      supplierId: "S102",
      supplierName: "Precision Auto-Cast Ltd",
      component: "C204 (ECU Lots)",
      origin: "Pune Hub",
      destination: "Plant 02 (Nashik)",
      carrier: "C12 Express Freight",
      dispatchDate: "2026-10-04",
      baselineEta: "2026-10-06 18:00",
      expectedEta: "2026-10-09 14:00",
      delayProb: 74,
      expectedDelayDays: 2.8,
      routeRisk: "High (NH-48 Corridor Rain Disruption)",
      status: "DELAYED",
      reason: "Regional highway waterlogging + carrier fleet scheduling backlog",
      criticality: "CRITICAL",
      units: 400
    },
    {
      id: "SH-1932",
      supplierId: "S115",
      supplierName: "Bharat Foundry Consortium",
      component: "C102 (Crankcase Castings)",
      origin: "Coimbatore Hub",
      destination: "Plant 01 (Chakan)",
      carrier: "C08 South Logistics",
      dispatchDate: "2026-10-03",
      baselineEta: "2026-10-07 10:00",
      expectedEta: "2026-10-08 22:00",
      delayProb: 58,
      expectedDelayDays: 1.5,
      routeRisk: "Medium",
      status: "AT_RISK",
      reason: "Foundry secondary inspection signoff delayed dispatch by 24h",
      criticality: "HIGH",
      units: 300
    },
    {
      id: "SH-2105",
      supplierId: "S108",
      supplierName: "Apex Microtech & Electronics",
      component: "C204 (ECU Secondary Lot)",
      origin: "Bengaluru Hub",
      destination: "Plant 02 (Nashik)",
      carrier: "C04 Air-Express Cargo",
      dispatchDate: "2026-10-05",
      baselineEta: "2026-10-07 14:00",
      expectedEta: "2026-10-07 16:30",
      delayProb: 12,
      expectedDelayDays: 0.1,
      routeRisk: "Low (Air Freight Corridor)",
      status: "ON_TIME",
      reason: "Dedicated air express transit operating without impediment",
      criticality: "HEALTHY",
      units: 250
    },
    {
      id: "SH-2089",
      supplierId: "S204",
      supplierName: "Deccan Forge & Machining",
      component: "C502 (Crossmember Bars)",
      origin: "Kolhapur Hub",
      destination: "Plant 04 (Haridwar)",
      carrier: "C18 North-South Cargo",
      dispatchDate: "2026-10-02",
      baselineEta: "2026-10-08 08:00",
      expectedEta: "2026-10-08 11:00",
      delayProb: 18,
      expectedDelayDays: 0.2,
      routeRisk: "Low",
      status: "ON_TIME",
      reason: "Transit on schedule via dedicated multi-axle freight carrier",
      criticality: "HEALTHY",
      units: 600
    }
  ],

  // Customer Orders & Delivery Database
  ordersSummary: {
    totalAtRisk: 2840,
    portfolioOtif: 84.2,
    fillRate: 88.5,
    backlogValue: "₹14.6 Cr",
    slaRiskLevel: "ELEVATED",
    explainId: "orders-summary"
  },
  orders: [
    {
      id: "ORD-89410",
      product: "Scorpio-N Z8L Diesel AT",
      plant: "Plant 02 (Nashik)",
      quantity: 1250,
      customerRegion: "North Zone (NCR & Punjab)",
      promisedDate: "2026-10-14",
      expectedDate: "2026-10-21",
      delayProb: 84,
      priority: "CRITICAL",
      revenueExposure: "₹22.5 Cr",
      rootCause: "Component C204 stockout risk on Line 2",
      status: "AT_RISK"
    },
    {
      id: "ORD-89411",
      product: "XUV700 AX7 AWD",
      plant: "Plant 02 (Nashik)",
      quantity: 940,
      customerRegion: "West Zone (Maharashtra & Gujarat)",
      promisedDate: "2026-10-16",
      expectedDate: "2026-10-23",
      delayProb: 79,
      priority: "CRITICAL",
      revenueExposure: "₹18.8 Cr",
      rootCause: "ECU allocation competition with Scorpio-N",
      status: "AT_RISK"
    },
    {
      id: "ORD-89412",
      product: "Thar Earth Edition 4x4",
      plant: "Plant 02 (Nashik)",
      quantity: 650,
      customerRegion: "South Zone (Bengaluru & Hyderabad)",
      promisedDate: "2026-10-18",
      expectedDate: "2026-10-24",
      delayProb: 68,
      priority: "HIGH",
      revenueExposure: "₹10.4 Cr",
      rootCause: "Line 2 powertrain schedule compression",
      status: "AT_RISK"
    },
    {
      id: "ORD-89304",
      product: "Bolero Neo N10 Utility",
      plant: "Plant 04 (Haridwar)",
      quantity: 820,
      customerRegion: "Central Zone (MP & UP)",
      promisedDate: "2026-10-15",
      expectedDate: "2026-10-15",
      delayProb: 9,
      priority: "MEDIUM",
      revenueExposure: "₹7.4 Cr",
      rootCause: "None - Stock buffer healthy",
      status: "ON_TRACK"
    },
    {
      id: "ORD-89218",
      product: "Mahindra Yuvo 575 DI Tractor",
      plant: "Plant 03 (Zaheerabad)",
      quantity: 450,
      customerRegion: "AP & Telangana Agro Dealerships",
      promisedDate: "2026-10-17",
      expectedDate: "2026-10-19",
      delayProb: 38,
      priority: "MEDIUM",
      revenueExposure: "₹3.2 Cr",
      rootCause: "Hydraulic cylinder transit delay watch",
      status: "WATCH"
    }
  ],

  // Comprehensive Risk Matrix Database
  riskMatrix: [
    {
      id: "R-101",
      title: "Supplier S102 OTIF & Lead Time Disruption",
      category: "Supplier",
      entity: "Supplier S102 (Pune)",
      probability: 82,
      impact: 88, // on 0-100 scale, maps to ₹1.8 Cr
      impactAmount: "₹1.8 Cr",
      timeToImpact: "5–7 days",
      confidence: 89,
      severity: "CRITICAL",
      affectedEntities: ["Component C204", "Plant 02", "Line 2", "SUV Scorpio-N", "2,840 Orders"],
      evidence: [
        "OTIF declined 18% over 14 days (down to 72%)",
        "Lead time inflated from 12.0d to 14.8d (+23%)",
        "Capacity utilization is 91% leaving zero surge capacity"
      ],
      propagationSummary: "Supplier delay → C204 ECU stockout in 6.2d → Plant 02 Line 2 output -8.4% → 2,840 customer delivery delays",
      recommendedAction: "Shift 30% volume to Supplier S108 + air-expedite trailing consignment.",
      explainId: "risk-s102"
    },
    {
      id: "R-102",
      title: "Component C204 Safety Stock Depletion",
      category: "Inventory",
      entity: "Component C204 (Nashik Store)",
      probability: 81,
      impact: 84,
      impactAmount: "₹1.48 Cr",
      timeToImpact: "5–7 days",
      confidence: 92,
      severity: "CRITICAL",
      affectedEntities: ["Plant 02 (Nashik)", "Line 2", "ORD-89410", "ORD-89411"],
      evidence: [
        "Current stock 1,240 units against 200 units/day consumption",
        "Days of supply = 6.2d vs target safety buffer 10.0d",
        "Demand forecast increased +11% for Q3 festive build"
      ],
      propagationSummary: "Inventory buffer exhaustion → assembly line starve → ₹1.48 Cr production inventory exposure",
      recommendedAction: "Release secondary allocation order to S108 and draw down regional buffer.",
      explainId: "risk-c204"
    },
    {
      id: "R-103",
      title: "Plant 02 Line 2 Powertrain Bottleneck",
      category: "Production",
      entity: "Plant 02 (Nashik)",
      probability: 76,
      impact: 85,
      impactAmount: "₹1.65 Cr",
      timeToImpact: "6–9 days",
      confidence: 87,
      severity: "CRITICAL",
      affectedEntities: ["Line 2 Powertrain", "Scorpio-N", "XUV700", "2,840 Orders"],
      evidence: [
        "Line 2 running at 96% utilization with no changeover slack",
        "C204 component starve projected to force line throttling by 8.4%",
        "Backlog accumulation rate: +180 vehicles/day under shortage"
      ],
      propagationSummary: "Throttled output → monthly target deficit of 1,560 units → SLA breach on tier-1 dealerships",
      recommendedAction: "Execute weekend overtime shift + reallocate non-critical trim lines.",
      explainId: "risk-plant02"
    },
    {
      id: "R-104",
      title: "Foundry S115 Quality Scrap Rate Anomaly",
      category: "Supplier",
      entity: "Supplier S115 (Coimbatore)",
      probability: 74,
      impact: 70,
      impactAmount: "₹1.1 Cr",
      timeToImpact: "8–11 days",
      confidence: 83,
      severity: "HIGH",
      affectedEntities: ["Component C102", "Plant 01 (Chakan)", "Line 1 Engine"],
      evidence: [
        "Defect scrap rate surged from 1.8% to 4.8%",
        "Supplier capacity tight at 88%",
        "Chakan buffer down to 4.1 days"
      ],
      propagationSummary: "Scrap defect → delayed delivery heats → C102 stockout in 4.1d → Chakan engine line slowdown",
      recommendedAction: "Deploy technical quality liaison to Coimbatore foundry and authorize alternate Kolhapur forge buffer.",
      explainId: "risk-s115"
    },
    {
      id: "R-105",
      title: "Carrier C12 NH-48 Corridor Transit Congestion",
      category: "Logistics",
      entity: "Carrier C12 (Consignment SH-2048)",
      probability: 71,
      impact: 65,
      impactAmount: "₹75 Lakh",
      timeToImpact: "2–3 days",
      confidence: 85,
      severity: "HIGH",
      affectedEntities: ["Shipment SH-2048", "Plant 02", "Plant 03"],
      evidence: [
        "Transit delay variance +2.8 days",
        "Weather alert on Western Ghats expressway pass",
        "Carrier OTIF compliance down to 68%"
      ],
      propagationSummary: "Transit delay → in-transit stock locked → delayed plant receipt → inventory buffer drain",
      recommendedAction: "Reroute subsequent cargo through bypass dry port and expedite via express dedicated van.",
      explainId: "risk-c12"
    },
    {
      id: "R-106",
      title: "Festive Season SUV Platform Demand Surge (+11%)",
      category: "Demand",
      entity: "Scorpio-N / XUV700 Platform",
      probability: 68,
      impact: 62,
      impactAmount: "₹90 Lakh",
      timeToImpact: "10–15 days",
      confidence: 88,
      severity: "MEDIUM",
      affectedEntities: ["Dealer Network", "Plant 02", "Plant 01"],
      evidence: [
        "Dealership bookings surged +11% above rolling 90-day baseline",
        "Production buffer depleted by 320 units",
        "Tier-1 supplier capacity already >90%"
      ],
      propagationSummary: "Surge demand → accelerates component consumption → shortens days of supply from 8.5 to 6.2",
      recommendedAction: "Adjust master production schedule (MPS) and prioritize high-margin VIN variants.",
      explainId: "risk-demand"
    },
    {
      id: "R-107",
      title: "North-West Dealership Order SLA Breach Risk",
      category: "Delivery",
      entity: "Order Batch ORD-89410 (1,250 units)",
      probability: 79,
      impact: 82,
      impactAmount: "₹22.5 Cr",
      timeToImpact: "8–14 days",
      confidence: 90,
      severity: "HIGH",
      affectedEntities: ["North Zone Dealers", "Customer Satisfaction Index (CSI)"],
      evidence: [
        "Promised dispatch Oct 14 vs projected dispatch Oct 21 (+7 days slip)",
        "Line 2 assembly bottleneck in Nashik directly delays VIN assignment",
        "Penalty SLA clause on dealer stocking loans"
      ],
      propagationSummary: "Line 2 delay → finished vehicle yard deficit → missed customer delivery dates",
      recommendedAction: "Notify regional managers, prioritize batch VINs as soon as alternate C204 lot lands.",
      explainId: "risk-orders"
    }
  ],

  // Supply Chain Risk Network Topology
  network: {
    nodes: [
      // Suppliers
      { id: "S102", name: "S102: Precision Auto-Cast", type: "supplier", risk: 82, status: "CRITICAL", x: 60, y: 80, info: "OTIF 72% (-18%), Lead Time 14.8d (+23%)" },
      { id: "S108", name: "S108: Apex Microtech", type: "supplier", risk: 24, status: "HEALTHY", x: 60, y: 190, info: "OTIF 94%, Lead Time 8.5d, Qualified Backup" },
      { id: "S115", name: "S115: Bharat Foundry", type: "supplier", risk: 76, status: "HIGH", x: 60, y: 300, info: "Scrap 4.8%, Lead Time 16.2d, Casting Block" },
      { id: "S204", name: "S204: Deccan Forge", type: "supplier", risk: 32, status: "HEALTHY", x: 60, y: 410, info: "OTIF 89%, Lead Time 10.1d, Axle Flanges" },
      // Components
      { id: "C204", name: "C204: Engine ECU", type: "component", risk: 81, status: "CRITICAL", x: 230, y: 110, info: "Days of supply: 6.2d (Target 10d), Stockout in 5-7d" },
      { id: "C102", name: "C102: Crankcase Block", type: "component", risk: 76, status: "HIGH", x: 230, y: 260, info: "Days of supply: 4.1d (Target 8d), Quality hold" },
      { id: "C305", name: "C305: Hydraulic Ram", type: "component", risk: 42, status: "AMBER", x: 230, y: 390, info: "Days of supply: 9.2d, In-transit watch" },
      // Plants
      { id: "P02", name: "Plant 02 (Nashik)", type: "plant", risk: 78, status: "CRITICAL", x: 400, y: 120, info: "Line 2 Powertrain bottleneck, 94% util, -8.4% plan" },
      { id: "P01", name: "Plant 01 (Chakan)", type: "plant", risk: 65, status: "AMBER", x: 400, y: 270, info: "Line 1 Engine machining watch, 88% util" },
      { id: "P03", name: "Plant 03 (Zaheerabad)", type: "plant", risk: 45, status: "AMBER", x: 400, y: 400, info: "Tractor line, 82% util, transit dependent" },
      // Production Lines
      { id: "L2", name: "Line 2: Powertrain Assy", type: "line", risk: 86, status: "CRITICAL", x: 570, y: 120, info: "Line utilization 96%, starving in 6 days" },
      { id: "L1", name: "Line 1: Engine Machining", type: "line", risk: 62, status: "AMBER", x: 570, y: 270, info: "Scrap risk from S115 casting inputs" },
      // Warehouses
      { id: "W03", name: "Warehouse W03 (Central)", type: "warehouse", risk: 72, status: "HIGH", x: 730, y: 140, info: "Vehicle buffer depleted to 1.8 days supply" },
      { id: "W01", name: "Warehouse W01 (Pune Hub)", type: "warehouse", risk: 38, status: "HEALTHY", x: 730, y: 320, info: "Standard buffer stock intact" },
      // Transportation / Carriers
      { id: "T12", name: "Carrier C12 Express", type: "carrier", risk: 71, status: "HIGH", x: 880, y: 140, info: "NH-48 corridor weather delay (+2.8 days)" },
      { id: "T08", name: "Carrier C08 Freight", type: "carrier", risk: 40, status: "HEALTHY", x: 880, y: 320, info: "Regular transit corridor" },
      // Customer Orders
      { id: "ORD", name: "Customer Orders (2,840)", type: "order", risk: 84, status: "CRITICAL", x: 1040, y: 200, info: "SLA delivery slip risk, ₹22.5 Cr exposure" }
    ],
    links: [
      { from: "S102", to: "C204", isCritical: true, note: "Primary single-source supplier (72% share)" },
      { from: "S108", to: "C204", isCritical: false, note: "Secondary supplier (18% share)" },
      { from: "S115", to: "C102", isCritical: true, note: "Primary casting foundry (80% share)" },
      { from: "S204", to: "C305", isCritical: false, note: "Drivetrain components" },
      { from: "C204", to: "P02", isCritical: true, note: "Critical powertrain input" },
      { from: "C102", to: "P01", isCritical: true, note: "Crankcase assembly input" },
      { from: "C305", to: "P03", isCritical: false, note: "Hydraulics assembly input" },
      { from: "P02", to: "L2", isCritical: true, note: "Line 2 Powertrain dependency" },
      { from: "P01", to: "L1", isCritical: false, note: "Line 1 Engine dependency" },
      { from: "L2", to: "W03", isCritical: true, note: "Finished vehicles to Central Hub" },
      { from: "L1", to: "W01", isCritical: false, note: "Commercial vehicles to Hub 01" },
      { from: "W03", to: "T12", isCritical: true, note: "Dispatch via C12 Express" },
      { from: "W01", to: "T08", isCritical: false, note: "Dispatch via C08 Freight" },
      { from: "T12", to: "ORD", isCritical: true, note: "Customer vehicle delivery commitment" },
      { from: "T08", to: "ORD", isCritical: false, note: "Fleet delivery commitment" }
    ]
  },

  // Dedicated Risk Propagation Flow Data
  riskPropagationEngine: {
    title: "End-to-End Operational Risk Propagation Model",
    subtitle: "Traces how upstream vendor volatility cascades into finished vehicle delivery failure.",
    stages: [
      {
        step: 1,
        stage: "UPSTREAM EVENT",
        entity: "Supplier S102 Delays",
        metric: "OTIF: 72% (↓ 18%) | Lead Time: 14.8d (↑ 23%)",
        description: "Sub-tier wafer component delay at Pune casting unit cascades into shipment delivery backlogs.",
        severity: "CRITICAL",
        riskScore: 82
      },
      {
        step: 2,
        stage: "COMPONENT BUFFER",
        entity: "Component C204 (Engine ECU)",
        metric: "Coverage: 6.2 Days (Safety Target: 10.0 Days)",
        description: "Buffer drops below reorder point (2,800 units). Daily consumption outpaces receipts by 60 units/day.",
        severity: "CRITICAL",
        riskScore: 81
      },
      {
        step: 3,
        stage: "MANUFACTURING PLANT",
        entity: "Plant 02 — Nashik Line 2",
        metric: "Capacity Utilization: 94% | Output Deficit: -8.4%",
        description: "Zero changeover buffer. Line 2 assembly throttle predicted in 5–7 days without stock replenishment.",
        severity: "CRITICAL",
        riskScore: 86
      },
      {
        step: 4,
        stage: "FINISHED GOODS & ORDERS",
        entity: "Customer Vehicle Fulfillment",
        metric: "2,840 Orders at SLA Risk | Exposure: ₹1.8 Cr Direct Loss",
        description: "Scorpio-N and XUV700 batches ORD-89410 and ORD-89411 slip beyond promised dealer delivery dates.",
        severity: "CRITICAL",
        riskScore: 84
      }
    ]
  },

  // Scenario Simulator Presets & Defaults
  scenarioPresets: [
    {
      id: "PRE-01",
      name: "Supplier S102 Outage (14 Days)",
      description: "Complete 14-day production freeze at Supplier S102 due to furnace re-lining.",
      params: { supplierDaysOut: 14, demandIncreasePct: 0, transitDelayDays: 0, plantCapacityCutPct: 0, safetyBufferDays: 10 }
    },
    {
      id: "PRE-02",
      name: "Monsoon Transit Corridor Disruption (+5 Days)",
      description: "Severe weather causes 5-day closure of Western Ghats logistics artery.",
      params: { supplierDaysOut: 0, demandIncreasePct: 0, transitDelayDays: 5, plantCapacityCutPct: 0, safetyBufferDays: 10 }
    },
    {
      id: "PRE-03",
      name: "Festive Season SUV Demand Spike (+25%)",
      description: "Festive sales drive unexpected 25% surge in Scorpio-N and XUV700 orders.",
      params: { supplierDaysOut: 0, demandIncreasePct: 25, transitDelayDays: 0, plantCapacityCutPct: 0, safetyBufferDays: 10 }
    },
    {
      id: "PRE-04",
      name: "Plant 02 Substation Transformer Failure (-30% Capacity)",
      description: "Plant 02 Line 2 power constraint slashes plant capacity by 30% for 10 days.",
      params: { supplierDaysOut: 0, demandIncreasePct: 0, transitDelayDays: 0, plantCapacityCutPct: 30, safetyBufferDays: 10 }
    }
  ],

  // AI Mitigation Recommendations & Comparison Engine
  mitigationOptions: [
    {
      id: "MIT-01",
      name: "Do Nothing (Status Quo)",
      recommended: false,
      cost: "₹0",
      costNum: 0,
      riskReductionPct: 0,
      productionImpactPct: -8.4,
      deliveryDelayOrders: 2840,
      revenueProtected: "₹0",
      revenueLost: "₹1.8 Cr",
      timeToImplement: "Immediate",
      confidence: 96,
      summary: "Accept risk. Plant 02 starves in 5–7 days. 2,840 vehicle deliveries delayed with ₹1.8 Cr direct margin loss.",
      pros: ["Zero additional immediate financial outlay"],
      cons: ["Guaranteed production shutdown", "Massive customer goodwill erosion", "Dealer stocking SLA fines"]
    },
    {
      id: "MIT-02",
      name: "Shift 30% Volume to Supplier S108 + Expedite Shipment",
      recommended: true,
      badge: "AI RECOMMENDED",
      cost: "₹4.2 Lakh",
      costNum: 420000,
      riskReductionPct: 68,
      productionImpactPct: -0.6,
      deliveryDelayOrders: 180,
      revenueProtected: "₹1.65 Cr",
      revenueLost: "₹15 Lakh",
      timeToImplement: "36 hours",
      confidence: 89,
      summary: "Reallocate 60 units/day of C204 from S102 to qualified Supplier S108 (Bengaluru). Expedite 400 units in transit via air freight.",
      pros: ["Compresses stockout probability from 81% down to 14%", "Protects 2,660 vehicle orders", "Optimal cost-to-benefit ratio"],
      cons: ["Requires ₹4.2 Lakh air freight & tooling calibration surcharge"]
    },
    {
      id: "MIT-03",
      name: "Air Expedite Entire In-Transit Batch (Pure Expedite)",
      recommended: false,
      cost: "₹11.8 Lakh",
      costNum: 1180000,
      riskReductionPct: 45,
      productionImpactPct: -2.8,
      deliveryDelayOrders: 820,
      revenueProtected: "₹1.15 Cr",
      revenueLost: "₹65 Lakh",
      timeToImplement: "24 hours",
      confidence: 82,
      summary: "Charter dedicated cargo aircraft to fly all pending lots from Pune to Nashik hub without vendor rebalancing.",
      pros: ["Immediate arrival within 24 hours", "No vendor contract adjustment"],
      cons: ["High freight expenditure (₹11.8L)", "Fails to solve ongoing supplier lead-time root cause"]
    },
    {
      id: "MIT-04",
      name: "Emergency Safety Stock Surge (Drawdown Buffer Yard)",
      recommended: false,
      cost: "₹6.5 Lakh",
      costNum: 650000,
      riskReductionPct: 52,
      productionImpactPct: -2.1,
      deliveryDelayOrders: 640,
      revenueProtected: "₹1.32 Cr",
      revenueLost: "₹48 Lakh",
      timeToImplement: "48 hours",
      confidence: 85,
      summary: "Transfer 500 units of reserve stock from Haridwar/Chakan buffer hubs to Nashik.",
      pros: ["Uses internal ecosystem inventory", "Moderate cost"],
      cons: ["Depletes safety reserves at other plants to 4.2 days", "Risk propagation to Chakan"]
    },
    {
      id: "MIT-05",
      name: "Throttle Low-Priority Assembly Lines (Reroute Allocation)",
      recommended: false,
      cost: "₹1.5 Lakh",
      costNum: 150000,
      riskReductionPct: 38,
      productionImpactPct: -5.2,
      deliveryDelayOrders: 1420,
      revenueProtected: "₹85 Lakh",
      revenueLost: "₹95 Lakh",
      timeToImplement: "12 hours",
      confidence: 91,
      summary: "Pause lower-margin commercial chassis runs and re-allocate shared sub-assemblies to Scorpio-N.",
      pros: ["Fastest to execute", "Low out-of-pocket cost"],
      cons: ["Delays 1,420 commercial vehicle customers", "Negative margin impact on subsidiary line"]
    }
  ],

  // AI Recommendation Cards
  recommendations: [
    {
      id: "R-1042",
      riskId: "R-101",
      title: "Rebalance C204 Procurement Volume to Supplier S108",
      problem: "Supplier S102 lead-time deterioration (+23%) and OTIF drop (72%) causing imminent component C204 stockout at Plant 02.",
      evidence: [
        "Supplier S102 OTIF dropped 18% over last 14 days",
        "Lead time increased 23% (14.8 days)",
        "Component C204 coverage down to 6.2 days",
        "Demand increased 11% for Q3 build"
      ],
      action: "Shift 30% procurement volume to qualified secondary Supplier S108 and air-expedite in-transit consignment Batch #SH-2048.",
      cost: "₹4.2 Lakh",
      riskReduction: "68%",
      revenueProtected: "₹1.65 Cr",
      confidence: 89,
      status: "PENDING_APPROVAL",
      owner: "Procurement Manager",
      deadline: "36 hours remaining",
      explainId: "rec-1042"
    },
    {
      id: "R-1043",
      riskId: "R-104",
      title: "Activate Kolhapur Reserve Foundry for Crankcase Castings",
      problem: "Supplier S115 scrap defect rate jumped to 4.8%, jeopardizing Chakan Plant 01 engine line assembly.",
      evidence: [
        "S115 defect rate spiked from 1.8% to 4.8%",
        "Chakan buffer down to 4.1 days",
        "Pig iron spot price uncertainty"
      ],
      action: "Release backup purchase order to Deccan Forge (S204) for 350 emergency cast blocks and dispatch on-site metallurgy auditor.",
      cost: "₹3.8 Lakh",
      riskReduction: "58%",
      revenueProtected: "₹95 Lakh",
      confidence: 84,
      status: "APPROVED",
      owner: "Plant Operations Head",
      deadline: "Approved (In Progress)",
      explainId: "rec-1043"
    },
    {
      id: "R-1044",
      riskId: "R-105",
      title: "Reroute Carrier C12 via Southern Bypass Expressway",
      problem: "Monsoon road blockages on Western Ghats highway holding critical shipments for Zaheerabad.",
      evidence: [
        "Carrier C12 ETA delayed +2.8 days",
        "Historical transit variance +16%",
        "Road authority congestion warning"
      ],
      action: "Instruct carrier dispatch hub to divert trailing consignments via Solapur bypass corridor with GPS telemetry tag.",
      cost: "₹85,000",
      riskReduction: "72%",
      revenueProtected: "₹50 Lakh",
      confidence: 91,
      status: "IN_PROGRESS",
      owner: "Logistics Lead",
      deadline: "Executing",
      explainId: "rec-1044"
    }
  ],

  // Action Center Queue
  actions: [
    {
      id: "ACT-501",
      title: "Shift 30% C204 Volume to Supplier S108",
      recommendationId: "R-1042",
      owner: "Procurement Manager (Arun S.)",
      priority: "CRITICAL",
      deadline: "36 hours",
      cost: "₹4.2 Lakh",
      benefit: "Protects ₹1.65 Cr & 2,660 Vehicle Orders",
      status: "Pending Approval",
      type: "HIGH_IMPACT",
      requiresApproval: true,
      description: "Issue PO amendment shifting 60 units/day to Apex Microtech and authorize air-cargo freight charge.",
      auditNote: "Awaiting CXO / Procurement Director digital signature."
    },
    {
      id: "ACT-502",
      title: "Issue Quality Engineering Audit to S115 Foundry",
      recommendationId: "R-1043",
      owner: "Supplier Quality Head (Vikram M.)",
      priority: "HIGH",
      deadline: "18 hours",
      cost: "₹60,000",
      benefit: "Arrests 4.8% scrap defect trend",
      status: "Approved",
      type: "LOW_IMPACT_AUTOMATED",
      requiresApproval: false,
      description: "Deploy technical quality lead to Coimbatore casting shop floor for tool recalibration.",
      auditNote: "Approved automatically under quality governance rules."
    },
    {
      id: "ACT-503",
      title: "Switch Logistics Route C-4 for In-Transit Batch SH-2048",
      recommendationId: "R-1044",
      owner: "Logistics Operations Lead (Priya K.)",
      priority: "HIGH",
      deadline: "8 hours",
      cost: "₹85,000",
      benefit: "Avoids 2.8 day road closure bottleneck",
      status: "In Progress",
      type: "OPERATIONAL",
      requiresApproval: true,
      description: "Notify Carrier C12 dispatcher to execute Solapur bypass route with dynamic tracking.",
      auditNote: "Approved by Priya K. at 14:30 today."
    },
    {
      id: "ACT-489",
      title: "Emergency Safety Stock Buffer Drawdown for Nashik",
      recommendationId: "R-1029",
      owner: "Inventory Controller (Ramesh D.)",
      priority: "MEDIUM",
      deadline: "Completed",
      cost: "₹1.2 Lakh",
      benefit: "Pre-empted Line 1 slowdown last week",
      status: "Completed",
      type: "OPERATIONAL",
      requiresApproval: true,
      description: "Drew 250 units from regional central depot to bridge 3-day supplier delay.",
      auditNote: "Completed on Oct 02. Production loss avoided."
    },
    {
      id: "ACT-478",
      title: "Full Factory Shutdown Proposal for Line 2 Maintenance",
      recommendationId: "R-1011",
      owner: "Plant Maintenance Head",
      priority: "CRITICAL",
      deadline: "Rejected",
      cost: "₹28 Lakh",
      benefit: "Non-critical preventative overhaul",
      status: "Rejected",
      type: "HIGH_IMPACT",
      requiresApproval: true,
      description: "Proposed 48h halt during high-demand festive ramp-up.",
      auditNote: "Rejected by Operations Director: Defer to planned annual shutdown in December."
    }
  ],

  // Agentic AI Multi-Agent Architecture
  agentArchitecture: [
    { id: "orch", name: "Orchestrator Agent", role: "Coordinates operational signals, aggregates agent findings, and synthesizes decision packages." },
    { id: "ext", name: "External Intelligence Agent", role: "Ingests weather, port dwell, commodity pricing, and logistics strikes to isolate internal impacts." },
    { id: "supp", name: "Supplier Risk Agent", role: "Tracks OTIF degradation, lead-time variance, financial flags, and single-source dependency concentration." },
    { id: "inv", name: "Inventory Agent", role: "Monitors days of supply, safety-stock breaches, reorder buffers, and stockout probabilities." },
    { id: "prod", name: "Production Agent", role: "Detects machine utilization bottlenecks, line starving risks, OEE drift, and schedule adherence deficits." },
    { id: "log", name: "Logistics Agent", role: "Monitors in-transit shipments, carrier on-time compliance, route delays, and ETA slippages." },
    { id: "impact", name: "Impact Analysis Agent", role: "Simulates cross-tier risk propagation from component failure to revenue exposure and vehicle delivery delays." },
    { id: "scen", name: "Scenario Simulation Agent", role: "Runs digital twin 'What-If?' simulations across supplier outages, demand surges, and capacity cuts." },
    { id: "rec", name: "Recommendation Agent", role: "Generates multi-attribute trade-off mitigation options (Do Nothing vs Alternate Supplier vs Expedite)." },
    { id: "guard", name: "Governance & Human-in-the-Loop Agent", role: "Enforces approval thresholds, fact vs prediction labeling, and audit logging." }
  ],

  // Historical Analytics & Model Reliability
  analytics: {
    accuracyMetrics: {
      precision: 91.4,
      recall: 88.2,
      falsePositiveRate: 4.6,
      meanLeadTimeDays: 6.2,
      mitigationSuccessRate: 94.1,
      totalPredictionsEvaluated: 142
    },
    trendHistory: [
      { date: "W1 Sep", avgRisk: 42, actualDisruptions: 1, predictedDisruptions: 2 },
      { date: "W2 Sep", avgRisk: 48, actualDisruptions: 2, predictedDisruptions: 2 },
      { date: "W3 Sep", avgRisk: 55, actualDisruptions: 3, predictedDisruptions: 3 },
      { date: "W4 Sep", avgRisk: 61, actualDisruptions: 4, predictedDisruptions: 4 },
      { date: "W1 Oct", avgRisk: 74, actualDisruptions: 5, predictedDisruptions: 6 }
    ],
    predictedVsActual: [
      {
        id: "PVA-101",
        predictionDate: "2026-09-18",
        event: "Supplier S112 casting delivery delay",
        predictedDelayDays: 5.0,
        actualDelayDays: 4.2,
        errorDays: -0.8,
        actionTaken: "Pre-emptively expediting buffer stock",
        outcome: "Production delay avoided",
        verified: true
      },
      {
        id: "PVA-102",
        predictionDate: "2026-09-24",
        event: "Component C305 hydraulic stockout",
        predictedDelayDays: 3.5,
        actualDelayDays: 3.0,
        errorDays: -0.5,
        actionTaken: "Secondary vendor split order",
        outcome: "Saved ₹45 Lakh output",
        verified: true
      },
      {
        id: "PVA-103",
        predictionDate: "2026-09-29",
        event: "Plant 01 robotic weld cell downtime",
        predictedDelayDays: 2.0,
        actualDelayDays: 2.2,
        errorDays: +0.2,
        actionTaken: "Preventative servo replacement",
        outcome: "Stoppage restricted to 3 hours",
        verified: true
      }
    ]
  },

  // Audit Trail Records
  auditTrail: [
    {
      id: "AUD-901",
      timestamp: "2026-10-06 14:30:12",
      recommendationId: "R-1044",
      user: "Priya K. (Logistics Lead)",
      action: "Approved Reroute Action ACT-503",
      decisionType: "EXECUTE_MITIGATION",
      modelConfidence: 91,
      rationale: "Approved via Mobile Control Tower: Diverting via Solapur avoids NH-48 waterlogging with minimal cost.",
      auditStatus: "VERIFIED"
    },
    {
      id: "AUD-900",
      timestamp: "2026-10-06 11:15:45",
      recommendationId: "R-1043",
      user: "SYSTEM_GOVERNANCE_AGENT",
      action: "Auto-Approved Quality Audit ACT-502",
      decisionType: "LOW_IMPACT_AUTOMATION",
      modelConfidence: 84,
      rationale: "Automated trigger: Scrap rate >4% on critical casting component invokes immediate engineering deployment.",
      auditStatus: "SYSTEM_EXECUTED"
    },
    {
      id: "AUD-899",
      timestamp: "2026-10-05 16:42:00",
      recommendationId: "R-1038",
      user: "Rajesh V. (Operations Director)",
      action: "Approved Overtime Shift Authorization",
      decisionType: "EXECUTE_MITIGATION",
      modelConfidence: 88,
      rationale: "Authorized 4h weekend shift at Plant 01 to build safety cushion ahead of festive demand spike.",
      auditStatus: "VERIFIED"
    },
    {
      id: "AUD-898",
      timestamp: "2026-10-04 09:20:18",
      recommendationId: "R-1011",
      user: "Rajesh V. (Operations Director)",
      action: "Rejected Preventative Shutdown ACT-478",
      decisionType: "USER_OVERRIDE",
      modelConfidence: 72,
      rationale: "Rejected AI maintenance recommendation due to critical festive vehicle delivery commitments. Rescheduled to Q4.",
      auditStatus: "OVERRIDDEN"
    }
  ],

  // Comprehensive Explain Why Knowledge Library
  explainWhyLibrary: {
    "kpi-health": {
      title: "Supply Chain Health Score (78 / 100 — WATCH)",
      whatIsThis: "A holistic composite index measuring the resilience and risk exposure of the entire manufacturing ecosystem.",
      whyValue: "Scored at 78/100 (Watch status) due to severe component C204 stockout risk, high plant utilization (94% at Nashik), and tier-1 supplier lead-time inflation.",
      calculation: "Weighted average: 25% Supplier Reliability + 25% Inventory Buffer Coverage + 20% Plant Bottleneck Index + 15% Logistics Transit Performance + 15% Customer Delivery SLA.",
      evidence: {
        facts: [
          "Supplier S102 OTIF declined 18% over 14 days",
          "Component C204 has only 6.2 days of supply remaining",
          "Plant 02 capacity utilization reached 94%"
        ],
        predictions: [
          "Without intervention, health score will decline to 64 within 6 days",
          "Likelihood of line stoppage is 87%"
        ],
        assumptions: [
          "Festive demand forecast remains +11% above normal",
          "In-transit shipments via NH-48 experience 2.8 days additional delay"
        ],
        recommendations: [
          "Rebalance 30% procurement volume to secondary Supplier S108",
          "Expedite in-transit shipments using dedicated air cargo"
        ]
      },
      impact: "Potential production loss of 8.4% at Plant 02, threatening ₹1.8 Cr revenue and 2,840 vehicle deliveries.",
      nextSteps: "Open Scenario Simulator or review AI Recommendation #R-1042."
    },

    "kpi-critical": {
      title: "Critical Operational Risks (5 Detected)",
      whatIsThis: "High-severity vulnerabilities with Probability > 70% and expected business impact > ₹1.0 Cr or line stoppage within 7 days.",
      whyValue: "Increased by +2 in the last 24h because Supplier S102 OTIF degraded further and Carrier C12 encountered highway delays.",
      calculation: "Evaluated dynamically: Risk Score = (Probability × 0.4) + (Business Impact × 0.4) + (Time-to-Impact Urgency × 0.2).",
      evidence: {
        facts: [
          "5 distinct risks qualify for Critical status (S102 delay, C204 stockout, Plant 02 bottleneck, S115 scrap rate, C12 transit delay)",
          "All 5 risks converge on SUV Alpha powertrain delivery"
        ],
        predictions: [
          "Compounded failure will lead to assembly halt in 5–7 days"
        ],
        assumptions: [
          "Suppliers will not self-correct without executive intervention"
        ],
        recommendations: [
          "Execute coordinated multi-agent mitigation package #R-1042"
        ]
      },
      impact: "Direct financial exposure of ₹4.2 Cr across inventory, production loss, and order delay penalties.",
      nextSteps: "Navigate to Risk Control Tower to view the interactive Probability vs Impact matrix."
    },

    "risk-s102": {
      title: "Supplier S102 Disruption (Risk Score: 82 / 100)",
      whatIsThis: "Evaluates the probability that Precision Auto-Cast Ltd will fail to fulfill delivery commitments, threatening plant operations.",
      whyValue: "S102 is currently running at 91% capacity utilization, experiencing a 23% lead-time surge (14.8 days) and an 18% OTIF drop.",
      calculation: "Supplier Risk Score = 0.35 × (100 - OTIF) + 0.30 × (Lead Time Variance) + 0.20 × (Capacity Utilization) + 0.15 × (Single Source Concentration).",
      evidence: {
        facts: [
          "Current OTIF is 72% (historical baseline was 90%)",
          "Average lead time is 14.8 days vs contract SLA of 12.0 days",
          "Single-source dependency: S102 holds 72% of Component C204 supply"
        ],
        predictions: [
          "Further lead-time inflation to 16.5 days over the next billing cycle",
          "Stockout probability at Plant 02 is 81%"
        ],
        assumptions: [
          "Supplier has zero spare tool capacity to run weekend makeup heats"
        ],
        recommendations: [
          "Shift 30% procurement volume to secondary qualified supplier S108 (Apex Microtech)"
        ]
      },
      impact: "Plant 02 production down 8.4%; 2,840 customer vehicle orders delayed.",
      nextSteps: "Review Recommendation #R-1042 or compare alternate suppliers in Supplier Intelligence."
    },

    "risk-c204": {
      title: "Component C204 Inventory Risk (81 / 100)",
      whatIsThis: "Measures the likelihood of a stockout event for Engine ECUs at Nashik Plant 02.",
      whyValue: "Stock coverage has dropped to 6.2 days against a safety buffer target of 10.0 days, while daily consumption has increased to 200 units.",
      calculation: "Stockout Probability = f(Days of Supply, Safety Target, Supplier Lead Time, Demand Volatility).",
      evidence: {
        facts: [
          "Current inventory on hand: 1,240 units",
          "Daily production burn rate: 200 units/day",
          "Supplier delivery lead time: 14.8 days"
        ],
        predictions: [
          "Inventory will reach zero (stockout) within 6.2 calendar days"
        ],
        assumptions: [
          "Assembly line runs at scheduled 2-shift capacity"
        ],
        recommendations: [
          "Trigger emergency reorder from Supplier S108 and air freight 400 units"
        ]
      },
      impact: "Powertrain Line 2 forced shutdown, idling 420 technicians and stalling 180 vehicles/day.",
      nextSteps: "Simulate buffer replenishment in Scenario Simulator."
    },

    "plant-02": {
      title: "Plant 02 (Nashik) Production Bottleneck (Risk Score: 78 / 100)",
      whatIsThis: "Assesses the probability of Plant 02 missing its monthly master production schedule.",
      whyValue: "Utilization is at 94% with Line 2 running at 96%. An imminent shortage of Component C204 leaves zero room for buffer.",
      calculation: "Production Risk = 0.40 × (Material Shortage Probability) + 0.35 × (Line Utilization) + 0.25 × (Schedule Backlog).",
      evidence: {
        facts: [
          "Plant 02 utilization: 94%",
          "Line 2 Powertrain utilization: 96%",
          "Component C204 days of supply: 6.2 days",
          "Existing backlog: 1,560 units"
        ],
        predictions: [
          "Plant output likely to fall by 8.4% (deficit of ~1,560 vehicles this month)"
        ],
        assumptions: [
          "No unplanned machine breakdowns occur during the period"
        ],
        recommendations: [
          "Execute procurement rebalance #R-1042 immediately"
        ]
      },
      impact: "Delayed fulfillment of Scorpio-N and XUV700 orders with ₹1.8 Cr revenue exposure.",
      nextSteps: "View bottleneck breakdown in Production Intelligence."
    },

    "concentration-c204": {
      title: "Single Supplier Dependency Risk (Component C204)",
      whatIsThis: "Measures fragility caused by excessive reliance on a single supplier or geographic cluster for a mission-critical part.",
      whyValue: "72% of all C204 ECUs are sourced from Supplier S102 in Pune, with 82% originating in Western Maharashtra.",
      calculation: "Herfindahl-Hirschman Index (HHI) for C204 supply is 5,584 (scores > 2,500 indicate extreme concentration).",
      evidence: {
        facts: [
          "S102 share: 72% | S108 share: 18% | S115 reserve: 10%",
          "Any delay at S102 immediately paralyses 72% of Nashik vehicle production"
        ],
        predictions: [
          "Disruption at S102 causes cascading failure within 6 days"
        ],
        assumptions: [
          "Supplier S108 has uncommitted production capacity to absorb +30% volume"
        ],
        recommendations: [
          "Permanently rebalance allocation to 50% S102 / 40% S108 / 10% S115"
        ]
      },
      impact: "Eliminating single-source concentration reduces total enterprise risk by 58%.",
      nextSteps: "Review supplier allocation matrix in Supplier Intelligence."
    }
  },

  // Glossary of Technical Supply Chain Terms
  glossary: {
    "OTIF": {
      term: "OTIF (On-Time In-Full)",
      definition: "A supply chain performance metric measuring whether a supplier delivered the exact agreed quantity by the agreed promised date.",
      whyItMatters: "A supplier with low OTIF (e.g. 72%) forces factories to hold expensive safety stocks or risk unexpected assembly line shutdowns.",
      formula: "(On-Time Shipments that are Complete ÷ Total Shipments) × 100%"
    },
    "OEE": {
      term: "OEE (Overall Equipment Effectiveness)",
      definition: "The gold standard for measuring manufacturing productivity, combining Availability, Performance, and Quality.",
      whyItMatters: "An OEE below 80% signals that plant machinery is suffering from unplanned micro-stops, slow cycles, or defective scrap.",
      formula: "Availability × Performance Rate × Quality Rate"
    },
    "Safety Stock": {
      term: "Safety Stock",
      definition: "Buffer inventory maintained to mitigate the risk of stockouts caused by uncertainties in supply lead time or sudden demand surges.",
      whyItMatters: "Breaching safety stock leaves the assembly line vulnerable to immediate starvation if the next shipment slips by even 24 hours.",
      formula: "(Max Daily Usage × Max Lead Time) - (Average Daily Usage × Average Lead Time)"
    },
    "Days of Supply": {
      term: "Days of Supply (DOS)",
      definition: "The number of days an existing inventory stock will last at the current rate of consumption without any new receipts.",
      whyItMatters: "When DOS drops below supplier lead time, a stockout is mathematically inevitable unless emergency freight is deployed.",
      formula: "Current On-Hand Stock ÷ Average Daily Demand"
    },
    "Stockout Probability": {
      term: "Stockout Probability",
      definition: "A probabilistic forecast (0–100%) that inventory on hand will reach zero before the next replenishment arrives.",
      whyItMatters: "High stockout probability (>70%) triggers automated risk escalation and early warning alerts.",
      formula: "Derived from Normal Distribution CDF of Demand and Lead Time Variance"
    },
    "Risk Propagation": {
      term: "Risk Propagation",
      definition: "The cascading transmission of an operational shock upstream (e.g., supplier delay) through components and factories to downstream customer orders.",
      whyItMatters: "Small upstream hiccups (e.g., a 2-day delay on a ₹3,000 ECU) amplify into multi-crore assembly shutdowns.",
      formula: "Multi-tier graph traversal weighting dependency percentage and buffer slack"
    }
  }
};

// Export to window for browser consumption
window.OPS_DATA = OPS_DATA;
