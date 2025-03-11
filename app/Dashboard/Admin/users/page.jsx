"use client";

import React, { useState, useEffect } from "react";
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";

import { formatDate, getInitials } from "@/lib/Utils";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
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
    <div className="container">
      <header
        className="d-flex justify-content-between flex-column align-items-start
       mb-8 pb-5 border-bottom"
      >
        <h1 className="h2 mb-0 font-weight-semibold text-gray-800">
          User Administration
        </h1>
        <p className="text-muted small">
          Manage users, roles, and permissions efficiently.
        </p>
      </header>

      <div className="d-flex justify-content-between align-items-center mb-6">
        <div>
          <select
            className="form-select"
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-light">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: "40px", height: "40px" }}>
                          {user.photo_de_profil ? (
                            <img
                              src={user.photo_de_profil}
                              alt={`${user.prenom} ${user.nom}`}
                              className="rounded-circle w-100 h-100"
                            />
                          ) : (
                            getInitials(user.prenom, user.nom)
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="font-weight-medium">
                            {user.prenom} {user.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role === "entreprise" ? "Enterprise" : "Regular"}</td>
                    <td>
                      <span
                        className={`badge text-white  ${
                          user.isVerified ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="d-flex">
                        <button
                          onClick={() =>
                            handleApproveUser(user._id, user.isVerified)
                          }
                          className={`btn btn-sm ${
                            user.isVerified
                              ? "btn-outline-danger"
                              : "btn-outline-success"
                          }`}
                          title={
                            user.isVerified ? "Revoke Verification" : "Approve User"
                          }
                        >
                          {user.isVerified ? (
                            <IconUserX size={18} />
                          ) : (
                            <IconUserCheck size={18} />
                          )}
                        </button>

                        <button className="btn btn-sm btn-outline-danger ml-2">
                          <IconTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
