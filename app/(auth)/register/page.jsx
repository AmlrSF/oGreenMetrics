"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VerificationRequired from "@/components/VerificationRequired";


const SignupPage = () => {
  const { push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("régulier");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    prenom: "", nom: "", email: "", mot_de_passe: "", confirmPassword: "", role: "régulier",
    nom_entreprise: "", matricule_fiscale: "", num_tel: "", adresse: "", date_fondation: "", industrie: "", country: ""
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

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateStep1 = () => {
    if (!formData.prenom || !formData.nom || !formData.email || !formData.mot_de_passe || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    if (formData.mot_de_passe !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    setError("");
    return true;
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
            country: formData.country,
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
        num_tel: "", adresse: "", date_fondation: "", industrie: "", country: ""
      });
      
    } catch (err) {
      setError("Failed to connect to the server");
      console.error(err);
    }
  };

  const naviagteToLoginPage = ()=>{
    push("/login");
  }

  if(success)
    return <VerificationRequired naviagteToLoginPage={naviagteToLoginPage} />

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-lg-7 p-4 p-lg-5">
              <div className="mb-4">
                <Image 
                  src="/logo.png" 
                  width={180} 
                  height={48} 
                  alt="OGreenMetric"
                  className="mb-4"
                />
                <h1 className="h4 fw-bold mb-1">Créez votre compte</h1>
                <p className="text-muted small">Inscrivez-vous pour accéder à nos outils et commencer à mesurer votre empreinte carbone en toute simplicité.</p>
              </div>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {success && <div className="alert alert-success py-2 small">Inscription réussie!</div>}

              {/* Step indicators */}
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <div className={`d-flex align-items-center ${currentStep >= 1 ? "text-success" : "text-secondary"}`}>
                    <div
                      className={`d-flex align-items-center justify-content-center rounded-circle me-2 ${
                        currentStep >= 1 ? "stepper-active" : "bg-light border"
                      }`}
                      style={{ width: "28px", height: "28px" }}
                    >
                      <span className={currentStep >= 1 ? "text-white" : "text-secondary"}>1</span>
                    </div>
                    <span className="small fw-medium">Type de compte</span>
                  </div>

                  <div className="mx-2 border-top flex-grow-1" style={{ borderColor: "#e5e5e5", height: "1px" }}></div>

                  <div className={`d-flex align-items-center ${currentStep >= 2 ? "text-success" : "text-secondary"}`}>
                    <div
                      className={`d-flex align-items-center justify-content-center rounded-circle me-2 ${
                        currentStep >= 2 ? "stepper-active" : "bg-light border"
                      }`}
                      style={{ width: "28px", height: "28px" }}
                    >
                      <span className={currentStep >= 2 ? "text-white" : "text-secondary"}>2</span>
                    </div>
                    <span className="small fw-medium">Infos personnelles</span>
                  </div>

                  {accountType === "entreprise" && (
                    <>
                      <div className="mx-2 border-top flex-grow-1" style={{ borderColor: "#e5e5e5", height: "1px" }}></div>

                      <div className={`d-flex align-items-center ${currentStep >= 3 ? "text-success" : "text-secondary"}`}>
                        <div
                          className={`d-flex align-items-center justify-content-center rounded-circle me-2 ${
                            currentStep >= 3 ? "stepper-active" : "bg-light border"
                          }`}
                          style={{ width: "28px", height: "28px" }}
                        >
                          <span className={currentStep >= 3 ? "text-white" : "text-secondary"}>3</span>
                        </div>
                        <span className="small fw-medium">Infos entreprise</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div id="account-type">
               <h2 className="d-flex align-items-center small fw-medium mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center text-white rounded-circle me-2 stepper-active"
                    style={{ width: "24px", height: "24px", fontSize: "12px" }}
                  >
                    1
                  </div>
                  Choisissez votre type de compte
                </h2>

                    <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                    <button
                        type="button"
                        className={`btn ${accountType === "régulier" ? "btn-success" : "btn-outline-secondary"} flex-grow-1 py-3`}
                        onClick={() => handleAccountTypeChange("régulier")}
                      >
                        <i className="bi bi-person me-2"></i>
                        Utilisateur Régulier
                      </button>

                      <button
                        type="button"
                        className={`btn ${accountType === "entreprise" ? "btn-success" : "btn-outline-secondary"} flex-grow-1 py-3`}
                        onClick={() => handleAccountTypeChange("entreprise")}
                      >
                        <i className="bi bi-building me-2"></i>
                        Propriétaire d'Entreprise
                      </button>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn btn-success px-4" onClick={nextStep}>
                        Suivant <i className="bi bi-arrow-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div id="personal-info">
                   <h2 className="d-flex align-items-center small fw-medium mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center text-white rounded-circle me-2 stepper-active"
                      style={{ width: "24px", height: "24px", fontSize: "12px" }}
                    >
                      1
                    </div>
                    Choisissez votre type de compte
                  </h2>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-medium mb-1">
                          Prénom<span className="text-danger ms-1">*</span>
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

                      <div className="col-md-6">
                        <label className="form-label small fw-medium mb-1">
                          Nom<span className="text-danger ms-1">*</span>
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

                      <div className="col-12">
                        <label className="form-label small fw-medium mb-1">
                          Adresse e-mail<span className="text-danger ms-1">*</span>
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

                      <div className="col-md-6">
                        <label className="form-label small fw-medium mb-1">
                          Mot de passe<span className="text-danger ms-1">*</span>
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
                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </button>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-medium mb-1">
                          Confirmez le mot de passe<span className="text-danger ms-1">*</span>
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
                            <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button type="button" className="btn btn-outline-secondary px-4" onClick={prevStep}>
                        <i className="bi bi-arrow-left me-1"></i> Précédent
                      </button>
                      
                      {accountType === "entreprise" ? (
                        <button type="button" className="btn btn-success px-4" onClick={() => {
                          if (validateStep1()) nextStep();
                        }}>
                          Suivant <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      ) : (
                        <button type="submit" className="btn btn-success px-4">S'inscrire</button>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && accountType === "entreprise" && (
                  <div id="company-info">
                    <h2 className="d-flex align-items-center small fw-medium mb-3">
                      <div className="d-flex align-items-center justify-content-center text-white rounded-circle me-2 stepper-active" style={{ width: "24px", height: "24px", fontSize: "12px" }}>3</div>
                      Informations sur l'entreprise
                    </h2>

                    <div className="row g-3 mb-4">
                      <div className="col-12">
                        <label className="form-label small fw-medium mb-1">
                          Nom de l'entreprise<span className="text-danger ms-1">*</span>
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

                      <div className="col-md-6">
                        <label className="form-label small fw-medium mb-1">
                          Matricule fiscale<span className="text-danger ms-1">*</span>
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

                      <div className="col-md-6">
                        <label className="form-label small fw-medium mb-1">
                          Numéro de téléphone<span className="text-danger ms-1">*</span>
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

                      <div className="col-12">
                        <label className="form-label small fw-medium mb-1">
                          Adresse<span className="text-danger ms-1">*</span>
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
                      
                      <div className="col-md-6">
                        <label className="form-label small fw-medium mb-1">
                          Pays<span className="text-danger ms-1">*</span>
                        </label>
                        <select
                          className="form-select" 
                          name="country" 
                          value={formData.country} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Sélectionnez un pays</option> 
                          <option value="Sweden">Sweden</option> 
                          <option value="Lithuania">Lithuania</option> 
                          <option value="France">France</option> 
                          <option value="Austria">Austria</option> 
                          <option value="Latvia">Latvia</option> 
                          <option value="Finland">Finland</option> 
                          <option value="Slovakia">Slovakia</option> 
                          <option value="Denmark">Denmark</option> 
                          <option value="Belgium">Belgium</option> 
                          <option value="Croatia">Croatia</option> 
                          <option value="Luxembourg">Luxembourg</option> 
                          <option value="Slovenia">Slovenia</option> 
                          <option value="Italy">Italy</option> 
                          <option value="Hungary">Hungary</option> 
                          <option value="Spain">Spain</option> 
                          <option value="United Kingdom">United Kingdom</option> 
                          <option value="Romania">Romania</option> 
                          <option value="Portugal">Portugal</option> 
                          <option value="Ireland">Ireland</option> 
                          <option value="Germany">Germany</option> 
                          <option value="Bulgaria">Bulgaria</option> 
                          <option value="Netherlands">Netherlands</option> 
                          <option value="Czechia">Czechia</option> 
                          <option value="Greece">Greece</option> 
                          <option value="Malta">Malta</option> 
                          <option value="Cyprus">Cyprus</option> 
                          <option value="Poland">Poland</option> 
                          <option value="Estonia">Estonia</option>
                        </select>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label small fw-medium mb-1">
                          Date de fondation<span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="date" 
                          name="date_fondation" 
                          value={formData.date_fondation} 
                          onChange={handleChange} 
                          className="form-control" 
                          required
                        />
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label small fw-medium mb-1">
                          Industrie<span className="text-danger ms-1">*</span>
                        </label>
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

                    <div className="d-flex justify-content-between mt-4">
                      <button type="button" className="btn btn-outline-secondary px-4" onClick={prevStep}>
                        <i className="bi bi-arrow-left me-1"></i> Précédent
                      </button>
                      <button type="submit" className="btn btn-success px-4">S'inscrire</button>
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="col-lg-5 d-none d-lg-block bg-light position-relative">
              <div className="position-absolute top-0 end-0 bottom-0 start-0 d-flex align-items-center justify-content-center">
                <Image 
                  src="/Auth illustrations/signup.png" 
                  alt="Registration illustration" 
                  width={400} 
                  height={400} 
                  className="img-fluid" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;