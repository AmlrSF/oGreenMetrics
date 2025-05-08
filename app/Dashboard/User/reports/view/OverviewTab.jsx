"use client";

import React from "react";
import ReportCharts from "./ReportCharts";

const OverviewTab = ({  report,  calculateTotalEmissions,  getScope1Details,  getScope2Details,  getScope3Details,  getFuelTypes,  getCoolingTypes,  getHeatingTypes,  getTransportModes,  getWasteTypes,  formatNumber, activeTab
}) => {
  return (
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
                <dd className="col-7">{report.name}</dd>
                <dt className="col-5">Description :</dt>
                <dd className="col-7">{report.description}</dd>
                <dt className="col-5">Année :</dt>
                <dd className="col-7">{report.Year}</dd>
                <dt className="col-5">Type de rapport :</dt>
                <dd className="col-7">{report.detailLevel === "detailed" ? "Detailed Report" : "Summary Report"}</dd>
                <dt className="col-5">Créé le :</dt>
                <dd className="col-7">{new Date(report.createdAt).toLocaleDateString()}</dd>
                <dt className="col-5">Scopes inclus :</dt>
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

      {/* Charts section */}
      <ReportCharts report={report} activeTab={activeTab} calculateTotalEmissions={calculateTotalEmissions} getScope1Details={getScope1Details} getScope2Details={getScope2Details} getScope3Details={getScope3Details} getFuelTypes={getFuelTypes} getCoolingTypes={getCoolingTypes} getHeatingTypes={getHeatingTypes} getTransportModes={getTransportModes} getWasteTypes={getWasteTypes}
      />
    </>
  );
};

export default OverviewTab;