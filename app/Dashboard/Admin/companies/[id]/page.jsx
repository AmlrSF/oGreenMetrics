"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCountryCode } from "@/lib/Data";

const Page = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCompany = async () => {
        try {
          const response = await fetch(`http://localhost:4000/company/${id}`);
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setCompany(data.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCompany();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container-xl d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-blue" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-4">Error: {error}</div>;
  }

   const countryCode = getCountryCode(company?.country);

  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Détails de l'entreprise</h2>
            </div>
          </div>
        </div>
        {company ? (
          <div className="row row-cards">
            {/* Carte d'en-tête de l'entreprise */}
            <div className="col-12">
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <span className="avatar avatar-lg rounded bg-blue-lt">
                        {company.nom_entreprise.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="col">
                      <h3 className="mb-0">{company.nom_entreprise}</h3>
                      {company.isVerified && (
                        <span className="badge bg-green-lt">
                          Entreprise vérifiée
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`flag flag-country-${countryCode}`}></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Informations de contact</h3>
                </div>
                <div className="card-body">
                  <div className="datagrid">
                    <div className="datagrid-item">
                      <div className="datagrid-title">Email</div>
                      <div className="datagrid-content">{company.email}</div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Téléphone</div>
                      <div className="datagrid-content">{company.num_tel}</div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Adresse</div>
                      <div className="datagrid-content">{company.adresse}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails de l'entreprise */}
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Informations sur l'entreprise</h3>
                </div>
                <div className="card-body">
                  <div className="datagrid">
                    <div className="datagrid-item">
                      <div className="datagrid-title">Secteur</div>
                      <div className="datagrid-content">
                        {company.industrie}
                      </div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Date de fondation</div>
                      <div className="datagrid-content">
                        {new Date(company.date_fondation).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">ID Fiscal</div>
                      <div className="datagrid-content">
                        {company.matricule_fiscale}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Données sur les émissions */}
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Données sur les émissions</h3>
                </div>
                <div className="card-body">
                  <div className="datagrid">
                    <div className="datagrid-item">
                      <div className="datagrid-title">Total des émissions</div>
                      <div className="datagrid-content">
                        <span className="badge bg-purple-lt">
                          {company.emissions} tonnes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations sur l'utilisateur */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Personne de contact</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="datagrid">
                        <div className="datagrid-item">
                          <div className="datagrid-title">Nom</div>
                          <div className="datagrid-content">
                            {company.userId.prenom} {company.userId.nom}
                          </div>
                        </div>
                        <div className="datagrid-item">
                          <div className="datagrid-title">Email</div>
                          <div className="datagrid-content">
                            {company.userId.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="datagrid">
                        <div className="datagrid-item">
                          <div className="datagrid-title">
                            Date d'inscription
                          </div>
                          <div className="datagrid-content">
                            {new Date(company.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="datagrid-item">
                          <div className="datagrid-title">
                            Dernière mise à jour
                          </div>
                          <div className="datagrid-content">
                            {new Date(company.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon">
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
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="12" r="9" />
                <line x1="9" y1="10" x2="9.01" y2="10" />
                <line x1="15" y1="10" x2="15.01" y2="10" />
                <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
              </svg>
            </div>
            <p className="empty-title">Aucune entreprise trouvée</p>
            <p className="empty-subtitle text-muted">
              Essayez d'ajuster votre recherche ou vos filtres pour trouver ce
              que vous cherchez.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
