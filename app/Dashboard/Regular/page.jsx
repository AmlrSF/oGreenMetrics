
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
    return sites.reduce((acc, site) => acc + site.statistics.co2.grid.grams, 0).toFixed(2);
  };

  const calculateAverageCleanerThan = () => {
    return (sites.reduce((acc, site) => acc + site.cleanerThan, 0) / sites.length * 100).toFixed(0);
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
          '#28a745',
          '#17a2b8',
          '#ffc107',
          '#dc3545',
          '#6c757d'
        ],
      }]
    };
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-lg-12 mb-4">
          <h1 className="text-primary">
        
            Dashboard Overview
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <h2 className=" text-primary text-uppercase mb-1">
                    Total Sites
                  </h2>
                  <p className=" mb-0 fs-2 font-weight-bold text-gray-800">
                    {sites.length}
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-globe fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <h2 className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Emissions (g CO2)
                  </h2>
                  <p className="fs-2 mb-0 font-weight-bold text-gray-800">
                    {calculateTotalEmissions()}
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-leaf fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <h2 className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Average Cleaner Than
                  </h2>
                  <p className="fs-2 mb-0 font-weight-bold text-gray-800">
                    {calculateAverageCleanerThan()}%
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-percentage fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <h2 className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Green Hosting
                  </h2>
                  <p className="fs-2 mb-0 font-weight-bold text-gray-800">
                    {sites.filter(site => site.green).length} sites
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-solar-panel fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        <div className="col-xl-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h2 className="m-0 font-weight-bold text-primary">
                 Distribution</h2>
            </div>
            <div className="card-body">
              <div className="chart-pie d-flex justify-content-center align-content-center pt-4">
                <Doughnut style={{width:"250px",height:"250px"}} data={ratingDistribution()} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h2 className="m-0 font-weight-bold text-primary">Recent Sites</h2>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>Rating</th>
                      <th>Emissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites.slice(0, 5).map(site => (
                      <tr key={site._id}>
                        <td>{site.url}</td>
                        <td>
                          <span className={`badge text-white bg-${site.rating === 'A' ? 'success' : 
                            site.rating === 'B' ? 'info' :
                            site.rating === 'C' ? 'warning' :
                            'danger'}`}>
                            {site.rating}
                          </span>
                        </td>
                        <td>{site.statistics.co2.grid.grams.toFixed(3)} g</td>
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
  );
};

export default Dashboard;