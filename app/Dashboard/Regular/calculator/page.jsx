"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Leaf,
  Globe,
  AlertCircle,
  Users,
  Copy,
  Check,
  Coffee,
  BatteryCharging,
  Plus,
  Minus,
} from "lucide-react";

function WebsiteCalculator() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSave, setShowSave] = useState(true);
  const [visits, setVisits] = useState(10000);
  const [counter, setCounter] = useState(1);

  const increment = () => {
    if (counter < 10000) {
      setCounter(counter * 10);
    }
  };

  const decrement = () => {
    if (counter > 1) {
      setCounter(counter / 10);
    }
  };

  useEffect(() => {
    let interval;
    if (result) {
      interval = setInterval(() => {
        setVisits((prev) => (prev < 10000 ? prev + 50 : 10000));
      }, 15);
    } else {
      setVisits(1000);
    }
    return () => clearInterval(interval);
  }, [result]);

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

  const SaveSiteDetails = async () => {
    if (!result) {
      alert("Please calculate the carbon footprint first.");
      return;
    }
    setSaving(true);
    try {
      await fetch("http://localhost:4000/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?._id,
          ...result,
        }),
      });
      setShowSave(false);
    } catch (err) {
      alert("Error saving site details: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserReponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const UseData = await UserReponse.json();
        if (UseData?.user) {
          setUser(UseData?.user);
        }
      } catch (error) {
        // Silent fail
      }
    };
    fetchUser();
  }, []);

  // Helper function for rating color
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

  // Helper function for CO2 formatting
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

  return (
    <div className="container-xl py-4">
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="card shadow-sm p-0"
            style={{
              borderRadius: "10px",
              background: "#fff",
              color: "#000",
              overflow: "hidden",
            }}
          >
            <div className="card-body p-4">
              <div className="flex align-items-center">
                <div className="col-9">
                  <h2 className="mb-0 fw-bold" style={{ color: "#000" }}>
                    Website Carbon Calculator
                  </h2>
                  <div className="text-muted mb-2">
                    Calculate your website's carbon footprint
                  </div>
                </div>
                <div className="col-3 text-end sm:block hidden">
                  <div className="badge bg-green-lt d-inline-flex align-items-center p-2">
                    <Leaf className="icon " />
                    Eco-friendly tool
                  </div>
                </div>
              </div>
              <form className="mt-4" onSubmit={calculateCarbon}>
                <div className="input-group input-group-md mb-2">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Enter website URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <button
                    className="btn btn-primary border-black border-1 border"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <Search className="icon me-2" />
                    )}
                    Calculate
                  </button>
                </div>
              </form>
              {error && (
                <div className="alert alert-danger mt-3">
                  <AlertCircle className="icon me-2" />
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div
                  className="card shadow-xl mb-4"
                  style={{
                    borderRadius: "30px",
                    background: "#1900e1",
                    color: "#fff",
                  }}
                >
                  <div className="card-body p-4 d-flex align-items-center">
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
                      <h3 className="mb-1 fw-bold" style={{ color: "#fff" }}>
                        Hurrah! This web page achieves a carbon rating of{" "}
                        <span className="fw-bold">{result?.rating}</span>
                      </h3>
                      <div className="mb-1">
                        This is cleaner than{" "}
                        <span className="badge bg-cyan-lt text-cyan me-1">
                          {((result?.cleanerThan || 0) * 100).toFixed(0)}%
                        </span>
                        of all web pages globally.
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold" style={{ color: "#fff" }}>
                          A+
                        </span>
                        <span
                          className="progress"
                          style={{
                            height: 10,
                            width: 120,
                            background: "#fff5",
                            borderRadius: 8,
                            overflow: "hidden",
                          }}
                        >
                          <span
                            className="progress-bar bg-success"
                            style={{
                              width: `${Math.max(
                                5,
                                100 * (result?.cleanerThan || 0)
                              )}%`,
                            }}
                          ></span>
                        </span>
                        <span style={{ color: "#fff", fontWeight: 600 }}>
                          F
                        </span>
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                          }}
                          className="btn btn-light btn-sm"
                          title="Copy URL"
                        >
                          <Copy className="icon me-1" /> Copy URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CO2 summary */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-4"
                >
                  <div className="card shadow" style={{ borderRadius: 20 }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <Globe className="icon me-2 text-primary" size={30} />
                        <span
                          className="fw-bold fs-4 px-3 py-1"
                          style={{
                            background: "rgba(0,229,255,0.13)",
                            borderRadius: 8,
                          }}
                        >
                          {formatCO2(result?.statistics?.co2?.grid?.grams )}
                        </span>
                        <span className="ms-2 fs-5">
                          of CO₂ is produced every time someone visits this web
                          page.
                        </span>
                      </div>

                      <div className="bg-light rounded p-4">
                        <div className="d-flex align-items-center justify-content-center gap-4 mb-4">
                          <button
                            onClick={decrement}
                            className="btn btn-primary rounded-circle fw-bold"
                            style={{ width: 48, height: 48 }}
                            disabled={counter === 1}
                          >
                            <Minus height={40} width={40} />
                          </button>

                          <div
                            className="bg-white px-4 py-2 rounded shadow-sm text-center"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-muted small mb-1">
                              Number of Users
                            </div>
                            <div className="fs-3 fw-bold text-primary">
                              {counter}
                            </div>
                          </div>

                          <button
                            onClick={increment}
                            className="btn btn-primary text-xl rounded-circle fw-bold"
                            style={{ width: 48, height: 48 }}
                            disabled={counter === 10000}
                          >
                            <Plus height={40} width={40} />
                          </button>
                        </div>

                        <div className="bg-light-lt rounded p-4 text-center">
                          <div className="text-muted mb-2">
                            Total CO₂ Emissions
                          </div>
                          <div className="fs-2 fw-bold text-primary">
                            {formatCO2(counter * result?.statistics?.co2?.grid?.grams )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Energy summary */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-4"
                >
                  <div className="card shadow" style={{ borderRadius: 20 }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center ">
                        <BatteryCharging
                          className="icon me-2 text-green"
                          size={30}
                        />
                        <span className="fs-5 fw-bold">
                          This web page appears to be running on{" "}
                          <span className="badge bg-green-lt text-green fs-5">
                            sustainable energy
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {showSave && (
                  <button
                    className="btn btn-success  mt-4 float-end"
                    onClick={SaveSiteDetails}
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <Check className="icon me-2" />
                    )}
                    Save to my dashboard
                  </button>
                )}
                {!showSave && (
                  <div className="alert alert-success mt-4 mb-0">
                    Site carbon data saved!
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebsiteCalculator;
