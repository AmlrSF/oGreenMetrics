"use client";
import React, { useState } from "react";

const Scope1 = () => {
  const [activeTab, setActiveTab] = useState("Combustion de carburant");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderTable = () => {
    return (
      <div className="table-container" style={{ padding: "20px" }}>
         <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e9ecef" }}>
              {activeTab === "Combustion de carburant" ? (
                <>
                  <th style={{ padding: "10px", textAlign: "center" }}>Type</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Quantité</th>
                </>
              ) : (
                <>
                  <th style={{ padding: "10px", textAlign: "center" }}>Titre</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Quantité</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Description</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={activeTab === "Combustion de carburant" ? "2" : "3"} style={{ textAlign: "center", padding: "30px" }}>
                Aucune donnée disponible pour {getTableTitle().toLowerCase()}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleButtonClick}
            style={{
              backgroundColor: "#76b82a",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              margin: "0 0 0 auto",
            }}
          >
            +
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
    if (activeTab === "Combustion de carburant") {
      return (
        <>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <input
              type="text"
              className="form-control"
              placeholder="Type de combustion"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Quantité</label>
            <input
              type="number"
              className="form-control"
              placeholder="Quantité"
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="mb-3">
            <label className="form-label">Titre</label>
            <input
              type="text"
              className="form-control"
              placeholder="Titre"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Quantité</label>
            <input
              type="number"
              className="form-control"
              placeholder="Quantité"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Description détaillée"
            ></textarea>
          </div>
        </>
      );
    }
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
            <div className="modal-footer">
              <a href="#" className="btn btn-link link-secondary" onClick={handleCloseModal}> Annuler </a>
              <a href="#" className="btn btn-primary ms-auto" onClick={handleCloseModal}>
                Ajouter
              </a>
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
            <b style={{ color: "#263589" }}>Émissions  directes </b>provenant de sources détenues ou contrôlées par une organisation.
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