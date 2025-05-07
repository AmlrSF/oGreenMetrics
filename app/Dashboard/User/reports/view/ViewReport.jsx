"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IconChartBar, IconFileText, IconCalendar, IconInfoCircle, IconBuildingFactory, IconArrowLeft, IconDownload, IconPrinter, IconFlame, IconTruck, IconBriefcase, IconTrash, IconBatteryCharging, IconSnowflake, IconBulb } from "@tabler/icons-react";
import OverviewTab from "./OverviewTab";
import Scope1Tab from "./Scope1Tab";
import Scope2Tab from "./Scope2Tab";
import Scope3Tab from "./Scope3Tab";
import RecommendationsTab from "./RecommendationsTab";

const ViewReport = ({ id }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    const fetchReportData = async () => {
      if (!id || typeof id !== "string") {
        setError("Invalid report ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${API_URL}/report/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        if (!data?.data) {
          throw new Error("No report data found");
        }
        setReport(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }; 
    fetchReportData();
  }, [id]);

  // Memoize report
  const memoizedReport = useMemo(() => report, [report]);

  // Calculate emissions (memoized to prevent recalculation)
  const calculateTotalEmissions = useMemo(() => {
    if (!memoizedReport) return { scope1: 0, scope2: 0, scope3: 0, total: 0 };

    let scope1Total = 0;
    let scope2Total = 0;
    let scope3Total = 0;

    // Scope 1
    if (memoizedReport.scope1Data) {
      if (memoizedReport.scope1Data.fuelCombution?.length > 0) {
        scope1Total += memoizedReport.scope1Data.fuelCombution[0].totalEmissions || 0;
      }
      if (memoizedReport.scope1Data.production?.length > 0) {
        scope1Total += memoizedReport.scope1Data.production[0].totalEmissions || 0;
      }
    }

    // Scope 2
    if (memoizedReport.scope2Data) {
      if (Array.isArray(memoizedReport.scope2Data.cooling)) {
        if (memoizedReport.scope2Data.cooling.length > 0) {
          scope2Total += memoizedReport.scope2Data.cooling[0].totalEmissions || 0;
        }
        if (memoizedReport.scope2Data.heating?.length > 0) {
          scope2Total += memoizedReport.scope2Data.heating[0].totalEmissions || 0;
        }
        if (memoizedReport.scope2Data.energyConsumption?.length > 0) {
          scope2Total += memoizedReport.scope2Data.energyConsumption[0].emissions || 0;
        }
      } else {
        scope2Total += memoizedReport.scope2Data.cooling?.totalEmissions || 0;
        scope2Total += memoizedReport.scope2Data.heating?.totalEmissions || 0;
        scope2Total += memoizedReport.scope2Data.energyConsumption?.emissions || 0;
      }
    }

    // Scope 3
    if (memoizedReport.scope3Data) {
      scope3Total += parseFloat(memoizedReport.scope3Data.businessTravelEmissions || 0);
      scope3Total += parseFloat(memoizedReport.scope3Data.transportEmissions || 0);
      scope3Total += parseFloat(memoizedReport.scope3Data.dechetEmissions || 0);
      scope3Total += parseFloat(memoizedReport.scope3Data.capitalGoodEmissions || 0);
    }

    return {
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total: scope1Total + scope2Total + scope3Total,
    };
  }, [memoizedReport]);

  const getScope1Details = () => {
    if (!memoizedReport || !memoizedReport.scope1Data) return { fuelEmissions: 0, productionEmissions: 0 };

    const fuelEmissions = memoizedReport.scope1Data.fuelCombution?.[0]?.totalEmissions || 0;
    const productionEmissions = memoizedReport.scope1Data.production?.[0]?.totalEmissions || 0;

    return { fuelEmissions, productionEmissions };
  };

  const getScope2Details = () => {
    if (!memoizedReport || !memoizedReport.scope2Data) return { coolingEmissions: 0, heatingEmissions: 0, energyConsumptionEmissions: 0 };

    let coolingEmissions = 0;
    let heatingEmissions = 0;
    let energyConsumptionEmissions = 0;

    if (Array.isArray(memoizedReport.scope2Data.cooling)) {
      coolingEmissions = memoizedReport.scope2Data.cooling?.[0]?.totalEmissions || 0;
      heatingEmissions = memoizedReport.scope2Data.heating?.[0]?.totalEmissions || 0;
      energyConsumptionEmissions = memoizedReport.scope2Data.energyConsumption?.[0]?.emissions || 0;
    } else {
      coolingEmissions = memoizedReport.scope2Data.cooling?.totalEmissions || 0;
      heatingEmissions = memoizedReport.scope2Data.heating?.totalEmissions || 0;
      energyConsumptionEmissions = memoizedReport.scope2Data.energyConsumption?.emissions || 0;
    }

    return { coolingEmissions, heatingEmissions, energyConsumptionEmissions };
  };

  const getScope3Details = () => {
    if (!memoizedReport || !memoizedReport.scope3Data) return {
      businessTravelEmissions: 0,
      transportEmissions: 0,
      wasteEmissions: 0,
      capitalGoodEmissions: 0,
    };

    const businessTravelEmissions = parseFloat(memoizedReport.scope3Data.businessTravelEmissions || 0);
    const transportEmissions = parseFloat(memoizedReport.scope3Data.transportEmissions || 0);
    const wasteEmissions = parseFloat(memoizedReport.scope3Data.dechetEmissions || 0);
    const capitalGoodEmissions = parseFloat(memoizedReport.scope3Data.capitalGoodEmissions || 0);

    return {
      businessTravelEmissions,
      transportEmissions,
      wasteEmissions,
      capitalGoodEmissions,
    };
  };

  const getFuelTypes = () => {
    if (!memoizedReport || !memoizedReport.scope1Data?.fuelCombution?.[0]?.machines) {
      return [];
    }

    const machines = memoizedReport.scope1Data.fuelCombution[0].machines;
    const fuelTypesMap = new Map();

    machines.forEach(machine => {
      const fuelType = machine.typeDeCarburant;
      fuelTypesMap.set(fuelType, (fuelTypesMap.get(fuelType) || 0) + machine.co2Emission);
    });

    return Array.from(fuelTypesMap).map(([type, emissions]) => ({ type, emissions }));
  };

  const getCoolingTypes = () => {
    if (!memoizedReport || !memoizedReport.scope2Data?.cooling) return [];

    const coolers = Array.isArray(memoizedReport.scope2Data.cooling)
      ? memoizedReport.scope2Data.cooling[0]?.coolers
      : memoizedReport.scope2Data.cooling.coolers;

    if (!coolers) return [];

    const coolingTypesMap = new Map();

    coolers.forEach(cooler => {
      const type = cooler.type;
      coolingTypesMap.set(type, (coolingTypesMap.get(type) || 0) + cooler.emissions);
    });

    return Array.from(coolingTypesMap).map(([type, emissions]) => ({ type, emissions }));
  };

  const getHeatingTypes = () => {
    if (!memoizedReport || !memoizedReport.scope2Data?.heating) return [];

    const heaters = Array.isArray(memoizedReport.scope2Data.heating)
      ? memoizedReport.scope2Data.heating[0]?.heaters
      : memoizedReport.scope2Data.heating.heaters;

    if (!heaters) return [];

    const heatingTypesMap = new Map();

    heaters.forEach(heater => {
      const type = heater.type;
      heatingTypesMap.set(type, (heatingTypesMap.get(type) || 0) + heater.emissions);
    });

    return Array.from(heatingTypesMap).map(([type, emissions]) => ({ type, emissions }));
  };

  const getTransportModes = () => {
    if (!memoizedReport || !memoizedReport.scope3Data?.transport) return [];

    const transportModes = new Map();

    memoizedReport.scope3Data.transport.forEach(item => {
      const mode = item.mode;
      transportModes.set(mode, (transportModes.get(mode) || 0) + parseFloat(item.emissions));
    });

    return Array.from(transportModes).map(([mode, emissions]) => ({ mode, emissions }));
  };

  const getWasteTypes = () => {
    if (!memoizedReport || !memoizedReport.scope3Data?.dechet) return [];

    const wasteTypes = new Map();

    memoizedReport.scope3Data.dechet.forEach(item => {
      const type = item.type;
      wasteTypes.set(type, (wasteTypes.get(type) || 0) + parseFloat(item.emissions));
    });

    return Array.from(wasteTypes).map(([type, emissions]) => ({ type, emissions }));
  };

  const formatNumber = (num) => {
    return Number(num).toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  // Conditional rendering for loading, error, and no data states
  if (loading) {
    return (
      <div className="container-xl py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!memoizedReport) {
    return (
      <div className="container-xl py-4">
        <div className="alert alert-info">No report data available</div>
      </div>
    );
  }

  // Prepare props for child components
  const commonProps = {
    report: memoizedReport,
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
    activeTab
  };

  return (
    <div className="container-xl py-4">
      {/* Report Header */}
      <div className="card mb-3">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between w-full">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-icon"
                onClick={() => router.push("/Dashboard/User/reports")}
              >
                <IconArrowLeft />
              </button>
              <h2 className="ms-3 mb-0">{memoizedReport.name || "Environmental Impact Report"}</h2>
            </div>
            <div className="btn-list">
              <button className="btn btn-outline-primary btn-icon" onClick={() => window.print()}>
                <IconPrinter size={18} />
              </button>
              <button className="btn btn-outline-primary btn-icon">
                <IconDownload size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-8">
              <p className="text-secondary mb-3">
                {memoizedReport.description || "Comprehensive report of your company's environmental impact"}
              </p>
              <div className="d-flex mb-2">
                <div className="me-4 d-flex align-items-center">
                  <IconCalendar size={18} className="me-2 text-primary" />
                  <span>Année: {memoizedReport.Year}</span>
                </div>
                <div className="me-4 d-flex align-items-center">
                  <IconFileText size={18} className="me-2 text-primary" />
                  <span>Type: {memoizedReport.detailLevel === "detailed" ? "Detailed Report" : "Summary Report"}</span>
                </div>
                <div className="d-flex align-items-center">
                  <IconChartBar size={18} className="me-2 text-primary" />
                  <span>Graphique: {memoizedReport.includeCharts === "yes" ? "Included" : "Not Included"}</span>
                </div>
              </div>
              <div className="mt-3">
                Scopes included:
                {memoizedReport.scope1 && <span className="badge bg-blue-lt ms-2">Scope 1</span>}
                {memoizedReport.scope2 && <span className="badge bg-purple-lt ms-2">Scope 2</span>}
                {memoizedReport.scope3 && <span className="badge bg-green-lt ms-2">Scope 3</span>}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <span className="bg-primary text-white avatar">
                        <IconBuildingFactory size={24} />
                      </span>
                    </div>
                    <div className="col">
                      <div className="font-weight-medium">Émissions totales</div>
                      <div className="text-secondary">{formatNumber(calculateTotalEmissions.total)} tCO₂</div>
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
          <ul className="nav nav-tabs nav-fill" role="tablist">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "overview" ? "active" : ""}`} 
                onClick={() => setActiveTab("overview")} 
                role="tab" 
                aria-selected={activeTab === "overview"}
              >
                <IconChartBar size={16} className="me-2" />
                Aperçu
              </button>
            </li>
            {memoizedReport.detailLevel === "detailed" && memoizedReport.scope1 && (
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === "scope1" ? "active" : ""}`}   
                  onClick={() => setActiveTab("scope1")}   
                  role="tab"   
                  aria-selected={activeTab === "scope1"}
                >
                  <IconFlame size={16} className="me-2" />
                  Scope 1
                </button>
              </li>
            )}
            {memoizedReport.detailLevel === "detailed" && memoizedReport.scope2 && (
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === "scope2" ? "active" : ""}`} 
                  onClick={() => setActiveTab("scope2")} 
                  role="tab" 
                  aria-selected={activeTab === "scope2"}
                >
                  <IconBatteryCharging size={16} className="me-2" />
                  Scope 2
                </button>
              </li>
            )}
            {memoizedReport.detailLevel === "detailed" && memoizedReport.scope3 && (
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === "scope3" ? "active" : ""}`} 
                  onClick={() => setActiveTab("scope3")} 
                  role="tab" 
                  aria-selected={activeTab === "scope3"}
                >
                  <IconTruck size={16} className="me-2" />
                  Scope 3
                </button>
              </li>
            )}
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "recommendations" ? "active" : ""}`} 
                onClick={() => setActiveTab("recommendations")} 
                role="tab" 
                aria-selected={activeTab === "recommendations"}
              >
                <IconBulb size={16} className="me-2" />
                Recommandations
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab {...commonProps} />}
      {activeTab === "scope1" && <Scope1Tab {...commonProps} />}
      {activeTab === "scope2" && <Scope2Tab {...commonProps} />}
      {activeTab === "scope3" && <Scope3Tab {...commonProps} />}
      {activeTab === "recommendations" && <RecommendationsTab {...commonProps} />}
    </div>
  );
};

export default ViewReport;