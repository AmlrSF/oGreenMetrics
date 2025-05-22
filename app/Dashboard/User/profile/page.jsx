"use client";
import React, { useState, useEffect } from 'react';
import { 
  IconCamera, 
  IconTrash, 
  IconMail, 
  IconKey, 
  IconBuilding, 
  IconEdit, 
  IconPhone, 
  IconCalendar, 
  IconChartLine,
  IconMap, 
  IconHome 
} from '@tabler/icons-react';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    personal: {
      prenom: '',
      nom: '',
      email: '',
      photo_de_profil: ''
    },
    company: {
      nom_entreprise: '',
      matricule_fiscale: '',
      email: '',
      num_tel: '',
      adresse: '',
      date_fondation: '',
      industrie: '',
      country: ''
    },
    password: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  const [originalData, setOriginalData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const industries = ["Agriculture", "Automobile", "Banking"]; 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const UserResponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const UserData = await UserResponse.json();
        console.log('User Data:', UserData);

        if (UserData?.user) {
          setUser(UserData.user);
          const personalData = {
            prenom: UserData.user.prenom || '',
            nom: UserData.user.nom || '',
            email: UserData.user.email || '',
            photo_de_profil: UserData.user.photo_de_profil || ''
          };

          const CompanyResponse = await fetch(
            `http://localhost:4000/GetCompanyByOwnerID/${UserData?.user?._id}`,
            { method: "GET" }
          );
          const CompanyData = await CompanyResponse.json();
          console.log('Company Data:', CompanyData);

          let companyData = {
            nom_entreprise: '',
            matricule_fiscale: '',
            email: '',
            num_tel: '',
            adresse: '',
            date_fondation: '',
            industrie: '',
            country: ''
          };

          if (CompanyData?.success && CompanyData.data) {
            setCompany(CompanyData.data);
            const dateObject = new Date(CompanyData.data.date_fondation);
            const formattedDate = dateObject.toISOString().split('T')[0];
            
            companyData = {
              nom_entreprise: CompanyData.data.nom_entreprise || '',
              matricule_fiscale: CompanyData.data.matricule_fiscale || '',
              email: CompanyData.data.email || '',
              num_tel: CompanyData.data.num_tel || '',
              adresse: CompanyData.data.adresse || '',
              date_fondation: formattedDate || '',
              industrie: CompanyData.data.industrie || '',
              country: CompanyData.data.country || ''
            };
            console.log('Fetched country:', CompanyData.data.country);
          }

          setFormData({
            personal: personalData,
            company: companyData,
            password: {
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }
          });

          setOriginalData({
            personal: personalData,
            company: companyData,
            password: { currentPassword: '', newPassword: '', confirmPassword: '' }
          });
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };    
    fetchUser();
  }, []);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      company: { ...prev.company, [name]: value }
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      password: { ...prev.password, [name]: value }
    }));
    setPasswordError('');
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const { currentPassword, newPassword, confirmPassword } = formData.password;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const passwordResponse = await fetch(`http://localhost:4000/users/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          currentPassword,
          newPassword
        })
      });

      const responseData = await passwordResponse.json();

      if (!passwordResponse.ok) {
        throw new Error(responseData.message || 'Failed to update password');
      }

      setFormData(prev => ({
        ...prev,
        password: { currentPassword: '', newPassword: '', confirmPassword: '' }
      }));
      setShowPasswordModal(false);
      alert('Password updated successfully!');
    } catch (error) {
      setPasswordError(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const personalResponse = await fetch(`http://localhost:4000/users/${user?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData.personal)
      });

      if (!personalResponse.ok) {
        const errorData = await personalResponse.json();
        throw new Error(errorData.message || 'Failed to update personal information');
      }
      
      const updatedUserData = await personalResponse.json();
      setUser(updatedUserData);

      if (company) {
        const companyResponse = await fetch(`http://localhost:4000/updatecompany/${company._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData.company)
        });
        
        if (!companyResponse.ok) {
          const errorData = await companyResponse.json();
          throw new Error(errorData.message || 'Failed to update company information');
        }
        
        const updatedCompanyData = await companyResponse.json();
        setCompany(updatedCompanyData.data);
      }
      
      setOriginalData({
        ...formData,
        password: { currentPassword: '', newPassword: '', confirmPassword: '' }
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          personal: { ...prev.personal, photo_de_profil: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
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
      <form onSubmit={handleSubmit}> 
        <div className="card mb-4">
          <div className="card-body">
            <div className="hr-text mb-4">Informations personnelles</div>
            <div className="row align-items-center mb-4">
              <div className="col-auto">
                {formData.personal.photo_de_profil ? (
                  <img src={formData.personal.photo_de_profil} alt="Profile" className="avatar avatar-xl rounded-circle" />
                ) : (
                  <span className="avatar avatar-xl rounded-circle bg-blue-lt">
                    {formData.personal.prenom?.charAt(0) || ''}{formData.personal.nom?.charAt(0) || ''}
                  </span>
                )}
              </div>
              <div className="col">
                <div className="btn-list">
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleUploadClick}>
                    <IconCamera size={20} />
                    Modifier votre avatar 
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-danger btn-sm" 
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, photo_de_profil: '' }
                      }));
                    }}
                  >
                    <IconTrash size={20} />
                    Supprimer votre avatar
                  </button>
                </div>
                <input 
                  type="file" 
                  id="fileInput" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange} 
                />
              </div>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Nom</label>
                <input 
                  type="text" className="form-control" name="nom" value={formData.personal.nom} onChange={handlePersonalChange} required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prénom</label>
                <input 
                  type="text" className="form-control" name="prenom" value={formData.personal.prenom} onChange={handlePersonalChange} required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <div className="row g-2">
                <div className="col-md-8">
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconMail size={20} />
                    </span>
                    <input 
                      type="email" className="form-control" name="email" value={formData.personal.email} onChange={handlePersonalChange} required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <button 
                type="button" 
                className="btn btn-outline-danger mt-2" 
                onClick={() => setShowPasswordModal(true)}
              >
                <IconKey size={20} />
                Réinitialiser votre mot de passe
              </button>
              <small className="form-hint d-block mt-1">Mettez à jour le mot de passe de votre compte.</small>
            </div>
          </div>
        </div>

        {company && (
          <div className="card mb-4">
            <div className="card-body">
              <div className="hr-text mb-4">Informations sur l'entreprise</div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nom d'entreprise</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconBuilding size={20} />
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="nom_entreprise"
                      value={formData.company.nom_entreprise}
                      onChange={handleCompanyChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Matricule fiscale</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconEdit size={20} />
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="matricule_fiscale"
                      value={formData.company.matricule_fiscale}
                      onChange={handleCompanyChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email de l'entreprise</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconMail size={20} />
                    </span>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={formData.company.email}
                      onChange={handleCompanyChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Numéro de téléphone</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconPhone size={20} />
                    </span>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="num_tel"
                      value={formData.company.num_tel}
                      onChange={handleCompanyChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date de fondation</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconCalendar size={20} />
                    </span>
                    <input 
                      type="date" 
                      className="form-control" 
                      name="date_fondation"
                      value={formData.company.date_fondation}
                      onChange={handleCompanyChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Industrie</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconChartLine size={20} />
                    </span>
                    <select 
                      className="form-select" 
                      name="industrie"
                      value={formData.company.industrie}
                      onChange={handleCompanyChange}
                      required
                      disabled
                    >
                      <option value="">Select an industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Pays</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconMap size={20} />
                    </span>
                    <select 
                      className="form-select" 
                      name="country"
                      value={formData.company.country || ''}
                      onChange={handleCompanyChange}
                      disabled
                    > 
                      <option value={formData.company.country}>{formData.company.country}</option>
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Adresse</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <IconHome size={20} />
                    </span>
                    <input 
                      type="text" 
                      className="form-control mb-2" 
                      name="adresse"
                      value={formData.company.adresse}
                      onChange={handleCompanyChange}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-footer bg-transparent mt-auto">
              <div className="btn-list justify-content-end">
                <button 
                  type="button" 
                  className="btn" 
                  onClick={handleCancel}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      <div className={`modal fade ${showPasswordModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showPasswordModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reset Password</h5>
              <button type="button" className="btn-close" onClick={() => {
                setShowPasswordModal(false);
                setPasswordError('');
                setFormData(prev => ({
                  ...prev,
                  password: { currentPassword: '', newPassword: '', confirmPassword: '' }
                }));
              }}></button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                {passwordError && (
                  <div className="alert alert-danger" role="alert">
                    {passwordError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Mot de passe actuel</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="currentPassword" 
                    value={formData.password.currentPassword} 
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="newPassword" 
                    value={formData.password.newPassword} 
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmer le nouveau mot de passe</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="confirmPassword" 
                    value={formData.password.confirmPassword} 
                    onChange={handlePasswordChange}
                    required
                  />
                  {formData.password.newPassword !== formData.password.confirmPassword && formData.password.confirmPassword && (
                    <div className="text-danger mt-1">Passwords do not match</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setFormData(prev => ({
                      ...prev,
                      password: { currentPassword: '', newPassword: '', confirmPassword: '' }
                    }));
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;