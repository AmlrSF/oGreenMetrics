"use client";

import React, { useState, useEffect } from "react";
import { 
  IconBriefcase, 
  IconTruck, 
  IconTrash, 
  IconBuildingFactory, 
  IconShoppingCart, 
  IconUsers, 
  IconInfoCircle, 
  IconArrowDown, 
  IconArrowUp, 
  IconChartPie, 
  IconExternalLink 
} from "@tabler/icons-react";
import ReportCharts from "./ReportCharts";

const Scope3Tab = ({
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
  const [expandedSection, setExpandedSection] = useState(null);
   
  // Calculate total scope 3 emissions
  const totalScope3Emissions = 
    (report.scope3Data?.businessTravelEmissions || 0) +
    (report.scope3Data?.transportEmissions || 0) +
    (report.scope3Data?.employesTransportEmissions || 0) +
    (report.scope3Data?.dechetEmissions || 0) +
    (report.scope3Data?.capitalGoodEmissions || 0) +
    (report.scope3Data?.purchasedGoodEmissions || 0);
  
  // Calculate percentage for each category
  const calculatePercentage = (value) => {
    return totalScope3Emissions > 0 ? ((value / totalScope3Emissions) * 100).toFixed(1) : 0;
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

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

      <div className="row mt-4">
        <div className="col-12 mb-4">
       
        </div>
      </div>
 
        <div className="row row-cards mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title">
                  <IconBriefcase className="me-2" size={20} />
                  Déplacements professionnels
                </h3>
                <div className="card-actions">
                  <span className="badge bg-blue text-white p-2">
                    {formatNumber(report.scope3Data?.businessTravelEmissions || 0)} tCO₂
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
                        <th>Facteur d'émission</th>
                        <th>Émissions de CO₂ (tCO₂)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.scope3Data?.businessTravel?.length > 0 ? (
                        report.scope3Data.businessTravel.map((travel, index) => (
                          <tr key={travel._id || index}>
                            <td>{travel.purpose}</td>
                            <td>
                              <span className="badge bg-blue-lt">{travel.mode}</span>
                            </td>
                            <td>{travel.type}</td>
                            <td>{parseFloat(travel.distance).toLocaleString()}</td>
                            <td>{travel.emissionFactor} kg CO₂/km</td>
                            <td>
                              <strong>{formatNumber(travel.emissions)}</strong>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">Aucune donnée disponible</td>
                        </tr>
                      )}
                    </tbody>
                    
                  </table>
                </div>
                
              </div>
            </div>
          </div>
        </div>
       
 
        <div className="row row-cards mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <IconTruck className="me-2" size={20} />
                  Transport et distribution
                </h3>
                <div className="card-actions">
                  <span className="badge bg-teal text-white p-2">
                    {formatNumber(report.scope3Data?.transportEmissions || 0)} tCO₂
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
                        <th>Distance (km)</th>
                        <th>Poids (kg)</th>
                        <th>Facteur d'émission</th>
                        <th>Émissions de CO₂ (tCO₂)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.scope3Data?.transport?.length > 0 ? (
                        report.scope3Data.transport.map((item, index) => (
                          <tr key={item._id || index}>
                            <td>{item.purpose}</td>
                            <td>
                              <span className="badge bg-teal-lt">{item.mode}</span>
                            </td>
                            <td>{parseFloat(item.distance).toLocaleString()}</td>
                            <td>{parseFloat(item.poids).toLocaleString()}</td>
                            <td>{item.emissionFactor} tCO₂/t·km</td>
                            <td>
                              <strong>{formatNumber(item.emissions)}</strong>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">Aucune donnée disponible</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                 
              </div>
            </div>
          </div>
        </div>
     

        <div className="row row-cards mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <IconUsers className="me-2" size={20} />
                  Transport des employés
                </h3>
                <div className="card-actions">
                  <span className="badge bg-purple text-white p-2">
                    {formatNumber(report.scope3Data?.employesTransportEmissions || 0)} tCO₂
                  </span>
                </div>
              </div>
              <div className="card-body">
                
                <div className="table-responsive">
                  <table className="table table-vcenter card-table table-striped">
                    <thead>
                      <tr>
                        <th>Départ</th>
                        <th>Destination</th>
                        <th>Mode</th>
                        <th>Distance (km)</th>
                        <th>Employés</th>
                        <th>Détails</th>
                        <th>Émissions de CO₂ (tCO₂)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.scope3Data?.employesTransport?.length > 0 ? (
                        report.scope3Data.employesTransport.map((item, index) => (
                          <tr key={item._id || index}>
                            <td>{item.depart}</td>
                            <td>{item.destination}</td>
                            <td>
                              <span className="badge bg-purple-lt">{item.mode}</span>
                            </td>
                            <td>{parseFloat(item.distance).toLocaleString()}</td>
                            <td>{item.nombreEmployes}</td>
                            <td>
                              {item.nomBus && (
                                <>
                                  {item.nomBus} ({item.matricule})
                                </>
                              )}
                            </td>
                            <td>
                              <strong>{formatNumber(item.emissions)}</strong>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">Aucune donnée disponible</td>
                        </tr>
                      )}
                    </tbody>
                    
                  </table>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      
        <div className="row row-cards mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <IconTrash className="me-2" size={20} />
                  Gestion des déchets
                </h3>
                <div className="card-actions">
                  <span className="badge bg-lime text-white p-2">
                    {formatNumber(report.scope3Data?.dechetEmissions || 0)} tCO₂
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
                          <th>Facteur d'émission</th>
                          <th>Émissions de CO₂ (tCO₂)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.scope3Data.dechet.map((waste, index) => (
                          <tr key={waste._id || index}>
                            <td>{waste.name}</td>
                            <td>
                              <span className="badge bg-lime-lt">{waste.type}</span>
                            </td>
                            <td>
                              <span className={`badge ${waste.methode === 'Recycling' ? 'bg-green-lt' : 'bg-yellow-lt'}`}>
                                {waste.methode}
                              </span>
                            </td>
                            <td>{parseFloat(waste.poids).toLocaleString()}</td>
                            <td>{waste.emissionFactor} tCO₂/t</td>
                            <td>
                              <strong>{formatNumber(waste.emissions)}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody> 
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-info">Aucune donnée sur la gestion des déchets disponible.</div>
                )}
                 
              </div>
            </div>
          </div>
        </div>
      

     
        <div className="row row-cards mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <IconBuildingFactory className="me-2" size={20} />
                  Biens d'équipement
                </h3>
                <div className="card-actions">
                  <span className="badge bg-orange text-white p-2">
                    {formatNumber(report.scope3Data?.capitalGoodEmissions || 0)} tCO₂
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
                          <th>Facteur d'émission</th>
                          <th>Émissions de CO₂ (tCO₂)</th>
                          <th>Émissions annuelles (tCO₂/an)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.scope3Data.capitalGood.map((good, index) => (
                          <tr key={good._id || index}>
                            <td>{good.name}</td>
                            <td>
                              <span className="badge bg-orange-lt">{good.category}</span>
                            </td>
                            <td>{parseFloat(good.cost).toLocaleString()} €</td>
                            <td>{good.lifetime}</td>
                            <td>{good.emissionFactor} tCO₂/k€</td>
                            <td>
                              <strong>{formatNumber(good.emissions)}</strong>
                            </td>
                            <td>
                              <strong>{formatNumber(good.emissions / good.lifetime)}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-info">Aucune donnée sur les biens d'équipement disponible.</div>
                )}
         
              </div>
            </div>
          </div>
        </div>
      

      
        <div className="row row-cards mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <IconShoppingCart className="me-2" size={20} />
                  Biens achetés
                </h3>
                <div className="card-actions">
                  <span className="badge bg-indigo text-white p-2">
                    {formatNumber(report.scope3Data?.purchasedGoodEmissions || 0)} tCO₂
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
                        <th>Facteur d'émission</th>
                        <th>Émissions de CO₂ (tCO₂)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.scope3Data?.purchasedGood?.length > 0 ? (
                        report.scope3Data.purchasedGood.map((good, index) => (
                          <tr key={good._id || index}>
                            <td>{good.titre}</td>
                            <td>
                              <span className="badge bg-indigo-lt">{good.type}</span>
                            </td>
                            <td>{good.sousType}</td>
                            <td>{parseFloat(good.quantite).toLocaleString()}</td>
                            <td>{good.emissionFactor} tCO₂/t</td>
                            <td>
                              <strong>{formatNumber(good.emissions)}</strong>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">Aucune donnée disponible</td>
                        </tr>
                      )}
                    </tbody>
                  
                  </table>
                </div>
               
              </div>
            </div>
          </div>
        </div>
       
 
    </>
  );
};

export default Scope3Tab;