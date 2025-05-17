"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { IconBulb, IconExternalLink, IconLeaf } from "@tabler/icons-react";

const RecommendationsTab = ({
  report,
  calculateTotalEmissions,
  getScope1Details,
  getScope2Details,
  getScope3Details,
  getFuelTypes,
  getCoolingTypes,
  getHeatingTypes,
  getTransportModes,
  getWasteTypes,
  formatNumber,
  activeTab,
}) => {
  // Chart refs
  const emissionReductionPotentialChartRef = useRef(null);
  const energyEfficiencyChartRef = useRef(null);
  const transportOptimizationChartRef = useRef(null);
  const wasteManagementChartRef = useRef(null);
  const businessTravelChartRef = useRef(null);
  const fuelEfficiencyChartRef = useRef(null);

  // Chart instances
  const [charts, setCharts] = useState({});
  const initializeTimeoutRef = useRef(null);

  useEffect(() => {
    if (report && report.includeCharts === "yes" && activeTab === "recommendations") {
      // Debounce chart initialization
      if (initializeTimeoutRef.current) {
        clearTimeout(initializeTimeoutRef.current);
      }
      initializeTimeoutRef.current = setTimeout(() => {
        initializeCharts();
      }, 100);
    }

    return () => {
      if (initializeTimeoutRef.current) {
        clearTimeout(initializeTimeoutRef.current);
      }
      Object.values(charts).forEach((chart) => {
        if (chart && chart.canvas) {
          chart.destroy();
        }
      });
      setCharts({});
    };
  }, [report, activeTab]);

  const initializeCharts = () => {
    const emissionTotals = calculateTotalEmissions;
    const scope1Details = getScope1Details();
    const scope2Details = getScope2Details();
    const scope3Details = getScope3Details();
    const fuelTypes = getFuelTypes();
    const transportModes = getTransportModes();

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
    };

    const newCharts = {};

    try {
      // Emission Reduction Potential Chart
      if (emissionReductionPotentialChartRef.current) {
        const reductionData = [
          {
            scope: "Scope 1",
            current: emissionTotals.scope1,
            potential: emissionTotals.scope1 * 0.7, // Assume 30% reduction potential
          },
          {
            scope: "Scope 2",
            current: emissionTotals.scope2,
            potential: emissionTotals.scope2 * 0.6, // Assume 40% reduction
          },
          {
            scope: "Scope 3",
            current: emissionTotals.scope3,
            potential: emissionTotals.scope3 * 0.75, // Assume 25% reduction
          },
        ].filter((d) => d.current > 0);

        newCharts.emissionReductionPotential = new Chart(
          emissionReductionPotentialChartRef.current,
          {
            type: "bar",
            data: {
              labels: reductionData.map((d) => d.scope),
              datasets: [
                {
                  label: "Current Emissions (tCO₂)",
                  data: reductionData.map((d) => d.current),
                  backgroundColor: "#328E6E",
                  borderWidth: 1,
                },
                {
                  label: "Potential Emissions After Reduction (tCO₂)",
                  data: reductionData.map((d) => d.potential),
                  backgroundColor: "#90C67C",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Potential Emission Reductions by Scope",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Emissions (tCO₂)",
                  },
                },
              },
            },
          }
        );
      }

      // Energy Efficiency Chart
      if (energyEfficiencyChartRef.current && scope2Details.energyConsumptionEmissions > 0) {
        const efficiencyData = [
          {
            measure: "Current Consumption",
            emissions: scope2Details.energyConsumptionEmissions,
          },
          {
            measure: "LED Lighting",
            emissions: scope2Details.energyConsumptionEmissions * 0.8, // 20% reduction
          },
          {
            measure: "Smart HVAC",
            emissions: scope2Details.energyConsumptionEmissions * 0.7, // 30% reduction
          },
          {
            measure: "Renewable Energy",
            emissions: scope2Details.energyConsumptionEmissions * 0.4, // 60% reduction
          },
        ];

        newCharts.energyEfficiency = new Chart(
          energyEfficiencyChartRef.current,
          {
            type: "bar",
            data: {
              labels: efficiencyData.map((d) => d.measure),
              datasets: [
                {
                  label: "Emissions (tCO₂)",
                  data: efficiencyData.map((d) => d.emissions),
                  backgroundColor: ["#328E6E", "#67AE6E", "#90C67C", "#E1EEBC"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Impact of Energy Efficiency Measures",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Emissions (tCO₂)",
                  },
                },
              },
            },
          }
        );
      }

      // Transport Optimization Chart
      if (transportOptimizationChartRef.current && scope3Details.transportEmissions > 0) {
        const optimizationData = [
          {
            mode: "Current Transport",
            emissions: scope3Details.transportEmissions,
          },
          {
            mode: "Electric Vehicles",
            emissions: scope3Details.transportEmissions * 0.5, // 50% reduction
          },
          {
            mode: "Route Optimization",
            emissions: scope3Details.transportEmissions * 0.7, // 30% reduction
          },
          {
            mode: "Rail Preference",
            emissions: scope3Details.transportEmissions * 0.6, // 40% reduction
          },
        ];

        newCharts.transportOptimization = new Chart(
          transportOptimizationChartRef.current,
          {
            type: "bar",
            data: {
              labels: optimizationData.map((d) => d.mode),
              datasets: [
                {
                  label: "Emissions (tCO₂)",
                  data: optimizationData.map((d) => d.emissions),
                  backgroundColor: ["#328E6E", "#4299e1", "#94d82d", "#f59f00"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Transport Emission Reduction Strategies",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Emissions (tCO₂)",
                  },
                },
              },
            },
          }
        );
      }

      // Waste Management Impact Chart
      if (wasteManagementChartRef.current && scope3Details.wasteEmissions > 0) {
        const wasteData = [
          {
            strategy: "Current Waste",
            emissions: scope3Details.wasteEmissions,
          },
          {
            strategy: "Recycling Program",
            emissions: scope3Details.wasteEmissions * 0.5, // 50% reduction
          },
          {
            strategy: "Waste-to-Energy",
            emissions: scope3Details.wasteEmissions * 0.4, // 60% reduction
          },
          {
            strategy: "Composting",
            emissions: scope3Details.wasteEmissions * 0.6, // 40% reduction
          },
        ];

        newCharts.wasteManagement = new Chart(
          wasteManagementChartRef.current,
          {
            type: "bar",
            data: {
              labels: wasteData.map((d) => d.strategy),
              datasets: [
                {
                  label: "Emissions (tCO₂)",
                  data: wasteData.map((d) => d.emissions),
                  backgroundColor: ["#328E6E", "#67AE6E", "#90C67C", "#E1EEBC"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Impact of Waste Management Strategies",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Emissions (tCO₂)",
                  },
                },
              },
            },
          }
        );
      }

      // Business Travel Reduction Chart
      if (businessTravelChartRef.current && scope3Details.businessTravelEmissions > 0) {
        const travelData = [
          {
            strategy: "Current Travel",
            emissions: scope3Details.businessTravelEmissions,
          },
          {
            strategy: "Virtual Meetings",
            emissions: scope3Details.businessTravelEmissions * 0.3, // 70% reduction
          },
          {
            strategy: "Train Travel",
            emissions: scope3Details.businessTravelEmissions * 0.4, // 60% reduction
          },
          {
            strategy: "Travel Policy",
            emissions: scope3Details.businessTravelEmissions * 0.5, // 50% reduction
          },
        ];

        newCharts.businessTravel = new Chart(
          businessTravelChartRef.current,
          {
            type: "bar",
            data: {
              labels: travelData.map((d) => d.strategy),
              datasets: [
                {
                  label: "Emissions (tCO₂)",
                  data: travelData.map((d) => d.emissions),
                  backgroundColor: ["#328E6E", "#4299e1", "#94d82d", "#f59f00"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Business Travel Emission Reduction Strategies",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Emissions (tCO₂)",
                  },
                },
              },
            },
          }
        );
      }

      // Fuel Efficiency Comparison Chart
      if (fuelEfficiencyChartRef.current && scope1Details.fuelEmissions > 0) {
        const fuelData = [
          {
            fuel: "Diesel",
            emissions: 2.68, // kg CO2 per liter
          },
          {
            fuel: "Gasoline",
            emissions: 2.31, // kg CO2 per liter
          },
          {
            fuel: "Natural Gas",
            emissions: 1.89, // kg CO2 per m3
          },
          {
            fuel: "Biodiesel (B100)",
            emissions: 0.33, // kg CO2 per liter
          },
          {
            fuel: "Biogas",
            emissions: 0.21, // kg CO2 per m3
          },
          {
            fuel: "Hydrogen (Green)",
            emissions: 0.01, // kg CO2 per kg
          },
        ];

        newCharts.fuelEfficiency = new Chart(
          fuelEfficiencyChartRef.current,
          {
            type: "bar",
            data: {
              labels: fuelData.map((d) => d.fuel),
              datasets: [
                {
                  label: "Emissions (kg CO₂ per unit)",
                  data: fuelData.map((d) => d.emissions),
                  backgroundColor: [
                    "#ef4444", // Red for diesel (highest emissions)
                    "#f97316", // Orange for gasoline
                    "#f59e0b", // Amber for natural gas
                    "#84cc16", // Lime for biodiesel
                    "#10b981", // Emerald for biogas
                    "#06b6d4", // Cyan for hydrogen (lowest emissions)
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Fuel Types Carbon Intensity Comparison",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Carbon Intensity (kg CO₂ per unit)",
                  },
                },
              },
            },
          }
        );
      }
    } catch (error) {
      console.error("Error initializing charts:", error);
    }

    setCharts(newCharts);
  };

  // Generate recommendations based on emission data
  const getRecommendations = () => {
    const recommendations = [];
    const emissionTotals = calculateTotalEmissions;
    const scope1Details = getScope1Details();
    const scope2Details = getScope2Details();
    const scope3Details = getScope3Details();
    
    let idCounter = 1;

    // Scope 1 Recommendations
    if (report.scope1 && emissionTotals.scope1 > 0) {
      if (scope1Details.fuelEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Transition to Low-Carbon Fuels",
          description:
            "Switch from high-emission fuels (e.g., diesel) to low-carbon alternatives like biofuels or green hydrogen for your fleet and machinery. This can significantly reduce your direct emissions while maintaining operational efficiency. Start with a pilot program for a subset of your fleet to evaluate performance and ROI before full implementation.",
          impact: `Potential to reduce Scope 1 emissions by approximately ${formatNumber(
            scope1Details.fuelEmissions * 0.3
          )} tCO₂ annually.`,
          scope: "Scope 1",
          priority: "High",
          potential: scope1Details.fuelEmissions * 0.3,
          payback: "2-3 years",
          difficulty: "Medium",
          sources: [
            {
              title: "IPCC, 2022: Climate Change 2022: Mitigation of Climate Change",
              url: "https://www.ipcc.ch/report/ar6/wg3/",
            },
            {
              title: "IEA, 2023: The Role of Low-Carbon Fuels in the Clean Energy Transition",
              url: "https://www.iea.org/reports/the-role-of-low-carbon-fuels-in-the-clean-energy-transition",
            },
          ],
        });
      }
      if (scope1Details.productionEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Optimize Production Processes",
          description:
            "Implement energy-efficient technologies in production processes, such as advanced automation, heat recovery systems, and optimized equipment scheduling. This can lead to both emissions reduction and operational cost savings. Consider conducting an energy audit to identify the most impactful opportunities for improvement.",
          impact: `Could reduce production-related emissions by up to ${formatNumber(
            scope1Details.productionEmissions * 0.25
          )} tCO₂ per year.`,
          scope: "Scope 1",
          priority: "Medium",
          potential: scope1Details.productionEmissions * 0.25,
          payback: "1-4 years",
          difficulty: "Medium",
          sources: [
            {
              title: "IEA, 2023: Energy Efficiency 2023 Report",
              url: "https://www.iea.org/reports/energy-efficiency-2023",
            },
            {
              title: "EPA, 2022: Energy Efficiency in Industrial Processes",
              url: "https://www.epa.gov/energy/industrial-processes",
            },
          ],
        });
      }
    }

    // Scope 2 Recommendations
    if (report.scope2 && emissionTotals.scope2 > 0) {
      if (scope2Details.energyConsumptionEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Adopt Renewable Energy Sources",
          description:
            "Source electricity from renewable energy providers or install on-site solar/wind systems to reduce reliance on fossil fuel-based electricity. Begin with a feasibility study to determine the most cost-effective renewable energy solutions for your specific locations and energy usage patterns.",
          impact: `Potential reduction of ${formatNumber(
            scope2Details.energyConsumptionEmissions * 0.6
          )} tCO₂ in Scope 2 emissions.`,
          scope: "Scope 2",
          priority: "High",
          potential: scope2Details.energyConsumptionEmissions * 0.6,
          payback: "4-8 years",
          difficulty: "Medium",
          sources: [
            {
              title: "IRENA, 2023: Renewable Energy Roadmap",
              url: "https://www.irena.org/publications/2023/renewable-energy-roadmap",
            },
            {
              title: "NREL, 2023: Renewable Energy for Commercial Buildings",
              url: "https://www.nrel.gov/commercial/renewable-energy.html",
            },
          ],
        });
      }
      if (scope2Details.coolingEmissions > 0 || scope2Details.heatingEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Upgrade HVAC Systems",
          description:
            "Install smart HVAC systems with energy-efficient cooling and heating technologies to minimize energy consumption. Integrate smart controls and zoning systems to optimize temperature regulation based on occupancy and usage patterns. Regular maintenance and performance monitoring can further improve efficiency.",
          impact: `Could save up to ${formatNumber(
            (scope2Details.coolingEmissions + scope2Details.heatingEmissions) * 0.3
          )} tCO₂ annually.`,
          scope: "Scope 2",
          priority: "Medium",
          potential: (scope2Details.coolingEmissions + scope2Details.heatingEmissions) * 0.3,
          payback: "3-5 years",
          difficulty: "Medium",
          sources: [
            {
              title: "US DOE, 2022: Energy Savings Performance Contracting for HVAC Systems",
              url: "https://www.energy.gov/eere/buildings/energy-savings-performance-contracting",
            },
            {
              title: "ASHRAE, 2023: Advanced HVAC System Design Guide",
              url: "https://www.ashrae.org/technical-resources/bookstore/advanced-hvac-systems",
            },
          ],
        });
      }
    }

    // Scope 3 Recommendations
    if (report.scope3 && emissionTotals.scope3 > 0) {
      if (scope3Details.transportEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Optimize Logistics and Transport",
          description:
            "Shift to electric vehicles for short-haul transport, optimize delivery routes using AI-driven logistics software, and prioritize rail over road transport for long-distance shipping. Collaborate with logistics partners to establish shared sustainability goals and implement joint emission reduction initiatives.",
          impact: `Potential to cut transport emissions by ${formatNumber(
            scope3Details.transportEmissions * 0.4
          )} tCO₂ per year.`,
          scope: "Scope 3",
          priority: "High",
          potential: scope3Details.transportEmissions * 0.4,
          payback: "2-5 years",
          difficulty: "Medium",
          sources: [
            {
              title: "Smart Freight Centre, 2023: Global Logistics Emissions Council Framework",
              url: "https://www.smartfreightcentre.org/en/how-to-implement-items/what-is-glec-framework/58/",
            },
            {
              title: "McKinsey, 2022: Decarbonizing the Global Supply Chain",
              url: "https://www.mckinsey.com/capabilities/operations/our-insights/decarbonizing-global-supply-chains",
            },
          ],
        });
      }
      if (scope3Details.wasteEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Enhance Waste Management",
          description:
            "Implement comprehensive recycling programs and partner with waste-to-energy facilities to reduce emissions from waste disposal. Adopt circular economy principles to minimize waste generation at the source. Conduct waste audits to identify major waste streams and develop targeted reduction strategies.",
          impact: `Could reduce waste-related emissions by ${formatNumber(
            scope3Details.wasteEmissions * 0.5
          )} tCO₂ annually.`,
          scope: "Scope 3",
          priority: "Medium",
          potential: scope3Details.wasteEmissions * 0.5,
          payback: "1-3 years",
          difficulty: "Low",
          sources: [
            {
              title: "EPA, 2023: Advancing Sustainable Materials Management",
              url: "https://www.epa.gov/smm/advancing-sustainable-materials-management-facts-and-figures-report",
            },
            {
              title: "Ellen MacArthur Foundation, 2023: Circular Economy in Business",
              url: "https://ellenmacarthurfoundation.org/topics/business/overview",
            },
          ],
        });
      }
      if (scope3Details.businessTravelEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Reduce Business Travel Emissions",
          description:
            "Encourage virtual meetings and incentivize low-carbon travel options like train travel for business trips. Develop a sustainable travel policy that incorporates carbon budgets for different types of business travel. Invest in high-quality video conferencing technology to make virtual meetings more effective and engaging.",
          impact: `Potential reduction of ${formatNumber(
            scope3Details.businessTravelEmissions * 0.3
          )} tCO₂ per year.`,
          scope: "Scope 3",
          priority: "Medium",
          potential: scope3Details.businessTravelEmissions * 0.3,
          payback: "1-2 years",
          difficulty: "Low",
          sources: [
            {
              title: "WRI, 2022: GHG Protocol Corporate Value Chain (Scope 3) Standard",
              url: "https://ghgprotocol.org/standards/scope-3-standard",
            },
            {
              title: "WBCSD, 2023: Sustainable Business Travel Framework",
              url: "https://www.wbcsd.org/Programs/Climate-and-Energy/Climate/SOS-1.5/Resources/Sustainable-Business-Travel",
            },
          ],
        });
      }
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  // Function to determine the color class for priority badges
  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-danger";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  // Creates a chart for each recommendation
  const createRecommendationCharts = () => {
    recommendations.forEach((rec, index) => {
      const chartRef = document.getElementById(`chart-${rec.id}`);
      if (chartRef) {
        const existingChart = Chart.getChart(chartRef);
        if (existingChart) {
          existingChart.destroy();
        }

        let data = [];
        let backgroundColor = [];
        let labels = [];

        // Customize chart data based on recommendation type
        if (rec.title.includes("Fuel")) {
          data = [2.68, 2.31, 1.89, 0.33, 0.21, 0.01];
          labels = ["Diesel", "Gasoline", "Natural Gas", "Biodiesel", "Biogas", "Green Hydrogen"];
          backgroundColor = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4"];
        } else if (rec.title.includes("Energy") || rec.title.includes("Renewable")) {
          data = [100, 60, 0, 2, 4, 6];
          labels = ["Coal", "Natural Gas", "Solar", "Wind", "Hydro", "Biomass"];
          backgroundColor = ["#ef4444", "#f97316", "#10b981", "#06b6d4", "#3b82f6", "#84cc16"];
        } else if (rec.title.includes("Transport") || rec.title.includes("Travel")) {
          data = [170, 140, 104, 14, 6, 1];
          labels = ["Air", "Car (Gasoline)", "Car (Diesel)", "Train", "Bus", "Electric Vehicle"];
          backgroundColor = ["#ef4444", "#f97316", "#f59e0b", "#3b82f6", "#84cc16", "#10b981"];
        } else if (rec.title.includes("Waste")) {
          data = [600, 240, 70, 18];
          labels = ["Landfill", "Incineration", "Recycling", "Composting"];
          backgroundColor = ["#ef4444", "#f97316", "#10b981", "#84cc16"];
        } else if (rec.title.includes("HVAC")) {
          data = [100, 70, 45, 30];
          labels = ["Standard HVAC", "High-Efficiency HVAC", "Smart HVAC", "Heat Pump"];
          backgroundColor = ["#ef4444", "#f97316", "#10b981", "#06b6d4"];
        } else if (rec.title.includes("Production")) {
          data = [100, 80, 60, 40];
          labels = ["Current Process", "Optimized Process", "Heat Recovery", "Advanced Automation"];
          backgroundColor = ["#ef4444", "#f97316", "#10b981", "#06b6d4"];
        } else {
          data = [100, rec.potential / (rec.potential * 0.3) * 100];
          labels = ["Current Emissions", "With Implemented Recommendation"];
          backgroundColor = ["#ef4444", "#10b981"];
        }

        new Chart(chartRef, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Emissions (relative scale)",
                data: data,
                backgroundColor: backgroundColor,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Impact Comparison",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    });
  };

  useEffect(() => {
    if (recommendations.length > 0 && activeTab === "recommendations") {
      // Use a timeout to ensure the DOM is updated before attempting to access the canvas elements
      const timer = setTimeout(() => {
        createRecommendationCharts();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [recommendations, activeTab]);

  return (
    <div className="container-xl">
      {/* Charts Section */}
      {report?.includeCharts === "yes" && (
        <div className="row row-cards mb-4">
          <div className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  Potential Emission Reductions by Scope
                </h3>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <canvas
                    id="emissionReductionPotentialChart"
                    ref={emissionReductionPotentialChartRef}
                  ></canvas>
                </div>
                <p className="text-muted mt-2">
                  <small>
                    Source: IPCC, 2022: Climate Change 2022: Mitigation of Climate
                    Change; IEA, 2023: Net Zero Roadmap.
                  </small>
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  Fuel Types Carbon Intensity Comparison
                </h3>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <canvas
                    id="fuelEfficiencyChart"
                    ref={fuelEfficiencyChartRef}
                  ></canvas>
                </div>
                <p className="text-muted mt-2">
                  <small>
                    Source: IEA, 2024: Greenhouse Gas Emissions from Energy; EPA, 2023: Emission Factors for Greenhouse Gas Inventories.
                  </small>
                </p>
              </div>
            </div>
          </div>
          {calculateTotalEmissions.scope2 > 0 && (
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Impact of Energy Efficiency Measures
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <canvas
                      id="energyEfficiencyChart"
                      ref={energyEfficiencyChartRef}
                    ></canvas>
                  </div>
                  <p className="text-muted mt-2">
                    <small>
                      Source: US DOE, 2023: Energy Efficiency and Renewable Energy
                      Reports; IRENA, 2023: Renewable Power Generation Costs.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
          {calculateTotalEmissions.scope3 > 0 && (
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Transport Emission Reduction Strategies
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <canvas
                      id="transportOptimizationChart"
                      ref={transportOptimizationChartRef}
                    ></canvas>
                  </div>
                  <p className="text-muted mt-2">
                    <small>
                      Source: Smart Freight Centre, 2023: Global Logistics
                      Emissions Council; IEA, 2023: The Future of Electric
                      Vehicles.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
          {calculateTotalEmissions.scope3 > 0 && (
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Impact of Waste Management Strategies
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <canvas
                      id="wasteManagementChart"
                      ref={wasteManagementChartRef}
                    ></canvas>
                  </div>
                  <p className="text-muted mt-2">
                    <small>
                      Source: EPA, 2023: Advancing Sustainable Materials
                      Management; EU, 2023: Circular Economy Action Plan.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
          {calculateTotalEmissions.scope3 > 0 && (
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Business Travel Emission Reduction Strategies
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <canvas
                      id="businessTravelChart"
                      ref={businessTravelChartRef}
                    ></canvas>
                  </div>
                  <p className="text-muted mt-2">
                    <small>
                      Source: WRI, 2022: GHG Protocol Corporate Value Chain (Scope
                      3) Standard; IATA, 2023: Sustainable Aviation Strategies.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations Swipeable Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">
            <IconBulb size={24} className="me-2" />
            Recommendations for Emission Reduction
          </h3>
        </div>
        <div className="card-body">
          <p className="text-secondary mb-4">
            Swipe to explore tailored recommendations to reduce your carbon
            footprint across different scopes.
          </p>
          {recommendations.length > 0 ? (
            <div
              className="d-flex flex-nowrap overflow-x-auto pb-3"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "thin",
              }}
            >
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="card flex-shrink-0 mx-2"
                  style={{
                    width: "300px",
                    scrollSnapAlign: "start",
                  }}
                >
                  <div className="card-body">
                    <h4 className="card-title">{rec.title}</h4>
                    <p className="text-secondary">{rec.description}</p>
                    <p className="text-primary fw-bold">{rec.impact}</p>
                    <p className="text-muted">
                      <small>Source: {rec.sources[0].title}</small>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No specific recommendations available based on the current data.
              Please ensure emission data is complete for all relevant scopes.
            </div>
          )}
        </div>
      </div>
 

      {/* Inline CSS for swipeable container */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default RecommendationsTab;