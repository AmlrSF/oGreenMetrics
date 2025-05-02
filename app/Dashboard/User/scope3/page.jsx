"use client";
import React, { useState, useEffect } from "react";
import { tabs } from "@/lib/Data";
import DataTable from "@/components/Commun/Datatable/Datatable";

const Scope3 = () => {
  const [activeTab, setActiveTab] = useState("transport");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [Company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const scopeType = "3";
  const [tableData, setTableData] = useState({
    transport: [],
    dechets: [],
    voyage: [],
    "biens-services": [],
    equipement: [],
    "deplacement-employes": [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserReponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const UseData = await UserReponse.json();

        if (UseData?.user) {
          const CompanyResponse = await fetch(
            `http://localhost:4000/GetCompanyByOwnerID/${UseData?.user?._id}`,
            {
              method: "GET",
            }
          );

          const CompanyData = await CompanyResponse.json();

          setCompany(CompanyData?.data);

          if(CompanyData?.Data?._id){
            const response = await fetch(
              `http://localhost:4000/transport/${Company?._id}`,
              {
                method: "GET",
              }
            );
            const data = await response.json();
  
            if (response.ok) {
              setTableData((prev) => ({ ...prev, [activeTab]: data?.data }));
            }
            
          }
          
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  
  }, []);

  useEffect(() => {
    if(Company?._id){
      fetchData();
    }

  }, [activeTab, Company]);

  const fetchData = async () => {
    if(Company){
      try {
        const response = await fetch(
          `http://localhost:4000/${activeTab}/${Company?._id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
  
        if (response.ok) {
          setTableData((prev) => ({ ...prev, [activeTab]: data?.data }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const newFormData = { ...formData, company_id: Company?._id, scopeType };

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:4000/${activeTab}/${editingId}`
        : `http://localhost:4000/${activeTab}`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });

      const responseData = await response.json();
      await fetchData();
      toggleModal(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error("Error adding/updating data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (deletingIds.has(id)) return;
    
    setDeletingIds(prev => new Set([...prev, id]));
    
    try {
      const response = await fetch(`http://localhost:4000/${activeTab}/${id}`, {
        method: "DELETE",
      });

      const responseData = await response.json();
      await fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleUpdate = async (id) => {
    const itemToUpdate = tableData[activeTab].find((item) => item._id === id);

    if (itemToUpdate) {
      const updatedFormData = {};
      tabs[activeTab]?.fields.forEach((field) => {
        updatedFormData[field.name] = itemToUpdate[field.name];
      });

      setFormData(updatedFormData);
      setIsEditing(true);
      setEditingId(id);
      toggleModal(true);
    }
  };

  const toggleModal = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      setFormData({});
      setIsEditing(false);
      setEditingId(null);
    }
  };

  const handleTabClick = async (tabId, e) => {
    e.preventDefault();
    setActiveTab(tabId);
    console.log(tabId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderFormFields = () => {
    const currentTab = tabs[activeTab];

    return currentTab?.fields.map((field, index) => {
      // Cas spécial pour le type de transport avec options dynamiques
      if (
        (field.name === "type" || field.name === "sousType") &&
        (activeTab === "transport" ||
          activeTab === "businessTravel" ||
          activeTab === "biens-services") &&
        field.dynamicOptions
      ) {
        const transportMode = formData.mode || formData.type;
        const availableOptions = transportMode
          ? field.dynamicOptions[transportMode] || []
          : [];

        return (
          <div className="mb-3" key={index}>
            <label className="form-label">{field?.label}</label>
            <select
              className="form-select"
              name={field.name}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
              required={field.required}
              disabled={!transportMode}
            >
              <option value="">{field.placeholder}</option>
              {availableOptions.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div className="mb-3" key={index}>
          <label className="form-label">{field?.label}{field?.required ? <span className="fs-2 text-danger">*</span> : "" }</label>
          {field.type === "select" ? (
            <select
              className="form-select"
              name={field.name}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
              required={field.required}
            >
              <option value="">{field.placeholder}</option>
              {field.options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              className="form-control"
              name={field.name}
              placeholder={field.placeholder}
              rows={field.rows}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              className="form-control"
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
              required={field.required}
              min={field.min}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className="container-xl ">
      <div
        className="py-2 mb-4 d-flex 
      border-b  justify-content-start align-items-center"
      >
        <div>
          <h1 className="fs-1 fw-bold" style={{ color: "#263589" }}>
            Scope 3
          </h1>
          <p>
            <strong className="text-primary">Émissions indirectes</strong>{" "}
            issues des activités de la chaîne de valeur de l’organisation,
            telles que l’achat de biens, les déplacements professionnels,
            l’utilisation des produits vendus, etc.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header pt-3">
          <ul className="nav nav-tabs card-header-tabs">
            {Object.values(tabs).map((tab) => (
              <li className="nav-item" key={tab?.id}>
                <a
                  href={`#${tab?.id}`}
                  className={`nav-link text-bold text-primary ${
                    activeTab === tab?.id ? "active 0" : ""
                  }`}
                  onClick={(e) => handleTabClick(tab?.id, e)}
                >
                  {tab?.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body">
          <DataTable
            dataHeader={tabs[activeTab]?.dataHeader}
            headers={tabs[activeTab]?.headers}
            data={tableData[activeTab] || []}
            activeTab={activeTab}
            tab={tabs[[activeTab]]}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAdd={() => toggleModal(true)}
            deletingIds={deletingIds}
            
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-blur show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? "Modifier" : "Nouveau"} {tabs[activeTab]?.label}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => toggleModal(false)}
                  
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">{renderFormFields()}</div>
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
                        {isEditing ? "Mise à jour..." : "Ajout..."}
                      </span>
                    ) : (
                      isEditing ? "Mettre à jour" : "Ajouter"
                    )}
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

export default Scope3;