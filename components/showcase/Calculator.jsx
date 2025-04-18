"use client";
import React, { useState } from "react";

const Calculator = () => {
  const [emailInput, setEmailInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Email submitted:", emailInput);
  };

  return (
    <>
    
      <section 
      className="bg-[#8ebe21] flex items-center justify-center min-h-[30vh] py-4">
        <div className="w-full  text-center">
          <h2 className="text-4xl text-white font-extrabold mb-1">
            Calculez votre empreinte carbone
          </h2>
          <p className="text-white mb-6">
            Évaluez les informations clés pour estimer vos émissions de CO₂
          </p>

        <div>
        <form
            onSubmit={handleSubmit}
            className="flex items-center max-w-xl mx-auto gap-2 justify-center w-full "
          >
            <input
              type="email"
              placeholder="Entrez votre email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="w-full flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-[#fff] text-black font-bold px-6 py-2 rounded-lg hover:bg-green-700 hover:text-white transition"
            >
              Calculer
            </button>
          </form>
        </div>
        </div>
      </section>
 
    </>
  );
};

export default Calculator;
