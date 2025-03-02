"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("régulier");
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    mot_de_passe: "",
    confirmPassword: "",
    role: "régulier",
    // entreprise fields
    nom_entreprise: "",
    matricule_fiscale: "",
    num_tel: "",
    adresse: "",
    date_fondation: "",
    industrie: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle form field change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle account type change
  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setFormData({
      ...formData,
      role: type
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.mot_de_passe !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const endpoint = accountType === "régulier" 
        ? "http://localhost:4000/register" 
        : "http://localhost:4000/registercompany";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setError("");
        console.log("User registered successfully", data);
        // Reset form
        setFormData({
          prenom: "",
          nom: "",
          email: "",
          mot_de_passe: "",
          confirmPassword: "",
          role: accountType,
          nom_entreprise: "",
          matricule_fiscale: "",
          num_tel: "",
          adresse: "",
          date_fondation: "",
          industrie: ""
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to register user");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute bottom-0 left-0 w-64 h-80 bg-green-50 opacity-50 rounded-tr-full"></div>
      <div className="absolute top-0 right-0 w-64 h-80 bg-green-50 opacity-50 rounded-bl-full"></div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl w-full flex relative z-10">
        {/* Left side - Form */}
        <div className="flex-1">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="text-[#9BC95B] font-bold flex items-center">
              <span className="text-3xl">Green</span>
              <span className="text-2xl text-[#2C4B85]">Metric</span>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-lg font-medium mb-2">Créez votre compte</h1>
          <p className="text-sm text-gray-600 mb-6">
            Inscrivez-vous pour accéder à nos outils et commencer à mesurer votre empreinte carbone en toute simplicité.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                className={`flex items-center px-4 py-2 rounded-lg ${
                  accountType === "régulier"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500"
                }`}
                onClick={() => handleAccountTypeChange("régulier")}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                Utilisateur Régulier
              </button>
              <button
                type="button"
                className={`flex items-center px-4 py-2 rounded-lg ${
                  accountType === "entreprise"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500"
                }`}
                onClick={() => handleAccountTypeChange("entreprise")}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12h-3v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2H2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" />
                </svg>
                Propriétaire d'Entreprise
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex-1">
                {/* Personal Information */}
                <div className="mb-6">
                  <h2 className="flex items-center text-sm font-medium mb-4">
                    <div className="w-5 h-5 rounded-full bg-[#9BC95B] text-white flex items-center justify-center text-xs mr-2">
                      1
                    </div>
                    Informations personnelles
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">
                        Nom<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Tapez votre nom"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Prénom<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Tapez votre prénom"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Adresse e-mail<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Tapez votre adresse email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Mot de passe<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="mot_de_passe"
                          value={formData.mot_de_passe}
                          onChange={handleChange}
                          placeholder="Tapez votre mot de passe"
                          className="w-full p-2 border border-gray-300 rounded-md pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2.5 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <p>Pour une sécurité optimale, utilisez:</p>
                        <ul className="list-disc pl-4 mt-1">
                          <li>Au moins 8 caractères</li>
                          <li>Au moins 1 majuscule</li>
                          <li>Au moins 1 chiffre</li>
                          <li>Au moins 1 caractère spécial</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Confirmez le mot de passe<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirmez votre mot de passe"
                          className="w-full p-2 border border-gray-300 rounded-md pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2.5 text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* entreprise Information - Only shown for entreprise accounts */}
                {accountType === "entreprise" && (
                  <div className="mb-6">
                    <h2 className="flex items-center text-sm font-medium mb-4">
                      <div className="w-5 h-5 rounded-full bg-[#9BC95B] text-white flex items-center justify-center text-xs mr-2">
                        2
                      </div>
                      Informations d'entreprise
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">
                          Nom de l'entreprise<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="nom_entreprise"
                          value={formData.nom_entreprise}
                          onChange={handleChange}
                          placeholder="Tapez le nom de votre entreprise"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required={accountType === "entreprise"}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">
                          Matricule Fiscal<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="matricule_fiscale"
                          value={formData.matricule_fiscale}
                          onChange={handleChange}
                          placeholder="Tapez le matricule fiscal de votre entreprise"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required={accountType === "entreprise"}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">
                            Adresse<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleChange}
                            placeholder="Tapez l'adresse de votre entreprise"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required={accountType === "entreprise"}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">
                            Date de Fondation<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="date_fondation"
                            value={formData.date_fondation}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required={accountType === "entreprise"}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">
                            Téléphone<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="num_tel"
                            value={formData.num_tel}
                            onChange={handleChange}
                            placeholder="Numéro de téléphone de l'entreprise"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required={accountType === "entreprise"}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">
                            Industrie<span className="text-red-500">*</span>
                          </label>
                          <select
                            name="industrie"
                            value={formData.industrie}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required={accountType === "entreprise"}
                          >
                            <option value="">Sélectionnez votre industrie</option>
                            <option value="Technologie">Technologie</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Santé">Santé</option>
                            <option value="Éducation">Éducation</option>
                            <option value="Retail">Retail</option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Énergie">Énergie</option>
                            <option value="Transport">Transport</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Success message */}
            {success && (
              <div className="text-green-600 bg-green-50 p-3 rounded-md mt-4">
                Inscription réussie ! Vous pouvez maintenant vous connecter.
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded-md mt-4">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#9BC95B] text-white rounded-md mt-6 hover:bg-[#8ab84d] transition-colors"
            >
              S'inscrire
            </button>

            {/* Login Link */}
            <p className="text-center mt-4 text-sm">
              Vous avez déjà un compte?{" "}
              <a href="/login" className="text-[#2C4B85] font-medium">
                Connectez-vous
              </a>
            </p>
          </form>
        </div>
            
        <div className="hidden lg:block flex-1 mt-60">
          <Image
            src="/Auth illustrations/signup.png"
            width={500}
            height={600}
            alt="Signup Illustration"
          />
        </div>
    
      </div>
    </div>
  );
};

export default SignupPage;