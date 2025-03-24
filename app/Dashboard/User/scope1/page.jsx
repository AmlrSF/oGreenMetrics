"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
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
  };

  const toggleModal = (isOpen) => {
    setIsModalOpen(isOpen);
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
        machines: [{ nom: data.nom, typeDeCarburant: data.typeDeCarburant || '', quantite: Number(data.quantite) }],
      }),
      ...(activeTab !== "Combustion de carburant" && {
        products: [{ nom: data.nom, quantite: Number(data.quantite) }],
      }),
    };
    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to add data: ${response.status} ${response.statusText}`);
      }
      fetchData();
      toggleModal(false);
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
          <div className="alert alert-danger" role="alert">{error}</div>
        </div>
      );
    }
    const items = activeTab === "Combustion de carburant" ? data.machines : data.products;
    const paginatedItems = paginateItems(items);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
      <div className="table-container p-5">
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
                        <span className="avatar avatar-md text-white me-2" style={{ backgroundColor: "#263589" }}>
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
                      <span className="badge bg-purple-lt">{item.quantite}</span>
                    </td>
                    <td>
                      <div className="btn-list flex-nowrap">
                        <button className="btn btn-ghost-primary btn-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button className="btn btn-ghost-danger btn-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    Aucune donnée disponible pour ce table
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
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  Précédent
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        )}
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
                href="#Production de produits"
                className={`nav-link ${activeTab === "Production de produits" ? "active" : ""}`}
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
     <button type="button" className="btn btn-primary" onClick={() => toggleModal(true)}>
      <Plus className="mr-2" size={16} />
      Ajouter
    </button>
  </div>
  {renderTable()}
</div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter  </h5>
                <button type="button" className="btn-close" onClick={() => toggleModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nom</label>
                    <input type="text" className="form-control" name="nom" required />
                  </div>
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
                    <label className="form-label">Quantité</label>
                    <input type="number" className="form-control" name="quantite" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-link link-secondary" onClick={() => toggleModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary ms-auto">
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scope1;