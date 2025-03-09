"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  ShieldCheck,
  shieldCheck,
  ShieldX,
} from "lucide-react";


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
      console.log(data);
      
      setCompanies(data?.data);
      setFilteredCompanies(data?.data);
    } catch (error) {
      setError("Failed to load companies");
    }
    setLoading(false);
  };

  const handleApproveCompany = async (companyId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/updatecompany/${companyId}`,
         {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isVerified: !currentStatus,
        }),
      });
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
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between flex-col items-start mb-8 pb-5 border-b border-gray-200">
        <h1 className="text-2xl mb-0 font-semibold text-gray-800">
          Company Administration
        </h1>
        <p className="text-gray-600 text-sm">
          Manage companies verification status efficiently.
        </p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div>
          <select
            className="border border-gray-300 px-4 py-2 rounded-md"
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
          >
            <option value="all">All Companies</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading companies...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company, index) => (
                    <tr key={company.id || index} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.nom_entreprise}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.industrie}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            company.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {company.isVerified ? (
                            <ShieldCheck className="w-3 h-3 mr-1" />
                          ) : (
                            <ShieldX className="w-3 h-3 mr-1" />
                          )}
                          {company.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleApproveCompany(company._id, company.isVerified)
                          }
                          className={`${
                            company.isVerified
                              ? "text-red-600 hover:text-red-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                          title={
                            company.isVerified
                              ? "Revoke Verification"
                              : "Approve Company"
                          }
                        >
                          {company.isVerified ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : (
                            <ShieldX className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;