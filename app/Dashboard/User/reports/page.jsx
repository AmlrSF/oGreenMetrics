"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';

const Reporting = () => {
  const [totalCO2, setTotalCO2] = useState(0);

  useEffect(() => {
    const fetchTotalEmissions = async () => {
      try {
        const response = await axios.get('/api/companies/calculate-emissions', {
          params: { companyId: 'YOUR_COMPANY_ID' }
        });
        setTotalCO2(response.data.data.totalCO2);
      } catch (error) {
        console.error('Error fetching total emissions:', error);
      }
    };
    fetchTotalEmissions();
  }, []);

  return (
    <div className="reporting-container mt-5" style={{ padding: "20px" }}>
      <h2>Rapport des émissions</h2>
      <div className="card mt-4">
        <div className="card-body">
          <h4>Total des émissions de CO2 (Scope 1)</h4>
          <p>{totalCO2.toFixed(2)} tonnes CO2e</p>
        </div>
      </div>
    </div>
  );
};

export default Reporting;