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
          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-building"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21l18 0" /><path d="M9 8l1 0" /><path d="M9 12l1 0" /><path d="M9 16l1 0" /><path d="M14 8l1 0" /><path d="M14 12l1 0" /><path d="M14 16l1 0" /><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" /></svg>
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
          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" /><path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" /></svg>
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
