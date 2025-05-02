"use client";

import React, { useState, useEffect } from "react";
import { formatDate, getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";
import { IconEye, IconTrash } from "@tabler/icons-react";

const Page = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userAccess, setUserAccess] = useState("");
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setselectedCompany] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data?.user) {
        setUserAccess(data?.user?.AdminRoles?.userManagement);
        console.log(data?.user);
      }
    } catch (err) {
      console.log();
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/companies");
      const data = await response.json();
      console.log(data);
      setCompanies(data?.data);
      setFilteredCompanies(data?.data);
    } catch (error) {
      setError("Failed to load companies");
    }
    setLoading(false);
  };

  const handleApproveCompany = async (companyId, currentStatus) => {
    try {
      const response = await fetch(
        `http://localhost:4000/updatecompany/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVerified: !currentStatus,
          }),
        }
      );
      await response.json();
      fetchCompanies();
    } catch (error) {
      setError("Failed to update company status");
    }
  };

  const handleDeleteCompany = async () => {
    if (deletingIds.has(selectedCompany._id)) return;

    setDeletingIds((prev) => new Set([...prev, selectedCompany._id]));

    try {
      const response = await fetch(
        `http://localhost:4000/deletecompany/${selectedCompany._id}`,
        {
          method: "Delete",
        }
      );
      await response.json();
      setModalOpen(false);
      fetchCompanies();
    } catch (error) {
      setError("Failed to update company status");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedCompany._id);
        return newSet;
      });
    }
  };

  useEffect(() => {
    let result = companies;

    if (currentFilter === "verified") {
      result = companies.filter((company) => company.isVerified);
    } else if (currentFilter === "unverified") {
      result = companies.filter((company) => !company.isVerified);
    }

    setFilteredCompanies(result);
  }, [currentFilter, companies]);

  const openModal = (company) => {
    setselectedCompany(company);
    setModalOpen(true);
  };

  const navigateToCompanyDetails = (companyId) => {
    router.push(`/Dashboard/Admin/companies/${companyId}`);
  };

  return (
    <div className="container-xl h-full">
      {modalOpen && selectedCompany && (
        <div className="modal modal-blur fade show d-block">
          <div
            style={{ zIndex: 1050 }}
            className="modal-dialog modal-dialog-centered modal-sm"
          >
            <div className="modal-content">
              <div className="modal-body">
                <div className="text-center py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler text-warn mb-2 icons-tabler-filled icon-tabler-alert-hexagon"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10.425 1.414a3.33 3.33 0 0 1 3.026 -.097l.19 .097l6.775 3.995l.096 .063l.092 .077l.107 .075a3.224 3.224 0 0 1 1.266 2.188l.018 .202l.005 .204v7.284c0 1.106 -.57 2.129 -1.454 2.693l-.17 .1l-6.803 4.302c-.918 .504 -2.019 .535 -3.004 .068l-.196 -.1l-6.695 -4.237a3.225 3.225 0 0 1 -1.671 -2.619l-.007 -.207v-7.285c0 -1.106 .57 -2.128 1.476 -2.705l6.95 -4.098zm1.585 13.586l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                  </svg>
                  <h3>Êtes-vous sûr ?</h3>
                  <div className="text-muted">
                    Voulez-vous supprimer cette entreprise ?
                  </div>
                  <div className="text-muted mt-2">
                    <strong>{selectedCompany.nom_entreprise}</strong>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="w-100">
                  <div className="row">
                    <div className="col">
                      <button
                        className="btn w-100"
                        onClick={() => setModalOpen(false)}
                      >
                        Annuler
                      </button>
                    </div>
                    <div className="col">
                      <button
                        className="btn w-100 btn-danger"
                        onClick={() => handleDeleteCompany(selectedCompany)}
                        disabled={deletingIds.has(selectedCompany._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setModalOpen(false)}
          ></div>
        </div>
      )}
      <div
        className="py-4 d-flex flex-column justify-content-center align-items-start 
     "
      >
        <h3
          className="fs-1 fw-bold"
          style={{ fontSize: "30px", color: "#263589" }}
        >
          Administration des entreprises
        </h3>
        <div className="card-subtitle">
          Gérez efficacement les statuts de vérification des entreprises.
        </div>
      </div>

      <div className="card ">
        <div className="card-body border-bottom py-3">
          <div className="d-flex">
            <div className="text-secondary">
              Afficher
              <div className="mx-2 d-inline-block">
                <select
                  className="form-select form-select-sm"
                  value={currentFilter}
                  onChange={(e) => setCurrentFilter(e.target.value)}
                >
                  <option value="all">Toutes les entreprises</option>
                  <option value="verified">Vérifiées</option>
                  <option value="unverified">Non vérifiées</option>
                </select>
              </div>
              entrées
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card-body">
            <div className="progress progress-sm">
              <div
                className="progress-bar progress-bar-indeterminate"
                style={{ backgroundColor: "#8EBE21" }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Propriétaire de l'entreprise</th>
                    <th>Entreprise</th>
                    <th>Email de contact</th>
                    <th>Industrie</th>
                    <th>Date d'inscription</th>
                    {userAccess == "10" ? (
                      <></>
                    ) : (
                      <th className=""> Action </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((company, index) => (
                        <tr key={company._id || index}>
                          <td className="d-flex align-items-center">
                            <span
                              className="avatar avatar-sm text-white me-2"
                              style={{ backgroundColor: "#263589" }}
                            >
                              {getInitials(
                                company.userId?.nom,
                                company.userId?.prenom
                              )}
                            </span>
                            <p className="text-[10px] mb-0">
                              {company.userId?.nom} {company.userId?.prenom}
                            </p>
                          </td>
                          <td className="text-secondary ">
                            <div className="d-flex align-items-center">
                              <div className="flex-fill">
                                <div className="font-weight-medium">
                                  {company.nom_entreprise}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-secondary">{company.email}</td>
                          <td>
                            <span className="badge bg-purple-lt">
                              {company.industrie}
                            </span>
                          </td>
                          <td className="text-secondary">
                            {formatDate(company.createdAt)}
                          </td>
                          {userAccess == "10" ? (
                            <></>
                          ) : (
                            <td>
                              <div className=" d-flex">
                                <button
                                  onClick={() =>
                                    navigateToCompanyDetails(company._id)
                                  }
                                  className="btn btn-ghost-blue btn-icon"
                                >
                                  <IconEye size={18} className="text-primary" />
                                </button>
                                <button
                                  onClick={() => openModal(company)}
                                  className="btn btn-ghost-danger btn-icon"
                                >
                                  <IconTrash className="text-red" size={18} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-secondary">
                        No companies found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-footer d-flex align-items-center">
              <p className="m-0 text-secondary">
                Affichage de <span>{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
                à{" "}
                <span>
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCompanies.length
                  )}
                </span>{" "}
                sur <span>{filteredCompanies.length}</span> entrées
              </p>
              <ul className="pagination d-flex gap-3 m-0 ms-auto">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
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
                      <path d="M15 6l-6 6l6 6" />
                    </svg>
                  </button>
                </li>
                <li className="page-item active">
                  <span
                    className="page-link"
                    style={{
                      backgroundColor: "#263589",
                      borderColor: "#263589",
                    }}
                  >
                    {currentPage}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
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
                      <path d="M9 6l6 6l-6 6" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
