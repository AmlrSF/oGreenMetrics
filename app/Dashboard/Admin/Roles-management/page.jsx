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
            Role Administration
          </h3>
          <div className="text-gray-600">Manage user roles efficiently.</div>
        </div>
        <button
          className="btn btn-success flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} className="mr-2" /> Add Role
        </button>
      </div>
      <div className="card pt-5">
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Role</th>
                {userAccess == "10" ? <></> : <th className="w-1"> Action </th>}
              </tr>
            </thead>
            <tbody>
              {roles?.length > 0 ? (
                roles.map((role, index) => (
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
        <div className="card-footer flex justify-between">
          <p className="text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, roles?.length)} of{" "}
            {roles?.length} entries
          </p>
          <div className="flex space-x-2">
            <button
              className={`btn ${currentPage === 1 ? "opacity-50" : ""}`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft />
            </button>
            <span className="px-4 py-2 bg-[#263589] text-white rounded">
              {currentPage}
            </span>
            <button
              className={`btn ${
                currentPage === totalPages ? "opacity-50" : ""
              }`}
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              <ChevronRight />
            </button>
          </div>
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
                <h5 className="modal-title">Add New Role</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleAddRole}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Role name"
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
                      placeholder="Role description"
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
                      {/* User Management */}
                      <div className="mb-2">
                        <strong className="text-secondary">
                          User Management
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
                          <label className="form-check-label">Read</label>
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
                          <label className="form-check-label">Write</label>
                        </div>
                      </div>

                      {/* Role Management */}
                      <div className="mb-2">
                        <strong className="text-secondary">
                          Role Management
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
                          <label className="form-check-label">Read</label>
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
                          <label className="form-check-label">Write</label>
                        </div>
                      </div>

                      {/* Company Management */}
                      <div className="mb-2">
                        <strong className="text-secondary">
                          Company Management
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
                          <label className="form-check-label">Read</label>
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
                          <label className="form-check-label">Write</label>
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#263589" }}
                  >
                    {loading ? "Creating..." : "Create Role"}
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
