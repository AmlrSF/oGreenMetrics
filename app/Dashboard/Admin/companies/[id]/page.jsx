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
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl py-4">
        <div className="alert alert-danger mb-0">
          <div className="d-flex">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 9v2m0 4v.01"></path>
                <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path>
              </svg>
            </div>
            <div className="ms-2">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  const countryCode = getCountryCode(company?.country);

  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl">
          <div className="page-header d-print-none mb-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="page-pretitle text-muted">Entreprise</div>
                <h2 className="page-title">Détails de l'entreprise</h2>
              </div>
              <div className="col-auto ms-auto">
                <div className="btn-list">
                  <a href="#" className="btn btn-outline-primary d-none d-sm-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                      <path d="M16 5l3 3" />
                    </svg>
                    Modifier
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {company ? (
            <div className="row row-cards">
              {/* Carte d'en-tête de l'entreprise */}
              <div className="col-12">
                <div className="card card-lg mb-4">
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span className="avatar avatar-xl rounded-circle bg-primary-lt shadow-sm">
                          {company.nom_entreprise.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="col">
                        <div className="d-flex align-items-center">
                          <h1 className="mb-0 me-2">{company.nom_entreprise}</h1>
                          <div className="d-flex align-items-center gap-2 ms-3">
                            {company.isVerified && (
                              <span className="badge bg-green text-green-fg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                  <path d="M5 12l5 5l10 -10" />
                                </svg>
                                Entreprise vérifiée
                              </span>
                            )}
                            <span className={`flag flag-country-${countryCode} flag-xl ms-2`}></span>
                          </div>
                        </div>
                        <div className="text-muted mt-1">{company.industrie}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="col-md-6 col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-address-book me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z" />
                        <path d="M10 16h6" />
                        <path d="M13 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M4 8h3" />
                        <path d="M4 12h3" />
                        <path d="M4 16h3" />
                      </svg>
                      Informations de contact
                    </h3>
                  </div>
                  <div className="card-body border-bottom py-3">
                    <div className="datagrid">
                      <div className="datagrid-item">
                        <div className="datagrid-title">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                            <path d="M3 7l9 6l9 -6" />
                          </svg>
                          Email
                        </div>
                        <div className="datagrid-content">
                          <a href={`mailto:${company.email}`} className="text-reset">{company.email}</a>
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                          </svg>
                          Téléphone
                        </div>
                        <div className="datagrid-content">
                          <a href={`tel:${company.num_tel}`} className="text-reset">{company.num_tel}</a>
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                          </svg>
                          Adresse
                        </div>
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
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-building-skyscraper me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M3 21l18 0" />
                        <path d="M5 21v-14l8 -4v18" />
                        <path d="M19 21v-10l-6 -4" />
                        <path d="M9 9l0 .01" />
                        <path d="M9 12l0 .01" />
                        <path d="M9 15l0 .01" />
                        <path d="M9 18l0 .01" />
                      </svg>
                      Informations sur l'entreprise
                    </h3>
                  </div>
                  <div className="card-body border-bottom py-3">
                    <div className="datagrid">
                      <div className="datagrid-item">
                        <div className="datagrid-title">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-category me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 4h6v6h-6z" />
                            <path d="M14 4h6v6h-6z" />
                            <path d="M4 14h6v6h-6z" />
                            <path d="M14 14h6v6h-6z" />
                          </svg>
                          Secteur
                        </div>
                        <div className="datagrid-content">
                          <span className="badge bg-blue-lt">{company.industrie}</span>
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                            <path d="M16 3v4" />
                            <path d="M8 3v4" />
                            <path d="M4 11h16" />
                            <path d="M11 15h1" />
                            <path d="M12 15v3" />
                          </svg>
                          Date de fondation
                        </div>
                        <div className="datagrid-content">
                          {new Date(company.date_fondation).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="datagrid-item">
                        <div className="datagrid-title">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-id me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                            <path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M15 8l2 0" />
                            <path d="M15 12l2 0" />
                            <path d="M7 16l10 0" />
                          </svg>
                          ID Fiscal
                        </div>
                        <div className="datagrid-content font-monospace">{company.matricule_fiscale}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Données sur les émissions */}
              <div className="col-md-6 col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chart-pie me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8" />
                        <path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5" />
                      </svg>
                      Totales des émissions
                    </h3>
                  </div>
                  <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="h1 mb-3 text-center">
                      <span className="badge bg-cyan-500">{company.emissions} tonnes</span>
                    </div>
                   
                  </div>
                </div>
              </div>

              {/* Informations sur l'utilisateur */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      </svg>
                      Personne de contact
                    </h3>
                  </div>
                  <div className="card-body border-bottom py-3">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="row d-flex align-items-center mb-3">
                          <div className="col-auto">
                            <span className="avatar avatar-md">
                              {company.userId.prenom.charAt(0).toUpperCase()}{company.userId.nom.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="col">
                            <div className="font-weight-medium">
                              {company.userId.prenom} {company.userId.nom}
                            </div>
                            <div className="text-muted">
                              <a href={`mailto:${company.userId.email}`} className="text-reset">{company.userId.email}</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="datagrid">
                          <div className="datagrid-item">
                            <div className="datagrid-title">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-plus me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" />
                                <path d="M16 3v4" />
                                <path d="M8 3v4" />
                                <path d="M4 11h16" />
                                <path d="M16 19h6" />
                                <path d="M19 16v6" />
                              </svg>
                              Date d'inscription
                            </div>
                            <div className="datagrid-content">
                              {new Date(company.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="datagrid-item">
                            <div className="datagrid-title">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-refresh me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                              </svg>
                              Dernière mise à jour
                            </div>
                            <div className="datagrid-content">
                              {new Date(company.updatedAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
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
              <div className="empty-img">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-building" width="100" height="100" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M3 21l18 0" />
                  <path d="M9 8l1 0" />
                  <path d="M9 12l1 0" />
                  <path d="M9 16l1 0" />
                  <path d="M14 8l1 0" />
                  <path d="M14 12l1 0" />
                  <path d="M14 16l1 0" />
                  <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
                </svg>
              </div>
              <p className="empty-title">Aucune entreprise trouvée</p>
              <p className="empty-subtitle text-secondary">
                Essayez d'ajuster votre recherche ou vos filtres pour trouver ce
                que vous cherchez.
              </p>
              <div className="empty-action">
                <a href="#" className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 5l0 14"></path>
                    <path d="M5 12l14 0"></path>
                  </svg>
                  Créer une entreprise
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;