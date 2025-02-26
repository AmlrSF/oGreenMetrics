"use client";


import Image from "next/image";

const page = () => {
 

  return (
    <div className="min-h-screen bg-white flex items-center justify-center bg-gradient-to-br from-green-50 to-white relative">
      <Image
        src="/Auth illustrations/shape1.png"
        width={250}
        height={420}
        alt="Shape 1"
        className="absolute bottom-0 left-0  "
      />
      <Image
        src="/Auth illustrations/shape2.png"
        width={250}
        height={420}
        alt="shape 2"
        className="absolute top-0 right-0  "
      />

      <div className="bg-white z-20 p-8 rounded-lg shadow-lg w-full max-w-4xl flex gap-8 items-center">
        <div className="flex-1 space-y-6">
          <div className="flex items-center  mb-8">
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
            Entrez votre e-mail pour le processus de vérification, nous vous enverrons un code à 4 chiffres à votre e-mail.            </p>
          </div>

          <form className="">
            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-1">
                Adresse e-mail <span className="text-red-600 font-bold">*</span>
              </label>
              <input
                type="email"
                placeholder="Tapez votre adresse email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

     
            <button
              type="submit"
              className="w-full primary-clr-bg text-white font-medium py-2
               rounded-md  mt-10 transition-colors"
            >
              Envoyer une instruction de réinitialisation
            </button>

            <p className="text-sm text-gray-600 text-center mt-1">
              Vous n&apos;avez pas de compte ?{" "}
              <a href="#" className="primary-clr hover:underline">
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
