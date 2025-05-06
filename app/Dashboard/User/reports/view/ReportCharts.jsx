"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const ReportCharts = ({ report, activeTab, calculateTotalEmissions, getScope1Details, getScope2Details, getScope3Details, getFuelTypes, getCoolingTypes, getHeatingTypes, getTransportModes, getWasteTypes }) => {
  // Chart refs
  const emissionsBySourceChartRef = useRef(null);
  const scopeDistributionChartRef = useRef(null);
  const emissionIntensityChartRef = useRef(null);
  const carbonFootprintChartRef = useRef(null);
  const emissionsByCategoryChartRef = useRef(null);
  const scope1BreakdownChartRef = useRef(null);
  const fuelTypeChartRef = useRef(null);
  const fuelEmissionIntensityChartRef = useRef(null);
  const scope2BreakdownChartRef = useRef(null);
  const electricitySourceChartRef = useRef(null);
  const energyConsumptionChartRef = useRef(null);
  const scope3BreakdownChartRef = useRef(null);
  const transportModeChartRef = useRef(null);
  const wasteTypeChartRef = useRef(null);
  const businessTravelChartRef = useRef(null);

  // Chart instances
  const [charts, setCharts] = useState({});
  const initializeTimeoutRef = useRef(null);

  useEffect(() => {
    if (report && report.includeCharts === "yes") {
      // Debounce chart initialization
      if (initializeTimeoutRef.current) {
        clearTimeout(initializeTimeoutRef.current);
      }
      initializeTimeoutRef.current = setTimeout(() => {
        console.log("Initializing charts for activeTab:", activeTab);
        initializeCharts();
      }, 100);
    }

    return () => {
      console.log("Cleaning up charts");
      if (initializeTimeoutRef.current) {
        clearTimeout(initializeTimeoutRef.current);
      }
      Object.values(charts).forEach(chart => {
        if (chart) {
          console.log("Destroying chart:", chart.canvas?.id);
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
    const coolingTypes = getCoolingTypes();
    const heatingTypes = getHeatingTypes();
    const transportModes = getTransportModes();
    const wasteTypes = getWasteTypes();

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
    };

    console.log("Destroying existing charts");
    Object.values(charts).forEach(chart => {
      if (chart) {
        console.log("Destroying chart:", chart.canvas.id);
        chart.destroy();
      }
    });

    const newCharts = {};

    try {
      // Scope Distribution Pie Chart
      if (scopeDistributionChartRef.current && activeTab === "overview") {
        newCharts.scopeDistribution = new Chart(scopeDistributionChartRef.current, {
          type: "pie",
          data: {
            labels: ["Scope 1", "Scope 2", "Scope 3"],
            datasets: [
              {
                data: [emissionTotals.scope1, emissionTotals.scope2, emissionTotals.scope3],
                backgroundColor: ["#328E6E", "#67AE6E", "#90C67C"],
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
                text: "Émissions par Scope",
              },
            },
          },
        });
      }

      // Emissions by Source Chart
      if (emissionsBySourceChartRef.current && activeTab === "overview") {
        const sources = [
          { name: "Combustion de carburants", value: scope1Details.fuelEmissions },
          { name: "Production", value: scope1Details.productionEmissions },
          { name: "Refroidissement", value: scope2Details.coolingEmissions },
          { name: "Chauffage", value: scope2Details.heatingEmissions },
          { name: "Électricité", value: scope2Details.energyConsumptionEmissions },
          { name: "Déplacements professionnels", value: scope3Details.businessTravelEmissions },
          { name: "Transports", value: scope3Details.transportEmissions },
          { name: "Déchets", value: scope3Details.wasteEmissions },
          { name: "Biens d'équipement", value: scope3Details.capitalGoodEmissions },
        ].filter(s => s.value > 0);

        sources.sort((a, b) => b.value - a.value);

        newCharts.emissionsBySource = new Chart(emissionsBySourceChartRef.current, {
          type: "bar",
          data: {
            labels: sources.map(s => s.name),
            datasets: [
              {
                label: "tCO₂",
                data: sources.map(s => s.value),
                backgroundColor: "#328E6E",
                borderWidth: 1,
              },
            ],
          },
          options: {
            ...chartOptions,
            indexAxis: "y",
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: "Émissions par source",
              },
            },
          },
        });
      }

      // Emission Intensity Chart
      if (emissionIntensityChartRef.current && activeTab === "overview") {
        const intensityData = [
          { name: "Fabrication", value: emissionTotals.total * 0.4 / 100 },
          { name: "Opérations de bureau", value: emissionTotals.total * 0.15 / 100 },
          { name: "Transport", value: emissionTotals.total * 0.25 / 100 },
          { name: "Chauffage et refroidissement", value: emissionTotals.total * 0.2 / 100 },
        ];

        newCharts.emissionIntensity = new Chart(emissionIntensityChartRef.current, {
          type: "bar",
          data: {
            labels: intensityData.map(d => d.name),
            datasets: [
              {
                label: "Intensité des émissions (tCO₂ par unité)",
                data: intensityData.map(d => d.value),
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
                text: "Intensité des émissions par activité",
              },
            },
          },
        });
      }

      // Carbon Footprint Comparison Chart
      if (carbonFootprintChartRef.current && activeTab === "overview") {
        const comparisonData = {
          labels: ["Your Company", "Industry Average", "Best in Class"],
          values: [emissionTotals.total, emissionTotals.total * 1.3, emissionTotals.total * 0.7],
        };

        newCharts.carbonFootprint = new Chart(carbonFootprintChartRef.current, {
          type: "bar",
          data: {
            labels: comparisonData.labels,
            datasets: [
              {
                label: "Carbon Footprint (tCO₂)",
                data: comparisonData.values,
                backgroundColor: ["#67AE6E", "#90C67C", "#E1EEBC"],
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
                text: "Carbon Footprint Comparison",
              },
            },
          },
        });
      }

      // Emissions by Category Chart
      if (emissionsByCategoryChartRef.current && activeTab === "overview") {
        const categoryData = {
          labels: ["Combustion de carburant", "Processus de production", "Transport", "Chauffage et refroidissement"],
          datasets: [
            {
              label: "tCO₂",
              data: [
                scope1Details.fuelEmissions,
                scope1Details.productionEmissions,
                scope3Details.transportEmissions,
                scope2Details.coolingEmissions + scope2Details.heatingEmissions,
              ],
              backgroundColor: ["#328E6E", "#67AE6E", "#90C67C", "#E1EEBC"],
              borderWidth: 1,
            },
          ],
        };

        newCharts.emissionsByCategory = new Chart(emissionsByCategoryChartRef.current, {
          type: "doughnut",
          data: categoryData,
          options: {
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: "Émissions par catégorie",
              },
            },
          },
        });
      }

      // Scope 1 Breakdown Chart
      if (scope1BreakdownChartRef.current && activeTab === "scope1") {
        newCharts.scope1Breakdown = new Chart(scope1BreakdownChartRef.current, {
          type: "pie",
          data: {
            labels: ["Combustion de carburant", "Processus de production"],
            datasets: [
              {
                data: [scope1Details.fuelEmissions, scope1Details.productionEmissions],
                backgroundColor: ["#206bc4", "#4299e1"],
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
                text: "Répartition des émissions de Scope 1",
              },
            },
          },
        });
      }

      // Fuel Type Chart
      if (fuelTypeChartRef.current && activeTab === "scope1" && fuelTypes.length > 0) {
        newCharts.fuelTypeChart = new Chart(fuelTypeChartRef.current, {
          type: "doughnut",
          data: {
            labels: fuelTypes.map(f => f.type),
            datasets: [
              {
                data: fuelTypes.map(f => f.emissions),
                backgroundColor: ["#206bc4", "#4299e1", "#1a9c86", "#2fb344", "#f59f00"].slice(0, fuelTypes.length),
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
                text: "Émissions par type de carburant",
              },
            },
          },
        });
      }

      // Fuel Emission Intensity Chart
      if (fuelEmissionIntensityChartRef.current && activeTab === "scope1" && fuelTypes.length > 0) {
        const intensityData = fuelTypes.map(fuelType => ({
          type: fuelType.type,
          intensity: fuelType.emissions / (Math.random() * 50 + 10),
        }));

        newCharts.fuelEmissionIntensity = new Chart(fuelEmissionIntensityChartRef.current, {
          type: "bar",
          data: {
            labels: intensityData.map(d => d.type),
            datasets: [
              {
                label: "Intensité des émissions (kgCO₂e par unité)",
                data: intensityData.map(d => d.intensity),
                backgroundColor: "#4299e1",
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
                text: "Intensité des émissions de carburant",
              },
            },
          },
        });
      }

      // Scope 2 Breakdown Chart
      if (scope2BreakdownChartRef.current && activeTab === "scope2") {
        newCharts.scope2Breakdown = new Chart(scope2BreakdownChartRef.current, {
          type: "doughnut",
          data: {
            labels: ["Systèmes de refroidissement", "Systèmes de chauffage", "Consommation d'électricité"],
            datasets: [
              {
                data: [
                  scope2Details.coolingEmissions,
                  scope2Details.heatingEmissions,
                  scope2Details.energyConsumptionEmissions,
                ],
                backgroundColor: ["#4299e1", "#ae3ec9", "#94d82d"],
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
                text: "Répartition des émissions de Scope 2",
              },
            },
          },
        });
      }

      // Electricity Source Chart
      if (electricitySourceChartRef.current && activeTab === "scope2") {
        const sourceData = [
          { source: "Électricité", value: scope2Details.energyConsumptionEmissions * 0.85 },
          { source: "Énergie renouvelable", value: scope2Details.energyConsumptionEmissions * 0.15 },
        ];

        newCharts.electricitySource = new Chart(electricitySourceChartRef.current, {
          type: "pie",
          data: {
            labels: sourceData.map(d => d.source),
            datasets: [
              {
                data: sourceData.map(d => d.value),
                backgroundColor: ["#ae3ec9", "#2fb344"],
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
                text: "Sources d'électricité",
              },
            },
          },
        });
      }

      // Energy Consumption Chart
      if (energyConsumptionChartRef.current && activeTab === "scope2") {
        const energyTypes = [
          ...coolingTypes.map(type => ({ ...type, category: "Refroidissement" })),
          ...heatingTypes.map(type => ({ ...type, category: "Chauffage" })),
        ];

        const datasets = [];
        const categoryColors = { Refroidissement: "#4299e1", Chauffage: "#ae3ec9" };

        const uniqueTypes = [...new Set(energyTypes.map(item => item.type))];
        const categories = [...new Set(energyTypes.map(item => item.category))];

        categories.forEach(category => {
          const data = [];
          uniqueTypes.forEach(type => {
            const item = energyTypes.find(i => i.type === type && i.category === category);
            data.push(item ? item.emissions : 0);
          });

          datasets.push({
            label: category,
            data: data,
            backgroundColor: categoryColors[category] || "#94d82d",
            borderWidth: 1,
          });
        });

        newCharts.energyConsumption = new Chart(energyConsumptionChartRef.current, {
          type: "bar",
          data: {
            labels: uniqueTypes,
            datasets: datasets,
          },
          options: {
            ...chartOptions,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: "Consommation d'énergie par type",
              },
            },
          },
        });
      }

      // Scope 3 Breakdown Chart
      if (scope3BreakdownChartRef.current && activeTab === "scope3") {
        newCharts.scope3Breakdown = new Chart(scope3BreakdownChartRef.current, {
          type: "polarArea",
          data: {
            labels: ["Voyages d'affaires", "Transport", "Gestion des déchets", "Biens d'équipement"],
            datasets: [
              {
                data: [
                  scope3Details.businessTravelEmissions,
                  scope3Details.transportEmissions,
                  scope3Details.wasteEmissions,
                  scope3Details.capitalGoodEmissions,
                ],
                backgroundColor: ["#4299e1", "#ae3ec9", "#94d82d", "#f59f00"],
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
                text: "Répartition des émissions de Scope 3",
              },
            },
          },
        });
      }

      // Transport Mode Chart
      if (transportModeChartRef.current && activeTab === "scope3" && transportModes.length > 0) {
        newCharts.transportMode = new Chart(transportModeChartRef.current, {
          type: "pie",
          data: {
            labels: transportModes.map(t => t.mode),
            datasets: [
              {
                data: transportModes.map(t => t.emissions),
                backgroundColor: ["#4299e1", "#ae3ec9", "#94d82d", "#f59f00", "#206bc4"].slice(0, transportModes.length),
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
                text: "Émissions par mode de transport",
              },
            },
          },
        });
      }

      // Waste Type Chart
      if (wasteTypeChartRef.current && activeTab === "scope3" && wasteTypes.length > 0) {
        newCharts.wasteType = new Chart(wasteTypeChartRef.current, {
          type: "doughnut",
          data: {
            labels: wasteTypes.map(w => w.type),
            datasets: [
              {
                data: wasteTypes.map(w => w.emissions),
                backgroundColor: ["#94d82d", "#f59f00", "#4299e1", "#ae3ec9"].slice(0, wasteTypes.length),
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
                text: "Émissions de déchets par type",
              },
            },
          },
        });
      }

      // Business Travel Chart
      if (businessTravelChartRef.current && activeTab === "scope3" && report.scope3Data?.businessTravel) {
        const travelPurposes = new Map();
        report.scope3Data.businessTravel.forEach(travel => {
          const purpose = travel.purpose;
          const emissions = parseFloat(travel.emissions) || 0;
          travelPurposes.set(purpose, (travelPurposes.get(purpose) || 0) + emissions);
        });

        const purposeData = Array.from(travelPurposes).map(([purpose, emissions]) => ({ purpose, emissions }));

        newCharts.businessTravel = new Chart(businessTravelChartRef.current, {
          type: "bar",
          data: {
            labels: purposeData.map(d => d.purpose),
            datasets: [
              {
                label: "Émissions (tCO₂)",
                data: purposeData.map(d => d.emissions),
                backgroundColor: "#4299e1",
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
                text: "Émissions liées aux voyages d'affaires par objectif",
              },
            },
          },
        });
      }
    } catch (error) {
      console.error("Error initializing charts:", error);
    }

    setCharts(newCharts);
  };

  return (
    <>
      {report?.includeCharts === "yes" && (
        <div className="row row-cards mt-3">
          {activeTab === "overview" && (
            <>
              <div className="">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Émissions par scope</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="scopeDistributionChart" ref={scopeDistributionChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Émissions par source</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="emissionsBySourceChart" ref={emissionsBySourceChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Intensité des émissions par activité</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="emissionIntensityChart" ref={emissionIntensityChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Comparaison de l’empreinte carbone</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas  id="carbonFootprintChart" ref={carbonFootprintChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Émissions par catégorie</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="emissionsByCategoryChart" ref={emissionsByCategoryChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "scope1" && (
            <>
              <div className="">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Répartition des émissions Scope 1</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="scope1BreakdownChart" ref={scope1BreakdownChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Émissions par Type de Carburant</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="fuelTypeChart" ref={fuelTypeChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Intensité des Émissions de Carburant</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="fuelEmissionIntensityChart" ref={fuelEmissionIntensityChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "scope2" && (
            <>
              <div className="">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Répartition des émissions du Scope 2</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="scope2BreakdownChart" ref={scope2BreakdownChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Sources d'Électricité</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center  justify-content-center">
                      <canvas className="w-100" id="electricitySourceChart" ref={electricitySourceChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Consommation d'Énergie par Type</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas className="w-100" id="energyConsumptionChart" ref={energyConsumptionChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "scope3" && (
            <>
              <div className="">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Répartition des émissions du Scope 3</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas className="w-100" id="scope3BreakdownChart" ref={scope3BreakdownChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Émissions par mode de transport</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas className="w-100" id="transportModeChart" ref={transportModeChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Émissions de déchets par type</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="wasteTypeChart" ref={wasteTypeChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Émissions de déplacements professionnels par objectif</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
                      <canvas className="w-100" id="businessTravelChart" ref={businessTravelChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ReportCharts;