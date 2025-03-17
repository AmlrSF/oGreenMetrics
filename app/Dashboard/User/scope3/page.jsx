"use client";
import React, { useState } from 'react';

const Scope3 = () => {
  const [activeTab, setActiveTab] = useState('transport');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
 
  const renderTable = () => {
    return (
      <div className="table-container" style={{ padding: '20px' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e9ecef' }}>
              {getTableHeaders().map((header, index) => (
                <th key={index} style={{ padding: '10px', textAlign: 'left' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>
                Aucune donnée disponible pour {getTableTitle().toLowerCase()}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button
            style={{
              backgroundColor: '#76b82a',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              margin: '0 0 0 auto',
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
      case 'transport':
        return 'Transport';
      case 'dechets':
        return 'Déchets';
      case 'voyage':
        return 'Voyage d\'affaires';
      case 'biens-services':
        return 'Biens et services achetés';
      case 'equipement':
        return 'Biens d\'équipement';
      case 'déplacements des employés':
        return 'Déplacements des employés';
      default:
        return 'Transport';
    }
  };

  const getTableHeaders = () => {
    switch (activeTab) {
      case 'transport':
        return ['Distance', 'Poids', 'Description'];
      case 'dechets':
        return ['Type', 'Poids', 'Description'];
      case 'voyage':
        return ['Type', 'Distance', 'Description'];
      case 'biens-services':
        return ['Titre', 'Type', 'Quantité', 'Description'];
      case 'equipement':
        return ['Type', 'Valeur', 'Description'];
      case 'déplacements des employés':
        return ['Distance', 'Nb d\'employés', 'Nb de voyages par jour'];
      default:
        return [];
    }
  };

  return (
    <div className="scope3-container mt-5 " style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
      <div className="card">
        <div className="card-body">
          <b>
            <p style={{ color: '#8EBE21' }}>Scope 3</p>
          </b>
        </div>
        <p>
          <b style={{ color: '#263589' }}>Émissions indirectes </b>provenant de sources détenues ou contrôlées par une organisation.
        </p>
      </div>

      <div className="scope3-tabs-container mt-4" style={{ backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="scope3-tabs">
          <ul className="nav" style={{ display: 'flex', listStyle: 'none', padding: '0', margin: '0', borderBottom: '1px solid #e9ecef' }}>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#transport"
                className={`nav-link ${activeTab === 'transport' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'transport' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'transport' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('transport');
                }}
              >
                Transport
              </a>
            </li>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#dechets"
                className={`nav-link ${activeTab === 'dechets' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'dechets' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'dechets' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('dechets');
                }}
              >
                Déchets
              </a>
            </li>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#voyage"
                className={`nav-link ${activeTab === 'voyage' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'voyage' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'voyage' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('voyage');
                }}
              >
                Voyage d'affaires
              </a>
            </li>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#biens-services"
                className={`nav-link ${activeTab === 'biens-services' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'biens-services' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'biens-services' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('biens-services');
                }}
              >
                Biens et services achetés
              </a>
            </li>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#equipement"
                className={`nav-link ${activeTab === 'equipement' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'equipement' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'equipement' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('equipement');
                }}
              >
                Biens d'équipement
              </a>
            </li>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#déplacements des employés"
                className={`nav-link ${activeTab === 'déplacements des employés' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'déplacements des employés' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'déplacements des employés' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('déplacements des employés');
                }}
              >
                Déplacements des employés
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content">{renderTable()}</div>
      </div>
    </div>
  );
};

export default Scope3;
