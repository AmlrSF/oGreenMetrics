"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Calculator = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateCarbon = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    setError(null);
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(
        `http://localhost:4000/carbon?url=${encodedUrl}`
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to calculate website carbon footprint");
    } finally {
      setLoading(false);
    }
  };

  const formatCO2 = (grams) => {
    if (grams >= 1000000) {
      return `${(grams / 1000000).toFixed(2)} tonnes`;
    } else if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`;
    } else if (grams < 1) {
      return `${(grams * 1000).toFixed(2)} mg`;
    } else {
      return `${grams.toFixed(2)} g`;
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case "A+":
        return "bg-green-lt text-green";
      case "A":
        return "bg-blue-lt text-blue";
      case "B":
        return "bg-yellow-lt text-yellow";
      case "C":
        return "bg-orange-lt text-orange";
      default:
        return "bg-red-lt text-red";
    }
  };

  return (
    <>
      <section style={{ background: "#8ebe21" }} className="py-4 calculator">
        <div className="container">
          <div className="text-center">
            <h2 className="display-5 text-white fw-bold mb-1">
              Calculez votre empreinte carbone
            </h2>
            <p className="text-white mb-4">
              Évaluez les informations clés pour estimer vos émissions de CO₂
            </p>

            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <form onSubmit={calculateCarbon} className="d-flex gap-2">
                  <input
                    type="url"
                    placeholder="Entrez l'URL du site"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="form-control"
                  />
                  <button
                    className="btn btn-light border-black border-1 border"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <svg  xmlns="http://www.w3.org/2000/svg" 
                       width="24"  height="24"  viewBox="0 0 24 24" 
                        fill="none"  stroke="currentColor"  
                        strokeWidth="2"  strokeLinecap="round" 
                         strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                    )}
                    Calculate
                  </button>
                </form>
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <div
                  className="spinner-border text-light"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="alert alert-danger mx-auto mt-4"
                    style={{ maxWidth: 600 }}
                  >
                    {error}
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.5 }}
                    className="container mt-4"
                  >
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <div
                          className="card shadow-lg mb-4"
                          style={{
                            borderRadius: "30px",
                            background: "#1900e1",
                            color: "#fff",
                          }}
                        >
                          <div className="card-body p-4 d-flex align-items-start">
                            <div
                              className={`avatar avatar-xl me-4 d-flex align-items-center justify-content-center ${getRatingColor(
                                result?.rating
                              )}`}
                              style={{
                                width: 80,
                                height: 80,
                                fontSize: 30,
                                fontWeight: "bold",
                                borderRadius: "50%",
                                background: "#fff",
                                color: "#8ebe21",
                              }}
                            >
                              {result?.rating || "A"}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 className="mb-1 text-left fw-bold text-white">
                                Hurrah! This web page achieves a carbon rating
                                of{" "}
                                <span className="fw-bold">
                                  {result?.rating}
                                </span>
                              </h3>
                              <div className="mb-1 text-left text-white">
                                This is cleaner than{" "}
                                <span className="badge bg-cyan-lt text-cyan me-1">
                                  {((result?.cleanerThan || 0) * 100).toFixed(
                                    0
                                  )}
                                  %
                                </span>
                                of all web pages globally.
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold text-white">A+</span>
                                <div
                                  className="progress"
                                  style={{
                                    height: 10,
                                    width: 120,
                                    background: "rgba(255,255,255,0.3)",
                                    borderRadius: 8,
                                  }}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    style={{
                                      width: `${Math.max(
                                        5,
                                        100 * (result?.cleanerThan || 0)
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-white fw-semibold">
                                  F
                                </span>
                              </div>
                            
                              <p className="text-left">
                                {" "}
                                Please{" "}
                                <a href="/login" className="fw-bold text-black">
                                  log in
                                </a>{" "}
                                to view CO₂ emission details.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Calculator;
