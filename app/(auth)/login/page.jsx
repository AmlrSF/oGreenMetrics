"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import Image from "next/image";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert(null);

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mot_de_passe }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.error) {
        if (data.error.includes("not found")) {
          showAlert("error", "Aucun compte trouvé avec cette adresse e-mail");
        } else if (data.error.includes("Invalid password")) {
          showAlert("error", "Mot de passe incorrect. Veuillez réessayer");
        } else {
          showAlert("error", "Une erreur est survenue. Veuillez réessayer");
        }
      } else {
        showAlert("success", "Connexion réussie ! Redirection en cours...");
        setTimeout(() => router.push("/"), 3000);
      }
    } catch (error) {
      showAlert("error", "Erreur de connexion. Veuillez réessayer plus tard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center bg-gradient-to-br from-green-50 to-white relative">
       {alert && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              alert.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {alert.type === "success" ? (
              <IconCheck className="mr-2" size={20} />
            ) : (
              <IconAlertCircle className="mr-2" size={20} />
            )}
            <span>{alert.message}</span>
          </div>
        </div>
      )}

       <div className="fixed inset-0 overflow-hidden">
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
          alt="Shape 2"
          className="absolute top-0 right-0"
        />
      </div>
 
      <div className="card w-full max-w-4xl bg-white/90 backdrop-blur-sm z-10">
        <div className="card-body p-8 flex gap-8 items-center">
           <div className="flex-1 space-y-2">
            <div className="flex items-center mb-8">
              <Image 
                src="/logo.png" 
                width={150} 
                height={150} 
                alt="logo" 
                className="hover:scale-105 transition-transform"
              />
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                Bienvenue chez GreenMetric 👋
              </h1>
              <p className="text-muted">
                Connectez-vous à votre compte GreenMetric pour continuer.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="form-label">
                  Adresse e-mail <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control focus:ring-2 focus:ring-green-500"
                  placeholder="Tapez votre adresse email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Mot de passe <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control focus:ring-2 focus:ring-green-500"
                    placeholder="Tapez votre mot de passe"
                    required
                    value={mot_de_passe}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary hover:bg-gray-50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </button>
                </div>
                <div className="mt-2">
                  <a 
                    href="/PasswordForgotten" 
                    className="text-muted text-sm hover:text-green-600 transition-colors"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full mt-10 py-3 hover:bg-green-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Connexion en cours...</span>
                ) : (
                  "S'authentifier"
                )}
              </button>

              <div className="text-center mt-3">
                <span className="text-muted">Vous n'avez pas de compte ? </span>
                <a 
                  href="/register" 
                  className="text-primary hover:text-green-600 transition-colors"
                >
                  Inscrivez-vous maintenant
                </a>
              </div>
            </form>
          </div> 
          <div className="hidden md:block flex-1">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Image
                  src="/Auth illustrations/Login illustration.png"
                  width={500}
                  height={500}
                  alt="Login illustration"
                  className="w-full h-auto animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;