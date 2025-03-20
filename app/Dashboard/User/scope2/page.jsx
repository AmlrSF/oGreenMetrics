"use client";
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Scope2 = () => {
  const [activeTab, setActiveTab] = useState('electricity');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = {
    electricity: {
      id: 'electricity',
      label: 'Consommation d\'électricité',
      headers: ['Consommation électrique (kWH)', 'Action'],
      fields: [
        {
          name: 'consumption',
          label: 'Consommation électrique (kW)',
          type: 'number',
          placeholder: 'Consommation en kW'
        }
      ]
    },
    heating: {
      id: 'heating',
      label: 'Chauffage',
      headers: ['Nom', 'Type', 'Énergie Consommée', 'Action'],
      fields: [
        {
          name: 'name',
          label: 'Nom',
          type: 'text',
          placeholder: 'Nom de l\'équipement'
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          placeholder: 'Sélectionner un type',
          options: [
            { value: 'type1', label: 'Type 1' },
            { value: 'type2', label: 'Type 2' },
            { value: 'type3', label: 'Type 3' }
          ]
        },
        {
          name: 'energy',
          label: 'Énergie Consommée',
          type: 'number',
          placeholder: 'Énergie consommée'
        }
      ]
    },
    cooling: {
      id: 'cooling',
      label: 'Refroidissement',
      headers: ['Nom', 'Type', 'Énergie Consommée', 'Action'],
      fields: [
        {
          name: 'name',
          label: 'Nom',
          type: 'text',
          placeholder: 'Nom de l\'équipement'
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          placeholder: 'Sélectionner un type',
          options: [
            { value: 'type1', label: 'Type 1' },
            { value: 'type2', label: 'Type 2' },
            { value: 'type3', label: 'Type 3' }
          ]
        },
        {
          name: 'energy',
          label: 'Énergie Consommée',
          type: 'number',
          placeholder: 'Énergie consommée'
        }
      ]
    }
  };

  const handleTabClick = (tabId, e) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const toggleModal = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would add the data to your state or send it to your API
    console.log('Form submitted:', formData);
    toggleModal(false);
  };

  const renderTable = () => {
    const currentTab = tabs[activeTab];
    
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
              <tr>
                <td colSpan={currentTab.headers.length} className="text-center text-secondary">
                  Aucune donnée disponible pour {currentTab.label.toLowerCase()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => toggleModal(true)}
          >
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
        {field.type === 'select' ? (
          <select 
            className="form-select"
            name={field.name}
            onChange={handleInputChange}
            value={formData[field.name] || ''}
          >
            <option value="" disabled>{field.placeholder}</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            className="form-control"
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            value={formData[field.name] || ''}
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
              <h5 className="modal-title">Nouveau {currentTab.label}</h5>
              <button type="button" className="btn-close" onClick={() => toggleModal(false)} aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {renderFormFields()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-link link-secondary" onClick={() => toggleModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary ms-auto">
                  Ajouter
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
            <strong className="text-primary">Émissions indirectes</strong> provenant de sources détenues ou contrôlées par une organisation.
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
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={(e) => handleTabClick(tab.id, e)}
                >
                  {tab.label}
                </a>
              </li>
            ))}
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

export default Scope2;