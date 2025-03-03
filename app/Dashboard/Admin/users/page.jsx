'use client';

import React, { useState, useEffect } from 'react';
import { 
  IconEdit, 
  IconTrash, 
  IconCheck, 
  IconX,  
} from '@tabler/icons-react';

const page = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:4000/users');
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); 
      } catch (error) {
        setError('Failed to load users');
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
 
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
 
  useEffect(() => {
    let result = users;
    
    if (currentFilter === 'verified') {
      result = users.filter((user) => user.isVerified);
    } else if (currentFilter === 'unverified') {
      result = users.filter((user) => !user.isVerified);
    }
    
    setFilteredUsers(result);
  }, [currentFilter, users]);

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">User Administration</h1>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div>
          <select 
            className="border border-gray-300 px-4 py-2 rounded-md" 
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
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user,index) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role === 'entreprise' ? 'Enterprise' : 'Regular'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isVerified ? (
                            <IconCheck size={14} className="mr-1" />
                          ) : (
                            <IconX size={14} className="mr-1" />
                          )}
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <IconEdit size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <IconTrash size={18} />
                          </button>
                        </div>
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

    
    </div>
  );
};

export default page;
