"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("régulier");
  const [formData, setFormData] = useState({
    prenom: "", nom: "", email: "", mot_de_passe: "", confirmPassword: "", role: "régulier", nom_entreprise: "", matricule_fiscale: "", num_tel: "", adresse: "", date_fondation: "", industrie: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setFormData({ ...formData, role: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mot_de_passe !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
    }
    try {
        const userResponse = await fetch("http://localhost:4000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prenom: formData.prenom,
                nom: formData.nom,
                email: formData.email,
                mot_de_passe: formData.mot_de_passe,
                role: formData.role
            }),
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            setError(errorData.error || "Failed to register user");
            return;
        }

        const userData = await userResponse.json();

        if (accountType === "entreprise") {
            const companyResponse = await fetch("http://localhost:4000/registercompany", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom_entreprise: formData.nom_entreprise,
                    matricule_fiscale: formData.matricule_fiscale,
                    email: formData.email,
                    num_tel: formData.num_tel,
                    adresse: formData.adresse,
                    date_fondation: formData.date_fondation,
                    industrie: formData.industrie,
                    userId: userData.user._id
                }),
            });

            if (!companyResponse.ok) {
                const errorData = await companyResponse.json();
                setError(errorData.message || "Failed to register company");
                return;
            }
        }

        setSuccess(true);
        setError("");
        console.log("Registration successful", userData);
        setFormData({
            prenom: "", nom: "", email: "", mot_de_passe: "", confirmPassword: "",
            role: accountType, nom_entreprise: "", matricule_fiscale: "",
            num_tel: "", adresse: "", date_fondation: "", industrie: ""
        });
    } catch (err) {
        setError("Failed to connect to the server");
        console.error(err);
    }
};

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 position-relative overflow-hidden">
      <div className="position-absolute bottom-0 start-0 rounded-top-end bg-light opacity-50" style={{width: "16rem", height: "20rem"}}></div>
      <div className="position-absolute top-0 end-0 rounded-bottom-start bg-light opacity-50" style={{width: "16rem", height: "20rem"}}></div>
      
      <div className="card shadow p-4 p-lg-5 w-100 d-flex flex-row position-relative" style={{maxWidth: "1200px", zIndex: 10}}>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-4">
                  <div className="d-flex mb-4">
                               <Image
                                 src="/logo.png"
                                 width={150}
                                 height={150}
                                 alt="logo"
                                 style={{ width: "auto", height: "auto" }}
                               />
                             </div>
          </div>
          
          <h1 className="fs-5 fw-medium mb-2">Créez votre compte</h1>
          <p className="small text-muted mb-4">Inscrivez-vous pour accéder à nos outils et commencer à mesurer votre empreinte carbone en toute simplicité.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="d-flex gap-3 mb-4">
              <button 
                type="button" 
                className={`btn btn-outline-secondary d-flex align-items-center ${accountType === "régulier" ? "active" : ""}`} 
                onClick={() => handleAccountTypeChange("régulier")}
              > 
                Utilisateur Régulier
              </button>
              <button 
                type="button" 
                className={`btn btn-outline-secondary d-flex align-items-center ${accountType === "entreprise" ? "active" : ""}`} 
                onClick={() => handleAccountTypeChange("entreprise")}
              >
            
                Propriétaire d'Entreprise
              </button>
            </div>
            
            <div className="d-flex flex-column gap-4">
              <div className="flex-grow-1">
                <div className="mb-4">
                  <h2 className="d-flex align-items-center small fw-medium mb-3">
                    <div className="d-flex align-items-center justify-content-center text-white rounded-circle me-2 bg-success" style={{width: "1.25rem", height: "1.25rem", fontSize: "0.75rem"}}>1</div>
                    Informations personnelles
                  </h2>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Nom<span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="nom" 
                      value={formData.nom} 
                      onChange={handleChange} 
                      placeholder="Tapez votre nom" 
                      className="form-control" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Prénom<span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="prenom" 
                      value={formData.prenom} 
                      onChange={handleChange} 
                      placeholder="Tapez votre prénom" 
                      className="form-control" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Adresse e-mail<span className="text-danger">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="Tapez votre adresse email" 
                      className="form-control" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Mot de passe<span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="mot_de_passe" 
                        value={formData.mot_de_passe} 
                        onChange={handleChange} 
                        placeholder="Tapez votre mot de passe" 
                        className="form-control" 
                        required 
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Confirmez le mot de passe<span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        placeholder="Confirmez votre mot de passe" 
                        className="form-control" 
                        required 
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {accountType === "entreprise" && (
              <div className="flex-grow-1">
                <div className="mb-4">
                  <h2 className="d-flex align-items-center small fw-medium mb-3">
                    <div className="d-flex align-items-center justify-content-center text-white rounded-circle me-2 bg-success" style={{width: "1.25rem", height: "1.25rem", fontSize: "0.75rem"}}>2</div>
                    Informations sur l'entreprise
                  </h2>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Nom de l'entreprise<span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="nom_entreprise" 
                      value={formData.nom_entreprise} 
                      onChange={handleChange} 
                      placeholder="Tapez le nom de l'entreprise" 
                      className="form-control" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Matricule fiscale<span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="matricule_fiscale" 
                      value={formData.matricule_fiscale} 
                      onChange={handleChange} 
                      placeholder="Tapez le matricule fiscale" 
                      className="form-control" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Numéro de téléphone<span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="num_tel" 
                      value={formData.num_tel} 
                      onChange={handleChange} 
                      placeholder="Tapez le numéro de téléphone" 
                      className="form-control" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Adresse<span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="adresse" 
                      value={formData.adresse} 
                      onChange={handleChange} 
                      placeholder="Tapez l'adresse" 
                      className="form-control" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Date de fondation<span className="text-danger">*</span>
                    </label>
                    <input 
                      type="date" 
                      name="date_fondation" 
                      value={formData.date_fondation} 
                      onChange={handleChange} 
                      className="form-control datepicker-inline" 
                      required 
                    />
                  </div>
                  <div className="mb-3">
  <div className="form-label">Industrie<span className="text-danger">*</span></div>
  <select 
    className="form-select" 
    name="industrie"
    value={formData.industrie}
    onChange={handleChange}
    required
  >
    <option value="">Sélectionnez une industrie</option>
    <optgroup label="Mineral Industry">
      <option value="Cement production">Cement production</option>
      <option value="Lime production">Lime production</option>
      <option value="Glass Production">Glass Production</option>
    </optgroup>
    <optgroup label="Chemical Industry">
      <option value="Ammonia Production">Ammonia Production</option>
      <option value="Soda Ash Production">Soda Ash Production</option>
      <option value="Carbide Production">Carbide Production</option>
    </optgroup>
    <optgroup label="Metal Industry">
      <option value="Iron and Steel Production">Iron and Steel Production</option>
      <option value="Magnesium production">Magnesium production</option>
      <option value="Lead Production">Lead Production</option>
      <option value="Zinc Production">Zinc Production</option>
    </optgroup>
    <optgroup label="Buildings">
      <option value="Natural gas heating">Natural gas heating</option>
      <option value="Oil heating">Oil heating</option>
      <option value="Commercial buildings operations">Commercial buildings operations</option>
    </optgroup>
    <optgroup label="Agriculture">
      <option value="Rice cultivation">Rice cultivation</option>
      <option value="Fertilizer application">Fertilizer application</option>
      <option value="Agricultural soil management">Agricultural soil management</option>
    </optgroup>
    <optgroup label="Waste Sector">
      <option value="Municipal solid waste treatment">Municipal solid waste treatment</option>
      <option value="Wastewater treatment">Wastewater treatment</option>
      <option value="Composting">Composting</option>
      <option value="Incineration">Incineration</option>
    </optgroup>
    <optgroup label="EU Importers">
      <option value="Cement">Cement</option>
      <option value="Iron and steel">Iron and steel</option>
      <option value="Aluminum">Aluminum</option>
      <option value="Fertilizers">Fertilizers</option>
    </optgroup>
  </select>
</div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success mt-3" role="alert">
                Inscription réussie
              </div>
            )}
            
            <button type="submit" className="btn btn-success w-100 mt-4">S'inscrire</button>
          </form>
        </div>
        
        <div className="d-none d-lg-flex w-50 align-items-center justify-content-center">
          <Image src="/Auth illustrations/signup.png" alt="Signup" width={500} height={500} />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;