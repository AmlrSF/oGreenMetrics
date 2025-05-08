"use client";

import React, { useEffect, useState } from "react";
import { IconEye, IconTrash, IconCalculator } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const SitesPage = () => {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [user, setUser] = useState(null);
  const itemsPerPage = 5;
  const router = useRouter();

  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    filterAndSortSites();
  }, [sites, currentFilter, sortOrder]);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const authRes = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });
      const authData = await authRes.json();
      setUser(authData.user);

      const siteRes = await fetch("http://localhost:4000/site");
      const siteData = await siteRes.json();

      const userSites = siteData?.data?.filter(
        (item) => item?.userId === authData?.user._id
      );
      setSites(userSites);
    } catch (err) {
      setError("Failed to fetch sites. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSites = () => {
    let filtered = [...sites];

    // Apply filters
    if (currentFilter === "green") {
      filtered = filtered.filter((site) => site.green);
    } else if (currentFilter === "non-green") {
      filtered = filtered.filter((site) => !site.green);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setFilteredSites(filtered);
    setCurrentPage(1); // Reset to first page when filtering/sorting
  };

  const handleDelete = async (siteId) => {
    try {
      const response = await fetch(`http://localhost:4000/site/${siteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setSites((prevSites) => prevSites.filter((site) => site._id !== siteId));
      } else {
        throw new Error("Failed to delete site");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete site. Please try again later.");
    }
  };
  const paginateData = filteredSites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-xl">
      <div className="d-flex  align-items-center py-2 mb-4 justify-content-between">
        <div className="  d-flex 
         flex-column justify-content-center align-items-start">
          <h3
            className="text-2xl mb-0 font-bold "
          
          >
            Website Carbon Footprint
          </h3>
          <div className=" mb-0card-subtitle">
            Monitor and analyze the environmental impact of websites
          </div>
        </div>
        <button
          className="btn btn-primary ms-auto d-flex align-items-center gap-2"
       
        >
          <IconCalculator size={18} />
          Calculate New Site
        </button>
      </div>

      <div className="card">
        <div className="card-body border-bottom py-3">
          <div className="d-flex">
            <div className="text-secondary d-flex align-items-center">
              Show
              <div className="mx-2 d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={currentFilter}
                  onChange={(e) => setCurrentFilter(e.target.value)}
                >
                  <option value="all">All Sites</option>
                  <option value="green">Green Sites</option>
                  <option value="non-green">Non-Green Sites</option>
                </select>

                <select
                  className="form-select form-select-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="latest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
              entries
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card-body">
            <div className="progress progress-sm">
              <div
                className="progress-bar progress-bar-indeterminate"
                style={{ backgroundColor: "#8EBE21" }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Green</th>
                    <th>Bytes</th>
                    <th>CO2 (Grid)</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginateData.map((site) => (
                    <tr key={site._id}>
                      <td>{site.url}</td>
                      <td>
                        <span
                          className={`badge ${
                            site.green ? "bg-success-lt" : "bg-danger-lt"
                          }`}
                        >
                          {site.green ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>{site.bytes?.toLocaleString() || "-"}</td>
                      <td>
                        {site.statistics?.co2?.grid?.grams.toFixed(4) || "-"}g
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            site.rating === "A"
                              ? "bg-success-lt"
                              : site.rating === "B"
                              ? "bg-primary-lt"
                              : site.rating === "C"
                              ? "bg-warning-lt"
                              : "bg-danger-lt"
                          }`}
                        >
                          {site.rating || "-"}
                        </span>
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button
                            onClick={() => router.push(`/Dashboard/Regular/Sites/${site._id}`)}
                            className="btn btn-ghost-blue btn-icon"
                          >
                            <IconEye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(site._id)}
                            className="btn btn-ghost-danger btn-icon"
                          >
                            <IconTrash  size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer d-flex align-items-center">
              <p className="m-0 text-secondary">
                Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span>
                  {Math.min(currentPage * itemsPerPage, filteredSites.length)}
                </span>{" "}
                of <span>{filteredSites.length}</span> entries
              </p>
              <ul className="pagination d-flex gap-3 m-0 ms-auto">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M15 6l-6 6l6 6" />
                    </svg>
                  </button>
                </li>
                <li className="page-item active">
                  <span
                    className="page-link bg-primary"
                
                  >
                    {currentPage}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 6l6 6l-6 6" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SitesPage;