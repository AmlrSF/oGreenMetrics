"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      return toast.error(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
    }
    if (password !== confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas.");
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
        toast.success(data?.message);
        localStorage.removeItem("resetToken");
        localStorage.removeItem("email");
        router.push("/login");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error("Une erreur est survenue lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSuccess) {
    return <p>Loading...</p>;
  }
  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center bg-gradient-to-br from-green-50 to-white relative">
      <Toaster position="top-right" />
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
        alt="shape 2"
        className="absolute top-0 right-0"
      />

      <div className="bg-white z-20 p-8 rounded-lg shadow-lg w-full max-w-4xl flex gap-8 items-center">
        <div className="flex-1 space-y-6">
          <div className="flex items-center mb-8">
            <Image src="/logo.png" width={150} height={150} alt="logo" />
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-medium text-gray-800 mb-1">
              Réinitialisation du mot de passe 🔒
            </h1>
            <p className="text-sm text-gray-600">
              Entrez votre nouveau mot de passe et confirmez-le pour finaliser
              la réinitialisation.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <div className="form-label">
                Nouveau mot de passe{" "}
                <span className="text-red-600 font-bold">*</span>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="Entrez un nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <div className="form-label">
                Confirmer le mot de passe{" "}
                <span className="text-red-600 font-bold">*</span>
              </div>
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
              className="p-3 rounded-lg text-white cursor-pointer font-medium hover:bg-primary-clr btn-primary w-full mt-10"
            >
              {loading
                ? "Réinitialisation..."
                : "Réinitialiser le mot de passe"}
            </button>
          </form>
        </div>

        <div className="hidden md:block flex-1">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full max-w-sm">
              <img
                src="/Auth illustrations/reset-password.png"
                alt="Reset Password Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
