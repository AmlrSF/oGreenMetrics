"use client";

import React from "react";
import { IconFlame, IconBuildingFactory } from "@tabler/icons-react";
import ReportCharts from "./ReportCharts";

const Scope1Tab = ({  report,  calculateTotalEmissions,  getScope1Details,  getScope2Details, getScope3Details, getFuelTypes,  getCoolingTypes,  getHeatingTypes,  getTransportModes,  getWasteTypes,  formatNumber, activeTab
}) => {
  return (
    <>
      <ReportCharts report={report} activeTab={activeTab} calculateTotalEmissions={calculateTotalEmissions} getScope1Details={getScope1Details} getScope2Details={getScope2Details} getScope3Details={getScope3Details} getFuelTypes={getFuelTypes} getCoolingTypes={getCoolingTypes} getHeatingTypes={getHeatingTypes} getTransportModes={getTransportModes} getWasteTypes={getWasteTypes}
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
                  {report.scope1Data?.fuelCombution?.[0]?.totalEmissions?.toLocaleString() || 0} tCO₂
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
                        const machines = report.scope1Data?.fuelCombution?.[0]?.machines?.filter(
                          m => m.typeDeCarburant === fuelType.type
                        ) || [];
                        const totalQuantity = machines.reduce((sum, m) => sum + m.quantite, 0);
                        const percentage = (fuelType.emissions / (report.scope1Data?.fuelCombution?.[0]?.totalEmissions || 1)) * 100;
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
                        <td><strong>{report.scope1Data?.fuelCombution?.[0]?.totalEmissions?.toLocaleString() || 0} tCO₂</strong></td>
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
                  {report.scope1Data?.production?.[0]?.totalEmissions?.toLocaleString() || 0} tCO₂
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
                    )) || (
                      <tr>
                        <td colSpan="4" className="text-center">Aucune donnée disponible</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Émissions Totales:</strong></td>
                      <td><strong>{report.scope1Data?.production?.[0]?.totalEmissions?.toLocaleString() || 0} tCO₂</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scope1Tab;