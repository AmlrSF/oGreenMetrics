"use client";
import React, { useState, useEffect, useRef } from "react";
import { IconPlus, IconSearch, IconPencil, IconTrash, IconArrowRight, IconArrowLeft, IconPlayerStop, IconPlayerPlay, IconUpload } from "@tabler/icons-react";
import * as XLSX from 'xlsx';

const Scope1 = () => {
  const [activeTab, setActiveTab] = useState("Combustion de carburant");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({
    machines: [],
    products: [],
    totalEmissions: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelFilter, setFuelFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [automating, setAutomating] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const automationIntervalRef = useRef(null);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchData();
    return () => {
      if (automationIntervalRef.current) {
        clearInterval(automationIntervalRef.current);
      }
    };
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const endpoint =
      activeTab === "Combustion de carburant"
        ? "/fuelcombustion"
        : "/production";
    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`
        );
      }
      const result = await response.json();
      const record = result[0] || {
        machines: [],
        products: [],
        totalEmissions: 0,
      };
      setData({
        machines: record.machines || [],
        products: record.products || [],
        totalEmissions: record.totalEmissions || 0,
      });
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm("");
    setFuelFilter("all");
    setExpandedItems(new Set());
    // Stop automation if active when changing tabs
    if (automating) {
      stopAutomation();
    }
  };

  const toggleModal = (isOpen, mode = "add", item = null) => {
    setIsModalOpen(isOpen);
    setModalMode(mode);
    setEditingItem(item);
  };

  const toggleUploadModal = (isOpen) => {
    setIsUploadModalOpen(isOpen);
    setUploadedData([]);
    setUploadError(null);
    if (!isOpen && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const newItem = {
      nom: formData.get("nom"),
      quantite: parseFloat(formData.get("quantite")),
    };

    if (activeTab === "Combustion de carburant") {
      newItem.typeDeCarburant = formData.get("typeDeCarburant");
      newItem.modele = formData.get("modele") || "Standard";

      const payload = { machines: [newItem] };
      try {
        const response = await fetch("http://localhost:4000/fuelcombustion", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to add fuel combustion");

        toggleModal(false);
        fetchData();
      } catch (error) {
        console.error("Error adding fuel combustion:", error);
        setError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      newItem.ligneDeProduction = formData.get("ligneDeProduction");
      const payload = { products: [newItem] };
      try {
        const response = await fetch("http://localhost:4000/production", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to add production");

        toggleModal(false);
        fetchData();
      } catch (error) {
        console.error("Error adding production:", error);
        setError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const updatedItem = {
      nom: formData.get("nom"),
      quantite: parseFloat(formData.get("quantite")),
    };

    if (activeTab === "Combustion de carburant") {
      updatedItem.typeDeCarburant = formData.get("typeDeCarburant");
      updatedItem.modele =
        formData.get("modele") || editingItem.modele || "Standard";

      try {
        const response = await fetch(
          `http://localhost:4000/fuelcombustion/${editingItem._id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedItem),
          }
        );

        if (!response.ok) throw new Error("Failed to update fuel combustion");

        toggleModal(false);
        fetchData();
      } catch (error) {
        console.error("Error updating fuel combustion:", error);
        setError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      updatedItem.ligneDeProduction = formData.get("ligneDeProduction");
      try {
        const response = await fetch(
          `http://localhost:4000/production/${editingItem._id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedItem),
          }
        );

        if (!response.ok) throw new Error("Failed to update production");

        toggleModal(false);
        fetchData();
      } catch (error) {
        console.error("Error updating production:", error);
        setError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (deletingIds.has(id)) return;
    setDeletingIds((prev) => new Set([...prev, id]));

    const endpoint =
      activeTab === "Combustion de carburant"
        ? `/fuelcombustion/${id}`
        : `/production/${id}`;

    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete item: ${response.status} - ${errorText}`
        );
      }

      setConfirmDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error.message);
      setError(error.message);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Excel file handling
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadError(null);
    setUploadedData([]);
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Validate data format based on active tab
        if (activeTab === "Combustion de carburant") {
          if (!validateFuelCombustionData(jsonData)) {
            setUploadError("Le format du fichier Excel ne correspond pas aux données requises pour la combustion de carburant.");
            return;
          }
        } else {
          if (!validateProductionData(jsonData)) {
            setUploadError("Le format du fichier Excel ne correspond pas aux données requises pour la production de produits.");
            return;
          }
        }
        
        setUploadedData(jsonData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setUploadError("Erreur lors de l'analyse du fichier Excel. Assurez-vous que le format est correct.");
      }
    };
    
    reader.onerror = () => {
      setUploadError("Erreur lors de la lecture du fichier.");
    };
    
    reader.readAsArrayBuffer(file);
  };

  const validateFuelCombustionData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return false;
    
    // Check if at least the first item has the required fields
    const requiredFields = ['nom', 'modele', 'typeDeCarburant', 'quantite'];
    const firstItem = data[0];
    
    return requiredFields.every(field => 
      Object.prototype.hasOwnProperty.call(firstItem, field)
    );
  };

  const validateProductionData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return false;
    
    // Check if at least the first item has the required fields
    const requiredFields = ['nom', 'ligneDeProduction', 'quantite'];
    const firstItem = data[0];
    
    return requiredFields.every(field => 
      Object.prototype.hasOwnProperty.call(firstItem, field)
    );
  };

  const handleBulkUpload = async () => {
  if (isUploading || uploadedData.length === 0) return;
  setIsUploading(true);
  setUploadError(null);

  try {
    const endpoint =
      activeTab === "Combustion de carburant"
        ? "http://localhost:4000/fuelcombustion"
        : "http://localhost:4000/production";

    // Process each item in uploadedData individually
    const payloadKey = activeTab === "Combustion de carburant" ? "machines" : "products";
    for (const item of uploadedData) {
      const payload = { [payloadKey]: [item] };
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload item "${item.nom}": ${response.status} - ${errorText}`);
      }
    }

    toggleUploadModal(false);
    fetchData();
  } catch (error) {
    console.error("Error uploading data:", error);
    setUploadError(error.message);
  } finally {
    setIsUploading(false);
  }
};

  // Random data generation functions
  const generateRandomMachine = () => {
    const fuelTypes = ["Natural Gas", "Diesel", "Gasoline", "Coal"];
    const machineNames = [ "Compresseur", "Générateur", "Moteur industriel", "Chaudière", "Turbine", "Excavatrice", "Chariot élévateur", "Broyeur", "Pompe à carburant", "Groupe électrogène"];
    const machineModels = [ "XC-2000", "PowerGen 5500", "TurboMax", "HD-500", "EcoFuel 3.0", "Industrial Pro", "HeavyDuty 9000", "LightCraft V8", "SuperFlow 2500", "Série Performance"];
    
    return {
      nom: machineNames[Math.floor(Math.random() * machineNames.length)],
      typeDeCarburant: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      modele: machineModels[Math.floor(Math.random() * machineModels.length)],
      quantite: Math.floor(Math.random() * 1000) + 50,
    };
  };

  const generateRandomProduct = () => {
    const productNames = ["Acier galvanisé","Béton armé","Pièce moulée","Composant électronique","Panneau solaire","Textile industriel","Matériau composite","Film plastique","Produit chimique","Alliage métallique"];
    const productionLines = ["Ligne A","Assemblage principal","Unité de fabrication 3","Zone de production B","Chaîne automatisée","Unité de moulage","Ligne de traitement thermique","Secteur de finition","Usine pilote","Atelier central"];
    
    return {
      nom: productNames[Math.floor(Math.random() * productNames.length)],
      ligneDeProduction: productionLines[Math.floor(Math.random() * productionLines.length)],
      quantite: Math.floor(Math.random() * 5000) + 100,
    };
  };

  // Function to add random data
  const addRandomData = async () => {
    if (activeTab === "Combustion de carburant") {
      const newMachine = generateRandomMachine();
      const payload = { machines: [newMachine] };
      
      try {
        const response = await fetch("http://localhost:4000/fuelcombustion", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to add automated fuel combustion");
        fetchData();
      } catch (error) {
        console.error("Error in automation:", error);
        stopAutomation();
        setError("Automation stopped due to an error: " + error.message);
      }
    } else {
      const newProduct = generateRandomProduct();
      const payload = { products: [newProduct] };
      
      try {
        const response = await fetch("http://localhost:4000/production", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to add automated production");
        fetchData();
      } catch (error) {
        console.error("Error in automation:", error);
        stopAutomation();
        setError("Automation stopped due to an error: " + error.message);
      }
    }
  };

  // Start automation
  const startAutomation = () => {
    setAutomating(true);
    // Add one item immediately
    addRandomData();
    // Then set up an interval to add more
    automationIntervalRef.current = setInterval(() => {
      addRandomData();
    }, 5000); // Add a new item every 5 seconds
  };

  // Stop automation
  const stopAutomation = () => {
    if (automationIntervalRef.current) {
      clearInterval(automationIntervalRef.current);
      automationIntervalRef.current = null;
    }
    setAutomating(false);
  };

  // Toggle automation
  const toggleAutomation = () => {
    if (automating) {
      stopAutomation();
    } else {
      startAutomation();
    }
  };

  const filteredItems = () => {
    let items =
      activeTab === "Combustion de carburant" ? data.machines : data.products;

    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.modele &&
            item.modele.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.ligneDeProduction &&
            item.ligneDeProduction.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (activeTab === "Combustion de carburant" && fuelFilter !== "all") {
      items = items.filter((item) => item.typeDeCarburant === fuelFilter);
    }

    return items;
  };

  const paginateItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
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

  const renderTable = () => {
    if (loading) {
      return <div className="p-4 text-center">Chargement des données...</div>;
    }
    if (error) {
      return (
        <div className="p-4 text-center text-danger">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      );
    }

    const items = filteredItems();
    const paginatedItems = paginateItems(items);
    const totalPages = Math.ceil(items.length / itemsPerPage);

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
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead>
              <tr>
                {activeTab === "Combustion de carburant" ? (
                  <>
                    <th>Nom</th>
                    <th>Modèle</th>
                    <th>Type de carburant</th>
                    <th>Quantité</th>
                    <th className="w-1">Action</th>
                  </>
                ) : (
                  <>
                    <th>Nom</th>
                    <th>Ligne de Production</th>
                    <th>Quantité</th>
                    <th className="w-1">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span
                          className="avatar avatar-md text-white me-2"
                          style={{ backgroundColor: "#263589" }}
                        >
                          {item.nom.charAt(0)}
                        </span>
                        <div>
                          <div
                            className={
                              expandedItems.has(`${item._id}-nom`)
                                ? ""
                                : "truncate-text"
                            }
                          >
                            {item.nom}
                          </div>
                          {item.nom.length > 50 && (
                            <span
                              className="voir-plus"
                              onClick={() => toggleExpand(item._id, "nom")}
                            >
                              {expandedItems.has(`${item._id}-nom`)
                                ? "Voir moins"
                                : "Voir plus"}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {activeTab === "Combustion de carburant" ? (
                      <>
                        <td>
                          <div
                            className={
                              expandedItems.has(`${item._id}-modele`)
                                ? ""
                                : "truncate-text"
                            }
                          >
                            {item.modele}
                          </div>
                          {item.modele.length > 50 && (
                            <span
                              className="voir-plus"
                              onClick={() => toggleExpand(item._id, "modele")}
                            >
                              {expandedItems.has(`${item._id}-modele`)
                                ? "Voir moins"
                                : "Voir plus"}
                            </span>
                          )}
                        </td>
                        <td className="text-secondary">
                          {item.typeDeCarburant}
                        </td>
                      </>
                    ) : (
                      <td className="text-secondary">
                        <div
                          className={
                            expandedItems.has(`${item._id}-ligneDeProduction`)
                              ? ""
                              : "truncate-text"
                            }
                        >
                          {item.ligneDeProduction}
                        </div>
                        {item.ligneDeProduction.length > 50 && (
                          <span
                            className="voir-plus"
                            onClick={() =>
                              toggleExpand(item._id, "ligneDeProduction")
                            }
                          >
                            {expandedItems.has(`${item._id}-ligneDeProduction`)
                              ? "Voir moins"
                              : "Voir plus"}
                          </span>
                        )}
                      </td>
                    )}
                    <td>
                      <span className="badge bg-purple-lt">
                        {item.quantite}
                      </span>
                    </td>
                    <td>
                      <div className="btn-list flex-nowrap">
                        <button
                          className="btn btn-ghost-primary btn-icon"
                          onClick={() => toggleModal(true, "edit", item)}
                        >
                          <IconPencil size={18} />
                        </button>
                        <button
                          className="btn btn-ghost-danger btn-icon"
                          onClick={() => setConfirmDelete(item)}
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
                    colSpan={
                      activeTab === "Combustion de carburant" ? "5" : "4"
                    }
                    className="text-center text-secondary"
                  >
                    Aucune donnée disponible pour ce tableau
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {items.length > itemsPerPage && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <IconArrowLeft size={16} />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <IconArrowRight size={16} />
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    );
  };

  const renderUploadedDataPreview = () => {
    if (uploadedData.length === 0) return null;
    
    return (
      <div className="mt-3">
        <h6>Aperçu des données ({uploadedData.length} élément(s))</h6>
        <div className="table-responsive" style={{maxHeight: '200px', overflowY: 'auto'}}>
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                {Object.keys(uploadedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploadedData.slice(0, 5).map((item, index) => (
                <tr key={index}>
                  {Object.keys(uploadedData[0]).map((key) => (
                    <td key={key}>{String(item[key])}</td>
                  ))}
                </tr>
              ))}
              {uploadedData.length > 5 && (
                <tr>
                  <td colSpan={Object.keys(uploadedData[0]).length} className="text-center">
                    ...et {uploadedData.length - 5} élément(s) supplémentaire(s)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            Scope 1
          </h3>
          <div className="card-subtitle">
            <strong className="text-primary">Émissions directes</strong> provenant de sources détenues ou contrôlées par
            une organisation.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a
                href="#Combustion de carburant"
                className={`nav-link ${
                  activeTab === "Combustion de carburant" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick("Combustion de carburant");
                }}
              >
                Combustion de carburant
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#Production de produits"
                className={`nav-link ${
                  activeTab === "Production de produits" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick("Production de produits");
                }}
              >
                Production de produits
              </a>
            </li>
          </ul>
        </div>

        <div className="card-body p-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex gap-2">
                {activeTab === "Combustion de carburant" && (
                  <div className="input-group" style={{ width: "200px" }}>
                    <select
                      className="form-select"
                      value={fuelFilter}
                      onChange={(e) => setFuelFilter(e.target.value)}
                    >
                      <option value="all">Tous les carburants</option>
                      <option value="Natural Gas">Natural Gas</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Coal">Coal</option>
                    </select>
                  </div>
                )}
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
                  className="btn btn-primary"
                  onClick={() => toggleModal(true, "add")}
                >
                  <IconPlus className="me-1" size={16} />
                  Ajouter
                </button>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => toggleUploadModal(true)}
                >
                  <IconUpload className="me-1" size={16} />
                  Importer Excel
                </button>
                <button
                  type="button"
                  className={`btn ${automating ? 'btn-danger' : 'btn-success'}`}
                  onClick={toggleAutomation}
                >
                  {automating ? (
                    <>
                      <IconPlayerStop className="me-1" size={16} />
                      Stop
                    </>
                  ) : (
                    <>
                      <IconPlayerPlay className="me-1" size={16} />
                      Automatiser
                    </>
                  )}
                </button>
              </div>
            </div>
            {renderTable()}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="modal show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "add" ? "Ajouter" : "Modifier"}{" "}
                  {activeTab === "Combustion de carburant"
                    ? "une machine"
                    : "un produit"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => toggleModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={modalMode === "add" ? handleAdd : handleEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nom <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="nom"
                      defaultValue={editingItem?.nom || ""}
                      required
                    />
                  </div>
                  {activeTab === "Combustion de carburant" ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Modèle <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="modele"
                          defaultValue={editingItem?.modele || ""}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Type de carburant <span className="text-danger">*</span></label>
                        <select
                          className="form-select"
                          name="typeDeCarburant"
                          defaultValue={editingItem?.typeDeCarburant || ""}
                          required
                        >
                          <option value="" disabled>
                            Choisir un type de carburant
                          </option>
                          <option value="Natural Gas">Natural Gas</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Gasoline">Gasoline</option>
                          <option value="Coal">Coal</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="mb-3">
                      <label className="form-label">Ligne de Production <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="ligneDeProduction"
                        defaultValue={editingItem?.ligneDeProduction || ""}
                        required
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Quantité <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantite"
                      defaultValue={editingItem?.quantite || ""}
                      required
                    />
                  </div>
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
                      modalMode === "add" ? "Ajouter" : "Mettre à jour"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {isUploadModalOpen && (
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
                    {activeTab === "Combustion de carburant"
                      ? "Le fichier doit contenir les colonnes: nom, modele, typeDeCarburant, quantite"
                      : "Le fichier doit contenir les colonnes: nom, ligneDeProduction, quantite"}
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
                  disabled={isUploading}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary ms-auto"
                  onClick={handleBulkUpload}
                  disabled={isUploading || uploadedData.length === 0}
                >
                  {isUploading ? (
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
      )}

      {/* Delete Confirmation Modal */}
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
                  onClick={() => handleDelete(confirmDelete._id)}
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
  );
};

export default Scope1;