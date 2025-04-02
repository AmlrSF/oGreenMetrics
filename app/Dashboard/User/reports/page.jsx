"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, FileText } from "lucide-react";
import { formatDate } from "@/lib/Utils";
const Reporting = () => {
  const [reports, setReports] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scope1: false,
    scope2: false,
    scope3: false,
    startDate: "",
    endDate: "",
    includeCharts: "yes",
    detailLevel: "summary",
  });

  useEffect(() => {
    const id = fetchUser();
    if (id) {
      fetchReports(id);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const UserReponse = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });
      const UseData = await UserReponse.json();

      if (UseData?.user) {
        const CompanyResponse = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${UseData?.user?._id}`,
          {
            method: "GET",
          }
        );

        const CompanyData = await CompanyResponse.json();

        setCompany(CompanyData?.data);
        return CompanyData?.data?._id;
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const filteredReports = reports
    .filter((report) => {
      if (statusFilter === "all") return true;
      return report.status === statusFilter;
    })
    .filter((report) => {
      if (scopeFilter === "all") return true;
      if (scopeFilter === "scope1") return report.scope1;
      if (scopeFilter === "scope2") return report.scope2;
      if (scopeFilter === "scope3") return report.scope3;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:4000/createReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReport),
      });

      const responseData = await response.json();

      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchReports = async (idPromise) => {
    try {
      const id = await idPromise;
      console.log(id);

      const response = await fetch(`http://localhost:4000/reports/${id}`, {
        method: "GET",
      });

      const responseData = await response.json();
      setReports(responseData?.data);
      
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const getScopes = (report) => {
    const scopes = [];
    if (report.scope1) scopes.push("Scope 1");
    if (report.scope2) scopes.push("Scope 2");
    if (report.scope3) scopes.push("Scope 3");
    return scopes.join(", ") || "None";
  };

  return (
    <div className="container-xl h-full overflow-y-auto">
      {modalOpen && (
        <div className="modal modal-blur fade show d-block">
          <div
            style={{ zIndex: 1050 }}
            className="modal-dialog modal-lg modal-dialog-centered"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Generate New Report</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Report Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Scope Selection</label>
                  <div className="form-selectgroup">
                    <label className="form-selectgroup-item">
                      <input
                        type="checkbox"
                        name="scope1"
                        className="form-selectgroup-input"
                        checked={formData.scope1}
                        onChange={handleInputChange}
                      />
                      <span className="form-selectgroup-label">Scope 1</span>
                    </label>
                    <label className="form-selectgroup-item">
                      <input
                        type="checkbox"
                        name="scope2"
                        className="form-selectgroup-input"
                        checked={formData.scope2}
                        onChange={handleInputChange}
                      />
                      <span className="form-selectgroup-label">Scope 2</span>
                    </label>
                    <label className="form-selectgroup-item">
                      <input
                        type="checkbox"
                        name="scope3"
                        className="form-selectgroup-input"
                        checked={formData.scope3}
                        onChange={handleInputChange}
                      />
                      <span className="form-selectgroup-label">Scope 3</span>
                    </label>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      className="form-control"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      className="form-control"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Include Charts</label>
                  <div className="form-selectgroup">
                    <label className="form-selectgroup-item">
                      <input
                        type="radio"
                        name="includeCharts"
                        value="yes"
                        className="form-selectgroup-input"
                        checked={formData.includeCharts === "yes"}
                        onChange={handleInputChange}
                      />
                      <span className="form-selectgroup-label">Yes</span>
                    </label>
                    <label className="form-selectgroup-item">
                      <input
                        type="radio"
                        name="includeCharts"
                        value="no"
                        className="form-selectgroup-input"
                        checked={formData.includeCharts === "no"}
                        onChange={handleInputChange}
                      />
                      <span className="form-selectgroup-label">No</span>
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Detail Level</label>
                  <div className="form-selectgroup">
                    <label className="form-selectgroup-item">
                      <input
                        type="radio"
                        name="detailLevel"
                        value="summary"
                        className="form-selectgroup-input"
                        checked={formData.detailLevel === "summary"}
                        onChange={handleInputChange}
                      />
                      <span className="form-selectgroup-label">Summary</span>
                    </label>
                    <label className="form-selectgroup-item">
                      <input
                        type="radio"
                        name="detailLevel"
                        value="detailed"
                        className="form-selectgroup-input"
                        checked={formData.detailLevel === "detailed"}
                        onChange={handleInputChange}
                      />
                      <span className="form-selectgroup-label">Detailed</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-link link-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary ms-auto"
                  onClick={handleSubmit}
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
          <div
            style={{ zIndex: 1040 }}
            className="modal-backdrop fade show"
            onClick={() => setModalOpen(false)}
          ></div>
        </div>
      )}

      <div className="py-10 mb-5 d-flex leading-[0.1] border-b  justify-content-center align-items-start">
        <div>
          <h3 className="text-[30px] font-bold" style={{ color: "#263589" }}>
            Reporting
          </h3>
          <div className="card-subtitle">
            Generate and manage your environmental impact reports
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary ms-auto"
          onClick={() => setModalOpen(true)}
        >
          Generate Report
        </button>
      </div>

      <div className="card pt-5">
        <div className="card-body border-bottom py-3">
          <div className="d-flex">
            <div className="text-secondary d-flex align-items-center">
              Show
              <div className="mx-2 d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value)}
                >
                  <option value="all">All Scopes</option>
                  <option value="scope1">Scope 1</option>
                  <option value="scope2">Scope 2</option>
                  <option value="scope3">Scope 3</option>
                </select>

                <select
                  className="form-select form-select-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="latest">Newest</option>
                  <option value="oldest">Oldest</option>
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
                    <th>Report Name</th>
                    <th>Description</th>
                    <th>Period</th>
                    <th>Scopes</th>
                    <th>Charts</th>
                    <th>Detail Level</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-md bg-blue-lt text-blue me-2">
                          <FileText size={18} />
                        </span>
                        <div className="flex-fill">
                          <div className="font-weight-medium">{data.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary">
                      {data.description.length > 30
                        ? `${data.description.slice(0, 30)}...`
                        : data.description}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Calendar size={16} className="me-1" />
                        <span>
                          {formatDate(data.startDate)} -{" "}
                          {formatDate(data.endDate)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-purple-lt">
                        {getScopes(data)}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-blue-lt">
                        <BarChart2 size={14} className="me-1" />
                        {data.includeCharts}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-green-lt">
                        {data.detailLevel}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          data.status === "pending"
                            ? "bg-yellow-lt"
                            : data.status === "completed"
                            ? "bg-success-lt"
                            : "bg-secondary-lt"
                        }`}
                      >
                        {data.status.charAt(0).toUpperCase() +
                          data.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <div className="btn-list flex-nowrap">
                      <button
                        className={`btn btn-ghost-${
                          user.isVerified ? "danger" : "success"
                        } btn-icon`}
                      >
                        {user.isVerified ? (
                          <UserX size={18} />
                        ) : (
                          <UserCheck size={18} />
                        )}
                      </button>
                      <button className="btn btn-ghost-danger btn-icon">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card-footer d-flex align-items-center">
              <p className="m-0 text-secondary">
                Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span>
                  {Math.min(currentPage * itemsPerPage, filteredReports.length)}
                </span>{" "}
                of <span>{filteredReports.length}</span> entries
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

export default Reporting;
