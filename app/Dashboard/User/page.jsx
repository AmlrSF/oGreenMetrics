"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  BarElement,
} from "chart.js";
import {
  IconTrendingUp,
  IconChartBar,
  IconChartPie,
  IconTruck,
  IconLamp,
  IconBuildingFactory,
  IconTarget,
  IconAlertTriangle,
  IconInfoCircle,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { toast } from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  BarElement,
  Legend,
  ArcElement,
  Filler
);

const COLORS = ["#206bc4", "#42e189", "#d618d6"];

const getFormattedDates = (createdDates) => {
  const dates = createdDates
    .map((date) => new Date(date))
    .sort((a, b) => a - b)
    .map((date) =>
      date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
    );
  return [...new Set(dates)];
};

const generateDailyData = (total, createdAt, allDates) => {
  const result = [];
  const emissionDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });

  for (let i = 0; i < allDates.length; i++) {
    const value = allDates[i] === emissionDate ? total : 0;
    result.push({
      name: allDates[i],
      value: value,
    });
  }

  return result;
};

const processEmissionsData = (data) => {
  if (!data) return null;

  const scope1Total =
    (data?.scope1Data?.fuelCombution?.[0]?.totalEmissions || 0) +
    (data?.scope1Data?.production?.[0]?.totalEmissions || 0);

  const scope2Total =
    (data?.scope2Data?.heating?.totalEmissions || 0) +
    (data?.scope2Data?.cooling?.totalEmissions || 0) +
    (data?.scope2Data?.energyConsumption?.emissions || 0);

  const scope3Total =
    (data?.scope3Data?.transport?.reduce(
      (sum, item) => sum + parseFloat(item.emissions || 0),
      0
    ) || 0) +
    (data?.scope3Data?.dechet?.reduce(
      (sum, item) => sum + parseFloat(item.emissions || 0),
      0
    ) || 0) +
    (data?.scope3Data?.capitalGood?.reduce(
      (sum, item) => sum + parseFloat(item.emissions || 0),
      0
    ) || 0) +
    (data?.scope3Data?.businessTravel?.reduce(
      (sum, item) => sum + parseFloat(item.emissions || 0),
      0
    ) || 0) +
    (data?.scope3Data?.purchasedGood?.reduce(
      (sum, item) => sum + parseFloat(item.emissions || 0),
      0
    ) || 0) +
    (data?.scope3Data?.employesTransport?.reduce(
      (sum, item) => sum + parseFloat(item.emissions || 0),
      0
    ) || 0);

  const allCreatedDates = [
    data?.scope1Data?.fuelCombution?.[0]?.createdAt,
    data?.scope1Data?.production?.[0]?.createdAt,
    data?.scope2Data?.heating?.createdAt,
    data?.scope2Data?.cooling?.createdAt,
    data?.scope2Data?.energyConsumption?.createdAt,
    ...(data?.scope3Data?.transport?.map((item) => item.createdAt) || []),
    ...(data?.scope3Data?.dechet?.map((item) => item.createdAt) || []),
    ...(data?.scope3Data?.capitalGood?.map((item) => item.createdAt) || []),
    ...(data?.scope3Data?.businessTravel?.map((item) => item.createdAt) || []),
    ...(data?.scope3Data?.purchasedGood?.map((item) => item.createdAt) || []),
    ...(data?.scope3Data?.employesTransport?.map((item) => item.createdAt) || []),
  ].filter((date) => date);

  const uniqueDates = getFormattedDates(allCreatedDates);

  return {
    scope1: {
      total: scope1Total,
      data: generateDailyData(
        scope1Total,
        data?.scope1Data?.fuelCombution?.[0]?.createdAt || new Date(),
        uniqueDates
      ),
      breakdown: [
        {
          source: "Fuel Combustion",
          value: data?.scope1Data?.fuelCombution?.[0]?.totalEmissions || 0,
        },
        {
          source: "Production",
          value: data?.scope1Data?.production?.[0]?.totalEmissions || 0,
        },
      ],
    },
    scope2: {
      total: scope2Total,
      data: generateDailyData(
        scope2Total,
        data?.scope2Data?.energyConsumption?.createdAt || new Date(),
        uniqueDates
      ),
      breakdown: [
        {
          source: "Heating",
          value: data?.scope2Data?.heating?.totalEmissions || 0,
        },
        {
          source: "Cooling",
          value: data?.scope2Data?.cooling?.totalEmissions || 0,
        },
        {
          source: "Energy",
          value: data?.scope2Data?.energyConsumption?.emissions || 0,
        },
      ],
    },
    scope3: {
      total: scope3Total,
      data: generateDailyData(
        scope3Total,
        data?.scope3Data?.transport?.[0]?.createdAt || new Date(),
        uniqueDates
      ),
      breakdown: [
        {
          source: "Transport",
          value:
            data?.scope3Data?.transport?.reduce(
              (sum, item) => sum + parseFloat(item.emissions || 0),
              0
            ) || 0,
        },
        {
          source: "Waste",
          value:
            data?.scope3Data?.dechet?.reduce(
              (sum, item) => sum + parseFloat(item.emissions || 0),
              0
            ) || 0,
        },
        {
          source: "Capital Goods",
          value:
            data?.scope3Data?.capitalGood?.reduce(
              (sum, item) => sum + parseFloat(item.emissions || 0),
              0
            ) || 0,
        },
        {
          source: "Business Travel",
          value:
            data?.scope3Data?.businessTravel?.reduce(
              (sum, item) => sum + parseFloat(item.emissions || 0),
              0
            ) || 0,
        },
        {
          source: "Transport d'employes",
          value:
            data?.scope3Data?.employesTransport?.reduce(
              (sum, item) => sum + parseFloat(item.emissions || 0),
              0
            ) || 0,
        },
        {
          source: "Purchased Goods And Service",
          value:
            data?.scope3Data?.purchasedGood?.reduce(
              (sum, item) => sum + parseFloat(item.emissions || 0),
              0
            ) || 0,
        },
      ],
    },
  };
};

const EmissionCard = ({ title, icon: Icon, value, color, data, breakdown }) => {
  return (
    <div className="card card-sm shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar avatar-sm me-3" style={{ backgroundColor: `${color}20` }}>
            <Icon className="icon" style={{ color }} />
          </div>
          <h3 className="card-title mb-0 fw-bold">{title}</h3>
        </div>
        <div className="d-flex align-items-center">
          <div className="h2 mb-0 me-2">{Number(value).toFixed(2)} tCO₂e</div>
          <IconTrendingUp className="icon-sm text-green" />
        </div>
      </div>
    </div>
  );
};

const GoalProgressCard = () => { 
  return (
    <div className="card card-sm shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar avatar-sm me-3" style={{ backgroundColor: "#206bc420" }}>
            <IconTarget className="icon" style={{ color: "#206bc4" }} />
          </div>
          <h3 className="card-title mb-0 fw-bold">Réduisez vos émissions</h3>
        </div>
        <Link href="/Dashboard/User/goals" className="text-primary fw-medium">
          Définir un objectif maintenant
        </Link>
      </div>
    </div>
  );
};

const CriticalPointsCard = ({ emissions }) => {
  const criticalPoints = [
    emissions.scope1.total > 1000 && "Scope 1 dépasse 1000 tCO₂e",
    emissions.scope2.total > 1000 && "Scope 2 dépasse 1000 tCO₂e",
    emissions.scope3.total > 1000 && "Scope 3 dépasse 1000 tCO₂e",
  ].filter(Boolean);

  return (
    <div className="card card-sm shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar avatar-sm me-3" style={{ backgroundColor: "#d6393920" }}>
            <IconAlertTriangle className="icon" style={{ color: "#d63939" }} />
          </div>
          <h3 className="card-title mb-0 fw-bold">Points Critiques</h3>
        </div>
        {criticalPoints.length > 0 ? (
          <ul className="list-unstyled mb-0">
            {criticalPoints.map((point, index) => (
              <li key={index} className="text-danger mb-2">
                • {point}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted">Aucun point critique détecté.</div>
        )}
      </div>
    </div>
  );
};

const CompanyInfoCard = ({ company, owner }) => {
  return (
    <div className="card card-sm shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar avatar-sm me-3" style={{ backgroundColor: "#206bc420" }}>
            <IconInfoCircle className="icon" style={{ color: "#206bc4" }} />
          </div>
          <h3 className="card-title mb-0 fw-bold">{company.nom_entreprise}</h3>
        </div>
        <div className="text-muted mb-2">
          <strong>Propriétaire:</strong> {owner.prenom} {owner.nom}
        </div>
        <div className="text-muted mb-2">
          <strong>Secteur:</strong> {company.industrie}
        </div>
        <div className="text-muted mb-2">
          <strong>Localisation:</strong> {company.adresse}, {company.country}
        </div>
        <div className="text-muted">
          <strong>Fondation:</strong>{" "}
          {new Date(company.date_fondation).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
};

const RecommendationsCard = () => {
  const recommendations = [
    "Adoptez des sources d'énergie renouvelables pour réduire les émissions de Scope 2.",
    "Optimisez la logistique et privilégiez des transports à faible émission pour Scope 3.",
    "Mettez en place un programme de recyclage pour réduire les déchets (Scope 3).",
    "Investissez dans des équipements éco-énergétiques pour diminuer les émissions de Scope 1.",
    "Formez les employés à des pratiques éco-responsables pour réduire l'empreinte carbone.",
  ];

  return (
    <div className="card card-sm shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar avatar-sm me-3" style={{ backgroundColor: "#42e18920" }}>
            <IconInfoCircle className="icon" style={{ color: "#42e189" }} />
          </div>
          <h3 className="card-title mb-0 fw-bold">Recommandations</h3>
        </div>
        <ul className="list-unstyled mb-0">
          {recommendations.map((rec, index) => (
            <li key={index} className="mb-2">
              • {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TopLeastEmissionsCard = ({ emissions }) => {
  const allSources = [
    ...emissions.scope1.breakdown.map((item) => ({
      ...item,
      scope: "Scope 1",
    })),
    ...emissions.scope2.breakdown.map((item) => ({
      ...item,
      scope: "Scope 2",
    })),
    ...emissions.scope3.breakdown.map((item) => ({
      ...item,
      scope: "Scope 3",
    })),
  ].filter((source) => source.value > 0);

  const sortedSources = allSources.sort((a, b) => b.value - a.value);
  const topSources = sortedSources.slice(0, 3);
  const leastSources = sortedSources.slice(-3).reverse();

  return (
    <div className="card card-sm shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-4">
          <div className="avatar avatar-sm me-3" style={{ backgroundColor: "#206bc420" }}>
            <IconChartBar className="icon" style={{ color: "#206bc4" }} />
          </div>
          <h3 className="card-title mb-0 fw-bold">Sources d'Émissions</h3>
        </div>
        <div className="row">
          <div className="col-md-6 mb-4">
            <h4 className="mb-3 fw-semibold">Top 3 Émetteurs</h4>
            {topSources.map((source, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <IconArrowUp className="icon-sm text-danger me-2" />
                <span>
                  {source.source} ({source.scope}): {source.value.toFixed(2)} tCO₂e
                </span>
              </div>
            ))}
          </div>
          <div className="col-md-6">
            <h4 className="mb-3 fw-semibold">3 Moins Émetteurs</h4>
            {leastSources.map((source, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <IconArrowDown className="icon-sm text-green me-2" />
                <span>
                  {source.source} ({source.scope}): {source.value.toFixed(2)} tCO₂e
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyDash = () => {
  const [loading, setLoading] = useState(true);
  const [emissionData, setEmissionData] = useState(null);
  const [processedEmissions, setProcessedEmissions] = useState(null);
  const [company, setCompany] = useState(null);
  const [owner, setOwner] = useState(null);
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const fetchUserAndCompany = async () => {
    try {
      const userResponse = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });
      const userData = await userResponse.json();

      if (userData?.user) {
        setOwner(userData.user);
        const companyResponse = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userData.user._id}`,
          {
            method: "GET",
          }
        );
        const companyData = await companyResponse.json();
        setCompany(companyData?.data);
        return companyData?.data?._id;
      }
      return null;
    } catch (error) {
      console.error(error);
      toast.error("Échec de la récupération des données utilisateur");
      return null;
    }
  };

  const fetchCompanyData = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/report/full/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setEmissionData(data?.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Échec de la récupération des données d'émissions");
    }
  };

  const fetchGoals = async (companyId) => {
    try {
      const res = await fetch(`http://localhost:4000/goals/all/${companyId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setGoals(data.data);
        const recentGoal = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setSelectedGoal(recentGoal);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Échec de la récupération des objectifs");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const id = await fetchUserAndCompany();
      if (id) {
        await Promise.all([fetchCompanyData(id), fetchGoals(id)]);
      }
      setLoading(false);
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (emissionData) {
      const processed = processEmissionsData(emissionData);
      setProcessedEmissions(processed);
    }
  }, [emissionData]);

  if (loading || !processedEmissions || !company || !owner) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const totalEmissions =
    processedEmissions.scope1.total +
    processedEmissions.scope2.total +
    processedEmissions.scope3.total;

  const pieChartData = {
    labels: ["Scope 1", "Scope 2", "Scope 3"],
    datasets: [
      {
        data: [
          processedEmissions.scope1.total,
          processedEmissions.scope2.total,
          processedEmissions.scope3.total,
        ],
        backgroundColor: COLORS,
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  const allEmissionSources = [
    ...processedEmissions.scope1.breakdown.map((item) => ({
      ...item,
      scope: "Scope 1",
    })),
    ...processedEmissions.scope2.breakdown.map((item) => ({
      ...item,
      scope: "Scope 2",
    })),
    ...processedEmissions.scope3.breakdown.map((item) => ({
      ...item,
      scope: "Scope 3",
    })),
  ];

  const stackedBarData = {
    labels: allEmissionSources.map((source) => source.source),
    datasets: [
      {
        label: "Scope 1",
        data: allEmissionSources.map((source) =>
          source.scope === "Scope 1" ? source.value : 0
        ),
        backgroundColor: COLORS[0],
        stack: "stack1",
      },
      {
        label: "Scope 2",
        data: allEmissionSources.map((source) =>
          source.scope === "Scope 2" ? source.value : 0
        ),
        backgroundColor: COLORS[1],
        stack: "stack1",
      },
      {
        label: "Scope 3",
        data: allEmissionSources.map((source) =>
          source.scope === "Scope 3" ? source.value : 0
        ),
        backgroundColor: COLORS[2],
        stack: "stack1",
      },
    ],
  };

  const scopeComparisonData = {
    labels: ["Scope 1", "Scope 2", "Scope 3"],
    datasets: [
      {
        label: "Émissions Actuelles (tCO₂e)",
        data: [
          processedEmissions.scope1.total,
          processedEmissions.scope2.total,
          processedEmissions.scope3.total,
        ],
        backgroundColor: COLORS,
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12 },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Émissions par Source",
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Sources d'Émissions",
          font: { size: 14 },
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: { size: 12 },
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Émissions (tCO₂e)",
          font: { size: 14 },
        },
        ticks: { font: { size: 12 } },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12 },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Répartition des Émissions",
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
  };

  const scopeComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Comparaison des Scopes",
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Émissions (tCO₂e)",
          font: { size: 14 },
        },
        beginAtZero: true,
        ticks: { font: { size: 12 } },
      },
      x: {
        ticks: { font: { size: 12 } },
      },
    },
  };

  return (
    <div className="container-xl py-4">
      <div className="page-header d-print-none mb-5">
        <div className="row align-items-center g-3">
          <div className="col-sm mb-sm-0 mb-3">
            <h2 className="page-title mb-0 d-flex align-items-center gap-2">
              <IconChartBar className="d-none d-sm-block" size={32} />
              Tableau de Bord des Émissions
            </h2>
          </div>
        </div>
      </div>

      <div className="row row-cards mb-5 g-4">
        <div className="col-lg-4 col-md-6">
          <EmissionCard
            title="Émissions Scope 1"
            icon={IconBuildingFactory}
            value={processedEmissions.scope1.total}
            color={COLORS[0]}
            data={processedEmissions.scope1.data}
            breakdown={processedEmissions.scope1.breakdown}
          />
        </div>
        <div className="col-lg-4 col-md-6">
          <EmissionCard
            title="Émissions Scope 2"
            icon={IconLamp}
            value={processedEmissions.scope2.total}
            color={COLORS[1]}
            data={processedEmissions.scope2.data}
            breakdown={processedEmissions.scope2.breakdown}
          />
        </div>
        <div className="col-lg-4 col-md-6">
          <EmissionCard
            title="Émissions Scope 3"
            icon={IconTruck}
            value={processedEmissions.scope3.total}
            color={COLORS[2]}
            data={processedEmissions.scope3.data}
            breakdown={processedEmissions.scope3.breakdown}
          />
        </div>
      </div>

      <div className="row row-cards mb-5 g-4">
        {selectedGoal && (
          <div className="col-lg-4 col-md-6">
            <GoalProgressCard
              goal={selectedGoal}
              emissions={{
                scope1: processedEmissions.scope1.total,
                scope2: processedEmissions.scope2.total,
                scope3: processedEmissions.scope3.total,
                total: totalEmissions,
              }}
            />
          </div>
        )}
        <div className="col-lg-4 col-md-6">
          <CriticalPointsCard emissions={processedEmissions} />
        </div>
        <div className="col-lg-4 col-md-6">
          <CompanyInfoCard company={company} owner={owner} />
        </div>
      </div>

      <div className="row row-cards mb-5 g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header py-3">
              <h3 className="card-title d-flex align-items-center gap-2">
                <IconChartPie size={24} />
                Répartition des Émissions
              </h3>
            </div>
            <div className="card-body p-4">
              <div style={{ height: "22rem" }}>
                <Doughnut data={pieChartData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header py-3">
              <h3 className="card-title d-flex align-items-center gap-2">
                <IconChartBar size={24} />
                Comparaison des Scopes
              </h3>
            </div>
            <div className="card-body p-4">
              <div style={{ height: "22rem" }}>
                <Bar data={scopeComparisonData} options={scopeComparisonOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cards mb-5 g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header py-3">
              <h3 className="card-title d-flex align-items-center gap-2">
                <IconTrendingUp size={24} />
                Émissions par Source
              </h3>
            </div>
            <div className="card-body p-4">
              <div style={{ height: "22rem" }}>
                <Bar data={stackedBarData} options={stackedBarOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <RecommendationsCard />
        </div>
      </div>

      <div className="row row-cards g-4">
        <div className="col-12">
          <TopLeastEmissionsCard emissions={processedEmissions} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDash;