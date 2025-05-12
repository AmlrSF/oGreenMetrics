"use client"

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [sites, setSites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const authRes = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });
      const authData = await authRes.json();
      setUser(authData.user);

      const siteRes = await fetch("http://localhost:4000/site");
      const siteData = await siteRes.json();

      const userSites = siteData?.data?.filter(
        (item) => item?.userId === authData?.user._id
      );
      setSites(userSites);
    } catch (err) {
      setError("Failed to fetch sites. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalEmissions = () => {
    return sites.reduce((acc, site) => acc + site.statistics.co2.grid.grams, 0)?.toFixed(2);
  };

  const calculateAverageCleanerThan = () => {
    return (sites.reduce((acc, site) => acc + site.cleanerThan, 0) / sites.length * 100)?.toFixed(0);
  };

  const ratingDistribution = () => {
    const distribution = sites.reduce((acc, site) => {
      acc[site.rating] = (acc[site.rating] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(distribution),
      datasets: [{
        data: Object.values(distribution),
        backgroundColor: [
          '#2fb344', // success
          '#4299e1', // info
          '#f59f00', // warning
          '#e53e3e', // danger
          '#667382'  // secondary
        ],
        borderWidth: 0,
      }]
    };
  };

  if (loading) return (
    <div className="container-narrow d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
      <span className="ms-2">Loading dashboard data...</span>
    </div>
  );
  
  if (error) return (
    <div className="container-narrow my-3">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-title">Error</h4>
        <div className="text-muted">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Dashboard Overview</h2>
                <div className="text-muted mt-1">Monitor your website performance metrics</div>
              </div>
             
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="container-xl">
            {/* Stats Cards */}
            <div className="row row-deck row-cards mb-4">
              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Total Sites</div>
                      <div className="ms-auto avatar bg-primary-lt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-world" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                          <path d="M3.6 9h16.8"></path>
                          <path d="M3.6 15h16.8"></path>
                          <path d="M11.5 3a17 17 0 0 0 0 18"></path>
                          <path d="M12.5 3a17 17 0 0 1 0 18"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="h1 mb-0">{sites.length}</div>
                    <div className="d-flex mt-1">
                      <div className="text-muted">Websites monitored</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Total Emissions (g CO2)</div>
                      <div className="ms-auto avatar bg-green-lt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-leaf" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M5 21c.5 -4.5 2.5 -8 7 -10"></path>
                          <path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="h1 mb-0">{calculateTotalEmissions()}</div>
                    <div className="d-flex mt-1">
                      <div className="text-muted">Carbon footprint</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Average Cleaner Than</div>
                      <div className="ms-auto avatar bg-azure-lt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chart-bar" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                          <path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                          <path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="h1 mb-0">{calculateAverageCleanerThan()}%</div>
                    <div className="d-flex mt-1">
                      <div className="text-muted">Industry comparison</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Green Hosting</div>
                      <div className="ms-auto avatar bg-yellow-lt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-solar-panel" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243z"></path>
                          <path d="M4 10h16"></path>
                          <path d="M10 6l-1 8"></path>
                          <path d="M14 6l1 8"></path>
                          <path d="M12 14v4"></path>
                          <path d="M7 18h10"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="h1 mb-0">{sites.filter(site => site.green).length}</div>
                    <div className="d-flex mt-1">
                      <div className="text-muted">Eco-friendly sites</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="row row-deck row-cards">
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Rating Distribution</h3>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-center">
                      <div style={{ height: "250px", width: "250px" }}>
                        <Doughnut 
                          data={ratingDistribution()} 
                          options={{
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  usePointStyle: true,
                                  padding: 20
                                }
                              }
                            },
                            cutout: '70%',
                            responsive: true,
                            maintainAspectRatio: false
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Recent Sites</h3>
                    <div className="card-actions">
                      <a href="/Dashboard/Regular/Sites" className="btn btn-outline-primary btn-sm">
                        View all
                      </a>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table">
                      <thead>
                        <tr>
                          <th>URL</th>
                          <th>Rating</th>
                          <th>Emissions</th>
                          <th className="w-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sites.slice(0, 5).map(site => (
                          <tr key={site._id}>
                            <td className="text-nowrap">{site.url}</td>
                            <td>
                              <span className={`badge ${
                                site.rating === 'A' ? 'bg-success' : 
                                site.rating === 'B' ? 'bg-info' :
                                site.rating === 'C' ? 'bg-warning' :
                                'bg-danger'
                              }`}>
                                {site.rating}
                              </span>
                            </td>
                            <td>{site.statistics.co2.grid.grams?.toFixed(3)} g</td>
                            <td>
                              <a href="#" className="btn btn-icon btn-ghost-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-external-link" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                  <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
                                  <path d="M11 13l9 -9"></path>
                                  <path d="M15 4h5v5"></path>
                                </svg>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;