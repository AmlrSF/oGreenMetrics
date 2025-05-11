"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  IconBuildingSkyscraper,
  IconFileText,
  IconUsers,
  IconTrendingUp,
  IconUserCheck,
  IconBuilding,
  IconShieldLock,
  IconEye,
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconArrowUp,
  IconArrowDown,
  IconUserX,
} from "@tabler/icons-react";
import { getInitials } from "@/lib/Utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { getCountryCode, roleTypes, industryBadgeColors } from "@/lib/Data";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CompanyDash = () => {
  const [companyCount, setCompanyCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [recentRoles, setRecentRoles] = useState([]);
  const [sites, setSites] = useState([]);
  const router = useRouter();
  const [isBest, setIsBest] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = React.useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [companiesEmissions, setCompaniesEmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [RolesUser, setRolesUser] = useState([]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  const getIndustryCounts = () => {
    const counts = {};
    companies.forEach((company) => {
      counts[company.industrie] = (counts[company.industrie] || 0) + 1;
    });
    return counts;
  };

  const getCountryCounts = () => {
    const counts = {};
    companies.forEach((company) => {
      counts[company.country] = (counts[company.country] || 0) + 1;
    });
    return counts;
  };

  const sortedSites = sites
    ?.sort((a, b) =>
      isBest
        ? a.statistics.co2.grid.grams - b.statistics.co2.grid.grams
        : b.statistics.co2.grid.grams - a.statistics.co2.grid.grams
    )
    .slice(0, 10);

  const sortedCompanies = companiesEmissions?.sort((a, b) =>
    isBest
      ? a.totalEmissions - b.totalEmissions
      : b.totalEmissions - a.totalEmissions
  );

  const handleToggle = () => {
    setIsBest((prevState) => !prevState);
  };

  const stats = [
    {
      title: "Entreprises",
      value: companyCount,
      icon: IconBuildingSkyscraper,
      trend: "+12%",
      color: "primary",
    },
    {
      title: "Rapports",
      value: reportCount,
      icon: IconFileText,
      trend: "+8%",
      color: "purple",
    },
    {
      title: "Utilisateurs",
      value: userCount,
      icon: IconUsers,
      trend: "+15%",
      color: "green",
    },
    {
      title: "Admins",
      value: adminCount,
      icon: IconTrendingUp,
      trend: "+5%",
      color: "orange",
    },
  ];

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/companies");
      const companiesData = response.data.data;
      setCompanyCount(companiesData.length);
      setCompanies(companiesData);
      setRecentCompanies(companiesData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/users");
      const users = response.data;

      const admins = users.filter(
        (item) => item?.AdminRoles || item?.role === "Admin"
      ).length;

      const nonAdmins = users.filter((item) => item?.role === "régulier" || item?.role === "entreprise").length;

      console.log(nonAdmins);
      

      setAdminCount(admins);
      setUserCount(nonAdmins);

      setRecentUsers(
        users
          .filter((item) => item?.role === "régulier" || item?.role === "entreprise")
          .slice(0, 5)
      );

      console.log(users);
      
      setRolesUser(users.filter((item) => item?.AdminRoles).slice(0, 5));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:4000/reports");
      setReportCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchSites = async () => {
    try {
      const response = await axios.get("http://localhost:4000/site");
      setSites(response?.data?.data);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:4000/roles");
      setRecentRoles(response?.data?.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  
  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    fetchReports();
    fetchSites();
    fetchRoles();
  }, []);

  const calculateTotalEmissions = (data) => {
    let total = 0;

    // Scope 1
    if (data.scope1Data) {
      // Fuel combustion
      data.scope1Data.fuelCombution?.forEach((item) => {
        total += item.totalEmissions || 0;
      });
      // Production
      data.scope1Data.production?.forEach((item) => {
        total += item.totalEmissions || 0;
      });
    }

    // Scope 2
    if (data.scope2Data) {
      total += data.scope2Data.heating?.totalEmissions || 0;
      total += data.scope2Data.cooling?.totalEmissions || 0;
      total += data.scope2Data.energyConsumption?.emissions || 0;
    }

    // Scope 3
    if (data.scope3Data) {
      // Transport
      data.scope3Data.transport?.forEach((item) => {
        total += parseFloat(item.emissions) || 0;
      });
      // Waste
      data.scope3Data.dechet?.forEach((item) => {
        total += parseFloat(item.emissions) || 0;
      });
      // Capital Goods
      data.scope3Data.capitalGood?.forEach((item) => {
        total += parseFloat(item.emissions) || 0;
      });
      // Business Travel
      data.scope3Data.businessTravel?.forEach((item) => {
        total += parseFloat(item.emissions) || 0;
      });
      // Employee Transport
      data.scope3Data.employesTransport?.forEach((item) => {
        total += parseFloat(item.emissions) || 0;
      });
      // Purchased Goods
      data.scope3Data.purchasedGood?.forEach((item) => {
        total += item.emissions || 0;
      });
    }

    return total;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await fetch(
          "http://localhost:4000/companies"
        );
        const companiesData = await companiesResponse.json();
        const companies = companiesData.data;

        const emissionsPromises = companies.map(async (company) => {
          const response = await fetch(
            `http://localhost:4000/report/full/${company._id}`
          );
          const data = await response.json();
          console.log(data);

          const totalEmissions = calculateTotalEmissions(data?.data);

          return {
            id: company._id,
            name: company.nom_entreprise,
            totalEmissions,
            industry: company.industrie,
          };
        });

        const emissionsData = await Promise.all(emissionsPromises);

        const sortedEmissions = emissionsData
          .sort((a, b) => b.totalEmissions - a.totalEmissions)
          .slice(0, 5);

        setCompaniesEmissions(sortedEmissions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateToCompanyDetails = (companyId) => {
    router.push(`/Dashboard/Admin/companies/${companyId}`);
  };

  const handleApproveUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVerified: !selectedUser.isVerified,
          }),
        }
      );
      await response.json();
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.log("Failed to update user status");
    }
  };

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <div className="page-body">
      {modalOpen && selectedUser && (
        <div className="modal modal-blur fade show d-block">
          <div
            style={{ zIndex: 1050 }}
            className="modal-dialog modal-dialog-centered modal-sm"
          >
            <div className="modal-content">
              <div className="modal-body">
                <div className="text-center py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler text-warn mb-2 icons-tabler-filled icon-tabler-alert-hexagon"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10.425 1.414a3.33 3.33 0 0 1 3.026 -.097l.19 .097l6.775 3.995l.096 .063l.092 .077l.107 .075a3.224 3.224 0 0 1 1.266 2.188l.018 .202l.005 .204v7.284c0 1.106 -.57 2.129 -1.454 2.693l-.17 .1l-6.803 4.302c-.918 .504 -2.019 .535 -3.004 .068l-.196 -.1l-6.695 -4.237a3.225 3.225 0 0 1 -1.671 -2.619l-.007 -.207v-7.285c0 -1.106 .57 -2.128 1.476 -2.705l6.95 -4.098zm1.585 13.586l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                  </svg>
                  <h3>Êtes-vous sûr ?</h3>
                  <div className="text-muted">
                    {modalType === "approve"
                      ? selectedUser.isVerified
                        ? "Voulez-vous désapprouver cet utilisateur ?"
                        : "Voulez-vous approuver cet utilisateur ?"
                      : "Voulez-vous supprimer cet utilisateur ?"}
                  </div>
                  <div className="text-muted mt-2">
                    <strong>
                      {selectedUser.prenom} {selectedUser.nom}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="w-100">
                  <div className="row">
                    <div className="col">
                      <button
                        className="btn w-100"
                        onClick={() => setModalOpen(false)}
                      >
                        Annuler
                      </button>
                    </div>
                    <div className="col">
                      <button
                        className={`btn w-100 ${
                          modalType === "approve"
                            ? selectedUser.isVerified
                              ? "btn-danger"
                              : "btn-success"
                            : "btn-danger"
                        }`}
                        onClick={handleApproveUser}
                      >
                        {selectedUser.isVerified ? "Désapprouver" : "Approuver"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setModalOpen(false)}
          ></div>
        </div>
      )}
      <div className="container-xl ">
        <div className="page-header mb-2">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Aperçu du Tableau de Bord.</h2>
            </div>
          </div>
        </div>

        <div className="container-card  gap-2">
          {stats.map((stat, index) => (
            <div className="card " key={index}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className={`icon-box p-2 badge icon-box-sm 
                      bg-${stat.color}-lt`}
                  >
                    <stat.icon className={`icon text-${stat.color}`} size={3} />
                  </div>
                  <div className="ms-auto">
                    <div
                      className={`text-${stat.color} d-flex align-items-center`}
                    >
                      <IconTrendingUp size={16} className="me-1" />
                      {stat.trend}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-baseline">
                  <div className="h1 mb-0 me-2">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="me-auto">
                    <span className="text-muted">{stat.title}</span>
                  </div>
                </div>

                <div className="progress progress-sm mt-3">
                  <div
                    className={`progress-bar bg-${stat.color}`}
                    style={{
                      width: `${Math.min((stat.value / 100) * 100, 100)}%`,
                    }}
                    role="progressbar"
                    aria-valuenow={stat.value}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span className="visually-hidden">
                      {stat.value}% Complete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="page-header mt-5 mb-2">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">
                Aperçu du nombre d'entreprises par type d'industrie.
              </h2>
            </div>
          </div>
        </div>

        <div className="position-relative my-4">
          <button
            onClick={() => scroll("left")}
            className="btn btn-icon btn-ghost-primary position-absolute start-0 top-50 translate-middle-y z-2 shadow"
          >
            <IconChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="d-flex gap-3 overflow-auto px-5 pb-2"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {Object.entries(getIndustryCounts()).map(
              ([industry, count], index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{ minWidth: "280px" }}
                >
                  <div className="card shadow-sm">
                    <div className="card-body p-3">
                      <div className="d-flex flex-column align-items-start gap-2">
                        <div
                          className={`badge ${
                            industryBadgeColors[industry] ||
                            industryBadgeColors.Default
                          } p-2`}
                        >
                          <IconBuilding size={18} className="me-1" />
                          {industry}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="h1 mb-0">{count}</span>
                          <span className="text-muted">entreprises</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <button
            onClick={() => scroll("right")}
            className="btn btn-icon btn-ghost-primary position-absolute end-0 top-50 translate-middle-y z-2 shadow"
          >
            <IconChevronRight />
          </button>

          <style>
            {`
      .overflow-auto::-webkit-scrollbar {
        display: none;
      }
    `}
          </style>
        </div>

        <div className="page-header mb-2">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">
                Aperçu des informations les plus récentes.
              </h2>
            </div>
          </div>
        </div>

        <div
          className="mt-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px,1fr))",
            gap: "10px",
          }}
        >
          <div className="card">
            <div className="card-header d-flex align-content-center justify-content-between">
              <h3 className="card-title">
                <IconUserCheck className="icon me-2" />
                Utilisateurs Récents
              </h3>
              <a href="/Dashboard/Admin/users" className="btn  btn-primary">
                Gérez les utilisateurs
              </a>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Role</th>

                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span
                            className="avatar border-1 border-gray-950 avatar-md text-white me-2"
                            style={{ backgroundColor: "#263589" }}
                          >
                            {user.photo_de_profil ? (
                              <img
                                className="w-full h-full rounded-sm object-fit-cover"
                                src={user.photo_de_profil}
                                alt={`${user.prenom} ${user.nom}`}
                              />
                            ) : (
                              getInitials(user.prenom, user.nom)
                            )}
                          </span>
                          {`${user.prenom} ${user.nom}`}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            roleTypes[user.role?.toLowerCase()]
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            user.isVerified ? "bg-success-lt" : "bg-danger-lt"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => openModal("approve", user)}
                          className={`btn btn-ghost-${
                            user.isVerified ? "danger" : "success"
                          } btn-icon`}
                        >
                          {user.isVerified ? (
                            <IconUserX size={18} />
                          ) : (
                            <IconUserCheck size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-content-center justify-content-between">
              <h3 className="card-title ">
                <IconBuilding className="icon me-2" />
                Entreprises Récentes
              </h3>
              <a href="/Dashboard/Admin/companies" className="btn  btn-primary">
                Gérez les entreprises
              </a>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Industrie</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCompanies.map((company, index) => (
                    <tr key={index}>
                      <td>{company.nom_entreprise}</td>
                      <td>
                        <span
                          className={`badge ${
                            industryBadgeColors[company.industrie] ||
                            industryBadgeColors.Default
                          }`}
                        >
                          {company.industrie}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => navigateToCompanyDetails(company._id)}
                          className="btn btn-ghost-blue btn-icon"
                        >
                          <IconEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-content-center justify-content-between">
              <h3 className="card-title">
                <IconShieldLock className="icon me-2" />
                Rôles Récents
              </h3>{" "}
              <a
                href="/Dashboard/Admin/users"
                className="btn d-flex align-items-center gap-2   btn-primary"
              >
                <IconPlus size={18} className="text-white" />
                Ajouter un rôle
              </a>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRoles.map((role, index) => (
                    <tr key={index}>
                      <td>{role.name}</td>
                      <td>
                        <span className="text-muted">
                          {role.description || "Aucune description"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-content-center justify-content-between">
              <h3 className="card-title">
                <IconUserCheck className="icon me-2" />
                Modérateurs  Récents
              </h3>
              <a href="/Dashboard/Admin/Users-management" className="btn  btn-primary">
                Gérez les Modérateurs 
              </a>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Role</th>

                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {RolesUser.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span
                            className="avatar border-1 border-gray-950 avatar-md text-white me-2"
                            style={{ backgroundColor: "#263589" }}
                          >
                            {user.photo_de_profil ? (
                              <img
                                className="w-full h-full rounded-sm object-fit-cover"
                                src={user.photo_de_profil}
                                alt={`${user.prenom} ${user.nom}`}
                              />
                            ) : (
                              getInitials(user.prenom, user.nom)
                            )}
                          </span>
                          {`${user.prenom} ${user.nom}`}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge `}
                        >
                          {user?.AdminRoles?.name}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            user.isVerified ? "bg-success-lt" : "bg-danger-lt"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => openModal("approve", user)}
                          className={`btn btn-ghost-${
                            user.isVerified ? "danger" : "success"
                          } btn-icon`}
                        >
                          {user.isVerified ? (
                            <IconUserX size={18} />
                          ) : (
                            <IconUserCheck size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="page-header mt-5 mb-2">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">
                Aperçu du nombre d'entreprises par pays.
              </h2>
            </div>
          </div>
        </div>

        <div className="position-relative my-4">
          <button
            onClick={() => scroll("left")}
            className="btn btn-icon btn-ghost-primary position-absolute start-0 top-50 translate-middle-y z-2 shadow"
          >
            <IconChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="d-flex gap-3 overflow-auto px-5 pb-2"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {Object.entries(getCountryCounts()).map(
              ([country, count], index) => {
                const countryCode = getCountryCode(country);

                return (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{ minWidth: "280px" }}
                  >
                    <div className="card shadow-sm">
                      <div className="card-body p-3">
                        <div className="d-flex flex-column align-items-start gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`flag flag-country-${countryCode}`}
                            ></span>
                            <span className="fw-bold">{country}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="h1 mb-0">{count}</span>
                            <span className="text-muted">entreprises</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <button
            onClick={() => scroll("right")}
            className="btn btn-icon btn-ghost-primary position-absolute end-0 top-50 translate-middle-y z-2 shadow"
          >
            <IconChevronRight />
          </button>

          <style>
            {`
      .overflow-auto::-webkit-scrollbar {
        display: none;
      }
    `}
          </style>
        </div>

        <div className="page-header mt-5 mb-2 w-100">
          <div
            className="
          d-flex w-100 justify-content-between 
          align-items-center"
          >
            <div>
              <h2 className="page-title">Classement des informations</h2>
              <div className="text-muted">
                Top sites basés sur les rapports ou autres métriques.
              </div>
            </div>
            <button onClick={handleToggle} className="btn btn-primary">
              {isBest ? "Show Worst" : "Show Best"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="card p-4">
            <div className="animate-pulse flex space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mt-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(550px,1fr))",
              gap: "10px",
            }}
          >
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-lg font-bold">
                  Top 5 Sites par Émissions
                </h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-vcenter">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nom du Site</th>
                        <th>Emission CO₂ (grammes)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSites?.map((site, index) => {
                        const rankIcons = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
                        const rankColors = [
                          "#FFD700",
                          "#C0C0C0",
                          "#CD7F32",
                          "#8e8e8e",
                          "#8e8e8e",
                        ];
                        const icon = index < 5 ? rankIcons[index] : index + 1;
                        const color = index < 5 ? rankColors[index] : "#666";

                        return (
                          <tr key={site._id}>
                            <td style={{ color, fontWeight: "bold" }}>
                              {icon}
                            </td>
                            <td>
                              <a
                                href={site.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {new URL(site.url).hostname}
                              </a>
                            </td>
                            <td>
                              <span className="badge bg-purple-lt text-purple">
                                {site.statistics.co2.grid.grams?.toFixed(2)}{" "}
                                G/USER
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-lg font-bold">
                  Top 5 Entreprises par Émissions
                </h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-vcenter">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Entreprise</th>
                        <th>Industrie</th>
                        <th>Émissions Totales </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCompanies?.map((company, index) => {
                        const rankIcons = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
                        const rankColors = [
                          "#FFD700",
                          "#C0C0C0",
                          "#CD7F32",
                          "#8e8e8e",
                          "#8e8e8e",
                        ];
                        const icon = index < 5 ? rankIcons[index] : index + 1;
                        const color = index < 5 ? rankColors[index] : "#666";

                        return (
                          <tr
                            key={index}
                            className={index === 0 ? "bg-yellow-50" : ""}
                          >
                            <td style={{ color, fontWeight: "bold" }}>
                              {icon}
                            </td>
                            <td className="font-medium">
                              <span
                                className="url"
                                onClick={() =>
                                  navigateToCompanyDetails(company._id)
                                }
                              >
                                {company.name}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {company.industry}
                              </span>
                            </td>
                            <td className="font-semibold">
                              <span className="badge bg-purple-lt text-purple">
                                {company.totalEmissions?.toFixed(2)} Kg/Co2
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDash;
