"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";

const CompanyDash = () => {
  const [companyCount, setCompanyCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  
  useEffect(() => {
    // Fetch number of companies
    axios.get("http://localhost:4000/companies")
      .then(response => setCompanyCount(response.data.data.length))  
      .catch(error => console.error("Error fetching companies:", error));
  
    // Fetch number of users
    axios.get("http://localhost:4000/users")
      .then(response => setUserCount(response.data.length))  
      .catch(error => console.error("Error fetching users:", error));
  }, []);
  

  return (
    <div className="flex flex-wrap gap-4 p-5">
      {/* Card for Companies */}
      <div className="card card-sm w-72">
        <div className="card-body">
          
          <div className="d-flex justify-content-between align-items-center">
      
            <div className="subheader">Companies</div>
            <span className="text-muted">Total</span>
          </div>
          <div className="h1 mb-3">{companyCount}</div>        
        </div>
      </div>

      {/* Card for Users */}
      <div className="card card-sm w-72">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div className="subheader">Users</div>
            <span className="text-muted">Total</span>
          </div>
          <div className="h1 mb-3">{userCount}</div>
         
          
         
        </div>
      </div>
    </div>
  );
};

export default CompanyDash;
