"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

function WebsiteCalculator() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateCarbon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      const encodedUrl = encodeURIComponent(url);

      const response = await fetch(
        `https://api.websitecarbon.com/site?url=${encodedUrl}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to calculate website carbon footprint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Website Carbon Calculator</h3>
      </div>
      <div className="card-body">
        <form onSubmit={calculateCarbon}>
          <div className="input-group mb-3">
            <input
              type="url"
              className="form-control"
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
              ) : (
                <Search size={18} />
              )}
              Calculate
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {result && (
          <div className="table-responsive">
            <table className="table table-vcenter card-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Website URL</td>
                  <td>{result.url}</td>
                </tr>
                <tr>
                  <td>Green Hosting</td>
                  <td>
                    <span
                      className={`badge bg-${
                        result.green ? "success" : "danger"
                      }`}
                    >
                      {result.green ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Total Bytes</td>
                  <td>{(result.bytes / 1024).toFixed(2)} KB</td>
                </tr>
                <tr>
                  <td>Cleaner Than</td>
                  <td>
                    {(result.cleanerThan * 100).toFixed(1)}% of tested websites
                  </td>
                </tr>
                <tr>
                  <td>Energy per Visit</td>
                  <td>{(result.statistics.energy * 1000).toFixed(2)} mWh</td>
                </tr>
                <tr>
                  <td>CO2 Grid (grams)</td>
                  <td>{result.statistics.co2.grid.grams.toFixed(4)} g</td>
                </tr>
                <tr>
                  <td>CO2 Renewable (grams)</td>
                  <td>{result.statistics.co2.renewable.grams.toFixed(4)} g</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebsiteCalculator;
