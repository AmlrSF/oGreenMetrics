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
      console.log(data);
      
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white position-relative">
      <div className="position-absolute top-0 end-0 w-25 h-50 bg-contain bg-no-repeat bg-right-top z-index-0">
        <Image
          src="/Auth illustrations/shape2.png"
          alt="Leaf decoration"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="position-absolute bottom-0 start-0 w-25 h-50 bg-contain bg-no-repeat bg-left-bottom z-index-0">
        <Image
          src="/Auth illustrations/shape1.png"
          alt="Leaf decoration"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <div className="position-fixed top-0 end-0 p-3 z-index-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`alert alert-${alert.type} alert-dismissible fade show`} 
            role="alert"
          >
            <div>{alert.message}</div>
            <button type="button" className="btn-close" onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}></button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded shadow-lg p-4 p-md-5 mx-auto z-index-2 position-relative" style={{maxWidth: "1200px", width: "100%"}}>
        <div className="row align-items-center">
          <div className="col-md-6 px-4">
            <div className="mb-4 text-center">
              <Image
                src="/logo.png"
                width={150}
                height={60}
                alt="GreenMetric"
              />
            </div>

            <div className="mb-5 text-center">
              <h1 className="fs-4 fw-semibold mb-2">Bienvenue chez GreenMetric 👋</h1>
              <p className="text-secondary">
                Connectez-vous à votre compte GreenMetric pour continuer.
              </p>
            </div>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
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

              <div className="mb-3 position-relative">
                <label className="form-label">Mot de passe</label>
                <div className="input-group">
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
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="bi bi-eye-slash" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                      </svg>
                    ) : (
                      <svg className="bi bi-eye" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-2 text-end">
                <a href="/PasswordForgotten" className="text-secondary text-decoration-none small">
                  Mot de passe oublié ?
                </a>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mt-4"
              >
                S'authentifier
              </button>

              <div className="text-center mt-4">
                <span className="text-secondary">
                  Vous n'avez pas de compte ?{" "}
                </span>
                <a href="/register" className="text-primary fw-medium text-decoration-none">
                  Inscrivez-vous maintenant
                </a>
              </div>
            </form>
          </div>

          <div className="col-md-6 text-center mt-5 mt-md-0">
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