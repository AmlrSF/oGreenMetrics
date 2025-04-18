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
  LogarithmicScale,
  BarElement,
} from "chart.js";

import { TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react";

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

import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Truck, Factory, Lightbulb, Activity } from "lucide-react";
import { formatDate } from "@/lib/Utils";

const COLORS = ["#206bc4", "#42e189", "#d618d6"];
const TIME_RANGES = ["7 Days", "30 Days", "3 Months", "1 Year"];

const getFormattedDates = (days) => {
  const now = new Date();
  const dates = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    if (days === 7) {
      const weekday = date.toLocaleDateString("fr-FR", { weekday: "short" });
      dates.push(weekday.charAt(0).toUpperCase() + weekday.slice(1));
    } else if (days >= 28 && days <= 90) {
      const month = date.toLocaleDateString("fr-FR", { month: "short" });
      dates.push(month.charAt(0).toUpperCase() + month.slice(1));
    } else if (days >= 365) {
      const month = date.toLocaleDateString("fr-FR", { month: "short" });
      if (!dates.includes(month)) {
        dates.push(month.charAt(0).toUpperCase() + month.slice(1));
      }
    } else {
      dates.push(date.toISOString().split("T")[0]);
    }
  }

  return dates;
};

const generateDailyData = (total, createdAt, days) => {
  const result = [];
  const dates = getFormattedDates(days);
  const emissionDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    weekday: "short",
  });

  for (let i = 0; i < dates.length; i++) {
    const value =
      dates[i].toLowerCase() === emissionDate.toLowerCase() ? total : 0;
    result.push({
      name: dates[i],
      value: value,
    });
  }

  return result;
};

const processEmissionsData = (data, days = 7) => {
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
    ) || 0);

  return {
    scope1: {
      total: scope1Total,
      data: generateDailyData(
        scope1Total,
        data?.scope1Data?.fuelCombution?.[0]?.createdAt || new Date(),
        days
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
        days
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
        days
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
      ],
    },
  };
};

const EmissionCard = ({ title, icon: Icon, value, color, data, breakdown }) => {
  const barChartData = {
    labels: breakdown.map((item) => item.source),
    datasets: [
      {
        label: title,
        data: breakdown.map((item) => item.value),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Emissions (tCO₂e)",
        },
      },
      x: {
        title: {
          display: true,
          text: formatDate(new Date()),
        },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div
            className="avatar me-3"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="icon" style={{ color }} />
          </div>
          <h3 className="card-title mb-0">{title}</h3>
        </div>

        <div className="d-flex align-items-center mb-3">
          <div className="h2 mb-0 me-2">{Number(value).toFixed(2)} tCO₂e</div>
          <TrendingUp className="icon-sm text-green" />
        </div>

        {/* <div style={{ height: "12rem" }}>
          <Bar data={barChartData} options={options} />
        </div> */}
      </div>
    </div>
  );
};

const CompanyDash = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7 Days");
  const [emissionData, setEmissionData] = useState(null);
  const [processedEmissions, setProcessedEmissions] = useState(null);

  const fetchUser = async () => {
    try {
      const userResponse = await fetch("http://localhost:4000/auth", {
        method: "POST",
        credentials: "include",
      });
      const userData = await userResponse.json();

      if (userData?.user) {
        const companyResponse = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userData.user._id}`,
          {
            method: "GET",
          }
        );
        const companyData = await companyResponse.json();
        return companyData?.data?._id;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchCompanyData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/report/full/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setEmissionData(data?.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const id = await fetchUser();
      if (id) {
        fetchCompanyData(id);
      }
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (emissionData) {
      const days =
        timeRange === "7 Days" ? 7 : timeRange === "30 Days" ? 30 : 90;
      const processed = processEmissionsData(emissionData, days);
      setProcessedEmissions(processed);
    }
  }, [emissionData, timeRange]);

  if (loading || !processedEmissions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Emissions by Source",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Emission Sources",
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
          text: "Emissions (tCO₂e)",
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

  return (
    <div className="container-xl">
      <div className="page-header d-print-none mb-2">
        <div className=" g-2 sm:flex flex-col sm:flex-row gap-10 
         align-items-center justify-content-between ">
          <div className="col sm:mb-0 mb-2">
            <h2 className="page-title ">
              <BarChart3 className=" sm:block  hidden text-center sm:text-left icon me-2" />
              Tableau de bord des émissions
            </h2>
            <div className="text-muted mt-1">
              Surveillez l'empreinte carbone de votre entreprise
            </div>
          </div>

          <div className="col-auto ms-auto">
            <div className="card">
              <div className="card-body p-3 d-flex align-items-center">
                <div className="avatar bg-primary me-3">
                  <Activity className="icon text-white" />
                </div>
                <div>
                  <div className="text-muted mb-1">Émissions Totales</div>
                  <div className="h3 mb-0">
                    {Number(
                      processedEmissions.scope1.total +
                        processedEmissions.scope2.total +
                        processedEmissions.scope3.total
                    ).toFixed(2)}{" "}
                    tCO₂e
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-card mb-2">
        <EmissionCard
          title="Émissions Scope 1"
          icon={Factory}
          value={processedEmissions.scope1.total}
          color={COLORS[0]}
          data={processedEmissions.scope1.data}
          breakdown={processedEmissions.scope1.breakdown}
        />
        <EmissionCard
          title="Émissions Scope 2"
          icon={Lightbulb}
          value={processedEmissions.scope2.total}
          color={COLORS[1]}
          data={processedEmissions.scope2.data}
          breakdown={processedEmissions.scope2.breakdown}
        />
        <EmissionCard
          title="Émissions Scope 3"
          icon={Truck}
          value={processedEmissions.scope3.total}
          color={COLORS[2]}
          data={processedEmissions.scope3.data}
          breakdown={processedEmissions.scope3.breakdown}
        />
      </div>

      <div className="row row-deck row-cards">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="flex items-center gap-1">
                <PieChart className="icon me-2" />
                Répartition des émissions
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
                <TrendingUp className="icon me-2" />
                Émissions par source
              </h3>
            </div>
            <div className="card-body">
              <div style={{ height: "18rem" }}>
                <Bar data={stackedBarData} options={stackedBarOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDash;
