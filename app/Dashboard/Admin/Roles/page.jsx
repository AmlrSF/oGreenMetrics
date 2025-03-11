"use client";

import React, { useState, useEffect } from "react";
import { formatDate, getInitials } from "@/lib/Utils";
import {
  IconTrash,
  IconCheck,
  IconX,
  IconSearch,
  IconX as IconClose,
  IconMailShare,
} from "@tabler/icons-react";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    prenom: "",
    nom: "",
    mot_de_passe: "",
    role: "Moderator",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/users");
      let data = await response.json();
      console.log(data);

      data = data.filter((item) => item?.role === "Moderator");
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setError("Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => {
    let result = users;
    if (currentFilter === "Moderator") {
      result = result.filter((user) => user.role === "Moderator");
    }
    if (searchTerm) {
      result = result.filter((user) => {
        const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
        const email = user.email.toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || email.includes(search);
      });
    }
    setFilteredUsers(result);
  }, [currentFilter, users, searchTerm]);

  const handleAddUsers = () => {
    setIsModalOpen(true);
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      console.log("User deleted successfully");

      fetchUsers();
    } catch (error) {
      console.error(error);
      setError("Failed to delete user");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    console.log(newUser);

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        await inviteUser(newUser);
        fetchUsers();
        setIsModalOpen(false);
        setNewUser({
          email: "",
          prenom: "",
          nom: "",
          mot_de_passe: "",
          role: "Moderator",
        });
      }
    } catch (error) {
      console.error("Failed to create user");
    }
  };

  const inviteUser = async (user) => {
    try {
      const response = await fetch(`http://localhost:4000/InviteUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to invite user");
      }

      console.log("User invited successfully");
    } catch (error) {
      console.error(error);
      setError("Failed to invite user");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
        <div className="mb-0">
          <h1 className="text-2xl mb-0 font-semibold text-gray-800">Roles</h1>
          <p className="text-gray-600 text-sm mb-0">
            Manage users, roles, and permissions efficiently.
          </p>
        </div>
        <button
          onClick={handleAddUsers}
          className="p-2 text-[16px] rounded-lg text-white font-medium hover:bg-primary-clr btn-primary"
        >
          Add Users
        </button>
      </header>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="w-full sm:w-auto border border-gray-300 px-4 py-2 rounded-md"
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="Moderator">Moderators</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="table-responsive  rounded-lg shadow overflow-hidden">
          <table className="table table-striped table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">User</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center text-dark fw-bold me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {user.photo_de_profil ? (
                            <img
                              src={user.photo_de_profil}
                              alt={`${user.prenom} ${user.nom}`}
                              className="rounded-circle"
                              style={{ width: "40px", height: "40px" }}
                            />
                          ) : (
                            getInitials(user.prenom, user.nom)
                          )}
                        </div>
                        <span className="fw-medium">
                          {user.prenom} {user.nom}
                        </span>
                      </div>
                    </td>
                    <td >{user.email}</td>
                    <td >
                      <span
                        className={`badge text-white ${
                          user.isVerified ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {user.isVerified ? (
                          <>
                             Verified
                          </>
                        ) : (
                          <>
                            Unverified
                          </>
                        )}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td >
                      <IconTrash
                        size={25}
                        className="cursor-pointer text-danger"
                        onClick={() => deleteUser(user._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          
          {isModalOpen && (
            <div className="modal d-block">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create New User</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setIsModalOpen(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleCreateUser}>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newUser.prenom}
                          onChange={(e) =>
                            setNewUser({ ...newUser, prenom: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newUser.nom}
                          onChange={(e) =>
                            setNewUser({ ...newUser, nom: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newUser.mot_de_passe}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              mot_de_passe: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Create User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
