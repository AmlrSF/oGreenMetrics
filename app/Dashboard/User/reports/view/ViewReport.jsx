"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PieChart, BarChart, LineChart, Download, Printer, Share2, ChevronLeft } from "lucide-react";

const ViewReport = ({ id }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
 
  useEffect(() => {
    if (id) {
      fetchReportData(id);
    }
  }, [id]);

  const fetchReportData = async (reportId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/report/${reportId}`, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }
      
      const data = await response.json();
      setReport(data.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // PDF download functionality would be implemented here
    alert("Download PDF functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="container-xl py-10 d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl py-10">
        <div className="alert alert-danger">
          Error loading report: {error}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container-xl py-10">
        <div className="alert alert-warning">
          Report not found.
        </div>
      </div>
    );
  }

  // Calculate total emissions by scope
  const calculateTotalEmissions = () => {
    let scope1Total = 0;
    let scope2Total = 0;
    let scope3Total = 0;

    // Calculate Scope 1 emissions (example calculation)
    if (report.scope1Data) {
      // Add fuel combustion emissions
      if (report.scope1Data.fuelCombution) {
        scope1Total += report.scope1Data.fuelCombution.reduce(
          (sum, item) => sum + (Number(item.emissions) || 0), 0
        );
      }
      
      // Add production emissions
      if (report.scope1Data.production) {
        scope1Total += report.scope1Data.production.reduce(
          (sum, item) => sum + (Number(item.emissions) || 0), 0
        );
      }
    }

    // Calculate Scope 2 emissions
    if (report.scope2Data) {
      // Add cooling emissions
      if (report.scope2Data.cooling) {
        scope2Total += report.scope2Data.cooling.reduce(
          (sum, item) => sum + (Number(item.emissions) || 0), 0
        );
      }
      
      // Add heating emissions
      if (report.scope2Data.heating) {
        scope2Total += report.scope2Data.heating.reduce(
          (sum, item) => sum + (Number(item.emissions) || 0), 0
        );
      }
      
      // Add energy consumption emissions
      if (report.scope2Data.energyConsumption) {
        scope2Total += report.scope2Data.energyConsumption.reduce(
          (sum, item) => sum + (Number(item.emissions) || 0), 0
        );
      }
    }

    // Calculate Scope 3 emissions
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

  const emissions = calculateTotalEmissions();

  return (
    <div className="container-xl report-view py-4">
      {/* Report Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => router.back()}
        >
          <ChevronLeft size={16} className="me-1" /> Back
        </button>
        <div className="btn-group">
          <button className="btn btn-outline-primary" onClick={handlePrint}>
            <Printer size={16} className="me-1" /> Print
          </button>
          <button className="btn btn-outline-success" onClick={handleDownloadPDF}>
            <Download size={16} className="me-1" /> Download PDF
          </button>
        </div>
      </div>

      {/* Report Title */}
      <div className="card mb-4">
        <div className="card-body text-center py-4">
          <h1 className="mb-1" style={{ color: "#263589" }}>{report.name}</h1>
          <p className="text-muted">{report.description}</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <div className="badge bg-blue-lt p-2">Year: {report.Year}</div>
            <div className="badge bg-purple-lt p-2">
              {report.detailLevel.charAt(0).toUpperCase() + report.detailLevel.slice(1)} Report
            </div>
            <div className="badge bg-green-lt p-2">
              Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section - Available in both summary and detailed views */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Emissions Summary</h3>
        </div>
        <div className="card-body">
          <div className="row row-cards">
            <div className="col-md-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Total Emissions</div>
                  </div>
                  <div className="h1 mb-3">{emissions.total.toFixed(2)} tCO₂e</div>
                  <div className="d-flex mb-2">
                    <div>Reporting Year</div>
                    <div className="ms-auto">
                      <span className="text-green d-inline-flex align-items-center lh-1">
                        {report.Year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Scope 1 Emissions</div>
                  </div>
                  <div className="h1 mb-3">{emissions.scope1.toFixed(2)} tCO₂e</div>
                  <div className="d-flex mb-2">
                    <div>Direct Emissions</div>
                    <div className="ms-auto">
                      <span className="text-green d-inline-flex align-items-center lh-1">
                        {((emissions.scope1 / emissions.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Scope 2 Emissions</div>
                  </div>
                  <div className="h1 mb-3">{emissions.scope2.toFixed(2)} tCO₂e</div>
                  <div className="d-flex mb-2">
                    <div>Indirect Emissions</div>
                    <div className="ms-auto">
                      <span className="text-green d-inline-flex align-items-center lh-1">
                        {((emissions.scope2 / emissions.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Scope 3 Emissions</div>
                  </div>
                  <div className="h1 mb-3">{emissions.scope3.toFixed(2)} tCO₂e</div>
                  <div className="d-flex mb-2">
                    <div>Value Chain Emissions</div>
                    <div className="ms-auto">
                      <span className="text-green d-inline-flex align-items-center lh-1">
                        {((emissions.scope3 / emissions.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {report.includeCharts === "yes" && (
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Emissions by Scope</h4>
                  </div>
                  <div className="card-body">
                    <div className="chart-container d-flex justify-content-center align-items-center" style={{height: "250px"}}>
                      <div className="ms-4">
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-primary me-2" style={{width: "12px", height: "12px"}}></span>
                          <span>Scope 1: {((emissions.scope1 / emissions.total) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-azure me-2" style={{width: "12px", height: "12px"}}></span>
                          <span>Scope 2: {((emissions.scope2 / emissions.total) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-green me-2" style={{width: "12px", height: "12px"}}></span>
                          <span>Scope 3: {((emissions.scope3 / emissions.total) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Emissions Comparison</h4>
                  </div>
                  <div className="card-body">
                    <div className="chart-container d-flex justify-content-center" style={{height: "250px"}}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Content - Only shown in detailed view */}
      {report.detailLevel === "detailed" && (
        <>
          {/* Scope 1 Details */}
          {report.scope1 && (
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Scope 1 Detailed Emissions</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h4>Fuel Combustion</h4>
                    {report.scope1Data.fuelCombution && report.scope1Data.fuelCombution.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Fuel Type</th>
                              <th>Quantity</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope1Data.fuelCombution.map((item, index) => (
                              <tr key={index}>
                                <td>{item.fuelType || "N/A"}</td>
                                <td>{item.quantity || 0} {item.unit || ""}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                            <tr className="bg-light">
                              <td colSpan="2"><strong>Total</strong></td>
                              <td><strong>
                                {report.scope1Data.fuelCombution.reduce((sum, item) => sum + Number(item.emissions || 0), 0).toFixed(2)}
                              </strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No fuel combustion data available.</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h4>Production Processes</h4>
                    {report.scope1Data.production && report.scope1Data.production.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Process</th>
                              <th>Quantity</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope1Data.production.map((item, index) => (
                              <tr key={index}>
                                <td>{item.processType || "N/A"}</td>
                                <td>{item.quantity || 0} {item.unit || ""}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                            <tr className="bg-light">
                              <td colSpan="2"><strong>Total</strong></td>
                              <td><strong>
                                {report.scope1Data.production.reduce((sum, item) => sum + Number(item.emissions || 0), 0).toFixed(2)}
                              </strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No production process data available.</p>
                    )}
                  </div>
                </div>
                {report.includeCharts === "yes" && (
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Scope 1 Emissions Distribution</h4>
                        </div>
                        <div className="card-body">
                          <div className="chart-container d-flex justify-content-center" style={{height: "250px"}}>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Scope 2 Details */}
          {report.scope2 && (
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Scope 2 Detailed Emissions</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <h4>Electricity Consumption</h4>
                    {report.scope2Data.energyConsumption && report.scope2Data.energyConsumption.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Source</th>
                              <th>Consumption (kWh)</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope2Data.energyConsumption.map((item, index) => (
                              <tr key={index}>
                                <td>{item.source || "N/A"}</td>
                                <td>{item.quantity || 0}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                            <tr className="bg-light">
                              <td colSpan="2"><strong>Total</strong></td>
                              <td><strong>
                                {report.scope2Data.energyConsumption.reduce((sum, item) => sum + Number(item.emissions || 0), 0).toFixed(2)}
                              </strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No energy consumption data available.</p>
                    )}
                  </div>
                  <div className="col-md-4">
                    <h4>Heating</h4>
                    {report.scope2Data.heating && report.scope2Data.heating.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Source</th>
                              <th>Consumption</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope2Data.heating.map((item, index) => (
                              <tr key={index}>
                                <td>{item.source || "N/A"}</td>
                                <td>{item.quantity || 0} {item.unit || ""}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                            <tr className="bg-light">
                              <td colSpan="2"><strong>Total</strong></td>
                              <td><strong>
                                {report.scope2Data.heating.reduce((sum, item) => sum + Number(item.emissions || 0), 0).toFixed(2)}
                              </strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No heating data available.</p>
                    )}
                  </div>
                  <div className="col-md-4">
                    <h4>Cooling</h4>
                    {report.scope2Data.cooling && report.scope2Data.cooling.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Source</th>
                              <th>Consumption</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope2Data.cooling.map((item, index) => (
                              <tr key={index}>
                                <td>{item.source || "N/A"}</td>
                                <td>{item.quantity || 0} {item.unit || ""}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                            <tr className="bg-light">
                              <td colSpan="2"><strong>Total</strong></td>
                              <td><strong>
                                {report.scope2Data.cooling.reduce((sum, item) => sum + Number(item.emissions || 0), 0).toFixed(2)}
                              </strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No cooling data available.</p>
                    )}
                  </div>
                </div>
                {report.includeCharts === "yes" && (
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Scope 2 Emissions Distribution</h4>
                        </div>
                        <div className="card-body">
                          <div className="chart-container d-flex justify-content-center" style={{height: "250px"}}>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Scope 3 Details */}
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
                              {(Number(report.scope3Data.businessTravelEmissions) / emissions.scope3 * 100).toFixed(1)}%
                            </td>
                          </tr>
                          <tr>
                            <td>Transportation</td>
                            <td>{Number(report.scope3Data.transportEmissions).toFixed(2)}</td>
                            <td>
                              {(Number(report.scope3Data.transportEmissions) / emissions.scope3 * 100).toFixed(1)}%
                            </td>
                          </tr>
                          <tr>
                            <td>Waste</td>
                            <td>{Number(report.scope3Data.dechetEmissions).toFixed(2)}</td>
                            <td>
                              {(Number(report.scope3Data.dechetEmissions) / emissions.scope3 * 100).toFixed(1)}%
                            </td>
                          </tr>
                          <tr>
                            <td>Capital Goods</td>
                            <td>{Number(report.scope3Data.capitalGoodEmissions).toFixed(2)}</td>
                            <td>
                              {(Number(report.scope3Data.capitalGoodEmissions) / emissions.scope3 * 100).toFixed(1)}%
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
                {/* Detailed breakdown of Scope 3 categories */}
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h4>Business Travel Details</h4>
                    {report.scope3Data.businessTravel && report.scope3Data.businessTravel.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Travel Type</th>
                              <th>Distance (km)</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope3Data.businessTravel.map((item, index) => (
                              <tr key={index}>
                                <td>{item.travelType || "N/A"}</td>
                                <td>{item.distance || 0}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No business travel data available.</p>
                    )}
                  </div>                  
                  <div className="col-md-6">
                    <h4>Transportation Details</h4>
                    {report.scope3Data.transport && report.scope3Data.transport.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Distance/Quantity</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope3Data.transport.map((item, index) => (
                              <tr key={index}>
                                <td>{item.transportType || "N/A"}</td>
                                <td>{item.quantity || 0} {item.unit || ""}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No transportation data available.</p>
                    )}
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h4>Waste Management Details</h4>
                    {report.scope3Data.dechet && report.scope3Data.dechet.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Waste Type</th>
                              <th>Quantity (tons)</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope3Data.dechet.map((item, index) => (
                              <tr key={index}>
                                <td>{item.wasteType || "N/A"}</td>
                                <td>{item.quantity || 0}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No waste management data available.</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h4>Capital Goods Details</h4>
                    {report.scope3Data.capitalGood && report.scope3Data.capitalGood.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Quantity</th>
                              <th>Emissions (tCO₂e)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.scope3Data.capitalGood.map((item, index) => (
                              <tr key={index}>
                                <td>{item.category || "N/A"}</td>
                                <td>{item.quantity || 0}</td>
                                <td>{Number(item.emissions).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No capital goods data available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )} </>
      )}
    </div>
  );
};

export default ViewReport;