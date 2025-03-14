"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";

import { formatDate, getInitials } from "@/lib/Utils";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

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

      const reponse = await response.json();
      console.log(reponse);
      fetchUsers();
    } catch (error) {
      setError("Failed to update user status");
    }
  };

  useEffect(() => {
    let result = users;

    if (currentFilter === "verified") {
      result = users.filter((user) => user.isVerified);
    } else if (currentFilter === "unverified") {
      result = users.filter((user) => !user.isVerified);
    }

    setFilteredUsers(result);
  }, [currentFilter, users]);

  return (
    <div className="container-xl  h-full">
      <div className="py-10  mb-5 d-flex leading-[0.1] border-b flex-column justify-content-center align-items-start">
        <h3 className=" text-[30px] font-bold" style={{ color: "#263589" }}>
          User Administration
        </h3>
        <div className="card-subtitle">
          Manage users, roles, and permissions efficiently.
        </div>
      </div>
      <div className="card pt-5">
        <div className="card-body border-bottom py-3">
          <div className="d-flex">
            <div className="text-secondary">
              Show
              <div className="mx-2 d-inline-block">
                <select
                  className="form-select form-select-sm"
                  value={currentFilter}
                  onChange={(e) => setCurrentFilter(e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              entries
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
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th className="w-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id || index}>
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
                            {user.role === "entreprise"
                              ? "Enterprise"
                              : "Regular"}
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
                        <td>
                          <div className="btn-list flex-nowrap">
                            <button
                              onClick={() =>
                                handleApproveUser(user._id, user.isVerified)
                              }
                              className={`btn btn-ghost-${
                                user.isVerified ? "danger" : "success"
                              } btn-icon`}
                            >
                              {user.isVerified ? (
                                <UserX size={18} />
                              ) : (
                                <UserCheck size={18} />
                              )}
                            </button>
                            <button className="btn btn-ghost-danger btn-icon">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
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
                Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span>
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                </span>{" "}
                of <span>{filteredUsers.length}</span> entries
              </p>
              <ul className="pagination m-0 ms-auto">
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
