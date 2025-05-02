"use client";
import React, { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";

const Scope2 = () => {
  const [activeTab, setActiveTab] = useState("electricity");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [editRecordId, setEditRecordId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [deletingIds, setDeletingIds] = useState(new Set());  

  const [scope2Data, setScope2Data] = useState({
    electricity: { yearlyConsumption: 0, emissions: 0, country: null },
    heating: { heaters: [], totalEmissions: 0 },
    cooling: { coolers: [], totalEmissions: 0 },
  });

  const tabs = {
    electricity: {
      id: "electricity",
      label: "Consommation d'électricité",
      headers: ["Consommation électrique (kWh)", "Pays", "Émissions (kgCO2e)", "Action"],
      fields: [
        {
          name: "yearlyConsumption",
          label: "Consommation électrique (kWh)",
          type: "number",
          placeholder: "Consommation annuelle en kWh",
          required: true,
        },
        {
          name: "country",
          label: "Pays",
          type: "select",
          placeholder: "Pays",
          required: true,
          disabled: true,
        }
      ],
    },
    heating: {
      id: "heating",
      label: "Chauffage",
      headers: ["Nom", "Type", "Énergie Consommée (kWh)", "Action"],
      fields: [
        {
          name: "name",
          label: "Nom",
          type: "text",
          placeholder: "Nom de l'équipement",
          required: true,
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          placeholder: "Sélectionner un type",
          required: true,
          options: [
            { value: "Electric Heating", label: "Electric Heating" },
            { value: "District Heating", label: "District Heating" },
          ],
        },
        {
          name: "energy",
          label: "Énergie Consommée (kWh)",
          type: "number",
          placeholder: "Énergie consommée",
          required: true,
        },
      ],
    },
    cooling: {
      id: "cooling",
      label: "Refroidissement",
      headers: ["Nom", "Type", "Énergie Consommée (kWh)", "Action"],
      fields: [
        {
          name: "name",
          label: "Nom",
          type: "text",
          placeholder: "Nom de l'équipement",
          required: true,
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          placeholder: "Sélectionner un type",
          required: true,
          options: [
            { value: "Electric Cooling", label: "Electric Cooling" },
            { value: "District Cooling", label: "District Cooling" },
          ],
        },
        {
          name: "energy",
          label: "Énergie Consommée (kWh)",
          type: "number",
          placeholder: "Énergie consommée",
          required: true,
        },
      ],
    },
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });

        if (!userResponse.ok) {
          throw new Error(`Authentication failed: ${userResponse.status}`);
        }

        const userData = await userResponse.json();

        if (!userData?.user?._id) {
          setError("User not authenticated. Please log in again.");
          return;
        }

        const companyResponse = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userData.user._id}`,
          {
            method: "GET",
          }
        );

        if (!companyResponse.ok) {
          throw new Error(`Failed to fetch company: ${companyResponse.status}`);
        }

        const companyData = await companyResponse.json();

        if (!companyData?.data?._id) {
          setError(
            "No company associated with this account. Please create a company first."
          );
          return;
        }

        setCompany(companyData.data);
      } catch (error) {
        console.error("Error fetching user or company:", error);
        setError(`Error: ${error.message}`);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (company?._id) {
      fetchScope2Data();
    }
  }, [activeTab, company]);

  const fetchScope2Data = async () => {
    try {
      const [electricityRes, heatingRes, coolingRes] = await Promise.all([
        fetch(`http://localhost:4000/energy-consumption/${company._id}`).then(
          (res) => res.json()
        ),
        fetch(`http://localhost:4000/heating/${company._id}`).then((res) =>
          res.json()
        ),
        fetch(`http://localhost:4000/cooling/${company._id}`).then((res) =>
          res.json()
        ),
      ]);

      setScope2Data({
        electricity: electricityRes.data || {
          yearlyConsumption: 0,
          emissions: 0,
          country: company.country,
        },
        heating: heatingRes.data || { heaters: [], totalEmissions: 0 },
        cooling: coolingRes.data || { coolers: [], totalEmissions: 0 },
      });
    } catch (error) {
      console.error("Error fetching Scope 2 data:", error);
    }
  };

  const handleTabClick = (tabId, e) => {
    e.preventDefault();
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const toggleModal = (
    isOpen,
    editMode = false,
    item = null,
    recordId = null
  ) => {
    setIsModalOpen(isOpen);
    setIsEditMode(editMode);
    if (isOpen && editMode && item) {
      setFormData(item);
      setEditId(item._id);
      setEditRecordId(recordId);
    } else {
      // For new electricity record, pre-populate the country
      if (isOpen && activeTab === "electricity" && company) {
        setFormData({ country: company.country });
      } else {
        setFormData({});
      }
      setEditId(null);
      setEditRecordId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    if (!company || !company._id) {
      const errorMsg =
        "Company information not available. Please refresh and try again.";
      console.error(errorMsg, company);
      setError(errorMsg);
      alert(errorMsg);
      setIsSubmitting(false);
      return;
    }

    const currentTabConfig = tabs[activeTab];
    const missingFields = currentTabConfig.fields
      .filter((field) => field.required && !formData[field.name] && !field.disabled)
      .map((field) => field.label);

    if (missingFields.length > 0) {
      alert(
        `Please fill in these required fields: ${missingFields.join(", ")}`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      let requestData = {
        ...formData,
        company_id: company._id,
      };
      
      // When in electricity tab, automatically use the company's country
      if (activeTab === "electricity") {
        requestData.country = company.country;
      }
      
      let endpoint, method;

      if (activeTab === "electricity") {
        endpoint = isEditMode
          ? `http://localhost:4000/energy-consumption/${editId}`
          : "http://localhost:4000/energy-consumption";
        method = isEditMode ? "PUT" : "POST";
      } else if (activeTab === "heating") {
        endpoint = isEditMode
          ? `http://localhost:4000/heating/${editRecordId}/heater/${editId}`
          : "http://localhost:4000/heating";
        method = isEditMode ? "PUT" : "POST";
      } else if (activeTab === "cooling") {
        endpoint = isEditMode
          ? `http://localhost:4000/cooling/${editRecordId}/cooler/${editId}`
          : "http://localhost:4000/cooling";
        method = isEditMode ? "PUT" : "POST";
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      toggleModal(false);
      await fetchScope2Data();
    } catch (err) {
      console.error("Submission error:", err);
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleDelete = async (recordId, itemId = null) => {
    const id = itemId || recordId; // Use itemId for heating/cooling, recordId for electricity
    if (deletingIds.has(id)) return; // Prevent multiple deletions
    setDeletingIds((prev) => new Set([...prev, id]));

    if (!window.confirm("Are you sure you want to delete this item?")) {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      return;
    }

    try {
      let endpoint;
      if (activeTab === "electricity") {
        endpoint = `http://localhost:4000/energy-consumption/${recordId}`;
        const response = await fetch(endpoint, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to delete");
        setScope2Data((prev) => ({
          ...prev,
          electricity: { yearlyConsumption: 0, emissions: 0, country: company.country },
        }));
      } else if (activeTab === "heating") {
        endpoint = `http://localhost:4000/heating/${recordId}/heater/${itemId}`;
        const response = await fetch(endpoint, {
          method: "DELETE",
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to delete");
        setScope2Data((prev) => ({ ...prev, heating: result.data }));
      } else if (activeTab === "cooling") {
        endpoint = `http://localhost:4000/cooling/${recordId}/cooler/${itemId}`;
        const response = await fetch(endpoint, {
          method: "DELETE",
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to delete");
        setScope2Data((prev) => ({ ...prev, cooling: result.data }));
      }
      fetchScope2Data();
    } catch (error) {
      alert(`Failed to delete: ${error.message}`);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      }); // Remove id from deletingIds
    }
  };

  const renderTable = () => {
    const currentTab = tabs[activeTab];
    const data = scope2Data[activeTab];

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let currentItems = [];
    let totalItems = 0;

    if (activeTab === "heating" && data.heaters?.length > 0) {
      totalItems = data.heaters.length;
      currentItems = data.heaters.slice(indexOfFirstItem, indexOfLastItem);
    } else if (activeTab === "cooling" && data.coolers?.length > 0) {
      totalItems = data.coolers.length;
      currentItems = data.coolers.slice(indexOfFirstItem, indexOfLastItem);
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <div className="table-container p-5">
        <div className="d-flex justify-content-between mb-5">
          <div className="scope-info">
          
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => toggleModal(true)}
          >
            <IconPlus className="mr-2" size={16} /> Ajouter
          </button>
        </div>
        
        <div className="table-responsive">   
          <table className="table table-vcenter card-table">           
            <thead>
              <tr>
                {currentTab.headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTab === "electricity" && data.yearlyConsumption > 0 ? (
                <tr>
                  <td>{data.yearlyConsumption.toLocaleString()} kWh</td>
                  <td>{data.country || company?.country || "N/A"}</td>
                  <td>{data.emissions.toLocaleString()} kgCO2e</td>
                  <td>
                    <div className="btn-list flex-nowrap">
                      <button
                        className="btn btn-ghost-primary btn-icon"
                        onClick={() => toggleModal(true, true, data, data._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn btn-ghost-danger btn-icon"
                        onClick={() => handleDelete(data._id)}
                        disabled={deletingIds.has(data._id)} // Disable button if deleting
                      >
                        {deletingIds.has(data._id) ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 7l16 0" />
                            <path d="M10 11l0 6" />
                            <path d="M14 11l0 6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : activeTab === "heating" && data.heaters?.length > 0 ? (
                currentItems.map((heater, idx) => (
                  <tr key={idx}>
                    <td>{heater.name}</td>
                    <td>{heater.type}</td>
                    <td>{heater.energy}</td>
                    <td>
                      <div className="btn-list flex-nowrap">
                        <button
                          className="btn btn-ghost-primary btn-icon"
                          onClick={() =>
                            toggleModal(true, true, heater, data._id)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="btn btn-ghost-danger btn-icon"
                          onClick={() => handleDelete(data._id, heater._id)}
                          disabled={deletingIds.has(heater._id)} // Disable button if deleting
                        >
                          {deletingIds.has(heater._id) ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M4 7l16 0" />
                              <path d="M10 11l0 6" />
                              <path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : activeTab === "cooling" && data.coolers?.length > 0 ? (
                currentItems.map((cooler, idx) => (
                  <tr key={idx}>
                    <td>{cooler.name}</td>
                    <td>{cooler.type}</td>
                    <td>{cooler.energy}</td>
                    <td>
                      <div className="btn-list flex-nowrap">
                        <button
                          className="btn btn-ghost-primary btn-icon"
                          onClick={() =>
                            toggleModal(true, true, cooler, data._id)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="btn btn-ghost-danger btn-icon"
                          onClick={() => handleDelete(data._id, cooler._id)}
                          disabled={deletingIds.has(cooler._id)} // Disable button if deleting
                        >
                          {deletingIds.has(cooler._id) ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M4 7l16 0" />
                              <path d="M10 11l0 6" />
                              <path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={currentTab.headers.length}
                    className="text-center text-secondary"
                  >
                    Aucune donnée disponible pour{" "}
                    {currentTab.label.toLowerCase()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {(activeTab === "heating" || activeTab === "cooling") &&
          totalItems > 0 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
                </li>
                {[...Array(totalPages).keys()].map((page) => (
                  <li
                    key={page + 1}
                    className={`page-item ${
                      currentPage === page + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          )}
      </div>
    );
  };

  const renderFormFields = () => {
    const currentTab = tabs[activeTab];
    return currentTab.fields.map((field, index) => {
      // Special case for country field in electricity tab
      if (field.name === "country" && activeTab === "electricity") {
        return (
          <div className="mb-3" key={index}>
            <label className="form-label">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>
            <select
              className="form-select"
              name={field.name}
              value={company?.country || ""}
              disabled={true}
            >
              <option value={company?.country || ""}>{company?.country || "Loading..."}</option>
            </select>
            <small className="form-text text-muted">
              Le pays est automatiquement défini selon votre profil de votre entreprise.
            </small>
          </div>
        );
      }
      
      return (
        <div className="mb-3" key={index}>
          <label className="form-label">
            {field.label}
            {field.required && <span className="text-danger">*</span>}
          </label>
          {field.type === "select" ? (
            <select
              className="form-select"
              name={field.name}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
              required={field.required}
              disabled={field.disabled}
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {field.options && field.options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              className="form-control"
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
              required={field.required}
              disabled={field.disabled}
            />
          )}
        </div>
      );
    });
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    const currentTab = tabs[activeTab];

    return (
      <div
        className="modal show"
        tabIndex="-1"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditMode ? "Modifier" : "Nouveau"} {currentTab.label}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => toggleModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {renderFormFields()}
                {activeTab === "electricity" && company && (
                  <div className="alert alert-info mt-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-info-circle">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/>
                          <path d="M12 9h.01"/>
                          <path d="M11 12h1v4h1"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="mb-1">Information sur le calcul d'émissions</h4>
                        <div>Pays utilisé pour le calcul: <strong>{company.country}</strong></div>
                        <div>Facteur d'émission: <strong>{company.countryEmissionFactor} kgCO2e/kWh</strong></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-link link-secondary"
                  onClick={() => toggleModal(false)}
                  disabled={isSubmitting} // Disable cancel button during submission
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary ms-auto"
                  disabled={isSubmitting} // Disable submit button during submission
                >
                  {isSubmitting ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" />
                      En cours...
                    </span>
                  ) : (
                    isEditMode ? "Modifier" : "Ajouter"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-xl">
      <div
        className="py-2 mb-4 d-flex border-b justify-content-start align-items-center"
      >
        <div>
          <h3 className="text-[30px] font-bold" style={{ color: "#263589" }}>
            Scope 2
          </h3>
          <div className="card-subtitle">
            <strong className="text-primary">Émissions indirectes</strong>{" "}
            provenant de sources détenues ou contrôlées par une organisation.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {Object.values(tabs).map((tab) => (
              <li className="nav-item" key={tab.id}>
                <a
                  href={`#${tab.id}`}
                  className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                  onClick={(e) => handleTabClick(tab.id, e)}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body p-0">
          <div className="tab-content">{renderTable()}</div>
          {renderModal()}
        </div>
      </div>
    </div>
  );
};

export default Scope2;