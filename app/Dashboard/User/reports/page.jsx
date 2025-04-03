"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, FileText } from "lucide-react";
import { formatDate } from "@/lib/Utils";
import {
  Calendar,
  BarChart2,
  UserX,
  UserCheck,
  Trash2,
  FileTextIcon,
} from "lucide-react";

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
  const [company, setCompany] = useState(null);
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
    const initializeData = async () => {
      const id = await fetchUser();
      if (id) {
        fetchReports(id);
      }
    };
    initializeData();
  }, []);

  const fetchUser = async () => {
    try {
      const userResponse = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });
      const userData = await userResponse.json();

      if (userData?.user) {
        const companyResponse = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userData.user._id}`,
          {
            method: "GET",
          }
        );
        const companyData = await companyResponse.json();
        setCompany(companyData?.data);
        return companyData?.data?._id;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getFilteredReports = () => {
    if (!reports) return [];

    return reports
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
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  };

  const filteredReports = getFilteredReports();
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {

    let form = {
      ...formData,
      company_id:company._id
    } 

    try {
      const response = await fetch("http://localhost:4000/createReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setModalOpen(false);
        fetchReports(company._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReports = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/reports/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setReports(data?.data || []);
    } catch (error) {
      setError("Failed to fetch reports");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    try {
      await fetch(`http://localhost:4000/deleteReport/${id}`, {
        method: "DELETE",
      });
      fetchReports(company._id);
    } catch (error) {
      console.error(error);
    }
  };

  const getScopes = (report) => {
    const scopes = [];
    if (report.scope1) scopes.push("Scope 1");
    if (report.scope2) scopes.push("Scope 2");
    if (report.scope3) scopes.push("Scope 3");
    return scopes.join(", ") || "None";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container-xl h-full">
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
                  {reports?.length > 0 ? (
                    reports
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((data) => (
                        <tr key={data._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-md bg-blue-lt text-blue me-2">
                                <FileTextIcon size={18} />
                              </span>
                              <div className="flex-fill">
                                <div className="font-weight-medium">
                                  {data.name}
                                </div>
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
                            <span className="badge flex items-center bg-blue-lt">
                              <div className="flex">
                                <BarChart2 size={14} className="me-1" />
                                {data.includeCharts ? "Yes" : "No"}
                              </div>
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
                          <td>
                            <div className="btn-list flex-nowrap">
                              <button
                                className={`btn btn-ghost-${
                                  data.status === "pending"
                                    ? "danger"
                                    : "success"
                                } btn-icon`}
                              >
                                {data.status === "pending" ? (
                                  <UserX size={18} />
                                ) : (
                                  <UserCheck size={18} />
                                )}
                              </button>
                              <button
                                onClick={() => deleteReport(data?._id)}
                                className="btn btn-ghost-danger btn-icon"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No reports available.
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
                    filteredReports?.length
                  )}
                </span>{" "}
                of <span>{filteredReports?.length}</span> entries
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
