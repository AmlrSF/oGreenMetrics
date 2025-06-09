"use client";
import React, { useState, useEffect, useRef } from "react";
import { IconPlus, IconSearch, IconPencil, IconTrash, IconInfoCircle, IconArrowRight, IconArrowLeft, IconPlayerPlay, IconPlayerStop, IconFileUpload } from "@tabler/icons-react";
import * as XLSX from "xlsx";

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
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isAutomating, setIsAutomating] = useState(false);
  const automationIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [uploadError, setUploadError] = useState(null);

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
        },
      ],
      excelFields: ["yearlyConsumption"],
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
      excelFields: ["name", "type", "energy"],
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
      excelFields: ["name", "type", "energy"],
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

  // Cleanup automation on unmount
  useEffect(() => {
    return () => {
      if (automationIntervalRef.current) {
        clearInterval(automationIntervalRef.current);
      }
    };
  }, []);

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
      setError(`Error: ${error.message}`);
    }
  };

  const handleTabClick = (tabId, e) => {
    e.preventDefault();
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchTerm("");
    setExpandedItems(new Set());
    // Stop automation when changing tabs
    if (isAutomating) {
      stopAutomation();
    }
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
      if (isOpen && activeTab === "electricity" && company) {
        setFormData({ country: company.country });
      } else {
        setFormData({});
      }
      setEditId(null);
      setEditRecordId(null);
    }
  };

  const toggleUploadModal = (isOpen) => {
    setIsUploadModalOpen(isOpen);
    setExcelData([]);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
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
        `Veuillez remplir ces champs obligatoires : ${missingFields.join(", ")}`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      let requestData = {
        ...formData,
        company_id: company._id,
      };

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
          result.message || `Erreur HTTP ! statut : ${response.status}`
        );
      }

      toggleModal(false);
      await fetchScope2Data();
    } catch (err) {
      console.error("Erreur de soumission :", err);
      alert(`Échec de la soumission : ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (recordId, itemId = null) => {
    const id = itemId || recordId;
    if (deletingIds.has(id)) return;
    setDeletingIds((prev) => new Set([...prev, id]));

    try {
      let endpoint;
      if (activeTab === "electricity") {
        endpoint = `http://localhost:4000/energy-consumption/${recordId}`;
        const response = await fetch(endpoint, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Échec de la suppression");
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
        if (!response.ok) throw new Error(result.message || "Échec de la suppression");
        setScope2Data((prev) => ({ ...prev, heating: result.data }));
      } else if (activeTab === "cooling") {
        endpoint = `http://localhost:4000/cooling/${recordId}/cooler/${itemId}`;
        const response = await fetch(endpoint, {
          method: "DELETE",
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Échec de la suppression");
        setScope2Data((prev) => ({ ...prev, cooling: result.data }));
      }
      setConfirmDelete(null);
      fetchScope2Data();
    } catch (error) {
      console.error("Erreur de suppression :", error.message);
      setError(error.message);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const toggleExpand = (itemId, field) => {
    const key = `${itemId}-${field}`;
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const filteredItems = () => {
    let items = activeTab === "heating" ? scope2Data.heating.heaters : scope2Data.cooling.coolers;

    if (searchTerm) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  };

  // Automation functions
  const generateRandomData = () => {
    if (!company || !company._id) {
      alert("Company information not available. Please refresh and try again.");
      stopAutomation();
      return;
    }

    let requestData;

    if (activeTab === "electricity") {
      const yearlyConsumption = Math.floor(Math.random() * 100000) + 50000; // Random between 50,000 and 150,000 kWh
      requestData = {
        yearlyConsumption,
        country: company.country,
        company_id: company._id,
      };
    } else if (activeTab === "heating") {
      const heaterTypes = ["Electric Heating", "District Heating"];
      const heaterName = `Heater-${Math.floor(Math.random() * 1000)}`;
      const heaterType = heaterTypes[Math.floor(Math.random() * heaterTypes.length)];
      const energy = Math.floor(Math.random() * 10000) + 5000; // Random between 5,000 and 15,000 kWh
      requestData = {
        name: heaterName,
        type: heaterType,
        energy,
        company_id: company._id,
      };
    } else if (activeTab === "cooling") {
      const coolerTypes = ["Electric Cooling", "District Cooling"];
      const coolerName = `Cooler-${Math.floor(Math.random() * 1000)}`;
      const coolerType = coolerTypes[Math.floor(Math.random() * coolerTypes.length)];
      const energy = Math.floor(Math.random() * 8000) + 3000; // Random between 3,000 and 11,000 kWh
      requestData = {
        name: coolerName,
        type: coolerType,
        energy,
        company_id: company._id,
      };
    }

    addAutomatedData(requestData);
  };

  const addAutomatedData = async (requestData) => {
    try {
      let endpoint;

      if (activeTab === "electricity") {
        endpoint = "http://localhost:4000/energy-consumption";
      } else if (activeTab === "heating") {
        endpoint = "http://localhost:4000/heating";
      } else if (activeTab === "cooling") {
        endpoint = "http://localhost:4000/cooling";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || `HTTP Error: ${response.status}`);
      }

      await fetchScope2Data();
    } catch (err) {
      console.error("Erreur d'automatisation :", err);
      stopAutomation();
      alert(`Échec de l'automatisation : ${err.message}`);
    }
  };

  const startAutomation = () => {
    setIsAutomating(true);
    
    // Generate data immediately once
    generateRandomData();
    
    // Then set up interval for continuous generation
    automationIntervalRef.current = setInterval(() => {
      generateRandomData();
    }, 3000); // Generate data every 3 seconds
  };

  const stopAutomation = () => {
    if (automationIntervalRef.current) {
      clearInterval(automationIntervalRef.current);
      automationIntervalRef.current = null;
    }
    setIsAutomating(false);
  };

  const toggleAutomation = () => {
    if (isAutomating) {
      stopAutomation();
    } else {
      startAutomation();
    }
  };

  // Excel handling functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Process and validate the data
        const processedData = processExcelData(jsonData);
        setExcelData(processedData);
        setUploadError(null);
      } catch (error) {
        console.error("Error processing Excel file:", error);
        setUploadError("Erreur lors du traitement du fichier Excel. Vérifiez le format du fichier.");
      }
      
      // Reset the file input
      e.target.value = null;
    };
    
    reader.readAsArrayBuffer(file);
  };

  const processExcelData = (data) => {
    const currentTabConfig = tabs[activeTab];
    const requiredFields = currentTabConfig.excelFields;
    
    return data.map(row => {
      const processedRow = { ...row };
      
      // Convert numeric fields from strings if needed
      if (activeTab === "electricity" && processedRow.yearlyConsumption) {
        processedRow.yearlyConsumption = Number(processedRow.yearlyConsumption);
      } else if ((activeTab === "heating" || activeTab === "cooling") && processedRow.energy) {
        processedRow.energy = Number(processedRow.energy);
      }
      
      // Add validation status
      const missingFields = requiredFields.filter(field => {
        return processedRow[field] === undefined || processedRow[field] === null || processedRow[field] === "";
      });
      
      processedRow.isValid = missingFields.length === 0;
      processedRow.errors = missingFields.length > 0 ? 
        `Champs manquants: ${missingFields.join(", ")}` : "";
      
      return processedRow;
    });
  };

  const handleBulkUpload = async () => {
    if (!company || !company._id) {
      alert("Company information not available. Please refresh and try again.");
      return;
    }
    
    setIsProcessingExcel(true);
    const validData = excelData.filter(row => row.isValid);
    
    try {
      for (const row of validData) {
        let requestData = {
          ...row,
          company_id: company._id,
        };
        
        if (activeTab === "electricity") {
          requestData.country = company.country;
        }
        
        let endpoint;
        
        if (activeTab === "electricity") {
          endpoint = "http://localhost:4000/energy-consumption";
        } else if (activeTab === "heating") {
          endpoint = "http://localhost:4000/heating";
        } else if (activeTab === "cooling") {
          endpoint = "http://localhost:4000/cooling";
        }
        
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestData),
          credentials: "include",
        });
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || `HTTP Error: ${response.status}`);
        }
      }
      
      await fetchScope2Data();
      toggleUploadModal(false);
      alert(`${validData.length} éléments importés avec succès.`);
    } catch (error) {
      console.error("Error importing Excel data:", error);
      setUploadError(`Échec de l'importation: ${error.message}`);
    } finally {
      setIsProcessingExcel(false);
    }
  };

  const renderTable = () => {
    if (error) {
      return (
        <div className="p-4 text-center text-danger">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      );
    }

    const currentTab = tabs[activeTab];
    const data = scope2Data[activeTab];

    // Pagination logic
    let currentItems = [];
    let totalItems = 0;
    let totalPages = 1;

    if (activeTab === "heating" || activeTab === "cooling") {
      const items = filteredItems();
      totalItems = items.length;
      totalPages = Math.ceil(totalItems / itemsPerPage);
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    }

    return (
      <div className="table-container p-5">
        <style>
          {`
            .truncate-text {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 300px;
            }
            .voir-plus {
              cursor: pointer;
              color: #206bc4;
              font-size: 0.875rem;
              margin-top: 0.25rem;
              display: inline-block;
            }
            .voir-plus:hover {
              text-decoration: underline;
            }
          `}
        </style>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex gap-2">
            <div className="input-group" style={{ width: "250px" }}>
              <span className="input-group-text">
                <IconSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-info"
              onClick={() => toggleUploadModal(true)}
            >
              <IconFileUpload className="mr-2" size={16} /> Import Excel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => toggleModal(true)}
            >
              <IconPlus className="mr-2" size={16} /> Ajouter
            </button>
            <button
              type="button"
              className={`btn ${isAutomating ? 'btn-danger' : 'btn-success'}`}
              onClick={toggleAutomation}
            >
              {isAutomating ? (
                <>
                  <IconPlayerStop className="mr-2" size={16} /> Stop
                </>
              ) : (
                <>
                  <IconPlayerPlay className="mr-2" size={16} /> Automatiser
                </>
              )}
            </button>
          </div>
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
                  <td>
                    <span className="badge bg-purple-lt">
                      {data.yearlyConsumption.toLocaleString()} kWh
                    </span>
                  </td>
                  <td className="text-secondary">{data.country || company?.country || "N/A"}</td>
                  <td>
                    <span className="badge bg-purple-lt">
                      {data.emissions.toLocaleString()} kgCO2e
                    </span>
                  </td>
                  <td>
                    <div className="btn-list flex-nowrap">
                      <button
                        className="btn btn-ghost-primary btn-icon"
                        onClick={() => toggleModal(true, true, data, data._id)}
                      >
                        <IconPencil size={18} />
                      </button>
                      <button
                        className="btn btn-ghost-danger btn-icon"
                        onClick={() => setConfirmDelete({ _id: data._id, nom: "Consommation électrique" })}
                        disabled={deletingIds.has(data._id)}
                      >
                        {deletingIds.has(data._id) ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <IconTrash size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (activeTab === "heating" || activeTab === "cooling") && currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span
                          className="avatar avatar-md text-white me-2"
                          style={{ backgroundColor: "#263589" }}
                        >
                          {item.name.charAt(0)}
                        </span>
                        <div>
                          <div
                            className={
                              expandedItems.has(`${item._id}-name`)
                                ? ""
                                : "truncate-text"
                            }
                          >
                            {item.name}
                          </div>
                          {item.name.length > 50 && (
                            <span
                              className="voir-plus"
                              onClick={() => toggleExpand(item._id, "name")}
                            >
                              {expandedItems.has(`${item._id}-name`)
                                ? "Voir moins"
                                : "Voir plus"}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary">{item.type}</td>
                    <td>
                      <span className="badge bg-purple-lt">
                        {item.energy.toLocaleString()} kWh
                      </span>
                    </td>
                    <td>
                      <div className="btn-list flex-nowrap">
                        <button
                          className="btn btn-ghost-primary btn-icon"
                          onClick={() =>
                            toggleModal(true, true, item, data._id)
                          }
                        >
                          <IconPencil size={18} />
                        </button>
                        <button
                          className="btn btn-ghost-danger btn-icon"
                          onClick={() => setConfirmDelete({ _id: item._id, nom: item.name, recordId: data._id })}
                          disabled={deletingIds.has(item._id)}
                        >
                          {deletingIds.has(item._id) ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <IconTrash size={18} />
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
                    Aucune donnée disponible pour {currentTab.label.toLowerCase()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {(activeTab === "heating" || activeTab === "cooling") && totalItems > itemsPerPage && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <IconArrowLeft size={16} />
                </button>
              </li>
              {[...Array(totalPages).keys()].map((page) => (
                <li
                  key={page + 1}
                  className={`page-item ${currentPage === page + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(page + 1)}>
                    {page + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <IconArrowRight size={16} />
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
      if (field.name === "country" && activeTab === "electricity") {
        return (
          <div className="mb-3" key={index}>
            <label className="form-label">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>
            <select className="form-select" name={field.name} value={company?.country || ""} disabled={true}>
              <option value={company?.country || ""}>{company?.country || "Chargement..."}</option>
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
                        <IconInfoCircle size={24} />
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
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary ms-auto"
                  disabled={isSubmitting}
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

  const renderUploadedDataPreview = () => {
    if (excelData.length === 0) return null;
    
    return (
      <div className="mt-3">
        <h6>Aperçu des données ({excelData.length} élément(s))</h6>
        <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                {tabs[activeTab].excelFields.map((field) => (
                  <th key={field}>{field}</th>
                ))}
                {activeTab === "electricity" && <th>Pays</th>}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(0, 5).map((item, index) => (
                <tr key={index} className={item.isValid ? "" : "bg-light-danger"}>
                  {tabs[activeTab].excelFields.map((field) => (
                    <td key={field}>{String(item[field] || "")}</td>
                  ))}
                  {activeTab === "electricity" && (
                    <td>{company?.country || "Défini par l'entreprise"}</td>
                  )}
                </tr>
              ))}
              {excelData.length > 5 && (
                <tr>
                  <td colSpan={tabs[activeTab].excelFields.length + (activeTab === "electricity" ? 1 : 0)} className="text-center">
                    ...et {excelData.length - 5} élément(s) supplémentaire(s)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderUploadModal = () => {
    if (!isUploadModalOpen) return null;
    
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
                Importer des données depuis Excel
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => toggleUploadModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  Sélectionner un fichier Excel (.xlsx, .xls)
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <small className="form-text text-muted">
                  Le fichier doit contenir les colonnes : {tabs[activeTab].excelFields.join(", ")}
                  {activeTab === "electricity" && " (le pays est défini automatiquement par l'entreprise)"}
                </small>
              </div>

              {uploadError && (
                <div className="alert alert-danger" role="alert">
                  {uploadError}
                </div>
              )}

              {renderUploadedDataPreview()}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link link-secondary"
                onClick={() => toggleUploadModal(false)}
                disabled={isProcessingExcel}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary ms-auto"
                onClick={handleBulkUpload}
                disabled={isProcessingExcel || excelData.length === 0 || excelData.every(row => !row.isValid)}
              >
                {isProcessingExcel ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Importation...
                  </span>
                ) : (
                  "Importer les données"
                )}
              </button>
            </div>
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
          {renderUploadModal()}
          {confirmDelete && (
            <div
              className="modal show"
              tabIndex="-1"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-sm" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirmer la suppression</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setConfirmDelete(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      Êtes-vous sûr de vouloir supprimer{" "}
                      <strong>{confirmDelete.nom}</strong>? Cette action est
                      irréversible.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-link link-secondary"
                      onClick={() => setConfirmDelete(null)}
                      disabled={deletingIds.has(confirmDelete._id)}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger ms-auto"
                      onClick={() => handleDelete(confirmDelete.recordId || confirmDelete._id, confirmDelete.recordId ? confirmDelete._id : null)}
                      disabled={deletingIds.has(confirmDelete._id)}
                    >
                      {deletingIds.has(confirmDelete._id) ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Suppression...
                        </span>
                      ) : (
                        "Supprimer"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scope2;