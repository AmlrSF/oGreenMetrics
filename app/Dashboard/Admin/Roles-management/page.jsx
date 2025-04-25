"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";

const Page = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAccess, setUserAccess] = useState("");
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    userManagement: "00",
    roleManagement: "00",
    companyManagement: "00",
  });

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
    }
  };

  const deleterole = async (role) => {
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
    }
  };

  return (
    <div className="container-xl h-full">
      <div className="py-10 mb-5 border-b flex justify-between items-center">
        <div className="flex flex-col justify-start">
          <h3 className="text-[30px] font-bold text-[#263589]">
            Administration des rôles
          </h3>
          <div className="text-gray-600">
            Gérez les rôles des utilisateurs efficacement.
          </div>
        </div>

        {userAccess == "10" ? (
          <></>
        ) : (
          <button
            className="btn btn-success flex items-center"
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: "#8EBE21" }}
          >
            <Plus size={18} className="mr-2" /> Add Role
          </button>
        )}
      </div>
      <div className="card pt-5">
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
                      <td>{role.description}</td>
                      <td className="gap-2 flex justify-start items-center">
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
                          >
                            <Trash2 size={18} />
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

          <ul className="pagination m-0 ms-auto">
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
                    <label className="form-label">Nom du rôle</label>
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
                    <label className="form-label">Description</label>
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
                    <label className="form-label">Permissions</label>
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
