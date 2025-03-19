"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
    return (
      <div className="alert alert-danger m-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Company Details</h2>
            </div>
          </div>
        </div>
        {company ? (
          <div className="row row-cards">
            {/* Company Header Card */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <span className="avatar avatar-lg rounded bg-blue-lt">
                        {company.nom_entreprise.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="col">
                      <h3 className="mb-0">{company.nom_entreprise}</h3>
                      {company.isVerified && (
                        <span className="badge bg-green-lt">Verified Company</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Contact Information</h3>
                </div>
                <div className="card-body">
                  <div className="datagrid">
                    <div className="datagrid-item">
                      <div className="datagrid-title">Email</div>
                      <div className="datagrid-content">{company.email}</div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Phone</div>
                      <div className="datagrid-content">{company.num_tel}</div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Address</div>
                      <div className="datagrid-content">{company.adresse}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Company Information</h3>
                </div>
                <div className="card-body">
                  <div className="datagrid">
                    <div className="datagrid-item">
                      <div className="datagrid-title">Industry</div>
                      <div className="datagrid-content">{company.industrie}</div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Founded Date</div>
                      <div className="datagrid-content">
                        {new Date(company.date_fondation).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="datagrid-item">
                      <div className="datagrid-title">Fiscal ID</div>
                      <div className="datagrid-content">{company.matricule_fiscale}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emissions Data */}
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Emissions Data</h3>
                </div>
                <div className="card-body">
                  <div className="datagrid">
                    <div className="datagrid-item">
                      <div className="datagrid-title">Total Emissions</div>
                      <div className="datagrid-content">
                        <span className="badge bg-purple-lt">{company.emissions} tons</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Contact Person</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="datagrid">
                        <div className="datagrid-item">
                          <div className="datagrid-title">Name</div>
                          <div className="datagrid-content">
                            {company.userId.prenom} {company.userId.nom}
                          </div>
                        </div>
                        <div className="datagrid-item">
                          <div className="datagrid-title">Email</div>
                          <div className="datagrid-content">{company.userId.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="datagrid">
                        <div className="datagrid-item">
                          <div className="datagrid-title">Registration Date</div>
                          <div className="datagrid-content">
                            {new Date(company.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="datagrid-item">
                          <div className="datagrid-title">Last Updated</div>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <circle cx="12" cy="12" r="9" />
                <line x1="9" y1="10" x2="9.01" y2="10" />
                <line x1="15" y1="10" x2="15.01" y2="10" />
                <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
              </svg>
            </div>
            <p className="empty-title">No company found</p>
            <p className="empty-subtitle text-muted">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;