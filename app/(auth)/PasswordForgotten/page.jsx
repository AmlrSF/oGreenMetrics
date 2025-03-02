"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useState } from "react";

const page = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); 
   const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault()

    
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
      console.log(data)

      if(data?.CreatedpasswordResetOTP){
        localStorage.setItem("email", email); 
        toast.success("OTP sent, check your mailbox");
        router.push("/OTP");
      }else{
        toast.error(data?.message);
      }

    
    } catch (error) {
      console.error("Error during OTP request:", error);
      setErrorMessage("An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center
    p-4 bg-gradient-to-br from-green-50 to-white relative">
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
 
            <Image
              src="/logo.png"
              width={150}
              height={150}
              alt="logo"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-medium text-gray-800 mb-1">
              Password forgotten 👋
            </h1>
            <p className="text-sm text-gray-600">
              Entrez votre e-mail pour le processus de vérification, nous vous enverrons un code à 4 chiffres à votre e-mail.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <div className="form-label">
                Adresse e-mail <span className="text-red-600 font-bold">*</span>
              </div>
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
              className="p-3 rounded-lg text-white font-medium hover:bg-primary-clr btn-primary w-full mt-10"
              disabled={loading} 
            >
              {loading ? "Envoi en cours..." : "Envoyer une instruction de réinitialisation"}
            </button>

            <p className="text-sm text-gray-600 text-center mt-1">
              Vous n&apos;avez pas de compte ?{" "}
              <a href="/register" className="text-primary hover:underline">
                Inscrivez-vous maintenant
              </a>
            </p>
          </form>
        </div>

        <div className="hidden md:block flex-1">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full max-w-sm">
              <img
                src="/Auth illustrations/Forgot password.png"
                alt="Login illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;