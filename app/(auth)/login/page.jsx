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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showAlert = (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
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
        if (data?.user?.role === "Admin" || data?.user?.AdminRoles) {
          showAlert("User logged successfully! ", "success");
          router.push("/Dashboard/Admin");
        } else if (data?.user?.role === "régulier") {
          showAlert("User logged successfully!", "success");
          router.push("/Dashboard/Regular");
        } else {
          showAlert("User logged successfully!", "success");
          router.push("/Dashboard/User");
        }
      } else {
        showAlert(data.error, "danger");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page-center">
      <div className="position-absolute top-0 end-0 w-25 h-50">
        <Image
          src="/Auth illustrations/shape2.png"
          alt="Leaf decoration"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="position-absolute bottom-0 start-0 w-25 h-50">
        <Image
          src="/Auth illustrations/shape1.png"
          alt="Leaf decoration"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <div className="position-fixed top-0 end-0 p-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert alert-${alert.type} alert-dismissible`}
            role="alert"
          >
            <div>{alert.message}</div>
            <button
              className="btn-close"
              onClick={() =>
                setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
              }
            ></button>
          </div>
        ))}
      </div>

      <div className="container-lg py-4">
        <div className="card shadow">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-12 col-md-6">
                <div className="text-center mb-4">
                  <Image
                    src="/logo.png"
                    width={150}
                    height={60}
                    alt="GreenMetric"
                  />
                </div>

                <div className="mb-4">
                  <h1 className="h3 mb-1">Bienvenue chez GreenMetric 👋</h1>
                  <p className="text-muted small">
                    Connectez-vous à votre compte GreenMetric pour continuer.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger mb-3">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Adresse email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Tappez votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Mot de passe
                      <span className="form-label-description">
                        <a href="/PasswordForgotten" className="primarytxtcolor">Mot de passe oublié ?</a>
                      </span>
                    </label>
                    <div className="input-group input-group-flat">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Tapez votre mot de passe"
                        value={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                        required
                      />
                      <span className="input-group-text">
                        <a
                          href="#"
                          className="link-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg
                              className="icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              ></path>
                            </svg>
                          )}
                        </a>
                      </span>
                    </div>
                  </div>

                  <div className="form-footer">
                    <button
                      type="submit"
                      className="btn
                     btn-primary w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" />
                        </span>
                      ) : (
                        "  S'authentifier"
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center text-muted mt-3">
                  Vous n'avez pas de compte ?{" "}
                  <a href="/register" className="primarytxtcolor">
                    Inscrivez-vous maintenant
                  </a>
                </div>
              </div>

              <div className="col-12 col-md-6 text-center  d-none d-md-block mt-4 mt-md-0">
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
      </div>
    </div>
  );
};

export default Page;