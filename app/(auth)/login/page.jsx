"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Image from "next/image";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
 
      router.push("/");  
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center bg-gradient-to-br from-green-50 to-white relative">
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

      <div className="card w-full max-w-4xl">
        <div className="card-body p-8 flex gap-8 items-center">
          <div className="flex-1 space-y-2">
            <div className="flex items-center mb-8">
              <Image src="/logo.png" width={150} height={150} alt="logo" />
            </div>

            <div className="mb-8">
              <h1 className="text-xl font-medium text-gray-800 mb-1">
                Bienvenue chez GreenMetric 👋
              </h1>
              <p className="text-muted">
                Connectez-vous à votre compte GreenMetric pour continuer.
              </p>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
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
                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </button>
                </div>
                <div className="mt-2">
                  <a href="/PasswordForgotten" className="text-muted text-sm">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-10">
                S&apos;authentifier
              </button>

              <div className="text-center mt-3">
                <span className="text-muted">Vous n&apos;avez pas de compte ? </span>
                <a href="/register" className="text-primary">
                  Inscrivez-vous maintenant
                </a>
              </div>
            </form>
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

export default Page;