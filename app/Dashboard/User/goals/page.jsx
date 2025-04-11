"use client"
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const GoalsPage = () => {
  const [company, setCompany] = useState(null);
  const [goals, setGoals] = useState({
    scope1Goal: 0,
    scope2Goal: 0,
    scope3Goal: 0,
    totalGoal: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });

        if (!userResponse.ok) {
          throw new Error(`Authentication failed: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        if (!userData?.user?._id) {
          setError("User not authenticated. Please log in again.");
          return;
        }

        const companyResponse = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userData.user._id}`,
          {
            method: "GET",
          }
        );

        if (!companyResponse.ok) {
          throw new Error(`Failed to fetch company: ${companyResponse.status}`);
        }

        const companyData = await companyResponse.json();
        setCompany(companyData.data);
      } catch (error) {
        console.error("Error fetching user or company:", error);
        setError(`Error: ${error.message}`);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company || !company._id) {
      toast.error("Company information not available. Please refresh and try again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company_id: company._id, goals }),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      toast.success("Goals saved successfully!");
    } catch (error) {
      toast.error(`Submission failed: ${error.message}`);
    }
  };

  return (
    <div className="container-xl">
      <div className="page-header d-print-none">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Emission Reduction Goals</h2>
            <div className="text-muted mt-1">Set and track your carbon emission reduction targets</div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="row row-cards">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Current Emissions</h3>
                {/* Current emissions UI goes here */}
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-8">
            <form className="card" onSubmit={handleSubmit}>
              <div className="card-header">
                <h3 className="card-title">Set Emission Goals</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Scope 1 Goal (tCO₂e)</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="scope1Goal"
                      placeholder="Enter target in tons of CO₂e"
                      min="0"
                      value={goals.scope1Goal}
                      onChange={(e) => setGoals({ ...goals, scope1Goal: e.target.value })}
                    />
                    <span className="input-group-text">tCO₂e</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Scope 2 Goal (tCO₂e)</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="scope2Goal"
                      placeholder="Enter target in tons of CO₂e"
                      min="0"
                      value={goals.scope2Goal}
                      onChange={(e) => setGoals({ ...goals, scope2Goal: e.target.value })}
                    />
                    <span className="input-group-text">tCO₂e</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Scope 3 Goal (tCO₂e)</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="scope3Goal"
                      placeholder="Enter target in tons of CO₂e"
                      min="0"
                      value={goals.scope3Goal}
                      onChange={(e) => setGoals({ ...goals, scope3Goal: e.target.value })}
                    />
                    <span className="input-group-text">tCO₂e</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Emissions Goal (tCO₂e)</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="totalGoal"
                      placeholder="Enter target in tons of CO₂e"
                      min="0"
                      value={goals.totalGoal}
                      onChange={(e) => setGoals({ ...goals, totalGoal: e.target.value })}
                    />
                    <span className="input-group-text">tCO₂e</span>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  Save Goals
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;