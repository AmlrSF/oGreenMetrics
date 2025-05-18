"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {IconCalendar,IconFile,IconChartBar,IconEye,IconTrash,IconChevronLeft,IconChevronRight,} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const Reporting = () => {
  const [reports, setReports] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const itemsPerPage = 3;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({name: "",description: "",scope1: false,scope2: false,scope3: false,Year: "",includeCharts: "yes",detailLevel: "summary",includeRecomondations: "yes",});
  const [currentStep, setCurrentStep] = useState(1);

  const router = useRouter();

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
    if (formData.Year == "") return;

    let form = {
      ...formData,
      company_id: company._id,
    };

    console.log(form);

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
        setCurrentStep(1);
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
      console.log(data?.data);
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
    return scopes;
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentStep(1);
  };

  return (
    <div className="container-xl h-full">
      {modalOpen && (
        <div
          className="modal modal-blur fade show d-block"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div
            style={{ zIndex: 1050 }}
            className="modal-dialog modal-lg modal-dialog-centered"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Générer un nouveau rapport</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="bs-stepper">
                  <div className="bs-stepper-header mb-4" role="tablist" style={{ position: "relative" }}>
                    <div 
                      style={{
                        position: "absolute",
                        top: "22px",
                        left: "10%",
                        width: "80%",
                        height: "4px",
                        backgroundColor: "#e9ecef",
                        zIndex: 1
                      }}
                    >
                      <div
                        style={{
                          width: `${((currentStep - 1) / 2) * 100}%`,
                          height: "100%",
                          backgroundColor: "#263589",
                          transition: "width 0.3s ease-in-out"
                        }}
                      />
                    </div>

                    <div className={`step ${currentStep === 1 ? 'active' : ''}`} data-target="#step1-part" style={{ zIndex: 2 }}>
                      <button 
                        type="button" 
                        className="step-trigger" 
                        role="tab" 
                        aria-controls="step1-part" 
                        id="step1-part-trigger"
                        style={{ background: "none", border: "none", padding: "0" }}
                      >
                        <span 
                          className="bs-stepper-circle text-white d-flex align-items-center justify-content-center" 
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: currentStep >= 1 ? "#263589" : "#adb5bd",
                            transition: "background-color 0.3s ease",
                            margin: "0 auto",
                            boxShadow: currentStep === 1 ? "0 0 0 4px rgba(38, 53, 137, 0.2)" : "none"
                          }}
                        >
                          1
                        </span>
                        <span 
                          className="bs-stepper-label d-block mt-2 text-center" 
                          style={{ 
                            color: currentStep >= 1 ? "#263589" : "#adb5bd", 
                            fontWeight: currentStep === 1 ? "600" : "normal",
                            fontSize: "0.9rem"
                          }}
                        >
                          Informations de base
                        </span>
                      </button>
                    </div>

                    <div className={`step ${currentStep === 2 ? 'active' : ''}`} data-target="#step2-part" style={{ zIndex: 2 }}>
                      <button 
                        type="button" 
                        className="step-trigger" 
                        role="tab" 
                        aria-controls="step2-part" 
                        id="step2-part-trigger"
                        style={{ background: "none", border: "none", padding: "0" }}
                      >
                        <span 
                          className="bs-stepper-circle text-white d-flex align-items-center justify-content-center" 
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: currentStep >= 2 ? "#263589" : "#adb5bd",
                            transition: "background-color 0.3s ease",
                            margin: "0 auto",
                            boxShadow: currentStep === 2 ? "0 0 0 4px rgba(38, 53, 137, 0.2)" : "none"
                          }}
                        >
                          2
                        </span>
                        <span 
                          className="bs-stepper-label d-block mt-2 text-center" 
                          style={{ 
                            color: currentStep >= 2 ? "#263589" : "#adb5bd", 
                            fontWeight: currentStep === 2 ? "600" : "normal",
                            fontSize: "0.9rem"
                          }}
                        >
                          Portée et Période
                        </span>
                      </button>
                    </div>

                    <div className={`step ${currentStep === 3 ? 'active' : ''}`} data-target="#step3-part" style={{ zIndex: 2 }}>
                      <button 
                        type="button" 
                        className="step-trigger" 
                        role="tab" 
                        aria-controls="step3-part" 
                        id="step3-part-trigger"
                        style={{ background: "none", border: "none", padding: "0" }}
                      >
                        <span 
                          className="bs-stepper-circle text-white d-flex align-items-center justify-content-center" 
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: currentStep >= 3 ? "#263589" : "#adb5bd",
                            transition: "background-color 0.3s ease",
                            margin: "0 auto",
                            boxShadow: currentStep === 3 ? "0 0 0 4px rgba(38, 53, 137, 0.2)" : "none"
                          }}
                        >
                          3
                        </span>
                        <span 
                          className="bs-stepper-label d-block mt-2 text-center" 
                          style={{ 
                            color: currentStep >= 3 ? "#263589" : "#adb5bd", 
                            fontWeight: currentStep === 3 ? "600" : "normal",
                            fontSize: "0.9rem"
                          }}
                        >
                          Options du rapport
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  <style jsx>{`
                    .bs-stepper-header {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 0 15px;
                    }
                    .step:hover .bs-stepper-circle {
                      transform: scale(1.1);
                      transition: transform 0.2s ease;
                    }
                    .step:hover .bs-stepper-label {
                      color: #263589;
                      transition: color 0.2s ease;
                    }
                  `}</style>

                  <div className="bs-stepper-content">
                    {/* Step 1 */}
                    <div id="step1-part" className={`content ${currentStep === 1 ? 'd-block' : 'd-none'}`} role="tabpanel" aria-labelledby="step1-part-trigger">
                      <div className="mb-3">
                        <label className="form-label">Nom du rapport</label>
                        <input 
                          type="text" 
                          name="name" 
                          className="form-control" 
                          value={formData.name} 
                          onChange={handleInputChange}
                          placeholder="Entrez le nom du rapport"
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
                          placeholder="Décrivez ce rapport"
                        />
                      </div>
                      
                      <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-primary" onClick={nextStep}>
                          Suivant <IconChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div id="step2-part" className={`content ${currentStep === 2 ? 'd-block' : 'd-none'}`} role="tabpanel" aria-labelledby="step2-part-trigger">
                      <div className="mb-4">
                        <label className="form-label">Sélection de la Scope</label>
                        <div className="form-selectgroup-boxes row">
                          <div className="col-md-4">
                            <label className="form-selectgroup-item">
                              <input
                                type="checkbox"
                                name="scope1"
                                className="form-selectgroup-input"
                                checked={formData.scope1}
                                onChange={handleInputChange}
                              />
                              <span className="form-selectgroup-label d-flex align-items-center p-2s">
                                <span className="me-3">
                                  <span className="form-selectgroup-check"></span>
                                </span>
                                <span className="form-selectgroup-label-content">
                                  <span className="form-selectgroup-title strong mb-1">
                                    Scope 1
                                  </span>
                                  <span className="d-block text-secondary">
                                    Émissions directes
                                  </span>
                                </span>
                              </span>
                            </label>
                          </div>
                          <div className="col-md-4">
                            <label className="form-selectgroup-item">
                              <input
                                type="checkbox"
                                name="scope2"
                                className="form-selectgroup-input"
                                checked={formData.scope2}
                                onChange={handleInputChange}
                              />
                              <span className="form-selectgroup-label d-flex align-items-center p-2s">
                                <span className="me-3">
                                  <span className="form-selectgroup-check"></span>
                                </span>
                                <span className="form-selectgroup-label-content">
                                  <span className="form-selectgroup-title strong mb-1">
                                    Scope 2
                                  </span>
                                  <span className="d-block text-secondary">
                                    Émissions indirectes
                                  </span>
                                </span>
                              </span>
                            </label>
                          </div>
                          <div className="col-md-4">
                            <label className="form-selectgroup-item">
                              <input
                                type="checkbox"
                                name="scope3"
                                className="form-selectgroup-input"
                                checked={formData.scope3}
                                onChange={handleInputChange}
                              />
                              <span className="form-selectgroup-label d-flex align-items-center p-2s">
                                <span className="me-3">
                                  <span className="form-selectgroup-check"></span>
                                </span>
                                <span className="form-selectgroup-label-content">
                                  <span className="form-selectgroup-title strong mb-1">
                                    Scope 3
                                  </span>
                                  <span className="d-block text-secondary">
                                    Toutes les autres
                                  </span>
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Sélectionner l'année</label>
                        <select
                          name="Year"
                          className="form-control"
                          value={formData.Year}
                          onChange={handleInputChange}
                        >
                          <option value="">Select a year</option>
                          {[2025, 2024, 2023].map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                          <IconChevronLeft size={16} /> Précédent
                        </button>
                        <button type="button" className="btn btn-primary" onClick={nextStep}>
                          Suivant <IconChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div id="step3-part" className={`content ${currentStep === 3 ? 'd-block' : 'd-none'}`} role="tabpanel" aria-labelledby="step3-part-trigger">
                      <div className="mb-3">
                        <label className="form-label">
                          Inclure des Charts graphiques
                        </label>
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
                            <span className="form-selectgroup-label">Oui</span>
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
                            <span className="form-selectgroup-label">Non</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">
                          Inclure des recommandations
                        </label>
                        <div className="form-selectgroup">
                          <label className="form-selectgroup-item">
                            <input 
                              type="radio" 
                              name="includeRecomondations" 
                              value="yes" 
                              className="form-selectgroup-input" 
                              checked={formData.includeRecomondations === "yes"} 
                              onChange={handleInputChange}
                            />
                            <span className="form-selectgroup-label">Oui</span>
                          </label>
                          <label className="form-selectgroup-item">
                            <input 
                              type="radio" 
                              name="includeRecomondations" 
                              value="no" 
                              className="form-selectgroup-input" 
                              checked={formData.includeRecomondations === "no"} 
                              onChange={handleInputChange}
                            />
                            <span className="form-selectgroup-label">Non</span>
                          </label>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Niveau de détail</label>
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
                            <span className="form-selectgroup-label">Résumé</span>
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
                            <span className="form-selectgroup-label">Détaillé</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                          <IconChevronLeft size={16} /> Précédent
                        </button>
                        <button type="button" className="btn btn-success" onClick={handleSubmit}>
                          Générer le rapport
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ zIndex: 1040 }}
            className="modal-backdrop fade"
            onClick={closeModal}
          ></div>
        </div>
      )}

      <div className="py-2 mb-4 d-flex border-b justify-content-center align-items-center">
        <div>
          <h3 className="fs-1 mb-0 fw-bold" style={{ color: "#263589" }}>
            {" "}
            Rapports{" "}
          </h3>
          <div className="card-subtitle">
            {" "}
            Générez et gérez vos rapports d'impact environnemental{" "}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary ms-auto"
          onClick={() => setModalOpen(true)}
        >
          {" "}
          Générer un nouveau rapport{" "}
        </button>
      </div>

      <div className="card">
        <div className="card-body border-bottom py-3">
          <div className="d-flex">
            <div className="text-secondary d-flex align-items-center">
              Afficher
              <div className="mx-2 d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value)}
                >
                  <option value="all">Tous les scopes</option>
                  <option value="scope1">Scope 1</option>
                  <option value="scope2">Scope 2</option>
                  <option value="scope3">Scope 3</option>
                </select>

                <select
                  className="form-select form-select-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="latest">Les plus récents</option>
                  <option value="oldest">Les plus anciens</option>
                </select>
              </div>
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
                  <tr className="text-center">
                    <th>Nom du rapport</th>
                    <th>Description</th>
                    <th>Période</th>
                    <th>Scopes</th>
                    <th>Graphiques</th>
                    <th>Recommandations</th>
                    <th>Niveau de détail</th>
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
                                <IconFile size={18} />
                              </span>
                              <div className="flex-fill">
                                <div className="font-weight-medium">
                                  {data.name.length > 30
                                    ? `${data.name.slice(0, 30)}...`
                                    : data.name}
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
                              <IconCalendar size={16} className="me-1" />
                              <span>{data.Year}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              {getScopes(data).map((item, index) => {
                                return (
                                  <span
                                    key={index}
                                    className="badge bg-purple-lt"
                                  >
                                    {item}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          <td>
                            <span className="badge flex items-center bg-blue-lt">
                              <div className="flex">
                                <IconChartBar size={14} className="me-1" />
                                {data.includeCharts ? "Yes" : "No"}
                              </div>
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="badge mx-auto flex justify-center items-center bg-pink-lt">
                                <div className="flex items-center w-full justify-center">
                                  <IconFile size={14} className="me-1" />
                                  {data.includeRecomondations === "yes"
                                    ? "Yes"
                                    : "No"}
                                </div>
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-green-lt">
                              {data.detailLevel}
                            </span>
                          </td>

                          <td>
                            <div className="btn-list flex-nowrap">
                              <button
                                onClick={() => deleteReport(data?._id)}
                                className="btn btn-ghost-danger btn-icon"
                              >
                                <IconTrash className="text-red" size={18} />
                              </button>
                              <button className="btn btn-ghost-blue btn-icon"
                                onClick={() =>
                                  router.push(
                                    `/Dashboard/User/reports/view/${data?._id}`
                                  )
                                }
                              >
                                <IconEye className="text-primary" size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        Aucun rapport disponible.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-footer d-flex align-items-center">
              <p className="m-0 text-secondary">
                Affichage de <span>{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
                à{" "}
                <span>
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredReports?.length
                  )}
                </span>{" "}
                sur <span>{filteredReports?.length}</span> entrées
              </p>
              <ul className="pagination m-0 ms-auto d-flex gap-3">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    <IconChevronLeft size={18} />
                  </button>
                </li>
                <li className="page-item active">
                  <span className="page-link bg-primary">{currentPage}</span>
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
                    <IconChevronRight size={18} />
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