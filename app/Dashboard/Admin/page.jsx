"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IconBuildingSkyscraper,
  IconFileText,
  IconUsers,
  IconTrendingUp,
} from "@tabler/icons-react";

const CompanyDash = () => {
  const [companyCount, setCompanyCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:4000/companies")
      .then((response) => setCompanyCount(response.data.data.length))
      .catch((error) => console.error("Error fetching companies:", error));

    axios
      .get("http://localhost:4000/users")
      .then((response) => {
        const users = response.data;
        const admins = users.filter((item) => item?.AdminRoles || item?.role=="Admin" ).length;
        const nonAdmins = users.filter(
          (item) => item?.roles !== "Admin" 
        ).length;

        setAdminCount(admins);
        setUserCount(nonAdmins - admins);
      })
      .catch((error) => console.error("Error fetching users:", error));

    axios
      .get("http://localhost:4000/reports")
      .then((response) => setReportCount(response.data.data.length))
      .catch((error) => console.error("Error fetching reports:", error));
  }, []);

  const stats = [
    {
      title: "Entreprises",
      value: companyCount,
      icon: IconBuildingSkyscraper,
      trend: "+12%",
      color: "primary",
    },
    {
      title: "Rapports",
      value: reportCount,
      icon: IconFileText,
      trend: "+8%",
      color: "purple",
    },
    {
      title: "Utilisateurs",
      value: userCount,
      icon: IconUsers,
      trend: "+15%",
      color: "green",
    },
    {
      title: "Admins",
      value: adminCount,
      icon: IconTrendingUp,
      trend: "+5%",
      color: "orange",
    },
  ];
  

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header mb-4">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Aperçu du Tableau de Bord</h2>
            </div>
          </div>
        </div>

        <div className="container-card">
          {stats.map((stat, index) => (
            <div key={index} className="flex-1">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className={`icon-box icon-box-sm bg-${stat.color}-lt`}>
                      <stat.icon
                        className={`icon text-${stat.color}`}
                        size={24}
                      />
                    </div>
                    <div className="ms-auto">
                      <div
                        className={`text-${stat.color} d-flex align-items-center`}
                      >
                        <IconTrendingUp size={16} className="me-1" />
                        {stat.trend}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-0 me-2">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="me-auto">
                      <span className="text-muted">{stat.title}</span>
                    </div>
                  </div>

                  <div className="progress progress-sm mt-3">
                    <div
                      className={`progress-bar bg-${stat.color}`}
                      style={{
                        width: `${Math.min((stat.value / 100) * 100, 100)}%`,
                      }}
                      role="progressbar"
                      aria-valuenow={stat.value}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span className="visually-hidden">
                        {stat.value}% Complete
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDash;
