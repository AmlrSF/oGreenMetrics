"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

const Scope2 = () => {
  const [activeTab, setActiveTab] = useState("electricity");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [editRecordId, setEditRecordId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items per page
  const [scope2Data, setScope2Data] = useState({
    electricity: { yearlyConsumption: 0, emissions: 0, country: null },
    heating: { heaters: [], totalEmissions: 0 },
    cooling: { coolers: [], totalEmissions: 0 },
  });

  const tabs = {
    electricity: {
      id: "electricity",
      label: "Consommation d'électricité",
      headers: ["Consommation électrique (kWh)",  "Action"],
      fields: [
        {
          name: "yearlyConsumption",
          label: "Consommation électrique (kWh)",
          type: "number",
          placeholder: "Consommation annuelle en kWh",
        },
        {
          name: "country",
          label: "Pays",
          type: "select",
          placeholder: "Sélectionner un pays",
          options: [
            "Sweden", "Lithuania", "France", "Austria", "Latvia", "Finland", "Slovakia",
            "Denmark", "Belgium", "Croatia", "Luxembourg", "Slovenia", "Italy", "Hungary",
            "Spain", "United Kingdom", "Romania", "Portugal", "Ireland", "Germany", "Bulgaria",
            "Netherlands", "Czechia", "Greece", "Malta", "Cyprus", "Poland", "Estonia",
          ].map((country) => ({ value: country, label: country })),
        },
      ],
    },
    heating: {
      id: "heating",
      label: "Chauffage",
      headers: ["Nom", "Type", "Énergie Consommée (kWh)",  "Action"],
      fields: [
        { name: "name", label: "Nom", type: "text", placeholder: "Nom de l'équipement" },
        {
          name: "type",
          label: "Type",
          type: "select",
          placeholder: "Sélectionner un type",
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
        },
      ],
    },
    cooling: {
      id: "cooling",
      label: "Refroidissement",
      headers: ["Nom", "Type", "Énergie Consommée (kWh)",  "Action"],
      fields: [
        { name: "name", label: "Nom", type: "text", placeholder: "Nom de l'équipement" },
        {
          name: "type",
          label: "Type",
          type: "select",
          placeholder: "Sélectionner un type",
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
        },
      ],
    },
  };

  useEffect(() => {
    const fetchScope2Data = async () => {
      try {
        const [electricityRes, heatingRes, coolingRes] = await Promise.all([
          fetch("http://localhost:4000/energy-consumption").then(res => res.json()),
          fetch("http://localhost:4000/heating").then(res => res.json()),
          fetch("http://localhost:4000/cooling").then(res => res.json()),
        ]);
        setScope2Data({
          electricity: electricityRes.data,
          heating: heatingRes.data,
          cooling: coolingRes.data,
        });
      } catch (error) {
        console.error("Error fetching Scope 2 data:", error);
      }
    };
    fetchScope2Data();
  }, []);

  const handleTabClick = (tabId, e) => {
    e.preventDefault();
    setActiveTab(tabId);
    setCurrentPage(1); 
  };

  const toggleModal = (isOpen, editMode = false, item = null, recordId = null) => {
    setIsModalOpen(isOpen);
    setIsEditMode(editMode);
    if (isOpen && editMode && item) {
      setFormData(item);
      setEditId(item._id);
      setEditRecordId(recordId);
    } else {
      setFormData({});
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
    try {
      let endpoint;
      let method;
      if (activeTab === "electricity") {
        endpoint = isEditMode ? `http://localhost:4000/energy-consumption/${editId}` : "http://localhost:4000/energy-consumption";
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
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save data");
      }

      setScope2Data((prev) => ({
        ...prev,
        [activeTab]: result.data,
      }));
      setCurrentPage(1); // Reset to first page after adding/editing
      toggleModal(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (recordId, itemId) => {
    try {
      if (!recordId) {
        throw new Error("Record ID is missing");
      }
      if ((activeTab === "heating" || activeTab === "cooling") && !itemId) {
        throw new Error("Item ID is missing");
      }

      let endpoint;
      if (activeTab === "electricity") {
        endpoint = `/energy-consumption/${recordId}`;
        const response = await fetch(endpoint, { method: "DELETE" });
        console.log("Delete Response Status (Electricity):", response.status);
        console.log("Delete Response Headers (Electricity):", response.headers.get("Content-Type"));

        const contentType = response.headers.get("Content-Type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON Response (Electricity):", text);
          throw new Error("Server did not return JSON");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete");
        }

        setScope2Data((prev) => ({
          ...prev,
          electricity: { yearlyConsumption: 0, emissions: 0, country: null },
        }));
      } else if (activeTab === "heating") {
        endpoint = `/heating/${recordId}/heater/${itemId}`;
        const response = await fetch(endpoint, { method: "DELETE" });
        console.log("Delete Response Status (Heating):", response.status);
        console.log("Delete Response Headers (Heating):", response.headers.get("Content-Type"));

        const contentType = response.headers.get("Content-Type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON Response (Heating):", text);
          throw new Error("Server did not return JSON");
        }

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to delete");
        }
        setScope2Data((prev) => ({
          ...prev,
          heating: result.data,
        }));
      } else if (activeTab === "cooling") {
        endpoint = `/cooling/${recordId}/cooler/${itemId}`;
        const response = await fetch(endpoint, { method: "DELETE" });
        console.log("Delete Response Status (Cooling):", response.status);
        console.log("Delete Response Headers (Cooling):", response.headers.get("Content-Type"));

        const contentType = response.headers.get("Content-Type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON Response (Cooling):", text);
          throw new Error("Server did not return JSON");
        }

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to delete");
        }
        setScope2Data((prev) => ({
          ...prev,
          cooling: result.data,
        }));
      }
      setCurrentPage(1); // Reset to first page after deleting
    } catch (error) {
      console.error("Error deleting data:", error);
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

    if (activeTab === "heating" && data.heaters.length > 0) {
      totalItems = data.heaters.length;
      currentItems = data.heaters.slice(indexOfFirstItem, indexOfLastItem);
    } else if (activeTab === "cooling" && data.coolers.length > 0) {
      totalItems = data.coolers.length;
      currentItems = data.coolers.slice(indexOfFirstItem, indexOfLastItem);
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    return (
      <div className="table-container p-5">
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
                  <td>{data.yearlyConsumption}</td>
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
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : activeTab === "heating" && data.heaters.length > 0 ? (
                currentItems.map((heater, idx) => (
                  <tr key={idx}>
                    <td>{heater.name}</td>
                    <td>{heater.type}</td>
                    <td>{heater.energy}</td>
                     <td>
                      <div className="btn-list flex-nowrap">
                        <button
                          className="btn btn-ghost-primary btn-icon"
                          onClick={() => toggleModal(true, true, heater, data._id)}
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
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : activeTab === "cooling" && data.coolers.length > 0 ? (
                currentItems.map((cooler, idx) => (
                  <tr key={idx}>
                    <td>{cooler.name}</td>
                    <td>{cooler.type}</td>
                    <td>{cooler.energy}</td>
                     <td>
                      <div className="btn-list flex-nowrap">
                        <button
                          className="btn btn-ghost-primary btn-icon"
                          onClick={() => toggleModal(true, true, cooler, data._id)}
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
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={currentTab.headers.length} className="text-center text-secondary">
                    Aucune donnée disponible pour {currentTab.label.toLowerCase()}
                  </td>
                </tr>
              )}
              {(activeTab === "heating" || activeTab === "cooling") && data.totalEmissions > 0 && (
                <tr>
                    <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {(activeTab === "heating" || activeTab === "cooling") && totalItems > 0 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>
              </li>
              {[...Array(totalPages).keys()].map((page) => (
                <li
                  key={page + 1}
                  className={`page-item ${currentPage === page + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        )}

        <div className="d-flex justify-content-end mt-4">
          <button type="button" className="btn btn-primary" onClick={() => toggleModal(true)}>
            <Plus className="mr-2" size={16} />
            Ajouter
          </button>
        </div>
      </div>
    );
  };

  const renderFormFields = () => {
    const currentTab = tabs[activeTab];
    return currentTab.fields.map((field, index) => (
      <div className="mb-3" key={index}>
        <label className="form-label">{field.label}</label>
        {field.type === "select" ? (
          <select
            className="form-select"
            name={field.name}
            onChange={handleInputChange}
            value={formData[field.name] || ""}
          >
            <option value="" disabled>
              {field.placeholder}
            </option>
            {field.options.map((option, idx) => (
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
          />
        )}
      </div>
    ));
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    const currentTab = tabs[activeTab];

    return (
      <div className="modal show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? "Modifier" : "Nouveau"} {currentTab.label}</h5>
              <button type="button" className="btn-close" onClick={() => toggleModal(false)} aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">{renderFormFields()}</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-link link-secondary" onClick={() => toggleModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary ms-auto">
                  {isEditMode ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-xl mt-3">
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title text-success">Scope 2</h3>
          <p className="card-subtitle">
            <strong className="text-primary">Émissions indirectes</strong> provenant de sources détenues ou contrôlées
            par une organisation.
          </p>
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