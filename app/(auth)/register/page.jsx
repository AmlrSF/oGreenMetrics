"use client"
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("regular");

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

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full relative z-10">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <Image
            src="/logo.png"
            width={150}
            height={150}
            alt="logo"
          />
        </div>

        {/* Header */}
        <h1 className="text-lg font-medium mb-2">Créez votre compte</h1>
        <p className="text-sm text-gray-600 mb-6">
          Inscrivez-vous pour accéder à nos outils et commencer à mesurer votre empreinte carbone en toute simplicité.
        </p>

        {/* Account Type Selection */}
        <div className="flex gap-4 mb-8">
          <button
            className={`flex items-center px-4 py-2 rounded-lg ${
              accountType === "regular"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500"
            }`}
            onClick={() => setAccountType("regular")}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            Utilisateur Régulier
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-lg ${
              accountType === "business"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500"
            }`}
            onClick={() => setAccountType("business")}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12h-3v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2H2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" />
            </svg>
            Propriétaire d'Entreprise
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {/* Personal Information */}
            <div className="mb-6">
              <h2 className="flex items-center text-sm font-medium mb-4">
                <div className="w-5 h-5 rounded-full bg-[#9BC95B] text-white flex items-center justify-center text-xs mr-2">1</div>
                Informations personnelles
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nom<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Tapez votre nom"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Prénom<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Tapez votre prénom"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Adresse e-mail<span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    placeholder="Tapez votre adresse email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mot de passe<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Tapez votre mot de passe"
                      className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2.5 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                    <div>8 caractères minimum</div>
                    <div>1 lettre minimum</div>
                    <div>1 chiffre minimum</div>
                    <div>1 symbole minimum</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            {accountType === "business" && (
              <div className="mb-6">
                <h2 className="flex items-center text-sm font-medium mb-4">
                  <div className="w-5 h-5 rounded-full bg-[#9BC95B] text-white flex items-center justify-center text-xs mr-2">2</div>
                  Informations d'entreprise
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Nom de l'entreprise<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Tapez le nom de votre entreprise"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Matricule fiscale<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Tapez le matricule fiscale de votre entreprise"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Adresse<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="Tapez l'adresse"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Date de Fondation<span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Adresse e-mail<span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        placeholder="Tapez l'adresse e-mail"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Téléphone<span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        placeholder="Tapez le numéro"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#9BC95B] text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
            >
              S'inscrire
            </button>
          </div>

          <div className="hidden md:block flex-1">
            <div className="w-full h-full flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default SignupPage;