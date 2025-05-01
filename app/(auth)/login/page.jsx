"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

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
          showAlert("User logged successfully!", "success");
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
                      <IconEyeOff size={16} />
                    ) : (
                      <IconEye size={16} />
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