"use client"
import React, { useState, useEffect } from 'react';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    photo_de_profil: ''
  });
  const [companyForm, setCompanyForm] = useState({
    nom_entreprise: '',
    matricule_fiscale: '',
    email: '',
    num_tel: '',
    adresse: '',
    date_fondation: '',
    industrie: ''
  });
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
 
  const industries = [
    "Agriculture",
    "Automobile",
    "Banking",
  ];
 
  const locations = [
    "Tunis",
    "Kairouan",
    "Bizerte",
    "Monastir",
    "Ben Arous",
    "Mahdia", 
    "Kébili", 
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const UserResponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const UserData = await UserResponse.json();
        
        if (UserData?.user) {
          setUser(UserData.user);
          setPersonalForm({
            prenom: UserData.user.prenom || '',
            nom: UserData.user.nom || '',
            email: UserData.user.email || '',
            photo_de_profil: UserData.user.photo_de_profil || ''
          });

          const CompanyResponse = await fetch(
            `http://localhost:4000/GetCompanyByOwnerID/${UserData.user._id}`,
            {
              method: "GET",
            }
          );
          const CompanyData = await CompanyResponse.json();
          console.log("Company Data Response:", CompanyData); 

          if (CompanyData?.success && CompanyData.data) {
            setCompany(CompanyData.data);
             
            const dateObject = new Date(CompanyData.data.date_fondation);
            const formattedDate = dateObject.toISOString().split('T')[0];
            
            setCompanyForm({
              nom_entreprise: CompanyData.data.nom_entreprise || '',
              matricule_fiscale: CompanyData.data.matricule_fiscale || '',
              email: CompanyData.data.email || '',
              num_tel: CompanyData.data.num_tel || '',
              adresse: CompanyData.data.adresse || '',
              date_fondation: formattedDate || '',
              industrie: CompanyData.data.industrie || ''
            });
            
          }
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };    


    fetchUser();
  }, []);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updatePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(personalForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.data);
        setShowPersonalModal(false);
        alert('Personal information updated successfully!');
      } else {
        alert('Failed to update personal information');
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      alert('An error occurred while updating personal information');
    }
  };

  const updateCompanyInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/updatecompany/${company._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(companyForm)
      });
      
      if (response.ok) {
        const updatedCompany = await response.json();
        setCompany(updatedCompany.data);
        setShowCompanyModal(false);
        alert('Company information updated successfully!');
      } else {
        alert('Failed to update company information');
      }
    } catch (error) {
      console.error('Error updating company info:', error);
      alert('An error occurred while updating company information');
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    try { 
      const response = await fetch(`http://localhost:4000/users/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setPasswordModal(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Password updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update password: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred while updating password');
    }
  };

  if (loading) {
    return (
      <div className="container-xl py-4 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl py-4">
      {/* Personal Account Section */}
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title m-0">Personal Account</h2>
            <button className="btn btn-outline-primary btn-sm" onClick={() => setShowPersonalModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path> <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path> <path d="M16 5l3 3"></path>
              </svg>
              Edit
            </button>
          </div>
          <div className="hr-text mb-4">Profile Details</div>
          <div className="row align-items-center mb-4">
            <div className="col-auto">
              {user?.photo_de_profil ? (
                <img src={user.photo_de_profil} alt="Profile" className="avatar avatar-xl rounded-circle" />
              ) : (
                <span className="avatar avatar-xl rounded-circle bg-blue-lt">
                  {user?.prenom?.charAt(0) || ''}{user?.nom?.charAt(0) || ''}
                </span>
              )}
            </div>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label">Nom</label>
              <input type="text" className="form-control" value={user?.nom || ''} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label">Prénom</label>
              <input type="text" className="form-control" value={user?.prenom || ''} readOnly />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Email</label>
            <div className="row g-2">
              <div className="col-md-8">
                <div className="input-icon">
                  <span className="input-icon-addon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path> <path d="M3 7l9 6l9 -6"></path>
                    </svg>
                  </span>
                  <input type="email" className="form-control" value={user?.email || ''} readOnly />
                </div>
                <small className="form-hint text-muted">This contact will be shown to others publicly, so choose it carefully.</small>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Mot de passe</label>
            <button type="button" className="btn btn-outline-danger" onClick={() => setPasswordModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-key" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l6.558 -6.558l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z"></path> <path d="M15 9h.01"></path>
              </svg>
              Reset Password
            </button>
            <small className="form-hint d-block mt-1">You can set a permanent password if you don't want to use temporary login codes.</small>
          </div>

          {/* Company Account Section */}
          {  company && (
            <div className="card mt-5 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="card-title">Company Account</h3>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setShowCompanyModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path> <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path> <path d="M16 5l3 3"></path>
                    </svg>
                    Edit
                  </button>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nom d'entreprise</label>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M3 21l18 0"></path> <path d="M5 21v-14l8 -4v18"></path> <path d="M19 21v-10l-6 -4"></path> <path d="M9 9l0 .01"></path> <path d="M9 12l0 .01"></path> <path d="M9 15l0 .01"></path> <path d="M9 18l0 .01"></path>
                        </svg>
                      </span>
                      <input type="text" className="form-control" value={company?.nom_entreprise || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Matricule fiscale</label>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"></path> <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"></path> <path d="M16 5l3 3"></path>
                        </svg>
                      </span>
                      <input type="text" className="form-control" value={company?.matricule_fiscale || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path> <path d="M3 7l9 6l9 -6"></path>
                        </svg>
                      </span>
                      <input type="email" className="form-control" value={company?.email || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Numéro de téléphone</label>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
                        </svg>
                      </span>
                      <input type="tel" className="form-control" value={company?.num_tel || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date de fondation</label>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"></path> <path d="M16 3v4"></path> <path d="M8 3v4"></path> <path d="M4 11h16"></path> <path d="M11 15h1"></path> <path d="M12 15v3"></path>
                        </svg>
                      </span>
                      <input 
                        type="text" className="form-control" value={company?.date_fondation ? new Date(company.date_fondation).toLocaleDateString() : ''} readOnly 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Industrie</label>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M4 19l16 0"></path> <path d="M4 15l4 -6l4 2l4 -5l4 4l0 5l-16 0"></path>
                        </svg>
                      </span>
                      <input type="text" className="form-control" value={company?.industrie || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Adresse</label>
                    <textarea className="form-control" rows="3" value={company?.adresse || ''} readOnly></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personal Info Edit Modal */}
      {showPersonalModal && (
        <div className="modal modal-blur show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={updatePersonalInfo}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Personal Information</h5>
                  <button type="button" className="btn-close" onClick={() => setShowPersonalModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Prénom</label>
                    <input 
                      type="text" className="form-control" name="prenom" value={personalForm.prenom} onChange={handlePersonalChange} required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nom</label>
                    <input 
                      type="text" className="form-control" name="nom" value={personalForm.nom} onChange={handlePersonalChange} required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" className="form-control" name="email" value={personalForm.email} onChange={handlePersonalChange} required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Photo URL (optional)</label>
                    <input 
                      type="url" className="form-control" name="photo_de_profil" value={personalForm.photo_de_profil} onChange={handlePersonalChange} 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-link link-secondary" onClick={() => setShowPersonalModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary ms-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M5 12l5 5l10 -10" />
                    </svg>
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Company Info Edit Modal */}
      {showCompanyModal && (
        <div className="modal modal-blur show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={updateCompanyInfo}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Company Information</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCompanyModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nom d'entreprise</label>
                      <input 
                        type="text" className="form-control" name="nom_entreprise" value={companyForm.nom_entreprise} onChange={handleCompanyChange} required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Matricule fiscale</label>
                      <input 
                        type="text" className="form-control" name="matricule_fiscale" value={companyForm.matricule_fiscale} onChange={handleCompanyChange} required 
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" className="form-control" name="email" value={companyForm.email} onChange={handleCompanyChange} required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Numéro de téléphone</label>
                      <input 
                        type="tel" className="form-control" name="num_tel" value={companyForm.num_tel} onChange={handleCompanyChange} required 
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date de fondation</label>
                      <input 
                        type="date" className="form-control" name="date_fondation" value={companyForm.date_fondation} onChange={handleCompanyChange} required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Industrie</label>
                      <select 
                        className="form-select" name="industrie" value={companyForm.industrie} onChange={handleCompanyChange}required
                      >
                        <option value="">Select an industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Adresse</label>
                    <select 
                      className="form-select mb-2" name="adresse" value={companyForm.adresse} onChange={handleCompanyChange}required
                    >
                      <option value="">Select a location</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    <textarea 
                      className="form-control" name="adresse" value={companyForm.adresse} onChange={handleCompanyChange} rows="3" placeholder="Full address details"required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-link link-secondary" onClick={() => setShowCompanyModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary ms-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M5 12l5 5l10 -10" />
                    </svg>
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Password Change Modal */}
      {passwordModal && (
        <div className="modal modal-blur show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={updatePassword}>
                <div className="modal-header">
                  <h5 className="modal-title">Change Password</h5>
                  <button type="button" className="btn-close" onClick={() => setPasswordModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input 
                      type="password" className="form-control" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input 
                      type="password"  className="form-control"  name="newPassword"  value={passwordForm.newPassword}  onChange={handlePasswordChange}  required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password"  className="form-control"  name="confirmPassword"  value={passwordForm.confirmPassword}  onChange={handlePasswordChange}  required 
                    />
                    {passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword && (
                      <div className="text-danger mt-1">Passwords do not match</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-link link-secondary" onClick={() => setPasswordModal(false)}>
                    Cancel
                  </button>
                  <button 
                    type="submit" className="btn btn-primary ms-auto" disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} 
      {(showPersonalModal || showCompanyModal || passwordModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};
export default UserProfilePage;