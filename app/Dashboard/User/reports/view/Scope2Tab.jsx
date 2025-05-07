"use client";

import React from "react";
import { IconBatteryCharging, IconSnowflake, IconFlame, IconInfoCircle } from "@tabler/icons-react";
import ReportCharts from "./ReportCharts";

const Scope2Tab = ({
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
  activeTab
}) => {
  return (
    <>
      <ReportCharts
        report={report}
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
                  {Array.isArray(report.scope2Data?.cooling)
                    ? report.scope2Data?.cooling?.[0]?.totalEmissions?.toLocaleString()
                    : report.scope2Data?.cooling?.totalEmissions?.toLocaleString() || 0} tCO₂
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
                        const coolers = (Array.isArray(report.scope2Data?.cooling)
                          ? report.scope2Data?.cooling?.[0]?.coolers
                          : report.scope2Data?.cooling?.coolers
                        )?.filter(c => c.type === coolingType.type) || [];
                        const totalEnergy = coolers.reduce((sum, c) => sum + (c.energy || 0), 0);
                        const totalEmissions = Array.isArray(report.scope2Data?.cooling)
                          ? report.scope2Data?.cooling?.[0]?.totalEmissions
                          : report.scope2Data?.cooling?.totalEmissions || 1;
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
                            {Array.isArray(report.scope2Data?.cooling)
                              ? report.scope2Data?.cooling?.[0]?.totalEmissions?.toLocaleString()
                              : report.scope2Data?.cooling?.totalEmissions?.toLocaleString() || 0} tCO₂
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
                  {Array.isArray(report.scope2Data?.heating)
                    ? report.scope2Data?.heating?.[0]?.totalEmissions?.toLocaleString()
                    : report.scope2Data?.heating?.totalEmissions?.toLocaleString() || 0} tCO₂
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
                        const heaters = (Array.isArray(report.scope2Data?.heating)
                          ? report.scope2Data?.heating?.[0]?.heaters
                          : report.scope2Data?.heating?.heaters
                        )?.filter(h => h.type === heatingType.type) || [];
                        const totalEnergy = heaters.reduce((sum, h) => sum + (h.energy || 0), 0);
                        const totalEmissions = Array.isArray(report.scope2Data?.heating)
                          ? report.scope2Data?.heating?.[0]?.totalEmissions
                          : report.scope2Data?.heating?.totalEmissions || 1;
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
                            {Array.isArray(report.scope2Data?.heating)
                              ? report.scope2Data?.heating?.[0]?.totalEmissions?.toLocaleString()
                              : report.scope2Data?.heating?.totalEmissions?.toLocaleString() || 0} tCO₂
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
                  {Array.isArray(report.scope2Data?.energyConsumption)
                    ? report.scope2Data?.energyConsumption?.[0]?.emissions?.toLocaleString()
                    : report.scope2Data?.energyConsumption?.emissions?.toLocaleString() || 0} tCO₂
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <dl className="row">
                    <dt className="col-5">Pays :</dt>
                    <dd className="col-7">
                      {Array.isArray(report.scope2Data?.energyConsumption)
                        ? report.scope2Data?.energyConsumption?.[0]?.country
                        : report.scope2Data?.energyConsumption?.country || "N/A"}
                    </dd>
                    <dt className="col-5">Consommation Annuelle :</dt>
                    <dd className="col-7">
                      {Array.isArray(report.scope2Data?.energyConsumption)
                        ? report.scope2Data?.energyConsumption?.[0]?.yearlyConsumption?.toLocaleString()
                        : report.scope2Data?.energyConsumption?.yearlyConsumption?.toLocaleString() || 0} kWh
                    </dd>
                    <dt className="col-5">Émissions Totales :</dt>
                    <dd className="col-7">
                      <strong>
                        {Array.isArray(report.scope2Data?.energyConsumption)
                          ? report.scope2Data?.energyConsumption?.[0]?.emissions?.toLocaleString()
                          : report.scope2Data?.energyConsumption?.emissions?.toLocaleString() || 0} tCO₂
                      </strong>
                    </dd>
                  </dl>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-info">
                    <div className="d-flex">
                      <IconInfoCircle className="me-2" />
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
  );
};

export default Scope2Tab;