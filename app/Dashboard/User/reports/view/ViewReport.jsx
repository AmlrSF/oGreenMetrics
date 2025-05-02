"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  IconChartBar,
  IconFileText,
  IconCalendar,
  IconBuildingFactory,
  IconArrowLeft,
  IconDownload,
  IconPrinter,
  IconFlame,
  IconTruck,
  IconBriefcase,
  IconTrash,
  IconBatteryCharging,
  IconSnowflake,
} from "@tabler/icons-react";
import ReportCharts from "./ReportCharts";

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

    console.log("Fetching report with ID:", id); // Debug log
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
                  <h3 className="card-title">Résumé des émissions</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="d-flex align-items-center">
                        <span className="badge bg-blue-lt me-2">Scope 1</span>
                        Émissions directes
                      </span>
                      <strong>{formatNumber(calculateTotalEmissions.scope1)} tCO₂</strong>
                    </div>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar bg-blue"
                        style={{ width: `${calculateTotalEmissions.total ? (calculateTotalEmissions.scope1 / calculateTotalEmissions.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="d-flex align-items-center">
                        <span className="badge bg-purple-lt me-2">Scope 2</span>
                        Émissions indirectes
                      </span>
                      <strong>{formatNumber(calculateTotalEmissions.scope2)} tCO₂</strong>
                    </div>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar bg-purple"
                        style={{ width: `${calculateTotalEmissions.total ? (calculateTotalEmissions.scope2 / calculateTotalEmissions.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="d-flex align-items-center">
                        <span className="badge bg-green-lt me-2">Scope 3</span>
                        Émissions indirectes
                      </span>
                      <strong>{formatNumber(calculateTotalEmissions.scope3)} tCO₂</strong>
                    </div>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar bg-green"
                        style={{ width: `${calculateTotalEmissions.total ? (calculateTotalEmissions.scope3 / calculateTotalEmissions.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="font-weight-bold">Émissions totales</span>
                      <strong>{formatNumber(calculateTotalEmissions.total)} tCO₂</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Informations sur le rapport généré</h3>
                </div>
                <div className="card-body">
                  <dl className="row">
                    <dt className="col-5">Nom du rapport :</dt>
                    <dd className="col-7">{memoizedReport.name}</dd>
                    <dt className="col-5">Description :</dt>
                    <dd className="col-7">{memoizedReport.description}</dd>
                    <dt className="col-5">Année :</dt>
                    <dd className="col-7">{memoizedReport.Year}</dd>
                    <dt className="col-5">Type de rapport :</dt>
                    <dd className="col-7">{memoizedReport.detailLevel === "detailed" ? "Detailed Report" : "Summary Report"}</dd>
                    <dt className="col-5">Créé le :</dt>
                    <dd className="col-7">{new Date(memoizedReport.createdAt).toLocaleDateString()}</dd>
                    <dt className="col-5">Scopes inclus :</dt>
                    <dd className="col-7">
                      {memoizedReport.scope1 && <span className="badge bg-blue-lt me-1">Scope 1</span>}
                      {memoizedReport.scope2 && <span className="badge bg-purple-lt me-1">Scope 2</span>}
                      {memoizedReport.scope3 && <span className="badge bg-green-lt me-1">Scope 3</span>}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <ReportCharts
            report={memoizedReport}
            activeTab={activeTab}
            calculateTotalEmissions={calculateTotalEmissions}
            getScope1Details={getScope1Details}
            getScope2Details={getScope2Details}
            getScope3Details={getScope3Details}
            getFuelTypes={getFuelTypes}
            getCoolingTypes={getCoolingTypes}
            getHeatingTypes={getHeatingTypes}
            getTransportModes={getTransportModes}
            getWasteTypes={getWasteTypes}
          />
        </>
      )}

      {activeTab === "scope1" && (
        <>
          <ReportCharts
            report={memoizedReport}
            activeTab={activeTab}
            calculateTotalEmissions={calculateTotalEmissions}
            getScope1Details={getScope1Details}
            getScope2Details={getScope2Details}
            getScope3Details={getScope3Details}
            getFuelTypes={getFuelTypes}
            getCoolingTypes={getCoolingTypes}
            getHeatingTypes={getHeatingTypes}
            getTransportModes={getTransportModes}
            getWasteTypes={getWasteTypes}
          />

          <div className="row row-cards">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconFlame className="me-2" size={20} />
                    Combustion de Carburant par Type
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-blue text-white">
                      {memoizedReport.scope1Data?.fuelCombution?.[0]?.totalEmissions?.toLocaleString() || 0} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {getFuelTypes().length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped">
                        <thead>
                          <tr>
                            <th>Type de Carburant</th>
                            <th>Nombre de Machines</th>
                            <th>Quantité Totale</th>
                            <th>Émissions CO₂ (tCO₂)</th>
                            <th>Pourcentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFuelTypes().map((fuelType, index) => {
                            const machines = memoizedReport.scope1Data?.fuelCombution?.[0]?.machines?.filter(
                              m => m.typeDeCarburant === fuelType.type
                            ) || [];
                            const totalQuantity = machines.reduce((sum, m) => sum + m.quantite, 0);
                            const percentage = (fuelType.emissions / (memoizedReport.scope1Data?.fuelCombution?.[0]?.totalEmissions || 1)) * 100;
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
                            <td><strong>{memoizedReport.scope1Data?.fuelCombution?.[0]?.totalEmissions?.toLocaleString() || 0} tCO₂</strong></td>
                            <td>100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">Aucune donnée sur la combustion de carburant disponible.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconBuildingFactory className="me-2" size={20} />
                    Processus de Production
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-blue text-white">
                      {memoizedReport.scope1Data?.production?.[0]?.totalEmissions?.toLocaleString() || 0} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table table-striped">
                      <thead>
                        <tr>
                          <th>Nom du Produit</th>
                          <th>Ligne de Production</th>
                          <th>Quantité</th>
                          <th>Émissions CO₂ (tCO₂)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memoizedReport.scope1Data?.production?.[0]?.products?.map((product, index) => (
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
                        )) || (
                          <tr>
                            <td colSpan="4" className="text-center">Aucune donnée disponible</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Émissions Totales:</strong></td>
                          <td><strong>{memoizedReport.scope1Data?.production?.[0]?.totalEmissions?.toLocaleString() || 0} tCO₂</strong></td>
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
          <ReportCharts
            report={memoizedReport}
            activeTab={activeTab}
            calculateTotalEmissions={calculateTotalEmissions}
            getScope1Details={getScope1Details}
            getScope2Details={getScope2Details}
            getScope3Details={getScope3Details}
            getFuelTypes={getFuelTypes}
            getCoolingTypes={getCoolingTypes}
            getHeatingTypes={getHeatingTypes}
            getTransportModes={getTransportModes}
            getWasteTypes={getWasteTypes}
          />

          <div className="row row-cards">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconSnowflake className="me-2" size={20} />
                    Systèmes de Refroidissement par Type
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-purple text-white">
                      {Array.isArray(memoizedReport.scope2Data?.cooling)
                        ? memoizedReport.scope2Data?.cooling?.[0]?.totalEmissions?.toLocaleString()
                        : memoizedReport.scope2Data?.cooling?.totalEmissions?.toLocaleString() || 0} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {getCoolingTypes().length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped">
                        <thead>
                          <tr>
                            <th>Type de Refroidissement</th>
                            <th>Nombre de Systèmes</th>
                            <th>Énergie Totale (kWh)</th>
                            <th>Émissions de CO₂ (tCO₂)</th>
                            <th>Pourcentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCoolingTypes().map((coolingType, index) => {
                            const coolers = (Array.isArray(memoizedReport.scope2Data?.cooling)
                              ? memoizedReport.scope2Data?.cooling?.[0]?.coolers
                              : memoizedReport.scope2Data?.cooling?.coolers
                            )?.filter(c => c.type === coolingType.type) || [];
                            const totalEnergy = coolers.reduce((sum, c) => sum + (c.energy || 0), 0);
                            const totalEmissions = Array.isArray(memoizedReport.scope2Data?.cooling)
                              ? memoizedReport.scope2Data?.cooling?.[0]?.totalEmissions
                              : memoizedReport.scope2Data?.cooling?.totalEmissions || 1;
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
                            <td colSpan="3" className="text-end"><strong>Émissions Totales:</strong></td>
                            <td>
                              <strong>
                                {Array.isArray(memoizedReport.scope2Data?.cooling)
                                  ? memoizedReport.scope2Data?.cooling?.[0]?.totalEmissions?.toLocaleString()
                                  : memoizedReport.scope2Data?.cooling?.totalEmissions?.toLocaleString() || 0} tCO₂
                              </strong>
                            </td>
                            <td>100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">Aucune donnée sur les systèmes de refroidissement disponible.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconFlame className="me-2" size={20} />
                    Systèmes de Chauffage par Type
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-purple text-white">
                      {Array.isArray(memoizedReport.scope2Data?.heating)
                        ? memoizedReport.scope2Data?.heating?.[0]?.totalEmissions?.toLocaleString()
                        : memoizedReport.scope2Data?.heating?.totalEmissions?.toLocaleString() || 0} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {getHeatingTypes().length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped">
                        <thead>
                          <tr>
                            <th>Type de Chauffage</th>
                            <th>Nombre de Systèmes</th>
                            <th>Énergie Totale (kWh)</th>
                            <th>Émissions de CO₂ (tCO₂)</th>
                            <th>Pourcentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getHeatingTypes().map((heatingType, index) => {
                            const heaters = (Array.isArray(memoizedReport.scope2Data?.heating)
                              ? memoizedReport.scope2Data?.heating?.[0]?.heaters
                              : memoizedReport.scope2Data?.heating?.heaters
                            )?.filter(h => h.type === heatingType.type) || [];
                            const totalEnergy = heaters.reduce((sum, h) => sum + (h.energy || 0), 0);
                            const totalEmissions = Array.isArray(memoizedReport.scope2Data?.heating)
                              ? memoizedReport.scope2Data?.heating?.[0]?.totalEmissions
                              : memoizedReport.scope2Data?.heating?.totalEmissions || 1;
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
                            <td colSpan="3" className="text-end"><strong>Émissions Totales:</strong></td>
                            <td>
                              <strong>
                                {Array.isArray(memoizedReport.scope2Data?.heating)
                                  ? memoizedReport.scope2Data?.heating?.[0]?.totalEmissions?.toLocaleString()
                                  : memoizedReport.scope2Data?.heating?.totalEmissions?.toLocaleString() || 0} tCO₂
                              </strong>
                            </td>
                            <td>100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">Aucune donnée sur les systèmes de chauffage disponible.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconBatteryCharging className="me-2" size={20} />
                    Consommation d'Énergie
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-purple text-white">
                      {Array.isArray(memoizedReport.scope2Data?.energyConsumption)
                        ? memoizedReport.scope2Data?.energyConsumption?.[0]?.emissions?.toLocaleString()
                        : memoizedReport.scope2Data?.energyConsumption?.emissions?.toLocaleString() || 0} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <dl className="row">
                        <dt className="col-5">Pays :</dt>
                        <dd className="col-7">
                          {Array.isArray(memoizedReport.scope2Data?.energyConsumption)
                            ? memoizedReport.scope2Data?.energyConsumption?.[0]?.country
                            : memoizedReport.scope2Data?.energyConsumption?.country || "N/A"}
                        </dd>
                        <dt className="col-5">Consommation Annuelle :</dt>
                        <dd className="col-7">
                          {Array.isArray(memoizedReport.scope2Data?.energyConsumption)
                            ? memoizedReport.scope2Data?.energyConsumption?.[0]?.yearlyConsumption?.toLocaleString()
                            : memoizedReport.scope2Data?.energyConsumption?.yearlyConsumption?.toLocaleString() || 0} kWh
                        </dd>
                        <dt className="col-5">Émissions Totales :</dt>
                        <dd className="col-7">
                          <strong>
                            {Array.isArray(memoizedReport.scope2Data?.energyConsumption)
                              ? memoizedReport.scope2Data?.energyConsumption?.[0]?.emissions?.toLocaleString()
                              : memoizedReport.scope2Data?.energyConsumption?.emissions?.toLocaleString() || 0} tCO₂
                          </strong>
                        </dd>
                      </dl>
                    </div>
                    <div className="col-md-6">
                      <div className="alert alert-info">
                        <div className="d-flex">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon alert-icon"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                              <path d="M12 9h.01"></path>
                              <path d="M11 12h1v4h1"></path>
                              <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                            </svg>
                          </div>
                          <div>
                            Les émissions liées à la consommation d'électricité sont calculées en fonction des facteurs d'émission spécifiques au pays.
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
          <ReportCharts
            report={memoizedReport}
            activeTab={activeTab}
            calculateTotalEmissions={calculateTotalEmissions}
            getScope1Details={getScope1Details}
            getScope2Details={getScope2Details}
            getScope3Details={getScope3Details}
            getFuelTypes={getFuelTypes}
            getCoolingTypes={getCoolingTypes}
            getHeatingTypes={getHeatingTypes}
            getTransportModes={getTransportModes}
            getWasteTypes={getWasteTypes}
          />

          <div className="row row-cards">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconBriefcase className="me-2" size={20} />
                    Déplacements professionnels
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-green text-white">
                      {parseFloat(memoizedReport.scope3Data?.businessTravelEmissions || 0).toLocaleString()} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table table-striped">
                      <thead>
                        <tr>
                          <th>But</th>
                          <th>Mode</th>
                          <th>Type</th>
                          <th>Distance (km)</th>
                          <th>Émissions de CO₂ (tCO₂)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memoizedReport.scope3Data?.businessTravel?.map((travel, index) => (
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
                        )) || (
                          <tr>
                            <td colSpan="5" className="text-center">Aucune donnée disponible</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-end"><strong>Émissions Totales :</strong></td>
                          <td><strong>{parseFloat(memoizedReport.scope3Data?.businessTravelEmissions || 0).toLocaleString()} tCO₂</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconTruck className="me-2" size={20} />
                    Transport & Distribution
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-green text-white">
                      {parseFloat(memoizedReport.scope3Data?.transportEmissions || 0).toLocaleString()} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table table-striped">
                      <thead>
                        <tr>
                          <th>But</th>
                          <th>Mode</th>
                          <th>Poids (kg)</th>
                          <th>Distance (km)</th>
                          <th>Émissions de CO₂ (tCO₂)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memoizedReport.scope3Data?.transport?.map((transport, index) => (
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
                        )) || (
                          <tr>
                            <td colSpan="5" className="text-center">Aucune donnée disponible</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-end"><strong>Émissions Totales :</strong></td>
                          <td><strong>{parseFloat(memoizedReport.scope3Data?.transportEmissions || 0).toLocaleString()} tCO₂</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconTrash className="me-2" size={20} />
                    Gestion des déchets
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-green text-white">
                      {parseFloat(memoizedReport.scope3Data?.dechetEmissions || 0).toLocaleString()} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {getWasteTypes().length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped">
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Méthode</th>
                            <th>Poids (kg)</th>
                            <th>Émissions de CO₂ (tCO₂)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memoizedReport.scope3Data?.dechet?.map((waste, index) => (
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
                          )) || (
                            <tr>
                              <td colSpan="5" className="text-center">Aucune donnée disponible</td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="4" className="text-end"><strong>Émissions Totales :</strong></td>
                            <td><strong>{parseFloat(memoizedReport.scope3Data?.dechetEmissions || 0).toLocaleString()} tCO₂</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">Aucune donnée sur la gestion des déchets disponible.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <IconBuildingFactory className="me-2" size={20} />
                    Biens d'équipement
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-green text-white">
                      {parseFloat(memoizedReport.scope3Data?.capitalGoodEmissions || 0).toLocaleString()} tCO₂
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {memoizedReport.scope3Data?.capitalGoods?.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped">
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Quantité</th>
                            <th>Émissions de CO₂ (tCO₂)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memoizedReport.scope3Data.capitalGoods.map((good, index) => (
                            <tr key={good._id || index}>
                              <td>{good.name}</td>
                              <td>
                                <span className="badge bg-orange-lt">{good.type}</span>
                              </td>
                              <td>{parseFloat(good.quantity).toLocaleString()}</td>
                              <td>
                                <strong>{parseFloat(good.emissions).toLocaleString()}</strong>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end"><strong>Émissions Totales :</strong></td>
                            <td><strong>{parseFloat(memoizedReport.scope3Data?.capitalGoodEmissions || 0).toLocaleString()} tCO₂</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">Aucune donnée sur les biens d'équipement disponible.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewReport;