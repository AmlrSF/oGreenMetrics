"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GoalsPage = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState({
    scope1Goal: 0,
    scope2Goal: 0,
    scope3Goal: 0,
    totalGoal: 0,
  });
  const [currentEmissions, setCurrentEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0,
  });

  const sumEmissions = (arr) => {
    if (!arr || !Array.isArray(arr)) return 0;
    return arr.reduce((sum, item) => sum + parseFloat(item.emissions || 0), 0);
  };

  const calculateProgress = (current, goal) => {
    if (!goal || goal <= 0 || current <= 0) return 0;
    const reduction = current - goal;
    return reduction <= 0 ? 0 : ((reduction / current) * 100).toFixed(1);
  };

  const getReductionNeeded = (current, goal) => {
    return goal >= current ? 0 : (current - goal).toFixed(1);
  };

  const getReductionPercentage = (current, goal) => {
    return goal >= current || current === 0
      ? 0
      : (((current - goal) / current) * 100).toFixed(1);
  };

  const handleGoalChange = (scope, value) => {
    const val = Math.max(0, Number(value));
    setGoals((prev) => ({
      ...prev,
      [scope]: val,
    }));
  };

  const validateGoals = () => {
    const validations = {
      scope1: goals.scope1Goal < currentEmissions.scope1,
      scope2: goals.scope2Goal < currentEmissions.scope2,
      scope3: goals.scope3Goal < currentEmissions.scope3,
      total: goals.totalGoal < currentEmissions.total,
    };
    return {
      valid:
        validations.scope1 &&
        validations.scope2 &&
        validations.scope3 &&
        validations.total,
      validations,
    };
  };

  const fetchAndCalculateEmissions = async (companyId) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company || !company._id) {
      toast.error("Company not found");
      return;
    }

    const updatedGoals = {
      ...goals,
      totalGoal:
        Number(goals.scope1Goal) +
        Number(goals.scope2Goal) +
        Number(goals.scope3Goal),
    };

    const { valid, validations } = validateGoals();
    if (!valid) {
      let msg = "Goals must be lower than current emissions:";
      if (!validations.scope1) msg += " Scope 1,";
      if (!validations.scope2) msg += " Scope 2,";
      if (!validations.scope3) msg += " Scope 3,";
      msg = msg.replace(/,$/, "");
      toast.error(msg);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          company_id: company._id,
          goals: updatedGoals,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGoals(updatedGoals);
      toast.success("Goals saved successfully!");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
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
        if (!userId) throw new Error("Unauthorized");

        const compRes = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userId}`
        );
        const compData = await compRes.json();
        setCompany(compData.data);

        const emissions = await fetchAndCalculateEmissions(compData.data._id);
        setCurrentEmissions(emissions);

        const goalRes = await fetch(
          `http://localhost:4000/goals/${compData.data._id}`
        );
        const goalData = await goalRes.json();
        if (goalData.success && goalData.data) {
          setGoals({
            scope1Goal: goalData.data.scope1Goal || 0,
            scope2Goal: goalData.data.scope2Goal || 0,
            scope3Goal: goalData.data.scope3Goal || 0,
            totalGoal: goalData.data.totalGoal || 0,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setGoals((prev) => ({
      ...prev,
      totalGoal:
        Number(prev.scope1Goal) +
        Number(prev.scope2Goal) +
        Number(prev.scope3Goal),
    }));
  }, [goals.scope1Goal, goals.scope2Goal, goals.scope3Goal]);

  const getProgressColor = (percentage) => {
    if (percentage >= 50) return "bg-success";
    if (percentage >= 25) return "bg-info";
    if (percentage > 0) return "bg-warning";
    return "bg-danger";
  };

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

  // Chart.js data setup
  const chartData = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [
      {
        label: 'Current Emissions',
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
      },
      {
        label: 'Goal Emissions',
        data: [goals.scope1Goal, goals.scope2Goal, goals.scope3Goal],
        backgroundColor: [
          getScopeChartColor(1, 0.4),
          getScopeChartColor(2, 0.4),
          getScopeChartColor(3, 0.4),
        ],
        borderColor: [
          getScopeChartColor(1, 0.6),
          getScopeChartColor(2, 0.6),
          getScopeChartColor(3, 0.6),
        ],
        borderWidth: 1,
      },
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
        text: 'Current vs Goal Emissions',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + ' tCO₂e';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'tCO₂e'
        }
      }
    }
  };

  // Reduction progress chart data
  const reductionProgressData = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3', 'Total'],
    datasets: [
      {
        label: 'Reduction Percentage',
        data: [
          getReductionPercentage(currentEmissions.scope1, goals.scope1Goal),
          getReductionPercentage(currentEmissions.scope2, goals.scope2Goal),
          getReductionPercentage(currentEmissions.scope3, goals.scope3Goal),
          getReductionPercentage(currentEmissions.total, goals.totalGoal)
        ],
        backgroundColor: [
          getScopeChartColor(1, 0.7),
          getScopeChartColor(2, 0.7),
          getScopeChartColor(3, 0.7),
          'rgba(108, 117, 125, 0.7)' // gray for total
        ],
        borderColor: [
          getScopeChartColor(1),
          getScopeChartColor(2),
          getScopeChartColor(3),
          'rgba(108, 117, 125, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const reductionProgressOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Reduction Goals Progress',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.parsed.y + '% reduction';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Reduction %'
        }
      }
    }
  };
  const generateChartData = () => {
    if (loading) return null; 
    
    const maxValue = Math.max(
      currentEmissions.scope1, 
      currentEmissions.scope2, 
      currentEmissions.scope3,
      goals.scope1Goal || 0,
      goals.scope2Goal || 0,
      goals.scope3Goal || 0
    );
    
    const getHeight = (value) => {
      if (!maxValue) return 0;
      return (value / maxValue) * 100;
    };
    
    return {
      maxValue,
      current: {
        scope1Height: getHeight(currentEmissions.scope1),
        scope2Height: getHeight(currentEmissions.scope2),
        scope3Height: getHeight(currentEmissions.scope3),
      },
      goals: {
        scope1Height: getHeight(goals.scope1Goal),
        scope2Height: getHeight(goals.scope2Goal),
        scope3Height: getHeight(goals.scope3Goal),
      }
    };
  }; 

  const chartDataCustom = generateChartData(); 
  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Emission Reduction Goals</h2>
              <div className="text-muted mt-1">
                Set and track your company's carbon reduction targets
              </div>
            </div>
          </div>
        </div> 
        <div className="page-body">
          {loading ? (
            <div className="card">
              <div className="card-body text-center py-4">
                <div className="spinner-border text-blue" role="status"></div>
                <div className="mt-3">Loading emission data...</div>
              </div>
            </div>
          ) : (
            <div className="row row-cards">
              <div className="col-md-12 col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Current Emissions</h3>
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
              </div>

              <div className="col-md-12 col-lg-8">
                <form onSubmit={handleSubmit} className="card">
                  <div className="card-header">
                    <h3 className="card-title">Set Reduction Goals</h3>
                  </div>
                  <div className="card-body">
                    {["scope1Goal", "scope2Goal", "scope3Goal"].map((scope, i) => {
                      const scopeLabel = `Scope ${i + 1}`;
                      const current = currentEmissions[`scope${i + 1}`];
                      const goal = goals[scope];
                      const progress = calculateProgress(current, goal);
                      const progressColor = getProgressColor(progress);
                      const scopeColor = getScopeColor(i + 1);

                      return (
                        <div className="mb-4" key={scope}>
                          <div className="row mb-1">
                            <div className="col">
                              <label className="form-label">
                                <span className={`badge ${scopeColor} me-1`}></span>
                                {scopeLabel} Goal (tCO₂e)
                              </label>
                            </div>
                            <div className="col-auto">
                              <span className="text-muted">
                                Current: {current} tCO₂e
                              </span>
                            </div>
                          </div>
                          
                          <div className="input-group mb-2">
                            <input
                              type="number"
                              min="0"
                              max={current - 0.1}
                              className="form-control"
                              value={goal}
                              onChange={(e) => handleGoalChange(scope, e.target.value)}
                            />
                            <span className="input-group-text">tCO₂e</span>
                          </div>
                          
                          <div className="row align-items-center">
                            <div className="col">
                              <div className="progress">
                                <div
                                  className={`progress-bar ${progressColor}`}
                                  role="progressbar"
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                  aria-valuenow={progress}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  {progress > 5 ? `${progress}%` : ''}
                                </div>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div className="text-muted small">
                                Target reduction: {getReductionNeeded(current, goal)} tCO₂e ({getReductionPercentage(current, goal)}%)
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="card mt-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="me-2">Total reduction goal:</div>
                              <span className="h3 mb-0">{goals.totalGoal.toFixed(1)} tCO₂e</span>
                            </div>
                            <div className="text-muted">
                              Reduction: {getReductionNeeded(currentEmissions.total, goals.totalGoal)} tCO₂e ({getReductionPercentage(currentEmissions.total, goals.totalGoal)}%)
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-floppy" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                              <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path>
                              <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                              <path d="M14 4l0 4l-6 0l0 -4"></path>
                            </svg>
                            Save Goals
                          </button>
                        </div>
                      </div>                      
                    </div>
                  </div>
                </form>
                <div className="card mt-2">
                      <div className="card-header">
                        <h3 className="card-title">Goal Visualization</h3>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div style={{ height: "280px" }}>
                              <Bar data={chartData} options={chartOptions} />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div style={{ height: "280px" }}>
                              <Bar data={reductionProgressData} options={reductionProgressOptions} />
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

export default GoalsPage;