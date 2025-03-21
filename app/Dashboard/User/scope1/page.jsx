"use client";
import React, { useState, useEffect } from "react";

const Scope1 = () => {
  const [activeTab, setActiveTab] = useState("Combustion de carburant");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ machines: [], products: [], totalEmissions: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const endpoint = activeTab === "Combustion de carburant" ? "/fuelcombution" : "/production";
    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "GET",
        credentials: "include", // Important: send cookies with the request
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      const record = result[0] || { machines: [], products: [], totalEmissions: 0 }; 
      setData({
        machines: record.machines || [],
        products: record.products || [],
        totalEmissions: record.totalEmissions || 0,
      });
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error("Failed to fetch data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
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
    setLoading(true);
    setError(null);
    
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
        credentials: "include", // Important: send cookies with the request
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        const errorText = await response.text();
        throw new Error(`Failed to add data: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const paginateItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
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
    
    const items = activeTab === "Combustion de carburant" ? data.machines : data.products;
    const paginatedItems = paginateItems(items);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
      <div className="table-container" style={{ padding: "20px" }}>
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead>
              <tr>
                {activeTab === "Combustion de carburant" ? (
                  <>
                    <th>Nom</th>
                    <th>Type de carburant</th>
                    <th>Quantité</th>
                    <th className="w-1">Action</th>
                  </>
                ) : (
                  <>
                    <th>Nom</th>
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
                        <div className="flex-fill">
                          <div className="font-weight-medium">{item.nom}</div>
                        </div>
                      </div>
                    </td>
                    {activeTab === "Combustion de carburant" && (
                      <td className="text-secondary">{item.typeDeCarburant}</td>
                    )}
                    <td>
                      <span className="badge bg-purple-lt">
                        {item.quantite}
                      </span>
                    </td>
                    <td>
                      <div className="btn-list flex-nowrap">
                        <button className="btn btn-ghost-primary btn-icon">
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
                        <button className="btn btn-ghost-danger btn-icon">
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
                  <td colSpan={activeTab === "Combustion de carburant" ? "4" : "3"} className="text-center text-secondary">
                    Aucune donnée disponible pour {getTableTitle().toLowerCase()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {items.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <ul className="pagination">
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
          </div>
        )}

        <div className="d-flex justify-content-between mt-4">
          <div>
            {data.totalEmissions > 0 && (
              <div className="alert alert-info" role="alert">
                Total des émissions: <strong>{data.totalEmissions.toFixed(2)} kg CO2</strong>
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleButtonClick}
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
              style={{ marginRight: "5px" }}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
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
              className="form-select"
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
          <button type="submit" className="btn btn-primary ms-auto" disabled={loading}>
            {loading ? "Traitement..." : "Ajouter"}
          </button>
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
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {renderModalFields()}
            </div>
          </div>
        </div>
      </div>
    );
  }; 

  return (
    <div className="container-xl mt-3">
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title text-success">Scope 1</h3>
          <p className="card-subtitle">
            <strong className="text-primary">Émissions directes</strong> provenant de sources détenues ou contrôlées par une organisation.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a
                href="#Combustion de carburant"
                className={`nav-link ${activeTab === "Combustion de carburant" ? "active" : ""}`}
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
                href="#Émissions du procédé"
                className={`nav-link ${activeTab === "Émissions du procédé" ? "active" : ""}`}
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

        <div className="card-body p-0">
          <div className="tab-content">
            {renderTable()}
            {renderModal()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope1;