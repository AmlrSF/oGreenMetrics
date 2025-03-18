"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import Image from "next/image";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState([]);
  const router = useRouter();

  // Function to show alerts
  const showAlert = (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts(prev => [...prev, { id, message, type }]);
    
    // Remove alert after 3 seconds
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
      console.log(data)
      if (data?.user) {
        console.log(data?.user?.role)
        if(data?.user?.role == "Admin" || data?.user?.AdminRoles){
          showAlert(`User logged successfully! ${data?.user?.role}`, "success");
          router.push("/Dashboard/Admin");
        } else if(data?.user?.role == "régulier") {
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
    <div className="page page-center">
      {/* Alerts container */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`alert alert-${alert.type} alert-dismissible`}
            role="alert"
          >
            {alert.type === 'success' ? 
              <IconCheck className="alert-icon" /> : 
              <IconAlertCircle className="alert-icon" />
            }
            <div>{alert.message}</div>
            <a className="btn-close" onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}></a>
          </div>
        ))}
      </div>

      {/* Background shapes */}
      <div className="position-absolute bottom-0 start-0">
        <Image
          src="/Auth illustrations/shape1.png"
          width={250}
          height={420}
          alt="Shape 1"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
      <div className="position-absolute top-0 end-0">
        <Image
          src="/Auth illustrations/shape2.png"
          width={250}
          height={420}
          alt="Shape 2"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      <div className="container-xl">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body p-4">
                <div className="d-flex mb-4">
                  <Image
                    src="/logo.png"
                    width={150}
                    height={150}
                    alt="logo"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>

                <div className="mb-4">
                  <h1 className="h3 mb-1">Bienvenue chez GreenMetric 👋</h1>
                  <p className="text-muted">
                    Connectez-vous à votre compte GreenMetric pour continuer.
                  </p>
                </div>

                {error && <div className="alert alert-danger mb-3">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Adresse e-mail <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Tapez votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Mot de passe <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
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
                          <IconEyeOff size={20} />
                        ) : (
                          <IconEye size={20} />
                        )}
                      </button>
                    </div>
                    <div className="mt-2">
                      <a href="/PasswordForgotten" className="text-muted small">
                        Mot de passe oublié ?
                      </a>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mt-4"
                  >
                    S&apos;authentifier
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-muted">
                      Vous n&apos;avez pas de compte ?{" "}
                    </span>
                    <a href="/register" className="text-primary">
                      Inscrivez-vous maintenant
                    </a>
                  </div>
                </form>
                
              </div>
              <div className="col-lg-6 d-none d-lg-block">
            <div className="d-flex h-100 align-items-center justify-content-center">
              <div className="w-100 max-w-sm">
                <img
                  src="/Auth illustrations/Login illustration.png"
                  alt="Login illustration"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
            </div>
            
          </div>

       
        </div>
      </div>
    </div>
  );
};

export default Page;