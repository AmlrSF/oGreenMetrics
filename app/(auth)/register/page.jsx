"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { IconEye, IconEyeOff, IconUser, IconBuilding } from '@tabler/icons-react';

const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('regular'); // 'regular' or 'business'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center bg-gradient-to-br from-green-50 to-white relative">
      <div className="card w-full max-w-4xl">
        <div className="card-body p-8 flex gap-8 items-start">
          <div className="flex-1">
            <div className="mb-8">
              <Image
                src="/logo.png"
                width={150}
                height={150}
                alt="GreenMetric Logo"
              />
            </div>

            <h2 className="card-title mb-1">Créez votre compte</h2>
            <p className="text-muted mb-4">
              Inscrivez-vous pour accéder à nos outils et commencez à mesurer votre empreinte carbone en toute simplicité.
            </p>

            <div className="btn-group w-full mb-6">
              <button 
                className={`btn flex-1 ${accountType === 'regular' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setAccountType('regular')}
              >
                <IconUser className="me-2" />
                Utilisateur Régulier
              </button>
              <button 
                className={`btn flex-1 ${accountType === 'business' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setAccountType('business')}
              >
                <IconBuilding className="me-2" />
                Propriétaire d'Entreprise
              </button>
            </div>

            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-label">Nom*</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tapez votre nom"
                  />
                </div>
                <div className="col-md-6">
                  <div className="form-label">Prénom*</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tapez votre prénom"
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="form-label">Adresse e-mail*</div>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Tapez votre adresse email"
                />
              </div>

              <div className="mb-3">
                <div className="form-label">Mot de passe*</div>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Tapez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </button>
                </div>
                <div className="text-muted mt-1 text-xs">
                  <ul className="list-unstyled">
                    <li>• 8 caractères minimum</li>
                    <li>• 1 lettre minimum</li>
                    <li>• 1 chiffre minimum</li>
                    <li>• 1 symbole minimum</li>
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-check">
                  <input type="checkbox" className="form-check-input"/>
                  <span className="form-check-label">Rester connecté(e)</span>
                </label>
              </div>

              <button type="submit" className="btn btn-success w-full">
                S'inscrire
              </button>
            </form>
          </div>

          <div className="hidden md:block flex-1">
            <div className="w-full h-full flex items-center justify-center mt-40">
              <img
                src="/Auth illustrations/signup.png"
                alt="Sign up illustration"
                className="w-full max-w-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;