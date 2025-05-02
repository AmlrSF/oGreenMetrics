"use client";
import React, { useState, useEffect } from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission
  const [deletingIds, setDeletingIds] = useState(new Set()); // New state for tracking deletions
  const itemsPerPage = 3;

  useEffect(() => {
    fetchData();
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
  };

  const toggleModal = (isOpen, mode = "add", item = null) => {
    setIsModalOpen(isOpen);
    setModalMode(mode);
    setEditingItem(item);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
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
        setIsSubmitting(false); // Reset submitting state
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
        setIsSubmitting(false); // Reset submitting state
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
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
        setIsSubmitting(false); // Reset submitting state
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
        setIsSubmitting(false); // Reset submitting state
      }
    }
  };

  const handleDelete = async (id) => {
    if (deletingIds.has(id)) return; // Prevent multiple deletions
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
      }); // Remove id from deletingIds
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
                        <div className="font-weight-medium">{item.nom}</div>
                      </div>
                    </td>
                    {activeTab === "Combustion de carburant" ? (
                      <>
                        <td>{item.modele}</td>
                        <td className="text-secondary">
                          {item.typeDeCarburant}
                        </td>
                      </>
                    ) : (
                      <td className="text-secondary">{item.ligneDeProduction}</td>
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
                          onClick={() => setConfirmDelete(item)}
                          disabled={deletingIds.has(item._id)} // Disable button if deleting
                        >
                          {deletingIds.has(item._id) ? (
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => toggleModal(true, "add")}
              >
                <IconPlus className="mr-2" size={16} />
                Ajouter
              </button>
            </div>
            {renderTable()}
          </div>
        </div>
      </div>

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
                    <label className="form-label">Nom</label>
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
                        <label className="form-label">Modèle</label>
                        <input
                          type="text"
                          className="form-control"
                          name="modele"
                          defaultValue={editingItem?.modele || ""}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Type de carburant</label>
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
                      <label className="form-label">Ligne de Production</label>
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
                    <label className="form-label">Quantité</label>
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
                      modalMode === "add" ? "Ajouter" : "Mettre à jour"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  disabled={deletingIds.has(confirmDelete._id)} // Disable cancel button during deletion
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-danger ms-auto"
                  onClick={() => handleDelete(confirmDelete._id)}
                  disabled={deletingIds.has(confirmDelete._id)} // Disable delete button during deletion
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