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
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/users");
      let data = await response.json();
      data = data.filter((item) => item?.role === "Moderator");
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
    try {
      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      setError("Failed to delete user");
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

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  return (
    <div className="container-xl h-full">
      <div className="py-10 mb-5 d-flex justify-content-between border-b align-items-center">
        <div className=" d-flex leading-[0.1]  flex-column
         justify-content-center align-items-start">
          <h3 className="text-[30px] font-bold" style={{ color: "#263589" }}>
            Roles Administration
          </h3>
          <div className="card-subtitle">
            Manage  roles, and permissions efficiently.
          </div>
        </div>
        <button className="btn  bg-[#263589]">
          Add User
        </button>
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
                          <span className="badge bg-purple-lt">Moderator</span>
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
                              className={`btn btn-ghost-${
                                user.isVerified ? "danger" : "success"
                              } btn-icon`}
                              onClick={() =>
                                handleApproveUser(user._id, user.isVerified)
                              }
                            >
                              {user.isVerified ? (
                                <UserX size={18} />
                              ) : (
                                <UserCheck size={18} />
                              )}
                            </button>
                            <button
                              className="btn btn-ghost-danger btn-icon"
                              onClick={() => deleteUser(user._id)}
                            >
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
                    <ChevronLeft className="icon" />
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
                    <ChevronRight className="icon" />
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
