"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const EmissionsChartPage = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEmissions, setCurrentEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0,
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [chartType, setChartType] = useState('bar');  
  const [timeRange, setTimeRange] = useState('current'); 
  const sumEmissions = (arr) => {
    if (!arr || !Array.isArray(arr)) return 0;
    return arr.reduce((sum, item) => sum + parseFloat(item.emissions || 0), 0);
  };

  const fetchAndCalculateEmissions = async (companyId) => {
    try {
      const reportRes = await fetch(
        `http://localhost:4000/report/full/${companyId}`
      );
      const reportJson = await reportRes.json();
      const reportData = reportJson.data;

      const scope1Fuel =
        reportData.scope1Data?.fuelCombution?.[0]?.totalEmissions || 0;
      const scope1Production =
        reportData.scope1Data?.production?.[0]?.totalEmissions || 0;
      const scope1 = parseFloat(scope1Fuel) + parseFloat(scope1Production);

      const scope2Heating = reportData.scope2Data?.heating?.totalEmissions || 0;
      const scope2Cooling = reportData.scope2Data?.cooling?.totalEmissions || 0;
      const scope2Energy =
        reportData.scope2Data?.energyConsumption?.emissions || 0;
      const scope2 =
        parseFloat(scope2Heating) +
        parseFloat(scope2Cooling) +
        parseFloat(scope2Energy);

      const scope3 =
        sumEmissions(reportData.scope3Data?.transport) +
        sumEmissions(reportData.scope3Data?.dechet) +
        sumEmissions(reportData.scope3Data?.capitalGood) +
        sumEmissions(reportData.scope3Data?.businessTravel);

      const total = scope1 + scope2 + scope3;

      return {
        scope1: parseFloat(scope1.toFixed(2)),
        scope2: parseFloat(scope2.toFixed(2)),
        scope3: parseFloat(scope3.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      };
    } catch (error) {
      console.error("Error calculating emissions:", error);
      toast.error("Échec du calcul des émissions actuelles");
      return { scope1: 0, scope2: 0, scope3: 0, total: 0 };
    }
  };

  const fetchHistoricalData = async (companyId) => {
    try { 
      const res = await fetch(`http://localhost:4000/emissions/history/${companyId}`);
      const data = await res.json();
      if (data.success) {
        setHistoricalData(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const authRes = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const authData = await authRes.json();
        const userId = authData?.user?._id;
        if (!userId) throw new Error("Non autorisé");

        const compRes = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userId}`
        );
        const compData = await compRes.json();
        setCompany(compData.data);

        const emissions = await fetchAndCalculateEmissions(compData.data._id);
        setCurrentEmissions(emissions);

        // Fetch historical data
        await fetchHistoricalData(compData.data._id);
        
      } catch (err) {
        console.error(err);
        toast.error("Échec de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getScopeColor = (scope) => {
    switch(scope) {
      case 1: return "bg-red";
      case 2: return "bg-blue";
      case 3: return "bg-green";
      default: return "bg-azure";
    }
  };

  const getScopeChartColor = (scope, alpha = 1) => {
    switch(scope) {
      case 1: return `rgba(220, 53, 69, ${alpha})`;
      case 2: return `rgba(13, 110, 253, ${alpha})`;
      case 3: return `rgba(25, 135, 84, ${alpha})`;
      default: return `rgba(23, 162, 184, ${alpha})`;
    }
  };

  const getPercentOfTotal = (value) => {
    if (!currentEmissions.total) return 0;
    return ((value / currentEmissions.total) * 100).toFixed(1);
  };

  // Bar Chart data
  const barChartData = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [
      {
        label: 'Émissions Actuelles',
        data: [currentEmissions.scope1, currentEmissions.scope2, currentEmissions.scope3],
        backgroundColor: [
          getScopeChartColor(1, 0.8),
          getScopeChartColor(2, 0.8),
          getScopeChartColor(3, 0.8),
        ],
        borderColor: [
          getScopeChartColor(1, 1),
          getScopeChartColor(2, 1),
          getScopeChartColor(3, 1),
        ],
        borderWidth: 1,
      }
    ],
  };

  // Pie Chart data
  const pieChartData = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [
      {
        data: [currentEmissions.scope1, currentEmissions.scope2, currentEmissions.scope3],
        backgroundColor: [
          getScopeChartColor(1, 0.7),
          getScopeChartColor(2, 0.7),
          getScopeChartColor(3, 0.7),
        ],
        borderColor: [
          getScopeChartColor(1, 1),
          getScopeChartColor(2, 1),
          getScopeChartColor(3, 1),
        ],
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Émissions Actuelles par Scope',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' tCO₂e';
            } else if (context.parsed !== null) {
              label += context.parsed + ' tCO₂e';
            }
            return label;
          }
        }
      }
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'tCO₂e'
        }
      }
    } : undefined
  };

  // Generate yearly breakdown of emissions by scope
  const yearlyEmissionsData = {
    labels: ['2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Scope 1',
        data: [50, 45, 40, currentEmissions.scope1],
        backgroundColor: getScopeChartColor(1, 0.7),
        borderColor: getScopeChartColor(1, 1),
        borderWidth: 1,
      },
      {
        label: 'Scope 2',
        data: [70, 65, 55, currentEmissions.scope2],
        backgroundColor: getScopeChartColor(2, 0.7),
        borderColor: getScopeChartColor(2, 1),
        borderWidth: 1,
      },
      {
        label: 'Scope 3',
        data: [120, 110, 100, currentEmissions.scope3],
        backgroundColor: getScopeChartColor(3, 0.7),
        borderColor: getScopeChartColor(3, 1),
        borderWidth: 1,
      }
    ],
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Tableau de Bord des Émissions</h2>
              <div className="text-muted mt-1">
                Visualisez et analysez votre empreinte carbone
              </div>
            </div>
          </div>
        </div>

        <div className="page-body">
          {loading ? (
            <div className="card">
              <div className="card-body text-center py-4">
                <div className="spinner-border text-blue" role="status"></div>
                <div className="mt-3">Chargement des données d'émission...</div>
              </div>
            </div>
          ) : (
            <div className="row row-cards">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Émissions Actuelles</h3>
                  </div>
                  <div className="card-body">
                    <div className="space-y-4">
                      {["scope1", "scope2", "scope3"].map((scope, i) => {
                        const scopeNumber = i + 1;
                        const value = currentEmissions[scope];
                        const percentage = getPercentOfTotal(value);
                        return (
                          <div key={scope}>
                            <div className="d-flex justify-content-between mb-1">
                              <div>Scope {scopeNumber}</div>
                              <div className="d-flex align-items-center">
                                <span className="text-muted me-2">{percentage}%</span>
                                <span className="ms-auto">{value} tCO₂e</span>
                              </div>
                            </div>
                            <div className="progress">
                              <div className={`progress-bar ${getScopeColor(scopeNumber)}`} 
                                style={{width: `${percentage}%`}}></div>
                            </div>
                          </div>
                        );
                      })} 
                      <div className="hr-text">Total</div> 
                      <div className="d-flex align-items-center">
                        <div className="h1 mb-0 me-2">{currentEmissions.total}</div>
                        <div className="me-auto">
                          <div className="text-muted">tCO₂e</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mt-3">
                  <div className="card-header">
                    <h3 className="card-title">Répartition par Scope</h3>
                    <div className="card-actions">
                      <div className="btn-group">
                        <button 
                          type="button" 
                          className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setChartType('bar')}
                        >
                          Barres
                        </button>
                        <button 
                          type="button" 
                          className={`btn ${chartType === 'pie' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setChartType('pie')}
                        >
                          Camembert
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "280px" }}>
                      {chartType === 'bar' ? (
                        <Bar data={barChartData} options={chartOptions} />
                      ) : (
                        <Pie data={pieChartData} options={chartOptions} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Évolution des Émissions</h3>
                    <div className="card-actions">
                      <div className="btn-group">
                        <button 
                          type="button" 
                          className={`btn ${timeRange === 'current' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setTimeRange('current')}
                        >
                          Actuel
                        </button>
                        <button 
                          type="button" 
                          className={`btn ${timeRange === 'yearly' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setTimeRange('yearly')}
                        >
                          Annuel
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "400px" }}>
                      {timeRange === 'current' ? (
                        <Bar data={barChartData} options={chartOptions} />
                      ) : (
                        <Bar 
                          data={yearlyEmissionsData} 
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              title: {
                                display: true,
                                text: 'Évolution des Émissions par Année',
                              },
                            },
                          }} 
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="card mt-3">
                  <div className="card-header">
                    <h3 className="card-title">Répartition Détaillée</h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h4>Scope 1: Émissions Directes</h4>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <div>Combustion de carburant</div>
                            <div>{(currentEmissions.scope1 * 0.6).toFixed(1)} tCO₂e</div>
                          </div>
                          <div className="progress">
                            <div className="progress-bar bg-red" style={{width: "60%"}}></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <div>Production industrielle</div>
                            <div>{(currentEmissions.scope1 * 0.4).toFixed(1)} tCO₂e</div>
                          </div>
                          <div className="progress">
                            <div className="progress-bar bg-red" style={{width: "40%"}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h4>Scope 2: Émissions Indirectes</h4>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <div>Consommation d'électricité</div>
                            <div>{(currentEmissions.scope2 * 0.7).toFixed(1)} tCO₂e</div>
                          </div>
                          <div className="progress">
                            <div className="progress-bar bg-blue" style={{width: "70%"}}></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <div>Chauffage et climatisation</div>
                            <div>{(currentEmissions.scope2 * 0.3).toFixed(1)} tCO₂e</div>
                          </div>
                          <div className="progress">
                            <div className="progress-bar bg-blue" style={{width: "30%"}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <h4>Scope 3: Autres Émissions Indirectes</h4>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <div>Transport et logistique</div>
                            <div>{(currentEmissions.scope3 * 0.35).toFixed(1)} tCO₂e</div>
                          </div>
                          <div className="progress">
                            <div className="progress-bar bg-green" style={{width: "35%"}}></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <div>Déchets</div>
                            <div>{(currentEmissions.scope3 * 0.25).toFixed(1)} tCO₂e</div>
                          </div>
                          <div className="progress">
                            <div className="progress-bar bg-green" style={{width: "25%"}}></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <div>Achats de biens et services</div>
                            <div>{(currentEmissions.scope3 * 0.25).toFixed(1)} tCO₂e</div>
                          </div>
                          <div className="progress">
                            <div className="progress-bar bg-green" style={{width: "25%"}}></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <div>Déplacements professionnels</div>
                            <div>{(currentEmissions.scope3 * 0.15).toFixed(1)} tCO₂e</div>
                          </div>
                          <div className="progress">
                            <div className="progress-bar bg-green" style={{width: "15%"}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmissionsChartPage;