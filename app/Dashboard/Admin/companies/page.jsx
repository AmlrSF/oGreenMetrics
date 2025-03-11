"use client";

import React, { useState, useEffect } from "react";
import { IconShieldCheck, IconShieldX } from "@tabler/icons-react";

const Page = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/companies");
      const data = await response.json();
      setCompanies(data?.data);
      setFilteredCompanies(data?.data);
    } catch (error) {
      setError("Failed to load companies");
    }
    setLoading(false);
  };

  const handleApproveCompany = async (companyId, currentStatus) => {
    try {
      const response = await fetch(
        `http://localhost:4000/updatecompany/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVerified: !currentStatus,
          }),
        }
      );
      await response.json();
      fetchCompanies();
    } catch (error) {
      setError("Failed to update company status");
    }
  };

  useEffect(() => {
    let result = companies;

    if (currentFilter === "verified") {
      result = companies.filter((company) => company.isVerified);
    } else if (currentFilter === "unverified") {
      result = companies.filter((company) => !company.isVerified);
    }

    setFilteredCompanies(result);
  }, [currentFilter, companies]);

  return (
    <div className="container">
      <header className="mb-4 border-bottom pb-3">
        <h1 className="h2">Company Administration</h1>
        <p className="text-muted">Manage company verification statuses.</p>
      </header>

      <div className="mb-4">
        <select
          className="form-select"
          value={currentFilter}
          onChange={(e) => setCurrentFilter(e.target.value)}
        >
          <option value="all">All Companies</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {loading ? (
        <p>Loading companies...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-light">
              <tr>
                <th>Company</th>
                <th>Company Owner</th>
                <th>Contact Email</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <tr key={company.id || index}>
                    <td>{company.nom_entreprise}</td>
                    <td>{company._id}</td>
                    <td>{company.email}</td>
                    <td>{company.industrie}</td>
                    <td>
                      <span
                        className={`badge   text-white  ${
                          company.isVerified ? "bg-success" : "bg-danger"
                        }`}
                      >
                       
                        {company.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleApproveCompany(company._id, company.isVerified)
                        }
                        className={`btn btn-sm ${
                          company.isVerified ? "btn-outline-danger" : "btn-autline-success"
                        }`}
                        title={
                          company.isVerified
                            ? "Revoke Verification"
                            : "Approve Company"
                        }
                      >
                        {company.isVerified ? (
                          <IconShieldCheck size={16} />
                        ) : (
                          <IconShieldX size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
