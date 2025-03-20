"use client";
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Scope3 = () => {
  const [activeTab, setActiveTab] = useState('transport');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Configuration object for all tabs
  const tabs = {
    transport: {
      id: 'transport',
      label: 'Transport',
      headers: ['Distance', 'Poids', 'Description', 'Action'],
      fields: [
        {
          name: 'distance',
          label: 'Distance',
          type: 'number',
          placeholder: 'Distance en km',
          required: true,
          min: 0
        },
        {
          name: 'poids',
          label: 'Poids',
          type: 'number',
          placeholder: 'Poids en kg',
          required: true,
          min: 0
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Description',
          rows: 3
        }
      ]
    },
    dechets: {
      id: 'dechets',
      label: 'Déchets',
      headers: ['Type', 'Poids', 'Description', 'Action'],
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          placeholder: 'Choisir un type de déchet',
          required: true,
          options: [
            { value: 'Papier', label: 'Papier' },
            { value: 'Plastique', label: 'Plastique' },
            { value: 'Organique', label: 'Organique' },
            { value: 'Métal', label: 'Métal' },
            { value: 'Verre', label: 'Verre' },
            { value: 'Électronique', label: 'Électronique' }
          ]
        },
        {
          name: 'poids',
          label: 'Poids',
          type: 'number',
          placeholder: 'Poids en kg',
          required: true,
          min: 0
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Description',
          rows: 3
        }
      ]
    },
    voyage: {
      id: 'voyage',
      label: 'Voyage d\'affaires',
      headers: ['Type', 'Distance', 'Description', 'Action'],
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          placeholder: 'Choisir un type de voyage',
          required: true,
          options: [
            { value: 'Avion', label: 'Avion' },
            { value: 'Train', label: 'Train' },
            { value: 'Voiture', label: 'Voiture' },
            { value: 'Bus', label: 'Bus' }
          ]
        },
        {
          name: 'distance',
          label: 'Distance',
          type: 'number',
          placeholder: 'Distance en km',
          required: true,
          min: 0
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Description',
          rows: 3
        }
      ]
    },
    'biens-services': {
      id: 'biens-services',
      label: 'Biens et services achetés',
      headers: ['Titre', 'Type', 'Quantité', 'Description', 'Action'],
      fields: [
        {
          name: 'titre',
          label: 'Titre',
          type: 'text',
          placeholder: 'Titre',
          required: true
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          placeholder: 'Choisir un type',
          required: true,
          options: [
            { value: 'Matériel', label: 'Matériel' },
            { value: 'Service', label: 'Service' },
            { value: 'Logiciel', label: 'Logiciel' }
          ]
        },
        {
          name: 'quantite',
          label: 'Quantité',
          type: 'number',
          placeholder: 'Quantité',
          required: true,
          min: 0
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Description',
          rows: 3
        }
      ]
    },
    equipement: {
      id: 'equipement',
      label: 'Biens d\'équipement',
      headers: ['Type', 'Valeur', 'Description', 'Action'],
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          placeholder: 'Choisir un type d\'équipement',
          required: true,
          options: [
            { value: 'Informatique', label: 'Informatique' },
            { value: 'Mobilier', label: 'Mobilier' },
            { value: 'Véhicule', label: 'Véhicule' },
            { value: 'Machines', label: 'Machines' }
          ]
        },
        {
          name: 'valeur',
          label: 'Valeur',
          type: 'number',
          placeholder: 'Valeur en €',
          required: true,
          min: 0
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Description',
          rows: 3
        }
      ]
    },
    'deplacement-employes': {
      id: 'deplacement-employes',
      label: 'Déplacements des employés',
      headers: ['Distance', 'Nb d\'employés', 'Nb de voyages par jour', 'Action'],
      fields: [
        {
          name: 'distance',
          label: 'Distance',
          type: 'number',
          placeholder: 'Distance en km',
          required: true,
          min: 0
        },
        {
          name: 'nbEmployes',
          label: 'Nombre d\'employés',
          type: 'number',
          placeholder: 'Nombre d\'employés',
          required: true,
          min: 1
        },
        {
          name: 'nbVoyages',
          label: 'Nombre de voyages par jour',
          type: 'number',
          placeholder: 'Nombre de voyages par jour',
          required: true,
          min: 0
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
        <div className="d-flex justify-content-end mt-4">
          <button
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
            required={field.required}
          >
            <option value="" disabled>{field.placeholder}</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            className="form-control"
            name={field.name}
            placeholder={field.placeholder}
            rows={field.rows}
            onChange={handleInputChange}
            value={formData[field.name] || ''}
            required={field.required}
          ></textarea>
        ) : (
          <input
            type={field.type}
            className="form-control"
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            value={formData[field.name] || ''}
            required={field.required}
            min={field.min}
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
          <h3 className="card-title text-success">Scope 3</h3>
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

        <div className="card-body">
          {renderTable()}
          {renderModal()}
        </div>
      </div>
    </div>
  );
};

export default Scope3;