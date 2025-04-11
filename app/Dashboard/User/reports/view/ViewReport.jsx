"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Chart from "chart.js/auto";

const ViewReport = ({ id }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const chartRefs = useRef({});

  useEffect(() => {
    if (id) {
      fetchReportData(id);
    }
    return () => {
      // Cleanup charts on unmount
      Object.values(chartRefs.current).forEach(chart => chart?.destroy());
    };
  }, [id]);

  useEffect(() => {
    if (report && report.includeCharts === "yes") {
      createCharts();
    }
  }, [report]);

  const fetchReportData = async (reportId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/report/${reportId}`);
      if (!response.ok) throw new Error("Failed to fetch report data");
      const data = await response.json();
      console.log(data.data);
      
      setReport(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalEmissions = () => {
    let scope1Total = 0;
    let scope2Total = 0;
    let scope3Total = 0;

    if (report.scope1Data) {
      scope1Total += report.scope1Data.fuelCombution?.[0]?.totalEmissions || 0;
      scope1Total += report.scope1Data.production?.[0]?.totalEmissions || 0;
    }

    if (report.scope2Data) {
      scope2Total += report.scope2Data.cooling?.[0]?.totalEmissions || 0;
      scope2Total += report.scope2Data.heating?.[0]?.totalEmissions || 0;
      scope2Total += report.scope2Data.energyConsumption?.[0]?.emissions || 0;
    }

    if (report.scope3Data) {
      scope3Total += Number(report.scope3Data.transportEmissions || 0);
      scope3Total += Number(report.scope3Data.dechetEmissions || 0);
      scope3Total += Number(report.scope3Data.capitalGoodEmissions || 0);
      scope3Total += Number(report.scope3Data.businessTravelEmissions || 0);
    }

    return {
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total: scope1Total + scope2Total + scope3Total
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

  const calculateHeatingCoolingSums = () => {
    const heatingSums = {
      "Electric Heating": 0,
      "District Heating": 0
    };
    const coolingSums = {
      "Electric Cooling": 0,
      "District Cooling": 0
    };

    report?.scope2Data?.heating?.[0]?.heaters?.forEach(heater => {
      if (heater.type?.toLowerCase().includes("electric")) {
        heatingSums["Electric Heating"] += Number(heater.emissions || 0);
      } else if (heater.type?.toLowerCase().includes("district")) {
        heatingSums["District Heating"] += Number(heater.emissions || 0);
      }
    });

    report?.scope2Data?.cooling?.[0]?.coolers?.forEach(cooler => {
      if (cooler.type?.toLowerCase().includes("electric")) {
        coolingSums["Electric Cooling"] += Number(cooler.emissions || 0);
      } else if (cooler.type?.toLowerCase().includes("district")) {
        coolingSums["District Cooling"] += Number(cooler.emissions || 0);
      }
    });

    return { heatingSums, coolingSums };
  };

  const createCharts = () => {
    const emissions = calculateTotalEmissions();
    const fuelSums = calculateFuelTypeSums();
    const { heatingSums, coolingSums } = calculateHeatingCoolingSums();

    // Scope Distribution Pie Chart
    if (!chartRefs.current.scopeDistribution) {
      chartRefs.current.scopeDistribution = new Chart(
        document.getElementById("scope-distribution-chart"),
        {
          type: "pie",
          data: {
            labels: ["Scope 1", "Scope 2", "Scope 3"],
            datasets: [{
              data: [emissions.scope1, emissions.scope2, emissions.scope3],
              backgroundColor: ["#206bc4", "#4299e1", "#2d9d78"]
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        }
      );
    }

    // Scope 1 Fuel Type Bar Chart
    if (report.scope1 && !chartRefs.current.scope1Fuel) {
      chartRefs.current.scope1Fuel = new Chart(
        document.getElementById("scope1-fuel-chart"),
        {
          type: "bar",
          data: {
            labels: Object.keys(fuelSums),
            datasets: [{
              label: "Emissions by Fuel Type (tCO₂e)",
              data: Object.values(fuelSums),
              backgroundColor: "#206bc4"
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        }
      );
    }

    // Scope 2 Heating/Cooling Bar Chart
    if (report.scope2 && !chartRefs.current.scope2HeatingCooling) {
      chartRefs.current.scope2HeatingCooling = new Chart(
        document.getElementById("scope2-heating-cooling-chart"),
        {
          type: "bar",
          data: {
            labels: [...Object.keys(heatingSums), ...Object.keys(coolingSums)],
            datasets: [{
              label: "Emissions (tCO₂e)",
              data: [...Object.values(heatingSums), ...Object.values(coolingSums)],
              backgroundColor: ["#206bc4", "#4299e1", "#2d9d78", "#79c6ac"]
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        }
      );
    }
  };

  if (loading) return <div className="container text-center p-5"><span className="spinner-border"></span></div>;
  if (error) return <div className="container p-5"><div className="alert alert-danger">{error}</div></div>;
  if (!report) return <div className="container p-5"><div className="alert alert-warning">Report not found</div></div>;

  const emissions = calculateTotalEmissions();
  const fuelSums = calculateFuelTypeSums();
  const { heatingSums, coolingSums } = calculateHeatingCoolingSums();

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline" onClick={() => router.back()}>
          <svg className="icon me-2"><use xlinkHref="#tabler-arrow-left" /></svg>Back
        </button>
        <div className="btn-group">
          <button className="btn" onClick={() => window.print()}>
            <svg className="icon me-2"><use xlinkHref="#tabler-printer" /></svg>Print
          </button>
          <button className="btn" onClick={() => alert("PDF download to be implemented")}>
            <svg className="icon me-2"><use xlinkHref="#tabler-download" /></svg>Download
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body text-center py-4">
          <h1 className="card-title">{report.name}</h1>
          <p className="text-muted">{report.description}</p>
          <div className="d-flex justify-content-center gap-3">
            <span className="badge bg-blue-lt">Year: {report.Year}</span>
            <span className="badge bg-purple-lt">{report.detailLevel.charAt(0).toUpperCase() + report.detailLevel.slice(1)}</span>
            <span className="badge bg-green-lt">{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3 className="card-title">Emissions Summary</h3></div>
        <div className="card-body">
          <div className="row row-cards">
            {["Total", "Scope 1", "Scope 2", "Scope 3"].map((scope, i) => (
              <div key={scope} className="col-md-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <h4 className="subheader">{scope} Emissions</h4>
                    <div className="h1 mb-3">{emissions[scope.toLowerCase().replace(" ", "")].toFixed(2)} tCO₂e</div>
                    <div className="d-flex">
                      <span>{i === 0 ? "Reporting Year" : i === 1 ? "Direct" : i === 2 ? "Indirect" : "Value Chain"}</span>
                      <span className="ms-auto text-green">
                        {i === 0 ? report.Year : emissions.total > 0 ? ((emissions[scope.toLowerCase().replace(" ", "")] / emissions.total) * 100).toFixed(1) + "%" : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {report.includeCharts === "yes" && (
            <div className="mt-4"><canvas id="scope-distribution-chart" height="200"></canvas></div>
          )}
        </div>
      </div>

      {report.detailLevel === "detailed" && (
        <>
          {report.scope1 && (
            <div className="card mb-4">
              <div className="card-header"><h3 className="card-title">Scope 1 Emissions</h3></div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h4>Fuel Combustion by Type</h4>
                    <div className="table-responsive">
                      <table className="table table-vcenter">
                        <thead>
                          <tr><th>Fuel Type</th><th>Emissions (tCO₂e)</th></tr>
                        </thead>
                        <tbody>
                          {Object.entries(fuelSums).map(([type, emissions]) => (
                            <tr key={type}>
                              <td>{type}</td><td>{emissions.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="bg-light">
                            <td><strong>Total</strong></td>
                            <td><strong>{report.scope1Data.fuelCombution?.[0]?.totalEmissions?.toFixed(2) || "0.00"}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {report.includeCharts === "yes" && (
                    <div className="col-md-6">
                      <canvas id="scope1-fuel-chart" height="200"></canvas>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {report.scope2 && (
            <div className="card mb-4">
              <div className="card-header"><h3 className="card-title">Scope 2 Emissions</h3></div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h4>Heating by Type</h4>
                    <div className="table-responsive">
                      <table className="table table-vcenter">
                        <thead>
                          <tr><th>Type</th><th>Emissions (tCO₂e)</th></tr>
                        </thead>
                        <tbody>
                          {Object.entries(heatingSums).map(([type, emissions]) => (
                            <tr key={type}>
                              <td>{type}</td><td>{emissions.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="bg-light">
                            <td><strong>Total</strong></td>
                            <td><strong>{report.scope2Data.heating?.[0]?.totalEmissions?.toFixed(2) || "0.00"}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h4 className="mt-4">Cooling by Type</h4>
                    <div className="table-responsive">
                      <table className="table table-vcenter">
                        <thead>
                          <tr><th>Type</th><th>Emissions (tCO₂e)</th></tr>
                        </thead>
                        <tbody>
                          {Object.entries(coolingSums).map(([type, emissions]) => (
                            <tr key={type}>
                              <td>{type}</td><td>{emissions.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="bg-light">
                            <td><strong>Total</strong></td>
                            <td><strong>{report.scope2Data.cooling?.[0]?.totalEmissions?.toFixed(2) || "0.00"}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {report.includeCharts === "yes" && (
                    <div className="col-md-6">
                      <canvas id="scope2-heating-cooling-chart" height="300"></canvas>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {report.scope3 && (
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Scope 3 Detailed Emissions</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="table-responsive">
                      <table className="table table-vcenter">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Emissions (tCO₂e)</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Business Travel</td>
                            <td>{Number(report.scope3Data.businessTravelEmissions).toFixed(2)}</td>
                            <td>
                              {emissions.scope3 > 0 ? (Number(report.scope3Data.businessTravelEmissions) / emissions.scope3 * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                          <tr>
                            <td>Transportation</td>
                            <td>{Number(report.scope3Data.transportEmissions).toFixed(2)}</td>
                            <td>
                              {emissions.scope3 > 0 ? (Number(report.scope3Data.transportEmissions) / emissions.scope3 * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                          <tr>
                            <td>Waste</td>
                            <td>{Number(report.scope3Data.dechetEmissions).toFixed(2)}</td>
                            <td>
                              {emissions.scope3 > 0 ? (Number(report.scope3Data.dechetEmissions) / emissions.scope3 * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                          <tr>
                            <td>Capital Goods</td>
                            <td>{Number(report.scope3Data.capitalGoodEmissions).toFixed(2)}</td>
                            <td>
                              {emissions.scope3 > 0 ? (Number(report.scope3Data.capitalGoodEmissions) / emissions.scope3 * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                          <tr className="bg-light">
                            <td><strong>Total</strong></td>
                            <td><strong>{emissions.scope3.toFixed(2)}</strong></td>
                            <td><strong>100%</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>                 
                  {report.includeCharts === "yes" && (
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Scope 3 Emissions Distribution</h4>
                        </div>
                        <div className="card-body">
                          <div className="chart-container d-flex justify-content-center" style={{height: "250px"}}>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div> 

              </div>
            </div>
          )}
    </div>
  );
};

export default ViewReport;