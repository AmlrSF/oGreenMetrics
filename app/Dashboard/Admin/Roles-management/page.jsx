"use client";

import { IconTrash } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAccess, setUserAccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    userManagement: "00",
    roleManagement: "00",
    companyManagement: "00",
  });

  const [deletingIds, setDeletingIds] = useState(new Set());
  const [expandedRoleId, setExpandedRoleId] = useState(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(roles?.length / itemsPerPage);

  useEffect(() => {
    fetchRoles();
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

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/roles");
      const data = await response.json();
      console.log(data);
      setRoles(data?.data);
    } catch (error) {
      setError("Failed to load roles");
    }
    setLoading(false);
  };

  const handlePermissionChange = (permissionName, type) => {
    setNewRole((prevRole) => {
      const current = prevRole[permissionName] || "00";

      let bits = current.split("");

      if (type === "read") {
        bits[0] = bits[0] === "1" ? "0" : "1";

        if (bits[0] === "0") {
          bits[1] = "0";
        }
      } else if (type === "write") {
        bits[1] = bits[1] === "1" ? "0" : "1";
        if (bits[1] === "1") {
          bits[0] = "1";
        }
      }
      return {
        ...prevRole,
        [permissionName]: bits.join(""),
      };
    });
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);
    try {
      console.log(newRole);
      const response = await fetch("http://localhost:4000/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error("Failed to create role");
      fetchRoles();
      setIsModalOpen(false);
      setNewRole({
        name: "",
        description: "",
        userManagement: "00",
        roleManagement: "00",
        companyManagement: "00",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const deleterole = async (role) => {
    if (deletingIds.has(role._id)) return;

    setDeletingIds((prev) => new Set([...prev, role._id]));

    try {
      const response = await fetch(`http://localhost:4000/roles/${role._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete role");

      const data = await response.json();
      console.log("✅ Role deleted:", data);
      fetchRoles();
    } catch (error) {
      console.error("❌ Error deleting role:", error);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(role._id);
        return newSet;
      });
    }
  };

  return (
    <div className="container-xl h-full">
      <div
        className="py-4  d-flex d-flex justify-content-between
       align-items-center"
      >
        <div className="d-flex flex-column justify-content-start">
          <h3
            className="fw-bold mb-1"
            style={{ fontSize: "30px", color: "#263589" }}
          >
            Administration des rôles
          </h3>
          <div className="text-muted">
            Gérez les rôles des utilisateurs efficacement.
          </div>
        </div>

        {userAccess == "10" ? (
          <></>
        ) : (
          <button
            className="btn btn-primary"
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
            </svg>{" "}
            Add Role
          </button>
        )}
      </div>
      <div className="card ">
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead>
              <tr>
                <th>Nom du rôle</th>
                <th>Description</th>
                <th>Rôle</th>
                {userAccess == "10" ? <></> : <th className="w-1"> Action </th>}
              </tr>
            </thead>
            <tbody>
              {roles?.length > 0 ? (
                roles
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((role, index) => (
                    <tr key={role._id || index}>
                      <td>{role.name}</td>
                      <td>
                        {role.description.length > 30 ? (
                          <>
                            {expandedRoleId === role._id
                              ? role.description
                              : `${role.description.slice(0, 30)}... `}
                            <button
                              className="btn btn-link p-0"
                              onClick={() =>
                                setExpandedRoleId(
                                  expandedRoleId === role._id ? null : role._id
                                )
                              }
                            >
                              {expandedRoleId === role._id
                                ? "Read less"
                                : "Read more"}
                            </button>
                          </>
                        ) : (
                          role.description
                        )}
                      </td>
                      <td className="gap-2 d-flex justify-content-start align-items-center">
                        <div>
                          {role.userManagement != "00"
                            ? role.userManagement && (
                                <div>
                                  <p className="badge bg-purple-lt">
                                    User Management
                                  </p>
                                  <div className="d-flex items-center gap-2">
                                    {role.userManagement == "10" ? (
                                      <>
                                        <span className="badge bg-orange-lt">
                                          Read
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="badge bg-orange-lt">
                                          Read
                                        </span>
                                        <span className="badge bg-orange-lt">
                                          Write
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )
                            : ""}
                        </div>
                        <div>
                          {role.roleManagement != "00"
                            ? role.roleManagement && (
                                <div>
                                  <p className="badge bg-purple-lt">
                                    Role Management
                                  </p>
                                  <div className="d-flex items-center gap-2">
                                    {role.roleManagement == "10" ? (
                                      <>
                                        <span className="badge bg-orange-lt">
                                          Read
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="badge bg-orange-lt">
                                          Read
                                        </span>
                                        <span className="badge bg-orange-lt">
                                          Write
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )
                            : ""}
                        </div>
                        <div>
                          {role.companyManagement != "00"
                            ? role.companyManagement && (
                                <div>
                                  <p className="badge bg-purple-lt">
                                    Company Management
                                  </p>
                                  <div className="d-flex items-center gap-2">
                                    {role.companyManagement == "10" ? (
                                      <>
                                        <span className="badge bg-orange-lt">
                                          Read
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="badge bg-orange-lt">
                                          Read
                                        </span>
                                        <span className="badge bg-orange-lt">
                                          Write
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )
                            : ""}
                        </div>
                      </td>
                      {userAccess == "10" ? (
                        <></>
                      ) : (
                        <td>
                          <button
                            className="btn btn-ghost-danger btn-icon"
                            onClick={() => deleterole(role)}
                            disabled={deletingIds.has(role._id)}
                          >
                            {deletingIds.has(role._id) ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <IconTrash size={18} />
                            )}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500">
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card-footer d-flex align-items-center">
          <p className="m-0 text-secondary">
            Affichage de <span>{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
            <span>{Math.min(currentPage * itemsPerPage, roles.length)}</span>{" "}
            sur <span>{roles.length}</span> entrées
          </p>

          <ul className="pagination d-flex gap-3 m-0 ms-auto">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
      </div>

      {isModalOpen && (
        <div className="modal modal-blur fade show d-block">
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter un nouveau rôle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleAddRole}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Nom du rôle <span className="text-red fs-2">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom du rôle"
                      value={newRole.name}
                      onChange={(e) =>
                        setNewRole({ ...newRole, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Description<span className="text-red fs-2">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Description du rôle"
                      value={newRole.description}
                      onChange={(e) =>
                        setNewRole({ ...newRole, description: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Permissions<span className="text-red fs-2">*</span>
                    </label>
                    <div className="border p-3 rounded">
                      {/* Gestion des utilisateurs */}
                      <div className="mb-2">
                        <strong className="text-secondary">
                          Gestion des utilisateurs
                        </strong>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={newRole.userManagement[0] === "1"}
                            onChange={() =>
                              handlePermissionChange("userManagement", "read")
                            }
                          />
                          <label className="form-check-label">Lecture</label>
                        </div>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={newRole.userManagement[1] === "1"}
                            onChange={() =>
                              handlePermissionChange("userManagement", "write")
                            }
                          />
                          <label className="form-check-label">Écriture</label>
                        </div>
                      </div>

                      {/* Gestion des rôles */}
                      <div className="mb-2">
                        <strong className="text-secondary">
                          Gestion des rôles
                        </strong>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={newRole.roleManagement[0] === "1"}
                            onChange={() =>
                              handlePermissionChange("roleManagement", "read")
                            }
                          />
                          <label className="form-check-label">Lecture</label>
                        </div>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={newRole.roleManagement[1] === "1"}
                            onChange={() =>
                              handlePermissionChange("roleManagement", "write")
                            }
                          />
                          <label className="form-check-label">Écriture</label>
                        </div>
                      </div>

                      {/* Gestion des entreprises */}
                      <div className="mb-2">
                        <strong className="text-secondary">
                          Gestion des entreprises
                        </strong>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={newRole.companyManagement[0] === "1"}
                            onChange={() =>
                              handlePermissionChange(
                                "companyManagement",
                                "read"
                              )
                            }
                          />
                          <label className="form-check-label">Lecture</label>
                        </div>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={newRole.companyManagement[1] === "1"}
                            onChange={() =>
                              handlePermissionChange(
                                "companyManagement",
                                "write"
                              )
                            }
                          />
                          <label className="form-check-label">Écriture</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#263589" }}
                    disabled={isSubmitting}
                  >
                    {loading ? "Création en cours..." : "Créer le rôle"}
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
