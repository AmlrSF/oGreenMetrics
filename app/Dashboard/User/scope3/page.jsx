"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
          setCompany(CompanyData?.data[0]);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      console.log(responseData)

      fetchData();
      toggleModal(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error("Error adding/updating data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/${activeTab}/${id}`, {
        method: "DELETE",
      });

      const responseData = await response.json();

      console.log(responseData);
      fetchData();
    } catch (error) {}
  };

  const handleUpdate = async (id) => {
    const itemToUpdate = tableData[activeTab].find((item) => item._id === id);
    
    
    if (itemToUpdate) {
      const updatedFormData = {};
      tabs[activeTab].fields.forEach((field) => {
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
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
  };

  const renderFormFields = () => {
    const currentTab = tabs[activeTab];

    return currentTab.fields.map((field, index) => {
      // Cas spécial pour le type de transport avec options dynamiques
      if (
        field.name === "type" &&
        activeTab === "transport" &&
        field.dynamicOptions
      ) {
        const transportMode = formData.mode;
        const availableOptions = transportMode
          ? field.dynamicOptions[transportMode] || []
          : [];

        return (
          <div className="mb-3" key={index}>
            <label className="form-label">{field.label}</label>
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
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div className="mb-3" key={index}>
          <label className="form-label">{field.label}</label>
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
                  {option.label}
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
    <div className="container-xl py-4">
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title text-success">Scope 3</h3>
          <p className="text-muted">
            <strong className="text-primary">Émissions indirectes</strong>{" "}
            provenant de sources détenues ou contrôlées par une organisation.
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

        <div className="card-body">
          <DataTable
            headers={tabs[activeTab].headers}
            data={tableData[activeTab]}
            activeTab={activeTab}
            tabs={tabs}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAdd={() => toggleModal(true)}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-blur show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? "Modifier" : "Nouveau"} {tabs[activeTab].label}
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
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary ms-auto">
                    {isEditing ? "Mettre à jour" : "Ajouter"}
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
