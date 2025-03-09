'use client'

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
    email: '',
    prenom: '',
    nom: '',
    mot_de_passe: '',
    role: 'Moderator'
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
      

      if (response.ok) {
        await inviteUser(newUser);
        fetchUsers();
        setIsModalOpen(false);
        setNewUser({
          email: '',
          prenom: '',
          nom: '',
          mot_de_passe: '',
          role: 'Moderator'
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                            {user.photo_de_profil ? (
                              <img
                                src={user.photo_de_profil}
                                alt={`${user.prenom} ${user.nom}`}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              getInitials(user.prenom, user.nom)
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.prenom} {user.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {user.isVerified ? (
                            <IconCheck size={14} className="mr-1" />
                          ) : (
                            <IconX size={14} className="mr-1" />
                          )}
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-5 whitespace-nowrap
                       flex justify-center items-center gap-2
                      text-sm text-gray-500">
                        <IconTrash size={25} className="cursor-pointer text-red-600"
                         onClick={() => deleteUser(user._id)} />
                         {/* <IconMailShare size={25} className="cursor-pointer text-green-600"
                         onClick={() => inviteUser(user)} /> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IconClose size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newUser.prenom}
                  onChange={(e) => setNewUser({...newUser, prenom: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newUser.nom}
                  onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300
                   rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newUser.mot_de_passe}
                  onChange={(e) => setNewUser({...newUser, mot_de_passe: e.target.value})}
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;