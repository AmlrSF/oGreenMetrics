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
  const [userAccess, setUserAccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [RoleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const itemsPerPage = 5;
  const [deletingIds, setDeletingIds] = useState(new Set());

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  useEffect(() => {
    checkAuth();
    fetchUsers();
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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/users");
      let data = await response.json();

      data = data.filter(
        (item) => item?.role == "entreprise" || item?.role == "régulier"
      );

      setUsers(data);

      setFilteredUsers(data);
    } catch (error) {
      setError("Failed to load users");
    }
    setLoading(false);
  };

  const handleApproveUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVerified: !selectedUser.isVerified,
          }),
        }
      );
      await response.json();
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      setError("Failed to update user status");
    }
  };

  const handleDeleteUser = async () => {
    if (deletingIds.has(selectedUser._id)) return;

    setDeletingIds((prev) => new Set([...prev, selectedUser._id]));

    try {
      const response = await fetch(
        `http://localhost:4000/users/${selectedUser._id}`,
        {
          method: "DELETE",
        }
      );
      await response.json();
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      setError("Failed to delete user");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedUser._id);
        return newSet;
      });
    }
  };

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setModalOpen(true);
  };

  useEffect(() => {
    let result = [...users];

    if (currentFilter === "verified") {
      result = result.filter((user) => user.isVerified);
    } else if (currentFilter === "unverified") {
      result = result.filter((user) => !user.isVerified);
    }

    if (RoleFilter === "régulier") {
      result = result.filter((user) => user.role === "régulier");
    } else if (RoleFilter === "Entreprise") {
      result = result.filter((user) => user.role === "entreprise");
    }

    if (sortOrder === "latest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first
    }

    setFilteredUsers(result);
  }, [currentFilter, RoleFilter, sortOrder, users]);

  return (
    <div className="container-xl  h-full">
      {modalOpen && selectedUser && (
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
                    {modalType === "approve"
                      ? selectedUser.isVerified
                        ? "Voulez-vous désapprouver cet utilisateur ?"
                        : "Voulez-vous approuver cet utilisateur ?"
                      : "Voulez-vous supprimer cet utilisateur ?"}
                  </div>
                  <div className="text-muted mt-2">
                    <strong>
                      {selectedUser.prenom} {selectedUser.nom}
                    </strong>
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
                        className={`btn w-100 ${
                          modalType === "approve"
                            ? selectedUser.isVerified
                              ? "btn-danger"
                              : "btn-success"
                            : "btn-danger"
                        }`}
                        onClick={
                          modalType === "approve"
                            ? handleApproveUser
                            : handleDeleteUser
                        }
                        disabled={deletingIds.has(selectedUser._id)}
                      >
                        {modalType === "approve"
                          ? selectedUser.isVerified
                            ? "Désapprouver"
                            : "Approuver"
                          : "Supprimer"}
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

      <div className="py-4  d-flex flex-column justify-content-center
       align-items-start ">
        <h3
          className="mb-1 fw-bold"
          style={{ fontSize: "30px", color: "#263589" }}
        >
          Administration des utilisateurs
        </h3>
        <div className="card-subtitle">
          Gérez les utilisateurs, les rôles et les permissions efficacement.
        </div>
      </div>

      <div className="card">
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
                  value={RoleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Tous les rôles</option>
                  <option value="régulier">Régulier</option>
                  <option value="Entreprise">Entreprise</option>
                </select>

                <select
                  className="form-select form-select-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="latest">Les plus récents</option>
                  <option value="oldest">Les plus anciens</option>
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
                  {filteredUsers.length > 0 ? (
                    filteredUsers
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((user, index) => (
                        <tr key={user.id || index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span
                                className="avatar avatar-md text-white me-2"
                                style={{ backgroundColor: "#263589" }}
                              >
                                {user.photo_de_profil ? (
                                  <img
                                    className="w-full h-full rounded-sm object-fit-cover"
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
                              {user.role === "entreprise"
                                ? "Enterprise"
                                : "Regular"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                user.isVerified
                                  ? "bg-success-lt"
                                  : "bg-danger-lt"
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
                              <div className=" d-flex gap-2 align-items-center justify-content-center ">
                                <button
                                  onClick={() => openModal("approve", user)}
                                  className={`btn btn-ghost-${
                                    user.isVerified ? "danger" : "success"
                                  } btn-icon`}
                                >
                                  {user.isVerified ? (
                                    <IconUserX size={18}  />
                                  ) : (
                                    <IconUserCheck   size={18}/>
                                  )}
                                </button>
                                <button
                                  onClick={() => openModal("delete", user)}
                                  className="btn btn-ghost-danger btn-icon"
                                  
                                >
                                  
                                 <IconTrash  size={18} />
                                  
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-secondary">
                        No users found.
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