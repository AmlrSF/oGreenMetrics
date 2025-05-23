"use client";

import React from "react";
import { IconBriefcase, IconTruck, IconTrash, IconBuildingFactory, IconShoppingCart } from "@tabler/icons-react";
import ReportCharts from "./ReportCharts";

const Scope3Tab = ({report, calculateTotalEmissions, getScope1Details, getScope2Details, getScope3Details, getFuelTypes, getCoolingTypes, getHeatingTypes, getTransportModes, getWasteTypes, formatNumber, activeTab
}) => {
  return (
    <>
      <ReportCharts  report={report} activeTab={activeTab} calculateTotalEmissions={calculateTotalEmissions} getScope1Details={getScope1Details} getScope2Details={getScope2Details} getScope3Details={getScope3Details} getFuelTypes={getFuelTypes} getCoolingTypes={getCoolingTypes} getHeatingTypes={getHeatingTypes} getTransportModes={getTransportModes} getWasteTypes={getWasteTypes}
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
                  {parseFloat(report.scope3Data?.businessTravelEmissions || 0).toLocaleString()} tCO₂
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
                    )) || (
                      <tr>
                        <td colSpan="5" className="text-center">Aucune donnée disponible</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="text-end"><strong>Émissions Totales :</strong></td>
                      <td><strong>{parseFloat(report.scope3Data?.businessTravelEmissions || 0).toLocaleString()} tCO₂</strong></td>
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
                <IconShoppingCart className="me-2" size={20} />
                Biens achetés
              </h3>
              <div className="card-actions">
                <span className="badge bg-green text-white">
                  {parseFloat(report.scope3Data?.purchasedGoodEmissions || 0).toLocaleString()} tCO₂
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-vcenter card-table table-striped">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Type</th>
                      <th>Sous-type</th>
                      <th>Quantité</th>
                      <th>Émissions de CO₂ (tCO₂)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.scope3Data?.purchasedGood?.map((good, index) => (
                      <tr key={good._id || index}>
                        <td>{good.titre}</td>
                        <td>
                          <span className="badge bg-indigo-lt">{good.type}</span>
                        </td>
                        <td>{good.sousType}</td>
                        <td>{parseFloat(good.quantite).toLocaleString()}</td>
                        <td>
                          <strong>{parseFloat(good.emissions).toLocaleString()}</strong>
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
                      <td><strong>{parseFloat(report.scope3Data?.purchasedGoodEmissions || 0).toLocaleString()} tCO₂</strong></td>
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
                  {parseFloat(report.scope3Data?.dechetEmissions || 0).toLocaleString()} tCO₂
                </span>
              </div>
            </div>
            <div className="card-body">
              {report.scope3Data?.dechet?.length > 0 ? (
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
                      )) || (
                        <tr>
                          <td colSpan="5" className="text-center">Aucune donnée disponible</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="text-end"><strong>Émissions Totales :</strong></td>
                        <td><strong>{parseFloat(report.scope3Data?.dechetEmissions || 0).toLocaleString()} tCO₂</strong></td>
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
                  {parseFloat(report.scope3Data?.capitalGoodEmissions || 0).toLocaleString()} tCO₂
                </span>
              </div>
            </div>
            <div className="card-body">
              {report.scope3Data?.capitalGood?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-vcenter card-table table-striped">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Coût</th>
                        <th>Durée de vie (années)</th>
                        <th>Émissions de CO₂ (tCO₂)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.scope3Data.capitalGood.map((good, index) => (
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
                        <td colSpan="4" className="text-end"><strong>Émissions Totales :</strong></td>
                        <td><strong>{parseFloat(report.scope3Data?.capitalGoodEmissions || 0).toLocaleString()} tCO₂</strong></td>
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
  );
};

export default Scope3Tab;