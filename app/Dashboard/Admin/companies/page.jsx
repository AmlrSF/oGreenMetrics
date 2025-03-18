"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldX, Trash2,AlertTriangle } from "lucide-react";
import { formatDate, getInitials } from "@/lib/Utils";

const Page = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [userAccess, setUserAccess] = useState("");
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const [modalOpen, setModalOpen] = useState(false);
 
  const [selectedCompany, setselectedCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data?.user) {
        setUserAccess(data?.user?.AdminRoles?.userManagement);
        console.log(data?.user);
      }
    } catch (err) {
      console.log();
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/companies");
      const data = await response.json();
      //console.log(data?.data);
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

  const handleDeleteCompany = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/deletecompany/${selectedCompany._id}`,
        {
          method: "Delete",
        }
      );
      await response.json();
      setModalOpen(false);
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

  const openModal = (company) => {
    setselectedCompany(company);
    setModalOpen(true);
  };

  return (
    <div className="container-xl h-full">
      {modalOpen && selectedCompany && (
        <div className="modal modal-blur fade show d-block">
          <div
            style={{ zIndex: 1050 }}
            className="modal-dialog modal-dialog-centered modal-sm"
          >
            <div className="modal-content">
              <div className="modal-body">
                <div className="text-center py-4">
                  <AlertTriangle
                    size={48}
                    className="text-yellow-500 mb-2 mx-auto"
                  />
                  <h3>Are you sure?</h3>
                  <div className="text-muted">
                    Do you want to delete this company?
                  </div>
                  <div className="text-muted mt-2">
                    <strong>
                      {selectedCompany.nom_entreprise}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="w-100">
                  <div className="row">
                    <div className="col">
                      <button
                        className="btn w-100"
                        onClick={() => setModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col">
                      <button
                        className="btn w-100  btn-danger"
                        onClick={
                          ()=>handleDeleteCompany(selectedCompany)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setModalOpen(false)}
          ></div>
        </div>
      )}

      <div className="py-10 mb-5 d-flex leading-[0.1] border-b flex-column justify-content-center align-items-start">
        <h3 className="text-[30px] font-bold" style={{ color: "#263589" }}>
          Company Administration
        </h3>
        <div className="card-subtitle">
          Manage company verification statuses efficiently.
        </div>
      </div>

      <div className="card pt-5">
        <div className="card-body border-bottom py-3">
          <div className="d-flex">
            <div className="text-secondary">
              Show
              <div className="mx-2 d-inline-block">
                <select
                  className="form-select form-select-sm"
                  value={currentFilter}
                  onChange={(e) => setCurrentFilter(e.target.value)}
                >
                  <option value="all">All Companies</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              entries
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card-body">
            <div className="progress progress-sm">
              <div
                className="progress-bar progress-bar-indeterminate"
                style={{ backgroundColor: "#8EBE21" }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Company Owner</th>
                    <th>Company</th>
                    <th>Contact Email</th>
                    <th>Industry</th>

                    <th>Registration Date</th>
                    {userAccess == "10" ? (
                      <></>
                    ) : (
                      <th className="w-1"> Action </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company, index) => (
                      <tr key={company.id || index}>
                        <td className="d-flex align-items-center">
                          <span
                            className="avatar avatar-sm text-white me-2"
                            style={{ backgroundColor: "#263589" }}
                          >
                            {getInitials(
                              company.userId?.nom,
                              company.userId?.prenom
                            )}
                          </span>
                          <p className="text-[10px] mb-0">
                            {company.userId?.nom} {company.userId?.prenom}
                          </p>
                        </td>
                        <td className="text-secondary ">
                          <div className="d-flex align-items-center">
                            <div className="flex-fill">
                              <div className="font-weight-medium">
                                {company.nom_entreprise}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-secondary">{company.email}</td>
                        <td>
                          <span className="badge bg-purple-lt">
                            {company.industrie}
                          </span>
                        </td>
                        <td className="text-secondary">
                          {formatDate(company.createdAt)}
                        </td>
                        {userAccess == "10" ? (
                          <></>
                        ) : (
                          <td>
                            <div className="btn-list flex-nowrap">
                              <button
                                 onClick={() => openModal(company)}
                                className="btn btn-ghost-danger btn-icon"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-secondary">
                        No companies found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-footer d-flex align-items-center">
              <p className="m-0 text-secondary">
                Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span>
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCompanies.length
                  )}
                </span>{" "}
                of <span>{filteredCompanies.length}</span> entries
              </p>
              <ul className="pagination m-0 ms-auto">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M15 6l-6 6l6 6" />
                    </svg>
                  </button>
                </li>
                <li className="page-item active">
                  <span
                    className="page-link"
                    style={{
                      backgroundColor: "#263589",
                      borderColor: "#263589",
                    }}
                  >
                    {currentPage}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 6l6 6l-6 6" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
