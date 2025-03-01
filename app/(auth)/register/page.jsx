"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("régulier");
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    mot_de_passe: "",
    role: "régulier", // Default for régulier user
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/register", {
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
      <Image
        src="/Auth illustrations/shape1.png"
        width={250}
        height={420}
        alt="Shape 1"
        className="absolute bottom-0 left-0"
      />
      <Image
        src="/Auth illustrations/shape2.png"
        width={250}
        height={420}
        alt="shape 2"
        className="absolute top-0 right-0"
      />

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl w-full flex relative z-10">
        {/* Left side - Form */}
        <div className="flex-1">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <Image src="/logo.png" width={150} height={150} alt="logo" />
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
                onClick={() => setAccountType("régulier")}
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
                  accountType === "company"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500"
                }`}
                onClick={() => setAccountType("company")}
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
                    </div>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && (
                  <p className="text-green-500 text-sm mb-4">
                    User registered successfully!
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#9BC95B] text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <img
              src="/Auth illustrations/Login illustration.png"
              alt="Login illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
