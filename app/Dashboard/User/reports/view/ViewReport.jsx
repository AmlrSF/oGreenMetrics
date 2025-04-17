"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Chart from "chart.js/auto";

const ViewReport = ({ id }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(null); // Will be set based on report.detailLevel
  const router = useRouter();
  const chartRefs = useRef({});

  useEffect(() => {
    if (id) {
      fetchReportData(id);
    }
    return () => {
      Object.values(chartRefs.current).forEach(chart => chart?.destroy());
    };
  }, [id]);

  useEffect(() => {
    if (report) {
      setViewMode(report.detailLevel || 'summary');
      createCharts();
    }
  }, [report]);

  const fetchReportData = async (reportId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/report/${reportId}`);
      if (!response.ok) throw new Error("Failed to fetch report data");
      const data = await response.json();
      console.log("Fetched Report Data:", data.data);
      
      setReport(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalEmissions = () => {
    if (!report) return { scope1: 0, scope2: 0, scope3: 0, total: 0 };

    // Scope 1 calculations
    const fuelCombustionEmissions = report.scope1Data?.fuelCombution?.[0]?.totalEmissions || 0;
    const productionEmissions = report.scope1Data?.production?.[0]?.totalEmissions || 0;
    const scope1Total = fuelCombustionEmissions + productionEmissions;

    // Scope 2 calculations
    let scope2Total = 0;
    if (report.scope2Data) {
      scope2Total += report.scope2Data.heating?.[0]?.totalEmissions || report.scope2Data.heating?.totalEmissions || 0;
      scope2Total += report.scope2Data.cooling?.[0]?.totalEmissions || report.scope2Data.cooling?.totalEmissions || 0;
      scope2Total += report.scope2Data.energyConsumption?.emissions || report.scope2Data.energyConsumption?.[0]?.emissions || 0;
    }

    // Scope 3 calculations
    let transportEmissions = 0;
    let wasteEmissions = 0;
    let capitalGoodsEmissions = 0;
    let businessTravelEmissions = 0;

    if (report.scope3Data) {
      report.scope3Data.transport?.forEach(item => {
        transportEmissions += Number(item.emissions) || 0;
      });

      report.scope3Data.dechet?.forEach(item => {
        wasteEmissions += Number(item.emissions) || 0;
      });

      report.scope3Data.capitalGood?.forEach(item => {
        capitalGoodsEmissions += Number(item.emissions) || 0;
      });

      report.scope3Data.businessTravel?.forEach(item => {
        businessTravelEmissions += Number(item.emissions) || 0;
      });
    }

    const scope3Total = transportEmissions + wasteEmissions + capitalGoodsEmissions + businessTravelEmissions;
    const total = scope1Total + scope2Total + scope3Total;

    return {
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total: total,
      scope1Details: {
        fuelCombustion: fuelCombustionEmissions,
        production: productionEmissions
      },
      scope2Details: {
        heating: report.scope2Data?.heating?.[0]?.totalEmissions || report.scope2Data?.heating?.totalEmissions || 0,
        cooling: report.scope2Data?.cooling?.[0]?.totalEmissions || report.scope2Data?.cooling?.totalEmissions || 0,
        energyConsumption: report.scope2Data?.energyConsumption?.emissions || report.scope2Data?.energyConsumption?.[0]?.emissions || 0
      },
      scope3Details: {
        transport: transportEmissions,
        waste: wasteEmissions,
        capitalGoods: capitalGoodsEmissions,
        businessTravel: businessTravelEmissions
      }
    };
  };

  const calculateFuelTypeSums = () => {
    const fuelSums = {};
    report?.scope1Data?.fuelCombution?.[0]?.machines?.forEach(machine => {
      const fuelType = machine.typeDeCarburant || "Unknown";
      fuelSums[fuelType] = (fuelSums[fuelType] || 0) + Number(machine.co2Emission || 0);
    });
    return fuelSums;
  };

  const calculateFuelMachineDetails = () => {
    const machineData = [];
    
    report?.scope1Data?.fuelCombution?.[0]?.machines?.forEach(machine => {
      machineData.push({
        name: machine.nom,
        model: machine.modele,
        fuelType: machine.typeDeCarburant,
        quantity: machine.quantite,
        emissions: machine.co2Emission,
        emissionFactor: machine.emissionFactor
      });
    });
    
    return machineData;
  };

  const calculateProductionDetails = () => {
    const productionData = [];
    
    report?.scope1Data?.production?.[0]?.products?.forEach(product => {
      productionData.push({
        name: product.nom,
        quantity: product.quantite,
        emissions: product.co2Emission
      });
    });
    
    return productionData;
  };

  const calculateHeatingCoolingDetails = () => {
    const heatingData = [];
    const coolingData = [];

    console.log("Scope 2 Heating Data:", report?.scope2Data?.heating);
    console.log("Scope 2 Cooling Data:", report?.scope2Data?.cooling);

    report?.scope2Data?.heating?.heaters?.forEach(heater => {
      heatingData.push({
        name: heater.name,
        type: heater.type,
        energy: heater.energy,
        emissionFactor: heater.emissionFactor,
        emissions: heater.emissions
      });
    });

    report?.scope2Data?.cooling?.coolers?.forEach(cooler => {
      coolingData.push({
        name: cooler.name,
        type: cooler.type,
        energy: cooler.energy,
        emissionFactor: cooler.emissionFactor,
        emissions: cooler.emissions
      });
    });

    return { heatingData, coolingData };
  };

  const calculateEmissionsByHeaterCoolerType = () => {
    const heatingSums = {
      "Electric Heating": 0,
      "District Heating": 0,
      "Other Heating": 0
    };
    const coolingSums = {
      "Electric Cooling": 0,
      "District Cooling": 0,
      "Other Cooling": 0
    };

    report?.scope2Data?.heating?.heaters?.forEach(heater => {
      const type = heater.type?.toLowerCase();
      if (type?.includes("electric")) {
        heatingSums["Electric Heating"] += Number(heater.emissions || 0);
      } else if (type?.includes("district")) {
        heatingSums["District Heating"] += Number(heater.emissions || 0);
      } else {
        heatingSums["Other Heating"] += Number(heater.emissions || 0);
      }
    });

    report?.scope2Data?.cooling?.coolers?.forEach(cooler => {
      const type = cooler.type?.toLowerCase();
      if (type?.includes("electric")) {
        coolingSums["Electric Cooling"] += Number(cooler.emissions || 0);
      } else if (type?.includes("district")) {
        coolingSums["District Cooling"] += Number(cooler.emissions || 0);
      } else {
        coolingSums["Other Cooling"] += Number(cooler.emissions || 0);
      }
    });

    console.log("Heating Sums:", heatingSums);
    console.log("Cooling Sums:", coolingSums);

    return { heatingSums, coolingSums };
  };

  const calculateScope3Details = () => {
    const transportDetails = report?.scope3Data?.transport || [];
    const wasteDetails = report?.scope3Data?.dechet || [];
    const capitalGoodsDetails = report?.scope3Data?.capitalGood || [];
    const businessTravelDetails = report?.scope3Data?.businessTravel || [];
    
    return {
      transport: transportDetails,
      waste: wasteDetails,
      capitalGoods: capitalGoodsDetails,
      businessTravel: businessTravelDetails
    };
  };

  const createCharts = () => {
    const emissions = calculateTotalEmissions();
    const fuelSums = calculateFuelTypeSums();
    const { heatingSums, coolingSums } = calculateEmissionsByHeaterCoolerType();
    const scope3Details = emissions.scope3Details;

    Object.values(chartRefs.current).forEach(chart => chart?.destroy());
    chartRefs.current = {};

    const ctxScopeDistribution = document.getElementById("scope-distribution-chart");
    if (ctxScopeDistribution) {
      chartRefs.current.scopeDistribution = new Chart(ctxScopeDistribution, {
        type: "pie",
        data: {
          labels: ["Scope 1", "Scope 2", "Scope 3"],
          datasets: [{
            data: [emissions.scope1, emissions.scope2, emissions.scope3],
            backgroundColor: ["#206bc4", "#4299e1", "#2d9d78"],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Total Emissions by Scope'
            },
            legend: {
              position: 'right'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%";
                  return `${context.label}: ${value.toFixed(2)} tCO₂e (${percentage})`;
                }
              }
            }
          }
        }
      });
    }

    const ctxScope1Breakdown = document.getElementById("scope1-breakdown-chart");
    if (ctxScope1Breakdown) {
      chartRefs.current.scope1Breakdown = new Chart(ctxScope1Breakdown, {
        type: "pie",
        data: {
          labels: ["Fuel Combustion", "Process Emissions"],
          datasets: [{
            data: [emissions.scope1Details.fuelCombustion, emissions.scope1Details.production],
            backgroundColor: ["#206bc4", "#4299e1"],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Scope 1 Emissions Breakdown'
            },
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%";
                  return `${context.label}: ${value.toFixed(2)} tCO₂e (${percentage})`;
                }
              }
            }
          }
        }
      });
    }

    const ctxScope1Fuel = document.getElementById("scope1-fuel-chart");
    if (ctxScope1Fuel && Object.keys(fuelSums).length > 0) {
      chartRefs.current.scope1Fuel = new Chart(ctxScope1Fuel, {
        type: "bar",
        data: {
          labels: Object.keys(fuelSums),
          datasets: [{
            label: "Emissions by Fuel Type (tCO₂e)",
            data: Object.values(fuelSums),
            backgroundColor: [
              "#206bc4", "#4299e1", "#2d9d78", "#79c6ac", "#f59f00", "#e74c3c"
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Emissions by Fuel Type'
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Emissions (tCO₂e)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Fuel Type'
              }
            }
          }
        }
      });
    }

    const ctxScope2Breakdown = document.getElementById("scope2-breakdown-chart");
    if (ctxScope2Breakdown) {
      chartRefs.current.scope2Breakdown = new Chart(ctxScope2Breakdown, {
        type: "pie",
        data: {
          labels: ["Heating", "Cooling", "Electricity Consumption"],
          datasets: [{
            data: [
              emissions.scope2Details.heating,
              emissions.scope2Details.cooling,
              emissions.scope2Details.energyConsumption
            ],
            backgroundColor: ["#206bc4", "#4299e1", "#2d9d78"],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Scope 2 Emissions Breakdown'
            },
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%";
                  return `${context.label}: ${value.toFixed(2)} tCO₂e (${percentage})`;
                }
              }
            }
          }
        }
      });
    }

    const ctxScope2HeatingCooling = document.getElementById("scope2-heating-cooling-chart");
    if (ctxScope2HeatingCooling) {
      const allTypes = [...Object.keys(heatingSums), ...Object.keys(coolingSums)].filter(
        (value, index, self) => self.indexOf(value) === index
      );

      chartRefs.current.scope2HeatingCooling = new Chart(ctxScope2HeatingCooling, {
        type: "bar",
        data: {
          labels: allTypes.length > 0 ? allTypes : ['No Data'],
          datasets: [{
            label: "Emissions (tCO₂e)",
            data: allTypes.length > 0 ? allTypes.map(type => (heatingSums[type] || 0) + (coolingSums[type] || 0)) : [0],
            backgroundColor: [
              "#206bc4", "#4299e1", "#2d9d78", "#79c6ac", "#f59f00", "#e74c3c"
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Heating and Cooling Emissions by Type'
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Emissions (tCO₂e)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Energy Type'
              }
            }
          }
        }
      });
    }

    const ctxScope3Categories = document.getElementById("scope3-categories-chart");
    if (ctxScope3Categories) {
      chartRefs.current.scope3Categories = new Chart(ctxScope3Categories, {
        type: "pie",
        data: {
          labels: ["Business Travel", "Transport", "Waste", "Capital Goods"],
          datasets: [{
            data: [
              scope3Details.businessTravel,
              scope3Details.transport,
              scope3Details.waste,
              scope3Details.capitalGoods
            ],
            backgroundColor: ["#206bc4", "#4299e1", "#2d9d78", "#79c6ac"],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Scope 3 Emissions by Category'
            },
            legend: {
              position: 'right'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%";
                  return `${context.label}: ${value.toFixed(2)} tCO₂e (${percentage})`;
                }
              }
            }
          }
        }
      });
    }

    const ctxScope3CategoriesBar = document.getElementById("scope3-categories-bar-chart");
    if (ctxScope3CategoriesBar) {
      chartRefs.current.scope3CategoriesBar = new Chart(ctxScope3CategoriesBar, {
        type: "bar",
        data: {
          labels: ["Business Travel", "Transport", "Waste", "Capital Goods"],
          datasets: [{
            label: "Emissions (tCO₂e)",
            data: [
              scope3Details.businessTravel,
              scope3Details.transport,
              scope3Details.waste,
              scope3Details.capitalGoods
            ],
            backgroundColor: ["#206bc4", "#4299e1", "#2d9d78", "#79c6ac"],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Scope 3 Emissions by Category'
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Emissions (tCO₂e)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Category'
              }
            }
          }
        }
      });
    }

    const ctxEmissionsTrend = document.getElementById("emissions-trend-chart");
    if (ctxEmissionsTrend) {
      chartRefs.current.emissionsTrend = new Chart(ctxEmissionsTrend, {
        type: "line",
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            {
              label: "Scope 1",
              data: [emissions.scope1 * 0.2, emissions.scope1 * 0.3, emissions.scope1 * 0.25, emissions.scope1 * 0.25],
              borderColor: "#206bc4",
              backgroundColor: "#206bc422",
              fill: true,
              tension: 0.3
            },
            {
              label: "Scope 2",
              data: [emissions.scope2 * 0.3, emissions.scope2 * 0.2, emissions.scope2 * 0.2, emissions.scope2 * 0.3],
              borderColor: "#4299e1",
              backgroundColor: "#4299e122",
              fill: true,
              tension: 0.3
            },
            {
              label: "Scope 3",
              data: [emissions.scope3 * 0.2, emissions.scope3 * 0.2, emissions.scope3 * 0.3, emissions.scope3 * 0.3],
              borderColor: "#2d9d78",
              backgroundColor: "#2d9d7822",
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Quarterly Emissions Trend (Estimated)'
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              title: {
                display: true,
                text: 'Emissions (tCO₂e)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Quarter'
              }
            }
          }
        }
      });
    }
  };

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getEmissionIntensity = (emissions, metric = 'production') => {
    const productionVolume = report?.scope1Data?.production?.[0]?.products?.reduce((sum, p) => sum + p.quantite, 0) || 1;
    return (emissions / productionVolume).toFixed(2);
  };

  if (loading) return (
    <div className="container text-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading emission data...</p>
    </div>
  );
  
  if (error) return (
    <div className="container p-5">
      <div className="alert alert-danger">
        <h4 className="alert-heading">Error Loading Report</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Please try again or contact support if the issue persists.</p>
      </div>
    </div>
  );
  if (!report) return (
    <div className="container p-5">
      <div className="alert alert-warning">
        <h4 className="alert-heading">Report Not Found</h4>
        <p>The requested emissions report could not be found.</p>
        <button className="btn btn-outline-warning mt-3" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    </div>
  );

  const emissions = calculateTotalEmissions();
  const fuelSums = calculateFuelTypeSums();
  const machineDetails = calculateFuelMachineDetails();
  const productionDetails = calculateProductionDetails();
  const { heatingData, coolingData } = calculateHeatingCoolingDetails();
  const scope3Details = calculateScope3Details();
  const generationDate = new Date(report.generatedAt || Date.now()).toLocaleDateString();
  const isSummary = report.detailLevel === 'summary';

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-outline-primary" onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-left" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12l14 0"></path>
              <path d="M5 12l6 6"></path>
              <path d="M5 12l6 -6"></path>
            </svg>
            Back
          </button>
        </div>
        <div className="btn-group">
          <button className="btn btn-light" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
              <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
              <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"></path>
            </svg>
            Print
          </button>
          <button className="btn btn-primary" onClick={() => alert("PDF download to be implemented")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
              <path d="M7 11l5 5l5 -5"></path>
              <path d="M12 4l0 12"></path>
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body text-center py-4">
          <h1 className="card-title mb-3">GHG Emissions Report</h1>
          <p className="text-muted mb-3">Generated on {generationDate}</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <span className="badge bg-blue-lt fs-6 py-2 px-3">Reporting Year: {report.Year} </span>
            <span className="badge bg-green-lt fs-6 py-2 px-3">  {isSummary ? "Summary Report" : "Detailed Report"} </span>
          </div>
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Total Emissions Summary</h3>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <span className="avatar avatar-xl rounded bg-blue-lt">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-cloud" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878"></path>
                    </svg>
                  </span>
                </div>
                <div>
                  <h2 className="mb-0">{formatNumberWithCommas(emissions.total)} tCO₂e</h2>
                  <div className="text-muted">Total GHG Emissions</div>
                </div>
              </div>
              
              <div className="progress progress-separated mb-3">
                {emissions.total > 0 && (
                  <>
                    <div className="progress-bar bg-primary" role="progressbar" style={{width: `${(emissions.scope1 / emissions.total) * 100}%`}}></div>
                    <div className="progress-bar bg-info" role="progressbar" style={{width: `${(emissions.scope2 / emissions.total) * 100}%`}}></div>
                    <div className="progress-bar bg-success" role="progressbar" style={{width: `${(emissions.scope3 / emissions.total) * 100}%`}}></div>
                  </>
                )}
              </div>
              
              <div className="row">
                <div className="col-auto d-flex align-items-center pe-2">
                  <span className="legend me-2 bg-primary"></span>
                  <span>Scope 1: {formatNumberWithCommas(emissions.scope1)} tCO₂e</span>
                  <span className="d-none d-md-inline text-muted ms-2">({emissions.total > 0 ? ((emissions.scope1 / emissions.total) * 100).toFixed(1) : 0}%)</span>
                </div>
                <div className="col-auto d-flex align-items-center px-2">
                  <span className="legend me-2 bg-info"></span>
                  <span>Scope 2: {formatNumberWithCommas(emissions.scope2)} tCO₂e</span>
                  <span className="d-none d-md-inline text-muted ms-2">({emissions.total > 0 ? ((emissions.scope2 / emissions.total) * 100).toFixed(1) : 0}%)</span>
                </div>
                <div className="col-auto d-flex align-items-center ps-2">
                  <span className="legend me-2 bg-success"></span>
                  <span>Scope 3: {formatNumberWithCommas(emissions.scope3)} tCO₂e</span>
                  <span className="d-none d-md-inline text-muted ms-2">({emissions.total > 0 ? ((emissions.scope3 / emissions.total) * 100).toFixed(1) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>
          </div>   
       
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <h3 className="card-title">Emissions Distribution by Scope</h3>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{height: "300px"}}>
                <canvas id="scope-distribution-chart"></canvas>
              </div>
            </div>
          </div>
          
          
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-header d-flex align-items-center">
          <h3 className="card-title">
            <span className="badge bg-blue-lt me-2">1</span>
            Scope 1 Emissions: {formatNumberWithCommas(emissions.scope1)} tCO₂e
          </h3>
        
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card-title mb-3">Emissions Breakdown</div>
              <div className="chart-container" style={{height: "250px"}}>
                <canvas id="scope1-breakdown-chart"></canvas>
              </div>
              <div className="mt-4">
                <div className="card-title mb-3">Fuel Combustion: {formatNumberWithCommas(emissions.scope1Details.fuelCombustion)} tCO₂e</div>
                <div className="chart-container" style={{height: "250px"}}>
                  <canvas id="scope1-fuel-chart"></canvas>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mt-4">
                <div className="card-title mb-3">Emissions by Fuel Type</div>
                <div className="table-responsive">
                  <table className="table table-vcenter card-table">
                    <thead>
                      <tr>
                        <th>Fuel Type</th>
                        <th>Emissions (tCO₂e)</th>
                        <th>% of Fuel Emissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(fuelSums).map(([fuelType, emission], index) => (
                        <tr key={index}>
                          <td>{fuelType}</td>
                          <td className="text-end">{formatNumberWithCommas(emission)}</td>
                          <td className="text-end">
                            {emissions.scope1Details.fuelCombustion > 0 
                              ? ((emission / emissions.scope1Details.fuelCombustion) * 100).toFixed(1) 
                              : 0}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-light">
                        <td><strong>Total</strong></td>
                        <td className="text-end"><strong>{formatNumberWithCommas(emissions.scope1Details.fuelCombustion)}</strong></td>
                        <td className="text-end"><strong>100%</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex align-items-center">
          <h3 className="card-title">
            <span className="badge bg-info-lt me-2">2</span>
            Scope 2 Emissions: {formatNumberWithCommas(emissions.scope2)} tCO₂e
          </h3>
       
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card-title mb-3">Emissions Breakdown</div>
              <div className="chart-container" style={{height: "250px"}}>
                <canvas id="scope2-breakdown-chart"></canvas>
              </div>
              <div className="mt-4">
                <div className="card-title mb-3">Heating & Cooling Emissions</div>
                <div className="chart-container" style={{height: "250px"}}>
                  <canvas id="scope2-heating-cooling-chart"></canvas>
                </div>
              </div>
            </div>
            
            <div className="row">
  {/* Electricity */}
  <div className="col-md-6 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center">
         
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="me-2 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 12a4 4 0 0 0 4 4m0 -8a4 4 0 0 0 -4 4" />
            <path d="M3 12h1" /><path d="M12 3v1" /><path d="M12 20v1" />
            <path d="M5.6 5.6l.7 .7" /><path d="M6.3 17.7l-.7 .7" />
            <path d="M20 7l-3 5h4l-3 5" />
          </svg>
          Electricity Consumption
        </h5>
        <p className="display-6 fw-bold text-success">
          {formatNumberWithCommas(emissions.scope2Details.energyConsumption)} tCO₂e
        </p>
      </div>
    </div>
  </div>

  {/* Cooling */}
  <div className="col-md-6 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="me-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 16a3 3 0 0 1 -3 3" />
            <path d="M16 16a3 3 0 0 0 3 3" />
            <path d="M12 16v4" />
            <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M7 13v-3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
          </svg>
          Cooling Systems
        </h5>
        <p className="display-6 fw-bold text-primary">
          {formatNumberWithCommas(emissions.scope2Details.cooling)} tCO₂e
        </p>
      </div>
    </div>
  </div>

  {/* Heating - full width */}
  <div className="col-md-12 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="me-2 text-warning" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" />
            <path d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z" />
            <path d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z" />
            <path d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
            <path d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
            <path d="M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z" />
            <path d="M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z" />
            <path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" />
            <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
          </svg>
          Heating Systems
        </h5>
        <p className="display-6 fw-bold text-warning">
          {formatNumberWithCommas(emissions.scope2Details.heating)} tCO₂e
        </p>
      </div>
    </div>
  </div>
</div>

          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex align-items-center">
          <h3 className="card-title">
            <span className="badge bg-green-lt me-2">3</span>
            Scope 3 Emissions: {formatNumberWithCommas(emissions.scope3)} tCO₂e
          </h3>
      
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card-title mb-3">Emissions by Category</div>
              <div className="chart-container" style={{height: "250px"}}>
                <canvas id="scope3-categories-chart"></canvas>
              </div>
              <div className="mt-4">
                <div className="chart-container" style={{height: "250px"}}>
                  <canvas id="scope3-categories-bar-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer text-end">
        <small className="text-muted">Report generated by GreenMetrics Reporting System • {generationDate}</small>
      </div>
    </div>
  );
};

export default ViewReport;