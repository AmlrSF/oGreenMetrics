"use client";

import React, { useState, useEffect } from "react";

import { formatDate, getInitials } from "@/lib/Utils";
import { IconTrash, IconUserCheck, IconUserX } from "@tabler/icons-react";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [userAccess, setUserAccess] = useState("");
  const [SortOrder, setSortOrder] = useState("all");
  const [selectedRole, setSelectedRole] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    prenom: "",
    nom: "",
    AdminRoles: "",
    mot_de_passe: "",
  });

  const [deletingIds, setDeletingIds] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);



  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    checkAuth();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:4000/roles");
      const data = await response.json();
      console.log(data);
      setRoles(data?.data);
    } catch (error) {
      setError("Failed to load roles");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/users");
      let data = await response.json();

      data = data.filter((item) => item?.AdminRoles);
      console.log(data);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setError("Failed to load users");
    }
    setLoading(false);
  };

  const handleApproveUser = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isVerified: !currentStatus,
        }),
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      setError("Failed to update user status");
    }
  };

  const deleteUser = async (userId) => {
    if (deletingIds.has(userId)) return;
    
    setDeletingIds(prev => new Set([...prev, userId]));
    

    try {
      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      setError("Failed to delete user");
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    let result = users;
    if (currentFilter === "verified") {
      result = users.filter((user) => user.isVerified);
    } else if (currentFilter === "unverified") {
      result = users.filter((user) => !user.isVerified);
    }

    if (SortOrder === "latest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (SortOrder === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (selectedRole) {
      result = result.filter((user) => user.AdminRoles?.name === selectedRole);
    }

    setFilteredUsers(result);
  }, [currentFilter, SortOrder, selectedRole, users]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

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

  const handleAddUser = async (e) => {
    e.preventDefault();
   
    if (isSubmitting) return;

    setIsSubmitting(true);


    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      setError(data?.error);
      if (response.ok) {
        fetchUsers();
        setIsModalOpen(false);
        setNewUser({
          email: "",
          prenom: "",
          nom: "",
          AdminRoles: "",
          mot_de_passe: "",
        });
      }
    } catch (error) {
      setError("Failed to create user");
    }finally {
      setIsSubmitting(false);
      setError(null)
    }

  };

  return (
    <div className="container-xl h-full ">
      <div className="py-4 d-flex d-flex justify-content-between align-items-center ">
        <div className="d-flex flex-column justify-content-start align-items-start">
          <h3
            className="fw-bold mb-1"
            style={{ fontSize: "30px", color: "#263589" }}
          >
            Administration des utilisateurs
          </h3>
          <div className="card-subtitle">
            Gérez efficacement les rôles et les permissions.
          </div>
        </div>

        {userAccess == "10" ? (
          <></>
        ) : (
          <button
            className="btn  d-flex align-items-center btn-primary"
            onClick={() => setIsModalOpen(true)}
         
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
            Ajouter un utilisateur
          </button>
        )}
      </div>

      <div className="card pt-">
        <div className="card-body border-bottom py-3">
          <div className="d-flex">
            <div className="text-secondary d-flex align-items-center">
              Afficher
              <div className="mx-2 d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={currentFilter}
                  onChange={(e) => setCurrentFilter(e.target.value)}
                >
                  <option value="all">Tous les utilisateurs</option>
                  <option value="verified">Vérifiés</option>
                  <option value="unverified">Non vérifiés</option>
                </select>
                <select
                  className="form-select form-select-sm"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Tous les rôles</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <select
                  className="form-select form-select-sm"
                  value={SortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="latest">Les plus anciens</option>
                  <option value="oldest">Les plus récents</option>
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
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Créé le</th>
                    {userAccess == "10" ? (
                      <></>
                    ) : (
                      <th className="w-1"> Action </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().length > 0 ? (
                    getCurrentPageItems().map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span
                              className="avatar avatar-md text-white me-2"
                              style={{ backgroundColor: "#263589" }}
                            >
                              {user.photo_de_profil ? (
                                <img
                                  src={user.photo_de_profil}
                                  alt={`${user.prenom} ${user.nom}`}
                                />
                              ) : (
                                getInitials(user.prenom, user.nom)
                              )}
                            </span>
                            <div className="flex-fill">
                              <div className="font-weight-medium">
                                {user.prenom} {user.nom}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-secondary">{user.email}</td>
                        <td>
                          <span className="badge bg-purple-lt">
                            {user.AdminRoles.name}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              user.isVerified ? "bg-success-lt" : "bg-danger-lt"
                            }`}
                          >
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="text-secondary">
                          {formatDate(user.createdAt)}
                        </td>
                        {userAccess == "10" ? (
                          <></>
                        ) : (
                          <td>
                            <div className="btn-list flex-nowrap">
                              <button
                                className={`btn btn-ghost-${
                                  user.isVerified ? "danger" : "success"
                                } btn-icon`}
                                onClick={() =>
                                  handleApproveUser(user._id, user.isVerified)
                                }
                              >
                                  {user.isVerified ? (
                                    <IconUserX size={18} className="text-red" />
                                  ) : (
                                    <IconUserCheck  className="text-green" size={18}/>
                                  )}
                              </button>
                              <button
                                className="btn btn-ghost-danger btn-icon"
                                onClick={() => deleteUser(user._id)}
                                disabled={deletingIds.has(user._id)}
                              >
                                <IconTrash size={18} className="text-red"/>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-secondary">
                        Aucun utilisateur trouvé.
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
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                </span>{" "}
                sur <span>{filteredUsers.length}</span> entrées
              </p>
              <ul className="pagination  d-flex gap-3  m-0 ms-auto">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
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
                 <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="modal modal-blur fade show d-block">
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter un nouvel utilisateur</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleAddUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Email<span className="text-red fs-2">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Adresse e-mail"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                    <span className="text-danger">{error}</span>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Prénom<span className="text-red fs-2">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Prénom"
                      value={newUser.prenom}
                      onChange={(e) =>
                        setNewUser({ ...newUser, prenom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nom<span className="text-red fs-2">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom"
                      value={newUser.nom}
                      onChange={(e) =>
                        setNewUser({ ...newUser, nom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rôle<span className="text-red fs-2">*</span></label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, AdminRoles: e.target.value })
                      }
                    >
                      <option value="">Sélectionner un rôle</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mot de passe<span className="text-red fs-2">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mot de passe"
                      value={newUser.mot_de_passe}
                      onChange={(e) =>
                        setNewUser({ ...newUser, mot_de_passe: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <a
                    type="button"
                    className="btn text-white"
                    style={{ backgroundColor: "#8EBE21" }}
                    href="/Dashboard/Admin/Roles-management"
                  >
                    Créer un rôle
                  </a>
                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#263589" }}
                    disabled={isSubmitting}
                  >
                    Créer un utilisateur
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setIsModalOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Page;
