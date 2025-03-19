"use client";
import React, { useState, useEffect } from "react";

const Scope1 = () => {
  const [activeTab, setActiveTab] = useState("Combustion de carburant");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ machines: [], products: [], totalEmissions: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    const endpoint = activeTab === "Combustion de carburant" ? "/fuelcombution" : "/production";
    try {
      const response = await fetch(`http://localhost:4000${endpoint}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      const record = result[0] || { machines: [], products: [], totalEmissions: 0 }; 
      setData({
        machines: record.machines || [],
        products: record.products || [],
        totalEmissions: record.totalEmissions || 0,
      });
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error("Failed to fetch data:", error.message);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const endpoint = activeTab === "Combustion de carburant" ? "/fuelcombution" : "/production";
    const payload = {
      ...(activeTab === "Combustion de carburant" && {
        machines: [{
          nom: data.nom,
          typeDeCarburant: data.typeDeCarburant || '',
          quantite: Number(data.quantite),
        }],
      }),
      ...(activeTab !== "Combustion de carburant" && {
        products: [{
          nom: data.nom,
          quantite: Number(data.quantite),
        }],
      }),
    };

    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add data: ${response.status} ${response.statusText} - ${errorText}`);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add data:", error.message);
    }
  };

  const paginateItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const renderTable = () => {
    const items = activeTab === "Combustion de carburant" ? data.machines : data.products;
    const paginatedItems = paginateItems(items);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
      <div className="table-container" style={{ padding: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e9ecef" }}>
              {activeTab === "Combustion de carburant" ? (
                <>
                  <th style={{ padding: "10px", textAlign: "center" }}>Nom</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Type de carburant</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Quantité</th>
                </>
              ) : (
                <>
                  <th style={{ padding: "10px", textAlign: "center" }}>Nom</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Quantité</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #e9ecef" }}>
                  <td style={{ padding: "10px", textAlign: "center" }}>{item.nom}</td>
                  {activeTab === "Combustion de carburant" && (
                    <td style={{ padding: "10px", textAlign: "center" }}>{item.typeDeCarburant}</td>
                  )}
                  <td style={{ padding: "10px", textAlign: "center" }}>{item.quantite}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === "Combustion de carburant" ? "3" : "3"} style={{ textAlign: "center", padding: "30px" }}>
                  Aucune donnée disponible pour {getTableTitle().toLowerCase()}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {items.length > itemsPerPage && (
          <ul className="pagination" style={{ justifyContent: "center", marginTop: "20px" }}>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <a
                className="page-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                tabIndex={currentPage === 1 ? "-1" : undefined}
                aria-disabled={currentPage === 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-1"
                >
                  <path d="M15 6l-6 6l6 6"></path>
                </svg>
              </a>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </a>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <a
                className="page-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                tabIndex={currentPage === totalPages ? "-1" : undefined}
                aria-disabled={currentPage === totalPages}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-1"
                >
                  <path d="M9 6l6 6l-6 6"></path>
                </svg>
              </a>
            </li>
          </ul>
        )}

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            type="submit"
            className="btn btn-primary ms-auto"
            onClick={handleButtonClick}
          >
            Ajouter
          </button>
        </div>
      </div>
    );
  };

  const getTableTitle = () => {
    switch (activeTab) {
      case "Combustion de carburant":
        return "Combustion de carburant";
      case "Émissions du procédé":
        return "Émissions du procédé";
      default:
        return "Combustion de carburant";
    }
  };

  const renderModalFields = () => {
    return (
      <form onSubmit={handleAdd}>
        {activeTab === "Combustion de carburant" && (
          <div className="mb-3">
            <label className="form-label">Type de carburant</label>
            <select
              className="form-control"
              name="typeDeCarburant"
              required
            >
              <option value="" disabled defaultValue>Choisir un type de carburant</option>
              <option value="Natural Gas">Natural Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Coal">Coal</option>
            </select>
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            placeholder={activeTab === "Combustion de carburant" ? "Nom de machine" : "Nom"}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantité</label>
          <input
            type="number"
            className="form-control"
            name="quantite"
            placeholder="Quantité"
            required
            min="0"
          />
        </div>
        <div className="modal-footer">
          <a href="#" className="btn btn-link link-secondary" onClick={handleCloseModal}>Annuler</a>
          <button type="submit" className="btn btn-primary ms-auto">Ajouter</button>
        </div>
      </form>
    );
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="modal show" id="exampleModal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {activeTab === "Combustion de carburant" 
                  ? "Nouvelle combustion de carburant" 
                  : "Nouvelle émission du procédé"}
              </h5>
              <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {renderModalFields()}
            </div>
          </div>
        </div>
      </div>
    );
  }; 

  return (
    <div className="scope3-container mt-5" style={{ backgroundColor: "#f8f9fa", padding: "20px" }}>
      <div className="card">
        <div className="card-body">
          <b>
            <p style={{ color: "#8EBE21" }}>Scope 1</p>
          </b>
          <p>
            <b style={{ color: "#263589" }}>Émissions directes </b>provenant de sources détenues ou contrôlées par une organisation.
          </p>
        </div>
      </div>

      <div className="scope3-tabs-container mt-4" style={{ backgroundColor: "white", borderRadius: "5px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div className="scope3-tabs">
          <ul className="nav" style={{ display: "flex", listStyle: "none", padding: "0", margin: "0", borderBottom: "1px solid #e9ecef" }}>
            <li className="nav-item" style={{ padding: "15px 0", textAlign: "center", flex: "1" }}>
              <a
                href="#Combustion de carburant"
                className={`nav-link ${activeTab === "Combustion de carburant" ? "active" : ""}`}
                style={{
                  color: activeTab === "Combustion de carburant" ? "#76b82a" : "#333",
                  textDecoration: "none",
                  fontSize: "14px",
                  borderBottom: activeTab === "Combustion de carburant" ? "2px solid #76b82a" : "none",
                  paddingBottom: "15px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick("Combustion de carburant");
                }}
              >
                Combustion de carburant
              </a>
            </li>
            <li className="nav-item" style={{ padding: "15px 0", textAlign: "center", flex: "1" }}>
              <a
                href="#Émissions du procédé"
                className={`nav-link ${activeTab === "Émissions du procédé" ? "active" : ""}`}
                style={{
                  color: activeTab === "Émissions du procédé" ? "#76b82a" : "#333",
                  textDecoration: "none",
                  fontSize: "14px",
                  borderBottom: activeTab === "Émissions du procédé" ? "2px solid #76b82a" : "none",
                  paddingBottom: "15px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick("Émissions du procédé");
                }}
              >
                Émissions du procédé
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content">
          {renderTable()}
          {renderModal()}
        </div>
      </div>
    </div>
  );
};

export default Scope1;