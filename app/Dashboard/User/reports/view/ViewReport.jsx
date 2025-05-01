"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BarChart, PieChart, FileText, Calendar, Building, ArrowLeft,   Download, Printer, Share2, Droplet, Flame, Truck, Briefcase, Trash, Factory, BatteryCharging, Wind, Snowflake, Globe, MapPin} from "lucide-react";
import Chart from 'chart.js/auto';

const ViewReport = ({ id }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

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
  const [charts, setCharts] = useState({
    emissionsBySource: null,
    scopeDistribution: null,
    emissionIntensity: null,
    carbonFootprint: null,
    emissionsByCategory: null,
    scope1Breakdown: null,
    fuelTypeChart: null,
    fuelEmissionIntensity: null,
    scope2Breakdown: null,
    electricitySource: null,
    energyConsumption: null,
    scope3Breakdown: null,
    transportMode: null,
    wasteType: null,
    businessTravel: null,
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/report/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setReport(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReportData();
    }
  }, [id]);

  useEffect(() => {
    if (report && report.includeCharts === "yes") {
      initializeCharts();
    }

    return () => {
      // Cleanup charts on unmount
      Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [report, activeTab]);

  const calculateTotalEmissions = () => {
    if (!report) return 0;

    let scope1Total = 0;
    let scope2Total = 0;
    let scope3Total = 0;

    // Scope 1
    if (report.scope1Data) {
      if (report.scope1Data.fuelCombution && report.scope1Data.fuelCombution.length > 0) {
        scope1Total += report.scope1Data.fuelCombution[0].totalEmissions || 0;
      }
      if (report.scope1Data.production && report.scope1Data.production.length > 0) {
        scope1Total += report.scope1Data.production[0].totalEmissions || 0;
      }
    }

    // Scope 2
    if (report.scope2Data) {
      // For summary reports
      if (Array.isArray(report.scope2Data.cooling)) {
        if (report.scope2Data.cooling.length > 0) {
          scope2Total += report.scope2Data.cooling[0].totalEmissions || 0;
        }
        if (report.scope2Data.heating.length > 0) {
          scope2Total += report.scope2Data.heating[0].totalEmissions || 0;
        }
        if (report.scope2Data.energyConsumption.length > 0) {
          scope2Total += report.scope2Data.energyConsumption[0].emissions || 0;
        }
      } else {
        // For full reports
        scope2Total += report.scope2Data.cooling?.totalEmissions || 0;
        scope2Total += report.scope2Data.heating?.totalEmissions || 0;
        scope2Total += report.scope2Data.energyConsumption?.emissions || 0;
      }
    }

    // Scope 3
    if (report.scope3Data) {
      scope3Total += parseFloat(report.scope3Data.businessTravelEmissions || 0);
      scope3Total += parseFloat(report.scope3Data.transportEmissions || 0);
      scope3Total += parseFloat(report.scope3Data.dechetEmissions || 0);
      scope3Total += parseFloat(report.scope3Data.capitalGoodEmissions || 0);
    }

    return {
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total: scope1Total + scope2Total + scope3Total,
    };
  };

  const getScope1Details = () => {
    if (!report || !report.scope1Data) return { fuelEmissions: 0, productionEmissions: 0 };
    
    const fuelEmissions = report.scope1Data.fuelCombution?.[0]?.totalEmissions || 0;
    const productionEmissions = report.scope1Data.production?.[0]?.totalEmissions || 0;
    
    return { fuelEmissions, productionEmissions };
  };

  const getScope2Details = () => {
    if (!report || !report.scope2Data) return { coolingEmissions: 0, heatingEmissions: 0, energyConsumptionEmissions: 0 };
    
    let coolingEmissions = 0;
    let heatingEmissions = 0;
    let energyConsumptionEmissions = 0;
    
    if (Array.isArray(report.scope2Data.cooling)) {
      coolingEmissions = report.scope2Data.cooling?.[0]?.totalEmissions || 0;
      heatingEmissions = report.scope2Data.heating?.[0]?.totalEmissions || 0;
      energyConsumptionEmissions = report.scope2Data.energyConsumption?.[0]?.emissions || 0;
    } else {
      coolingEmissions = report.scope2Data.cooling?.totalEmissions || 0;
      heatingEmissions = report.scope2Data.heating?.totalEmissions || 0;
      energyConsumptionEmissions = report.scope2Data.energyConsumption?.emissions || 0;
    }
    
    return { coolingEmissions, heatingEmissions, energyConsumptionEmissions };
  };

  const getScope3Details = () => {
    if (!report || !report.scope3Data) return { 
      businessTravelEmissions: 0, 
      transportEmissions: 0, 
      wasteEmissions: 0, 
      capitalGoodEmissions: 0 
    };
    
    const businessTravelEmissions = parseFloat(report.scope3Data.businessTravelEmissions || 0);
    const transportEmissions = parseFloat(report.scope3Data.transportEmissions || 0);
    const wasteEmissions = parseFloat(report.scope3Data.dechetEmissions || 0);
    const capitalGoodEmissions = parseFloat(report.scope3Data.capitalGoodEmissions || 0);
    
    return { 
      businessTravelEmissions, 
      transportEmissions, 
      wasteEmissions, 
      capitalGoodEmissions 
    };
  };

  const getFuelTypes = () => {
    if (!report || !report.scope1Data || !report.scope1Data.fuelCombution || !report.scope1Data.fuelCombution[0]?.machines) {
      return [];
    }

    const machines = report.scope1Data.fuelCombution[0].machines;
    const fuelTypesMap = new Map();

    machines.forEach(machine => {
      const fuelType = machine.typeDeCarburant;
      if (fuelTypesMap.has(fuelType)) {
        fuelTypesMap.set(fuelType, fuelTypesMap.get(fuelType) + machine.co2Emission);
      } else {
        fuelTypesMap.set(fuelType, machine.co2Emission);
      }
    });

    return Array.from(fuelTypesMap).map(([type, emissions]) => ({ type, emissions }));
  };

  const getCoolingTypes = () => {
    if (!report || !report.scope2Data?.cooling) return [];
    
    const coolers = Array.isArray(report.scope2Data.cooling) 
      ? report.scope2Data.cooling[0]?.coolers 
      : report.scope2Data.cooling.coolers;
    
    if (!coolers) return [];
    
    const coolingTypesMap = new Map();
    
    coolers.forEach(cooler => {
      const type = cooler.type;
      if (coolingTypesMap.has(type)) {
        coolingTypesMap.set(type, coolingTypesMap.get(type) + cooler.emissions);
      } else {
        coolingTypesMap.set(type, cooler.emissions);
      }
    });
    
    return Array.from(coolingTypesMap).map(([type, emissions]) => ({ type, emissions }));
  };

  const getHeatingTypes = () => {
    if (!report || !report.scope2Data?.heating) return [];
    
    const heaters = Array.isArray(report.scope2Data.heating) 
      ? report.scope2Data.heating[0]?.heaters 
      : report.scope2Data.heating.heaters;
    
    if (!heaters) return [];
    
    const heatingTypesMap = new Map();
    
    heaters.forEach(heater => {
      const type = heater.type;
      if (heatingTypesMap.has(type)) {
        heatingTypesMap.set(type, heatingTypesMap.get(type) + heater.emissions);
      } else {
        heatingTypesMap.set(type, heater.emissions);
      }
    });
    
    return Array.from(heatingTypesMap).map(([type, emissions]) => ({ type, emissions }));
  };

  const getTransportModes = () => {
    if (!report || !report.scope3Data?.transport) return [];
    
    const transportModes = new Map();
    
    report.scope3Data.transport.forEach(item => {
      const mode = item.mode;
      if (transportModes.has(mode)) {
        transportModes.set(mode, transportModes.get(mode) + parseFloat(item.emissions));
      } else {
        transportModes.set(mode, parseFloat(item.emissions));
      }
    });
    
    return Array.from(transportModes).map(([mode, emissions]) => ({ mode, emissions }));
  };

  const getWasteTypes = () => {
    if (!report || !report.scope3Data?.dechet) return [];
    
    const wasteTypes = new Map();
    
    report.scope3Data.dechet.forEach(item => {
      const type = item.type;
      if (wasteTypes.has(type)) {
        wasteTypes.set(type, wasteTypes.get(type) + parseFloat(item.emissions));
      } else {
        wasteTypes.set(type, parseFloat(item.emissions));
      }
    });
    
    return Array.from(wasteTypes).map(([type, emissions]) => ({ type, emissions }));
  };

  const initializeCharts = () => {
    const emissionTotals = calculateTotalEmissions();
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
          position: 'top',
        },
      }
    };
 
    Object.values(charts).forEach(chart => {
      if (chart) chart.destroy();
    });

    const newCharts = { ...charts };

    // Scope Distribution Pie Chart
    if (scopeDistributionChartRef.current && activeTab === "overview") {
      newCharts.scopeDistribution = new Chart(scopeDistributionChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Scope 1', 'Scope 2', 'Scope 3'],
          datasets: [{
            data: [emissionTotals.scope1, emissionTotals.scope2, emissionTotals.scope3],
            backgroundColor: ['#328E6E', '#67AE6E', '#90C67C'],
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Emissions by Scope'
            }
          }
        }
      });
    }

    // Emissions by Source Chart
    if (emissionsBySourceChartRef.current && activeTab === "overview") {
      const sources = [
        { name: 'Fuel Combustion', value: scope1Details.fuelEmissions },
        { name: 'Production', value: scope1Details.productionEmissions },
        { name: 'Cooling', value: scope2Details.coolingEmissions },
        { name: 'Heating', value: scope2Details.heatingEmissions },
        { name: 'Electricity', value: scope2Details.energyConsumptionEmissions },
        { name: 'Business Travel', value: scope3Details.businessTravelEmissions },
        { name: 'Transportation', value: scope3Details.transportEmissions },
        { name: 'Waste', value: scope3Details.wasteEmissions },
        { name: 'Capital Goods', value: scope3Details.capitalGoodEmissions }
      ];

      // Sort by emission value descending
      sources.sort((a, b) => b.value - a.value);

      newCharts.emissionsBySource = new Chart(emissionsBySourceChartRef.current, {
        type: 'bar',
        data: {
          labels: sources.map(s => s.name),
          datasets: [{
            label: 'tCO₂e',
            data: sources.map(s => s.value),
            backgroundColor: '#328E6E',
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          indexAxis: 'y',
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Emissions by Source'
            }
          }
        }
      });
    }

    // Emission Intensity Chart (new replacement chart)
    if (emissionIntensityChartRef.current && activeTab === "overview") {
      // Sample emission intensity data (per process/activity)
      const intensityData = [
        { name: 'Manufacturing', value: emissionTotals.total * 0.4 / 100 },
        { name: 'Office Operations', value: emissionTotals.total * 0.15 / 100 },
        { name: 'Transportation', value: emissionTotals.total * 0.25 / 100 },
        { name: 'Heating & Cooling', value: emissionTotals.total * 0.2 / 100 }
      ];
      
      newCharts.emissionIntensity = new Chart(emissionIntensityChartRef.current, {
        type: 'bar',
        data: {
          labels: intensityData.map(d => d.name),
          datasets: [{
            label: 'Emission Intensity (tCO₂e per unit)',
            data: intensityData.map(d => d.value),
            backgroundColor: [
              '#328E6E',
              '#67AE6E',
              '#90C67C',
              '#E1EEBC'
            ],
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Emission Intensity by Activity'
            }
          }
        }
      });
    }

    // Carbon Footprint Comparison Chart (new replacement chart)
    if (carbonFootprintChartRef.current && activeTab === "overview") {
      // Sample comparison data with industry benchmarks
      const comparisonData = {
        labels: ['Your Company', 'Industry Average', 'Best in Class'],
        values: [
          emissionTotals.total,
          emissionTotals.total * 1.3, // Assume industry average is higher
          emissionTotals.total * 0.7  // Assume best in class is lower
        ]
      };
      
      newCharts.carbonFootprint = new Chart(carbonFootprintChartRef.current, {
        type: 'bar',
        data: {
          labels: comparisonData.labels,
          datasets: [{
            label: 'Carbon Footprint (tCO₂e)',
            data: comparisonData.values,
            backgroundColor: [
              '#67AE6E',
              '#90C67C',
              '#E1EEBC'
            ],
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Carbon Footprint Comparison'
            }
          }
        }
      });
    }

    // Emissions by Category Chart (new replacement chart)
    if (emissionsByCategoryChartRef.current && activeTab === "overview") {
      // Create category data
      const categoryData = {
        labels: ['Fuel Combustion', 'Production Processes', 'Transportation', 'Heating and cooling'],
        datasets: [{
          label: 'tCO₂e',
          data: [
            scope1Details.fuelEmissions,
            scope1Details.productionEmissions,
            scope3Details.transportEmissions,
            scope2Details.coolingEmissions + scope2Details.heatingEmissions 
          ],
          backgroundColor: [
            '#328E6E',
            '#67AE6E',
            '#90C67C',
            '#E1EEBC',
          ],
          borderWidth: 1
        }]
      };
      
      newCharts.emissionsByCategory = new Chart(emissionsByCategoryChartRef.current, {
        type: 'doughnut',
        data: categoryData,
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Emissions by Category'
            }
          }
        }
      });
    }

    // Scope 1 Breakdown Chart
    if (scope1BreakdownChartRef.current && activeTab === "scope1") {
      newCharts.scope1Breakdown = new Chart(scope1BreakdownChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Fuel Combustion', 'Production Processes'],
          datasets: [{
            data: [scope1Details.fuelEmissions, scope1Details.productionEmissions],
            backgroundColor: ['#206bc4', '#4299e1'],
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Scope 1 Emissions Breakdown'
            }
          }
        }
      });
    }

    // Fuel Type Chart
    if (fuelTypeChartRef.current && activeTab === "scope1" && fuelTypes.length > 0) {
      newCharts.fuelTypeChart = new Chart(fuelTypeChartRef.current, {
        type: 'doughnut',
        data: {
          labels: fuelTypes.map(f => f.type),
          datasets: [{
            data: fuelTypes.map(f => f.emissions),
            backgroundColor: [
              '#206bc4', 
              '#4299e1', 
              '#1a9c86', 
              '#2fb344', 
              '#f59f00'
            ].slice(0, fuelTypes.length),
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Emissions by Fuel Type'
            }
          }
        }
      });
    }

    // Fuel Emission Intensity Chart
    if (fuelEmissionIntensityChartRef.current && activeTab === "scope1" && fuelTypes.length > 0) {
      // Generate sample emission intensity data for each fuel type
      const intensityData = fuelTypes.map(fuelType => ({
        type: fuelType.type,
        intensity: fuelType.emissions / Math.random() * 50 + 10 // Random consumption to get intensity
      }));
      
      newCharts.fuelEmissionIntensity = new Chart(fuelEmissionIntensityChartRef.current, {
        type: 'bar',
        data: {
          labels: intensityData.map(d => d.type),
          datasets: [{
            label: 'Emission Intensity (kgCO₂e per unit)',
            data: intensityData.map(d => d.intensity),
            backgroundColor: '#4299e1',
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Fuel Emission Intensity'
            }
          }
        }
      });
    }

    // Scope 2 Breakdown Chart
    if (scope2BreakdownChartRef.current && activeTab === "scope2") {
      newCharts.scope2Breakdown = new Chart(scope2BreakdownChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Cooling Systems', 'Heating Systems', 'Electricity Consumption'],
          datasets: [{
            data: [
              scope2Details.coolingEmissions,
              scope2Details.heatingEmissions,
              scope2Details.energyConsumptionEmissions
            ],
            backgroundColor: ['#4299e1', '#ae3ec9', '#94d82d'],
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Scope 2 Emissions Breakdown'
            }
          }
        }
      });
    }

    // Electricity Source Chart
    if (electricitySourceChartRef.current && activeTab === "scope2") {
      // Sample electricity source data
      const sourceData = [
        { source: 'Grid Electricity', value: scope2Details.energyConsumptionEmissions * 0.85 },
        { source: 'Renewable Energy', value: scope2Details.energyConsumptionEmissions * 0.15 }
      ];
      
      newCharts.electricitySource = new Chart(electricitySourceChartRef.current, {
        type: 'pie',
        data: {
          labels: sourceData.map(d => d.source),
          datasets: [{
            data: sourceData.map(d => d.value),
            backgroundColor: ['#ae3ec9', '#2fb344'],
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Electricity Sources'
            }
          }
        }
      });
    }

    // Energy Consumption Chart
    if (energyConsumptionChartRef.current && activeTab === "scope2") {
      // Create energy consumption types data combining cooling and heating types
      const energyTypes = [
        ...coolingTypes.map(type => ({ ...type, category: 'Cooling' })),
        ...heatingTypes.map(type => ({ ...type, category: 'Heating' }))
      ];
      
      // Create a stacked bar chart for energy consumption by type
      const datasets = [];
      const categoryColors = { 'Cooling': '#4299e1', 'Heating': '#ae3ec9' };
      
      // Get unique types and categories
      const uniqueTypes = [...new Set(energyTypes.map(item => item.type))];
      const categories = [...new Set(energyTypes.map(item => item.category))];
      
      // Create dataset for each category
      categories.forEach(category => {
        const data = [];
        
        // Fill data for each type
        uniqueTypes.forEach(type => {
          const item = energyTypes.find(i => i.type === type && i.category === category);
          data.push(item ? item.emissions : 0);
        });
        
        datasets.push({
          label: category,
          data: data,
          backgroundColor: categoryColors[category] || '#94d82d',
          borderWidth: 1
        });
      });
      
      newCharts.energyConsumption = new Chart(energyConsumptionChartRef.current, {
        type: 'bar',
        data: {
          labels: uniqueTypes,
          datasets: datasets
        },
        options: {
          ...chartOptions,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true
            }
          },
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Energy Consumption by Type'
            }
          }
        }
      });
    }

    // Scope 3 Breakdown Chart
    if (scope3BreakdownChartRef.current && activeTab === "scope3") {
      newCharts.scope3Breakdown = new Chart(scope3BreakdownChartRef.current, {
        type: 'polarArea',
        data: {
          labels: ['Business Travel', 'Transportation', 'Waste Management', 'Capital Goods'],
          datasets: [{
            data: [
              scope3Details.businessTravelEmissions,
              scope3Details.transportEmissions,
              scope3Details.wasteEmissions,
              scope3Details.capitalGoodEmissions
            ],
            backgroundColor: ['#4299e1', '#ae3ec9', '#94d82d', '#f59f00'],
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Scope 3 Emissions Breakdown'
            }
          }
        }
      });
    }

    // Transport Mode Chart
    if (transportModeChartRef.current && activeTab === "scope3" && transportModes.length > 0) {
      newCharts.transportMode = new Chart(transportModeChartRef.current, {
        type: 'pie',
        data: {
          labels: transportModes.map(t => t.mode),
          datasets: [{
            data: transportModes.map(t => t.emissions),
            backgroundColor: [
              '#4299e1', 
              '#ae3ec9', 
              '#94d82d', 
              '#f59f00', 
              '#206bc4'
            ].slice(0, transportModes.length),
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Emissions by Transport Mode'
            }
          }
        }
      });
    }

    // Waste Type Chart
    if (wasteTypeChartRef.current && activeTab === "scope3" && wasteTypes.length > 0) {
      newCharts.wasteType = new Chart(wasteTypeChartRef.current, {
        type: 'doughnut',
        data: {
          labels: wasteTypes.map(w => w.type),
          datasets: [{
            data: wasteTypes.map(w => w.emissions),
            backgroundColor: [
              '#94d82d', 
              '#f59f00', 
              '#4299e1', 
              '#ae3ec9'
            ].slice(0, wasteTypes.length),
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Waste Emissions by Type'
            }
          }
        }
      });
    }

    // Business Travel Chart
    if (businessTravelChartRef.current && activeTab === "scope3" && report.scope3Data?.businessTravel) {
      // Create business travel by purpose data
      const travelPurposes = new Map();
      
      report.scope3Data.businessTravel.forEach(travel => {
        const purpose = travel.purpose;
        if (travelPurposes.has(purpose)) {
          travelPurposes.set(purpose, travelPurposes.get(purpose) + parseFloat(travel.emissions));
        } else {
          travelPurposes.set(purpose, parseFloat(travel.emissions));
        }
      });
      
      const purposeData = Array.from(travelPurposes).map(([purpose, emissions]) => ({ purpose, emissions }));
      
      newCharts.businessTravel = new Chart(businessTravelChartRef.current, {
        type: 'bar',
        data: {
          labels: purposeData.map(d => d.purpose),
          datasets: [{
            label: 'Emissions (tCO₂e)',
            data: purposeData.map(d => d.emissions),
            backgroundColor: '#4299e1',
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: 'Business Travel Emissions by Purpose'
            }
          }
        }
      });
    }

    setCharts(newCharts);
  };

  const formatNumber = (num) => {
    return Number(num).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <div className="container-xl py-4">
        <div className="card">
          <div className="card-body text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Loading report data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container-xl py-4">
        <div className="card">
          <div className="card-body text-center py-4">
            <div className="alert alert-danger mb-0">
              {error || "Report not found"}
            </div>
            <button
              className="btn btn-primary mt-3"
              onClick={() => router.push("/Dashboard/User/reports")}
            >
              <ArrowLeft size={16} className="me-2" /> Back to Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  const emissionTotals = calculateTotalEmissions();
  const fuelTypes = getFuelTypes();


  const handleDownloadPDF = () => {
    const content = document.querySelector('.report-body-view-details');
    
    if (content) {
      // Create a new window with proper styling
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Emissions Report</title>
              <style>
                @page {
                  size: A4;
                  margin: 20mm;
                }
                
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 20px;
                }
                
                .report-header {
                  margin-bottom: 30px;
                }
                
                .report-title {
                  font-size: 24px;
                  color: #2563eb;
                  margin-bottom: 10px;
                }
                
                .report-meta {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 20px;
                }
                
                .scope-tags {
                  margin: 10px 0;
                }
                
                .scope-tag {
                  display: inline-block;
                  padding: 4px 12px;
                  border-radius: 15px;
                  margin-right: 8px;
                  font-size: 14px;
                }
                
                .scope-1 { background: #dbeafe; color: #1e40af; }
                .scope-2 { background: #fae8ff; color: #86198f; }
                .scope-3 { background: #dcfce7; color: #166534; }
                
                .emissions-summary {
                  background: #f8fafc;
                  padding: 20px;
                  border-radius: 8px;
                  margin-bottom: 30px;
                }
                
                .chart-container {
                  background: white;
                  border-radius: 8px;
                  padding: 20px;
                  margin-bottom: 30px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .chart-title {
                  font-size: 18px;
                  margin-bottom: 15px;
                  color: #1e293b;
                }
                
                /* Preserve chart colors and styling */
                .recharts-wrapper {
                  margin: 0 auto;
                }
                
                @media print {
                  body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  .chart-container {
                    break-inside: avoid;
                  }
                }
              </style>

            </head>
            <body>
              ${content.innerHTML}
              <script>
                window.onload = () => {
                  // Wait for charts to render
                  setTimeout(() => {
                    window.print();
                    window.onafterprint = () => window.close();
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `);
        
        printWindow.document.close();
      }
    }
  };

  const handleprint = async() =>{
    window.print();
  }

  return (
    <div className="container-xl report-body-view-details  py-4">
      {/* Report Header */}
      <div className="card mb-3">
        <div className="card-header">
          <div className="d-flex align-items-center w-100
           justify-content-between">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-icon"
                onClick={() => router.push("/Dashboard/User/reports")}
              >
                <ArrowLeft />
              </button>
              <h2 className="ms-3 mb-0">{report.name || "Environmental Impact Report"}</h2>
            </div>
            <div className="btn-list">
              <button onClick={handleprint}  className="btn btn-outline-primary btn-icon">
                <Printer size={18} />
              </button>
              <button onClick={handleDownloadPDF} className="btn btn-outline-primary btn-icon">
                <Download size={18} />
              </button>
              <button className="btn btn-primary">
                <Share2 size={18} className="me-2" /> Share
              </button>
            </div>
          </div>
        </div>
        <div className="card-body report-body-view-details">
          <div className="row">
            <div className="col-lg-8">
              <p className="text-secondary mb-3">
                {report.description || "Comprehensive report of your company's environmental impact"}
              </p>
              <div className="d-flex mb-2">
                <div className="me-4 d-flex align-items-center">
                  <Calendar size={18} className="me-2 text-primary" />
                  <span>Year: {report.Year}</span>
                </div>
                <div className="me-4 d-flex align-items-center">
                  <FileText size={18} className="me-2 text-primary" />
                  <span>Type: {report.detailLevel === "detailed" ? "Detailed Report" : "Summary Report"}</span>
                </div>
                <div className="d-flex align-items-center">
                  <BarChart size={18} className="me-2 text-primary" />
                  <span>Charts: {report.includeCharts === "yes" ? "Included" : "Not Included"}</span>
                </div>
              </div>
              <div className="mt-3">
                Scopes included: 
                
                {report.scope1 && <span className="badge bg-blue-lt ms-2">Scope 1</span>}
                {report.scope2 && <span className="badge bg-purple-lt ms-2">Scope 2</span>}
                {report.scope3 && <span className="badge bg-green-lt ms-2">Scope 3</span>}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <span className="bg-primary text-white avatar">
                        <Factory size={24} />
                      </span>
                    </div>
                    <div className="col">
                      <div className="font-weight-medium">
                        Total Emissions
                      </div>
                      <div className="text-secondary">
                        {formatNumber(emissionTotals.total)} tCO₂e
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="card mb-3">
        <div className="card-body">
          <ul className="nav nav-tabs nav-fill" data-bs-toggle="tabs">
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); setActiveTab("overview"); }}
              >
                <BarChart size={16} className="me-2" />
                Overview
              </a>
            </li>
            {report.detailLevel === "detailed" && report.scope1 && (
              <li className="nav-item">
                <a 
                  href="#" 
                  className={`nav-link ${activeTab === "scope1" ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab("scope1"); }}
                >
                  <Flame size={16} className="me-2" />
                  Scope 1
                </a>
              </li>
            )}
            {report.detailLevel === "detailed" && report.scope2 && (
              <li className="nav-item">
                <a 
                  href="#" 
                  className={`nav-link ${activeTab === "scope2" ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab("scope2"); }}
                >
                  <BatteryCharging size={16} className="me-2" />
                  Scope 2
                </a>
              </li>
            )}
            {report.detailLevel === "detailed" && report.scope3 && (
              <li className="nav-item">
                <a 
                  href="#" 
                  className={`nav-link ${activeTab === "scope3" ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab("scope3"); }}
                >
                  <Truck size={16} className="me-2" />
                  Scope 3
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <>
          <div className="row row-cards">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Emissions Summary</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="d-flex align-items-center">
                        <span className="badge bg-blue-lt me-2">Scope 1</span>
                        Direct Emissions
                      </span>
                      <strong>{formatNumber(emissionTotals.scope1)} tCO₂e</strong>
                    </div>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-blue" 
                        style={{ width: `${(emissionTotals.scope1 / emissionTotals.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="d-flex align-items-center">
                        <span className="badge bg-purple-lt me-2">Scope 2</span>
                        Indirect Emissions
                      </span>
                      <strong>{formatNumber(emissionTotals.scope2)} tCO₂e</strong>
                    </div>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-purple" 
                        style={{ width: `${(emissionTotals.scope2 / emissionTotals.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="d-flex align-items-center">
                        <span className="badge bg-green-lt me-2">Scope 3</span>
                        Value Chain Emissions
                      </span>
                      <strong>{formatNumber(emissionTotals.scope3)} tCO₂e</strong>
                    </div>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-green" 
                        style={{ width: `${(emissionTotals.scope3 / emissionTotals.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="font-weight-bold">Total Emissions</span>
                      <strong>{formatNumber(emissionTotals.total)} tCO₂e</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Generated Report Information</h3>
                </div>
                <div className="card-body">
                  <dl className="row">
                    <dt className="col-5">Report Name:</dt>
                    <dd className="col-7">{report.name}</dd>
                    
                    <dt className="col-5">Description:</dt>
                    <dd className="col-7">{report.description}</dd>
                    
                    <dt className="col-5">Year:</dt>
                    <dd className="col-7">{report.Year}</dd>
                    
                    <dt className="col-5">Report Type:</dt>
                    <dd className="col-7">{report.detailLevel === "detailed" ? "Detailed Report" : "Summary Report"}</dd>
                    
                    <dt className="col-5">Created On:</dt>
                    <dd className="col-7">{new Date(report.createdAt).toLocaleDateString()}</dd>
                    
                    <dt className="col-5">Scopes Included:</dt>
                    <dd className="col-7">
                      {report.scope1 && <span className="badge bg-blue-lt me-1">Scope 1</span>}
                      {report.scope2 && <span className="badge bg-purple-lt me-1">Scope 2</span>}
                      {report.scope3 && <span className="badge bg-green-lt me-1">Scope 3</span>}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section - Overview */}
          {report.includeCharts === "yes" && (
            <div className="row row-cards mt-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Emissions by Scope</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={scopeDistributionChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Emissions by Source</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={emissionsBySourceChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Emission Intensity by Activity</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={emissionIntensityChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Carbon Footprint Comparison</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={carbonFootprintChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Emissions by Category</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={emissionsByCategoryChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "scope1" && (
        <>
          {/* Chart Section - Scope 1 */}
          {report.includeCharts === "yes" && (
            <div className="row row-cards mb-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Scope 1 Emissions Breakdown</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={scope1BreakdownChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Scope 1 Summary</h3>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-baseline">
                      <div className="h1 mb-0 me-2">{formatNumber(emissionTotals.scope1)}</div>
                      <div className="me-auto">
                        <span className="text-muted">tCO₂e total direct emissions</span>
                      </div>
                    </div>
                    <div className="d-flex mt-4">
                      <div className="col-6">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-blue text-white avatar">
                                  <Flame size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Fuel Combustion
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope1Details().fuelEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-azure text-white avatar">
                                  <Factory size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Production
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope1Details().productionEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Emissions by Fuel Type</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={fuelTypeChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Fuel Emission Intensity</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={fuelEmissionIntensityChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row row-cards">
            {/* Fuel Combustion by Type */}
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Flame className="me-2" size={20} />
                    Fuel Combustion by Type
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-blue text-white">
                      {report.scope1Data?.fuelCombution?.[0]?.totalEmissions?.toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {fuelTypes.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped">
                        <thead>
                          <tr>
                            <th>Fuel Type</th>
                            <th>Number of Machines</th>
                            <th>Total Quantity</th>
                            <th>CO₂ Emissions (tCO₂e)</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fuelTypes.map((fuelType, index) => {
                            const machines = report.scope1Data?.fuelCombution?.[0]?.machines?.filter(
                              m => m.typeDeCarburant === fuelType.type
                            ) || [];
                            
                            const totalQuantity = machines.reduce((sum, m) => sum + m.quantite, 0);
                            const percentage = (fuelType.emissions / report.scope1Data?.fuelCombution?.[0]?.totalEmissions) * 100;
                            
                            return (
                              <tr key={index}>
                                <td>
                                  <span className="badge bg-blue-lt">{fuelType.type}</span>
                                </td>
                                <td>{machines.length}</td>
                                <td>{totalQuantity.toLocaleString()}</td>
                                <td><strong>{fuelType.emissions.toLocaleString()}</strong></td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="me-2">{percentage.toFixed(1)}%</span>
                                    <div className="progress flex-grow-1" style={{ height: "6px" }}>
                                      <div className="progress-bar bg-blue" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end"><strong>Total Emissions:</strong></td>
                            <td><strong>{report.scope1Data?.fuelCombution?.[0]?.totalEmissions?.toLocaleString()} tCO₂e</strong></td>
                            <td>100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">No fuel combustion data available.</div>
                  )}
                </div>
              </div>
            </div>


            {/* Production Processes */}
            <div className="col-md-12 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Factory className="me-2" size={20} />
                    Production Processes
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-blue text-white">
                      {report.scope1Data?.production?.[0]?.totalEmissions?.toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table table-striped">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Production Line</th>
                          <th>Quantity</th>
                          <th>CO₂ Emissions (tCO₂e)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.scope1Data?.production?.[0]?.products?.map((product, index) => (
                          <tr key={product._id || index}>
                            <td>{product.nom}</td>
                            <td>
                              <span className="badge bg-azure-lt">{product.ligneDeProduction}</span>
                            </td>
                            <td>{product.quantite.toLocaleString()}</td>
                            <td>
                              <strong>{product.co2Emission.toLocaleString()}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Total Emissions:</strong></td>
                          <td><strong>{report.scope1Data?.production?.[0]?.totalEmissions?.toLocaleString()} tCO₂e</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "scope2" && (
        <>
          {/* Chart Section - Scope 2 */}
          {report.includeCharts === "yes" && (
            <div className="row row-cards mb-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Scope 2 Emissions Breakdown</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={scope2BreakdownChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Scope 2 Summary</h3>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-baseline">
                      <div className="h1 mb-0 me-2">{formatNumber(emissionTotals.scope2)}</div>
                      <div className="me-auto">
                        <span className="text-muted">tCO₂e total indirect emissions</span>
                      </div>
                    </div>
                    <div className="d-flex mt-4 flex-wrap">
                      <div className="col-md-4 mb-3">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-cyan text-white avatar">
                                  <Snowflake size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Cooling
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope2Details().coolingEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-red text-white avatar">
                                  <Flame size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Heating
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope2Details().heatingEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-purple text-white avatar">
                                  <BatteryCharging size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Electricity
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope2Details().energyConsumptionEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Electricity Sources</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={electricitySourceChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Energy Consumption by Type</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={energyConsumptionChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row row-cards">
            {/* Cooling Systems by Type */}
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Snowflake className="me-2" size={20} />
                    Cooling Systems by Type
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-purple text-white">
                      {Array.isArray(report.scope2Data?.cooling)
                        ? report.scope2Data?.cooling?.[0]?.totalEmissions?.toLocaleString()
                        : report.scope2Data?.cooling?.totalEmissions?.toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {getCoolingTypes().length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped">
                        <thead>
                          <tr>
                            <th>Cooling Type</th>
                            <th>Number of Systems</th>
                            <th>Total Energy (kWh)</th>
                            <th>CO₂ Emissions (tCO₂e)</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCoolingTypes().map((coolingType, index) => {
                            const coolers = (Array.isArray(report.scope2Data?.cooling)
                              ? report.scope2Data?.cooling?.[0]?.coolers
                              : report.scope2Data?.cooling?.coolers
                            )?.filter(c => c.type === coolingType.type) || [];
                            
                            const totalEnergy = coolers.reduce((sum, c) => sum + c.energy, 0);
                            const totalEmissions = Array.isArray(report.scope2Data?.cooling)
                              ? report.scope2Data?.cooling?.[0]?.totalEmissions
                              : report.scope2Data?.cooling?.totalEmissions;
                            const percentage = (coolingType.emissions / totalEmissions) * 100;
                            
                            return (
                              <tr key={index}>
                                <td>
                                  <span className="badge bg-cyan-lt">{coolingType.type}</span>
                                </td>
                                <td>{coolers.length}</td>
                                <td>{totalEnergy.toLocaleString()}</td>
                                <td><strong>{coolingType.emissions.toLocaleString()}</strong></td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="me-2">{percentage.toFixed(1)}%</span>
                                    <div className="progress flex-grow-1" style={{ height: "6px" }}>
                                      <div className="progress-bar bg-cyan" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end"><strong>Total Emissions:</strong></td>
                            <td>
                              <strong>
                                {Array.isArray(report.scope2Data?.cooling)
                                  ? report.scope2Data?.cooling?.[0]?.totalEmissions?.toLocaleString()
                                  : report.scope2Data?.cooling?.totalEmissions?.toLocaleString()} tCO₂e
                              </strong>
                            </td>
                            <td>100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">No cooling system data available.</div>
                  )}
                </div>
              </div>
            </div>

   

            {/* Heating Systems by Type */}
            <div className="col-md-12 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Flame className="me-2" size={20} />
                    Heating Systems by Type
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-purple text-white">
                      {Array.isArray(report.scope2Data?.heating)
                        ? report.scope2Data?.heating?.[0]?.totalEmissions?.toLocaleString()
                        : report.scope2Data?.heating?.totalEmissions?.toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {getHeatingTypes().length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped">
                        <thead>
                          <tr>
                            <th>Heating Type</th>
                            <th>Number of Systems</th>
                            <th>Total Energy (kWh)</th>
                            <th>CO₂ Emissions (tCO₂e)</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getHeatingTypes().map((heatingType, index) => {
                            const heaters = (Array.isArray(report.scope2Data?.heating)
                              ? report.scope2Data?.heating?.[0]?.heaters
                              : report.scope2Data?.heating?.heaters
                            )?.filter(h => h.type === heatingType.type) || [];
                            
                            const totalEnergy = heaters.reduce((sum, h) => sum + h.energy, 0);
                            const totalEmissions = Array.isArray(report.scope2Data?.heating)
                              ? report.scope2Data?.heating?.[0]?.totalEmissions
                              : report.scope2Data?.heating?.totalEmissions;
                            const percentage = (heatingType.emissions / totalEmissions) * 100;
                            
                            return (
                              <tr key={index}>
                                <td>
                                  <span className="badge bg-red-lt">{heatingType.type}</span>
                                </td>
                                <td>{heaters.length}</td>
                                <td>{totalEnergy.toLocaleString()}</td>
                                <td><strong>{heatingType.emissions.toLocaleString()}</strong></td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="me-2">{percentage.toFixed(1)}%</span>
                                    <div className="progress flex-grow-1" style={{ height: "6px" }}>
                                      <div className="progress-bar bg-red" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end"><strong>Total Emissions:</strong></td>
                            <td>
                              <strong>
                                {Array.isArray(report.scope2Data?.heating)
                                  ? report.scope2Data?.heating?.[0]?.totalEmissions?.toLocaleString()
                                  : report.scope2Data?.heating?.totalEmissions?.toLocaleString()} tCO₂e
                              </strong>
                            </td>
                            <td>100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">No heating system data available.</div>
                  )}
                </div>
              </div>
            </div>
 

            {/* Energy Consumption */}
            <div className="col-md-12 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <BatteryCharging className="me-2" size={20} />
                    Energy Consumption
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-purple text-white">
                      {Array.isArray(report.scope2Data?.energyConsumption)
                        ? report.scope2Data?.energyConsumption?.[0]?.emissions?.toLocaleString()
                        : report.scope2Data?.energyConsumption?.emissions?.toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <dl className="row">
                        <dt className="col-5">Country:</dt>
                        <dd className="col-7">
                          {Array.isArray(report.scope2Data?.energyConsumption)
                            ? report.scope2Data?.energyConsumption?.[0]?.country
                            : report.scope2Data?.energyConsumption?.country}
                        </dd>
                        
                        <dt className="col-5">Yearly Consumption:</dt>
                        <dd className="col-7">
                          {Array.isArray(report.scope2Data?.energyConsumption)
                            ? report.scope2Data?.energyConsumption?.[0]?.yearlyConsumption?.toLocaleString()
                            : report.scope2Data?.energyConsumption?.yearlyConsumption?.toLocaleString()} kWh
                        </dd>
                        
                        <dt className="col-5">Total Emissions:</dt>
                        <dd className="col-7">
                          <strong>
                            {Array.isArray(report.scope2Data?.energyConsumption)
                              ? report.scope2Data?.energyConsumption?.[0]?.emissions?.toLocaleString()
                              : report.scope2Data?.energyConsumption?.emissions?.toLocaleString()} tCO₂e
                          </strong>
                        </dd>
                      </dl>
                    </div>
                    <div className="col-md-6">
                      <div className="alert alert-info">
                        <div className="d-flex">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                              <path d="M12 9h.01"></path>
                              <path d="M11 12h1v4h1"></path>
                              <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                            </svg>
                          </div>
                          <div>
                            Electricity consumption emissions are calculated based on country-specific emission factors that reflect the grid's energy mix.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "scope3" && (
        <>
          {/* Chart Section - Scope 3 */}
          {report.includeCharts === "yes" && (
            <div className="row row-cards mb-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Scope 3 Emissions Breakdown</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={scope3BreakdownChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Scope 3 Summary</h3>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-baseline">
                      <div className="h1 mb-0 me-2">{formatNumber(emissionTotals.scope3)}</div>
                      <div className="me-auto">
                        <span className="text-muted">tCO₂e total value chain emissions</span>
                      </div>
                    </div>
                    <div className="d-flex mt-4 flex-wrap">
                      <div className="col-md-6 mb-3">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-green text-white avatar">
                                  <Briefcase size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Business Travel
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope3Details().businessTravelEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-purple text-white avatar">
                                  <Truck size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Transportation
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope3Details().transportEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-yellow text-white avatar">
                                  <Trash size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Waste
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope3Details().wasteEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card card-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <span className="bg-orange text-white avatar">
                                  <Building size={24} />
                                </span>
                              </div>
                              <div className="col">
                                <div className="font-weight-medium">
                                  Capital Goods
                                </div>
                                <div className="text-muted">
                                  {formatNumber(getScope3Details().capitalGoodEmissions)} tCO₂e
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Transport Emissions by Mode</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={transportModeChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Waste Emissions by Type</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={wasteTypeChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Business Travel Emissions by Purpose</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <canvas ref={businessTravelChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row row-cards">
            {/* Business Travel */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Briefcase className="me-2" size={20} />
                    Business Travel
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-green text-white">
                      {parseFloat(report.scope3Data?.businessTravelEmissions || 0).toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table table-striped">
                      <thead>
                        <tr>
                          <th>Purpose</th>
                          <th>Mode</th>
                          <th>Type</th>
                          <th>Distance (km)</th>
                          <th>CO₂ Emissions (tCO₂e)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.scope3Data?.businessTravel?.map((travel, index) => (
                          <tr key={travel._id || index}>
                            <td>{travel.purpose}</td>
                            <td>
                              <span className="badge bg-teal-lt">{travel.mode}</span>
                            </td>
                            <td>{travel.type}</td>
                            <td>{parseFloat(travel.distance).toLocaleString()}</td>
                            <td>
                              <strong>{parseFloat(travel.emissions).toLocaleString()}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-end"><strong>Total Emissions:</strong></td>
                          <td><strong>{parseFloat(report.scope3Data?.businessTravelEmissions || 0).toLocaleString()} tCO₂e</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation & Distribution */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Truck className="me-2" size={20} />
                    Transportation & Distribution
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-green text-white">
                      {parseFloat(report.scope3Data?.transportEmissions || 0).toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table table-striped">
                      <thead>
                        <tr>
                          <th>Purpose</th>
                          <th>Mode</th>
                          <th>Weight (kg)</th>
                          <th>Distance (km)</th>
                          <th>CO₂ Emissions (tCO₂e)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.scope3Data?.transport?.map((transport, index) => (
                          <tr key={transport._id || index}>
                            <td>{transport.purpose}</td>
                            <td>
                              <span className="badge bg-indigo-lt">{transport.mode} - {transport.type}</span>
                            </td>
                            <td>{parseFloat(transport.poids).toLocaleString()}</td>
                            <td>{parseFloat(transport.distance).toLocaleString()}</td>
                            <td>
                              <strong>{parseFloat(transport.emissions).toLocaleString()}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-end"><strong>Total Emissions:</strong></td>
                          <td><strong>{parseFloat(report.scope3Data?.transportEmissions || 0).toLocaleString()} tCO₂e</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Management */}
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Trash className="me-2" size={20} />
                    Waste Management
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-green text-white">
                      {parseFloat(report.scope3Data?.dechetEmissions || 0).toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Method</th>
                          <th>Weight (kg)</th>
                          <th>CO₂ Emissions (tCO₂e)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.scope3Data?.dechet?.map((waste, index) => (
                          <tr key={waste._id || index}>
                            <td>{waste.name}</td>
                            <td>
                              <span className="badge bg-lime-lt">{waste.type}</span>
                            </td>
                            <td>{waste.methode}</td>
                            <td>{parseFloat(waste.poids).toLocaleString()}</td>
                            <td>
                              <strong>{parseFloat(waste.emissions).toLocaleString()}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-end"><strong>Total Emissions:</strong></td>
                          <td><strong>{parseFloat(report.scope3Data?.dechetEmissions || 0).toLocaleString()} tCO₂e</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Capital Goods */}
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Building className="me-2" size={20} />
                    Capital Goods
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-green text-white">
                      {parseFloat(report.scope3Data?.capitalGoodEmissions || 0).toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Cost ($)</th>
                          <th>Lifetime (years)</th>
                          <th>CO₂ Emissions (tCO₂e)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.scope3Data?.capitalGood?.map((good, index) => (
                          <tr key={good._id || index}>
                            <td>{good.name}</td>
                            <td>
                              <span className="badge bg-orange-lt">{good.category}</span>
                            </td>
                            <td>{parseFloat(good.cost).toLocaleString()}</td>
                            <td>{good.lifetime}</td>
                            <td>
                              <strong>{parseFloat(good.emissions).toLocaleString()}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-end"><strong>Total Emissions:</strong></td>
                          <td><strong>{parseFloat(report.scope3Data?.capitalGoodEmissions || 0).toLocaleString()} tCO₂e</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Report Footer */}
      <div className="card mt-3">
        <div className="card-footer text-muted">
          <div className="row">
            <div className="col-md-6">
              Report generated on: {new Date(report.createdAt).toLocaleString()}
            </div>
            <div className="col-md-6 text-end">
              <small>Carbon footprint measurement & reporting system</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;