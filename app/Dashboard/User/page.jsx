"use client";

import React, { useState, useEffect } from "react";
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
    <div className="card card-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar me-3" style={{ backgroundColor: `${color}20` }}>
            <Icon className="icon" style={{ color }} />
          </div>
          <h3 className="card-title mb-0">{title}</h3>
        </div>
        <div className="d-flex align-items-center mb-3">
          <div className="h2 mb-0 me-2">{Number(value).toFixed(2)} tCO₂e</div>
          <IconTrendingUp className="icon-sm text-green" />
        </div>
      </div>
    </div>
  );
};

const GoalProgressCard = ({ goal, emissions }) => {
  const totalGoal = parseFloat(goal.totalGoal || 0);
  const currentEmissions = parseFloat(emissions.total || 0);
  const progress = totalGoal > 0 ? Math.min(100, Math.max(0, ((currentEmissions - totalGoal) / currentEmissions) * 100)) : 0;

  return (
    <div className="card card-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar me-3" style={{ backgroundColor: "#206bc420" }}>
            <IconTarget className="icon" style={{ color: "#206bc4" }} />
          </div>
          <h3 className="card-title mb-0">{goal.name}</h3>
        </div>
        <div className="progress mb-2">
          <div
            className="progress-bar bg-primary"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress.toFixed(1)}%
          </div>
        </div>
        <div className="text-muted">
          Objectif: {totalGoal.toFixed(2)} tCO₂e | Actuel: {currentEmissions.toFixed(2)} tCO₂e
        </div>
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
    <div className="card card-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar me-3" style={{ backgroundColor: "#d6393920" }}>
            <IconAlertTriangle className="icon" style={{ color: "#d63939" }} />
          </div>
          <h3 className="card-title mb-0">Points Critiques</h3>
        </div>
        {criticalPoints.length > 0 ? (
          <ul className="list-unstyled">
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
    <div className="card card-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar me-3" style={{ backgroundColor: "#206bc420" }}>
            <IconInfoCircle className="icon" style={{ color: "#206bc4" }} />
          </div>
          <h3 className="card-title mb-0">{company.nom_entreprise}</h3>
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
    <div className="card card-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar me-3" style={{ backgroundColor: "#42e18920" }}>
            <IconInfoCircle className="icon" style={{ color: "#42e189" }} />
          </div>
          <h3 className="card-title mb-0">Recommandations</h3>
        </div>
        <ul className="list-unstyled">
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
    <div className="card card-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar me-3" style={{ backgroundColor: "#206bc420" }}>
            <IconChartBar className="icon" style={{ color: "#206bc4" }} />
          </div>
          <h3 className="card-title mb-0">Sources d'Émissions</h3>
        </div>
        <div className="mb-3">
          <h4 className="mb-2">Top 3 Émetteurs</h4>
          {topSources.map((source, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <IconArrowUp className="icon-sm text-danger me-2" />
              <span>
                {source.source} ({source.scope}): {source.value.toFixed(2)} tCO₂e
              </span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="mb-2">3 Moins Émetteurs</h4>
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
        // Select the most recent goal for the progress card
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
          style={{ width: "2rem", height: "2rem" }}
        >
          <span className="visually-hidden">Loading...</span>
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
      },
    ],
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Émissions par Source",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Sources d'Émissions",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Émissions (tCO₂e)",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
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
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Émissions (tCO₂e)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container-xl">
      <div className="page-header d-print-none mb-4">
        <div className="row align-items-center g-2">
          <div className="col-sm mb-sm-0 mb-2 d-flex align-items-center justify-content-between">
            <h2 className="page-title mb-0 d-flex align-items-center">
              <IconChartBar className="d-none d-sm-block me-2" />
              Tableau de Bord des Émissions
            </h2>
          </div>
        </div>
      </div>

      <div className="row row-cards mb-4">
        <div className="col-md-4">
          <EmissionCard
            title="Émissions Scope 1"
            icon={IconBuildingFactory}
            value={processedEmissions.scope1.total}
            color={COLORS[0]}
            data={processedEmissions.scope1.data}
            breakdown={processedEmissions.scope1.breakdown}
          />
        </div>
        <div className="col-md-4">
          <EmissionCard
            title="Émissions Scope 2"
            icon={IconLamp}
            value={processedEmissions.scope2.total}
            color={COLORS[1]}
            data={processedEmissions.scope2.data}
            breakdown={processedEmissions.scope2.breakdown}
          />
        </div>
        <div className="col-md-4">
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

      <div className="row row-cards mb-4">
        {selectedGoal && (
          <div className="col-md-4">
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
        <div className="col-md-4">
          <CriticalPointsCard emissions={processedEmissions} />
        </div>
        <div className="col-md-4">
          <CompanyInfoCard company={company} owner={owner} />
        </div>
      </div>

      <div className="row row-cards mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="flex items-center gap-1">
                <IconChartBar className="icon me-2" />
                Répartition des Émissions
              </h3>
            </div>
            <div className="card-body">
              <div style={{ height: "18rem" }}>
                <Doughnut data={pieChartData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="flex items-center gap-1">
                <IconChartBar className="icon me-2" />
                Comparaison des Scopes
              </h3>
            </div>
            <div className="card-body">
              <div style={{ height: "18rem" }}>
                <Bar data={scopeComparisonData} options={scopeComparisonOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cards mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="flex items-center gap-1">
                <IconTrendingUp className="icon me-2" />
                Émissions par Source
              </h3>
            </div>
            <div className="card-body">
              <div style={{ height: "18rem" }}>
                <Bar data={stackedBarData} options={stackedBarOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <RecommendationsCard />
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-md-12">
          <TopLeastEmissionsCard emissions={processedEmissions} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDash;