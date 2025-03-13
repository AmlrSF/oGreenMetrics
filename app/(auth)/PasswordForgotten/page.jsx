"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/forgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data);

      if (data?.CreatedpasswordResetOTP) {
        localStorage.setItem("email", email);
        showAlert("OTP sent, check your mailbox", "success");
        router.push("/OTP");
      } else {
        showAlert(data?.message, "danger");
      }
    } catch (error) {
      console.error("Error during OTP request:", error);
      setErrorMessage("An error occurred while sending OTP.");
      showAlert("An error occurred while sending OTP.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-center bg-body-tertiary">
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

      <div className="container-tight py-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-6">
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
                  <h1 className="h3 mb-1">Password forgotten 👋</h1>
                  <p className="text-muted small">
                    Entrez votre e-mail pour le processus de vérification, nous vous enverrons un code à 4 chiffres à votre e-mail.
                  </p>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger mb-3">{errorMessage}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Adresse e-mail <span className="text-danger fw-bold">*</span>
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

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer une instruction de réinitialisation"
                    )}
                  </button>

                  <p className="text-muted small text-center mt-3">
                    Vous n&apos;avez pas de compte ?{" "}
                    <a href="/register" className="text-primary">
                      Inscrivez-vous maintenant
                    </a>
                  </p>
                </form>
              </div>

              <div className="col-md-6 d-none d-md-block">
                <div className="d-flex h-100 align-items-center justify-content-center">
                  <div className="w-100">
                    <img
                      src="/Auth illustrations/Forgot password.png"
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