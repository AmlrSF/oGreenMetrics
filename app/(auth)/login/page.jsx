"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState([]);
  const router = useRouter();

  const showAlert = (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log(email, motDePasse);
      
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      const data = await response.json();
      if (data?.user) {
        if(data?.user?.role === "Admin" || data?.user?.AdminRoles){
          showAlert("User logged successfully! ", "success");
          router.push("/Dashboard/Admin");
        } else if(data?.user?.role === "régulier") {
          showAlert("User logged successfully!", "success");
          router.push("/Dashboard/Regular");
        }else {
          showAlert("User logged successfully!", "success");
          router.push("/Dashboard/User");
        }
      } else {
        showAlert(data.error, "danger");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <div className="absolute top-0 right-0 w-1/4 h-1/2 bg-contain bg-no-repeat bg-right-top z-0">
        <Image
          src="/Auth illustrations/shape2.png"
          alt="Leaf decoration"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-contain bg-no-repeat bg-left-bottom z-0">
        <Image
          src="/Auth illustrations/shape1.png"
          alt="Leaf decoration"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <div className="fixed top-0 right-0 p-3 z-50">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`alert alert-${alert.type} alert-dismissible`} 
            role="alert"
          >
            <div>{alert.message}</div>
            <button className="btn-close" onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}></button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl w-full mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 px-4">
            <div className="mb-6 text-center">
              <Image
                src="/logo.png"
                width={150}
                height={60}
                alt="GreenMetric"
              />
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold mb-2">Bienvenue chez GreenMetric 👋</h1>
              <p className="text-gray-600">
                Connectez-vous à votre compte GreenMetric pour continuer.
              </p>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Adresse email</label>
                <input
                  type="email"
                  className="form-control"
                  name="example-text-input"
                  placeholder="Tappez votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 relative">
                <label className="form-label">Mot de passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="example-password-input"
                  placeholder="Tapez votre mot de passe"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center top-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>

              <div className="mt-2 text-right">
                <a href="/PasswordForgotten" className="text-gray-500 text-sm">
                  Mot de passe oublié ?
                </a>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full mt-4"
              >
                S'authentifier
              </button>

              <div className="text-center mt-6">
                <span className="text-gray-600">
                  Vous n'avez pas de compte ?{" "}
                </span>
                <a href="/register" className="text-blue-600 font-medium">
                  Inscrivez-vous maintenant
                </a>
              </div>
            </form>
          </div>

          <div className="w-full md:w-1/2 text-center mt-8 md:mt-0">
            <Image
              src="/Auth illustrations/Login illustration.png"
              width={500}
              height={500}
              alt="Login illustration"
              className="mx-auto"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;