"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const alertRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const resetToken = localStorage.getItem("resetToken");
    if (!savedEmail || !resetToken) {
      router.push("/login");
    } else {
      setEmail(savedEmail);
      setResetToken(resetToken);
      setIsSuccess(true);
    }
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    
    // Auto-hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 3000);
    
    // Scroll to alert
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      return showAlert("danger", "Le mot de passe doit contenir au moins 6 caractères.");
    }
    if (password !== confirmPassword) {
      return showAlert("danger", "Les mots de passe ne correspondent pas.");
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/resetPassword?resetToken=${resetToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPass: password }),
        }
      );
      
      const data = await response.json();
      if (response.ok) {
        showAlert("success", data?.message);
        localStorage.removeItem("resetToken");
        localStorage.removeItem("email");
        // Delay redirect to show success message
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        showAlert("danger", data?.message);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      showAlert("danger", "Une erreur est survenue lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSuccess) {
    return <div className="d-flex align-items-center justify-content-center min-vh-100"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light position-relative">
      <div ref={alertRef}>
        {alert.show && (
          <div className={`alert alert-${alert.type} alert-dismissible position-fixed top-0 start-50 translate-middle-x mt-3`} role="alert">
            {alert.message}
            <button type="button" className="btn-close" onClick={() => setAlert({ show: false, type: "", message: "" })}></button>
          </div>
        )}
      </div>
      
      <Image 
        src="/Auth illustrations/shape1.png" 
        width={250} 
        height={420} 
        alt="Shape 1" 
        className="position-absolute bottom-0 start-0" 
        style={{ width: "auto", height: "auto" }}
      />
      
      <Image
        src="/Auth illustrations/shape2.png"
        width={250} 
        height={420} 
        alt="shape 2" 
        className="position-absolute top-0 end-0" 
        style={{ width: "auto", height: "auto" }}
      />
      
      <div className="card shadow-lg p-4 p-md-5 w-100" style={{ maxWidth: "900px", zIndex: 20 }}>
        <div className="row g-0">
          <div className="col-md-6">
            <div className="card-body">
              <div className="mb-4">
                <Image
                  src="/logo.png"
                  width={150}
                  height={150}
                  alt="logo"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              
              <div className="mb-4">
                <h1 className="h3 mb-1">
                  Réinitialisation du mot de passe 🔒
                </h1>
                <p className="text-muted small">
                  Entrez votre nouveau mot de passe et confirmez-le pour finaliser
                  la réinitialisation.
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Nouveau mot de passe{" "}
                    <span className="text-danger fw-bold">*</span>
                  </label>
                  <input
                    type="password" 
                    className="form-control" 
                    placeholder="Entrez un nouveau mot de passe" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    Confirmer le mot de passe{" "}
                    <span className="text-danger fw-bold">*</span>
                  </label>
                  <input
                    type="password" 
                    className="form-control" 
                    placeholder="Confirmez votre mot de passe" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className={`btn btn-primary w-100 mt-4 ${loading ? 'disabled' : ''}`}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Réinitialisation...
                    </>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="col-md-6 d-none d-md-block">
            <div className="d-flex align-items-center justify-content-center h-100">
              <div style={{ maxWidth: "300px" }}>
                <img
                  src="/Auth illustrations/reset-password.png"
                  alt="Reset Password Illustration"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;