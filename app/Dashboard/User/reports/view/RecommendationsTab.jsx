"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { IconBulb, IconExternalLink, IconLeaf } from "@tabler/icons-react";

const RecommendationsTab = ({
  report,
  calculateTotalEmissions,
  getScope1Details,
  getScope2Details,
  getScope3Details,
  getFuelTypes,
  getCoolingTypes,
  getHeatingTypes,
  getTransportModes,
  getWasteTypes,
  formatNumber,
  activeTab,
}) => {
  // Références pour les graphiques
  const emissionReductionPotentialChartRef = useRef(null);
  const energyEfficiencyChartRef = useRef(null);
  const transportOptimizationChartRef = useRef(null);
  const wasteManagementChartRef = useRef(null);
  const businessTravelChartRef = useRef(null);
  const fuelEfficiencyChartRef = useRef(null);

  // Instances des graphiques
  const [charts, setCharts] = useState({});
  const initializeTimeoutRef = useRef(null);

  useEffect(() => {
    if (report && report.includeCharts === "yes" && activeTab === "recommendations") {
      // Délai pour l'initialisation des graphiques
      if (initializeTimeoutRef.current) {
        clearTimeout(initializeTimeoutRef.current);
      }
      initializeTimeoutRef.current = setTimeout(() => {
        initializeCharts();
      }, 100);
    }

    return () => {
      if (initializeTimeoutRef.current) {
        clearTimeout(initializeTimeoutRef.current);
      }
      Object.values(charts).forEach((chart) => {
        if (chart && chart.canvas) {
          chart.destroy();
        }
      });
      setCharts({});
    };
  }, [report, activeTab]);

  const initializeCharts = () => {
    const emissionTotals = calculateTotalEmissions;
    const scope1Details = getScope1Details();
    const scope2Details = getScope2Details();
    const scope3Details = getScope3Details();
    const fuelTypes = getFuelTypes();
    const transportModes = getTransportModes();

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
    };

    const newCharts = {};

    try {
      // Graphique du potentiel de réduction des émissions (Pie Chart)
      if (emissionReductionPotentialChartRef.current) {
        const reductionData = [
          {
            scope: "Scope 1",
            current: emissionTotals.scope1,
            potential: emissionTotals.scope1 * 0.7, // Réduction potentielle de 30%
          },
          {
            scope: "Scope 2",
            current: emissionTotals.scope2,
            potential: emissionTotals.scope2 * 0.6, // Réduction de 40%
          },
          {
            scope: "Scope 3",
            current: emissionTotals.scope3,
            potential: emissionTotals.scope3 * 0.75, // Réduction de 25%
          },
        ].filter((d) => d.current > 0);

        const totalCurrent = reductionData.reduce((sum, item) => sum + item.current, 0);
        const totalPotential = reductionData.reduce((sum, item) => sum + item.potential, 0);
        const totalReduction = totalCurrent - totalPotential;

        newCharts.emissionReductionPotential = new Chart(
          emissionReductionPotentialChartRef.current,
          {
            type: "pie",
            data: {
              labels: ["Potentiel de réduction", "Émissions restantes"],
              datasets: [
                {
                  data: [totalReduction, totalPotential],
                  backgroundColor: ["#90C67C", "#328E6E"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Réductions potentielles des émissions par scope",
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw;
                      const percentage = Math.round((value / totalCurrent) * 100);
                      return `${label}: ${value.toFixed(2)} tCO₂ (${percentage}%)`;
                    }
                  }
                }
              },
            },
          }
        );
      }

      // Graphique d'efficacité énergétique (Column Chart)
      if (energyEfficiencyChartRef.current && scope2Details.energyConsumptionEmissions > 0) {
        const efficiencyData = [
          {
            measure: "Consommation actuelle",
            emissions: scope2Details.energyConsumptionEmissions,
          },
          {
            measure: "Éclairage LED",
            emissions: scope2Details.energyConsumptionEmissions * 0.8, // Réduction de 20%
          },
          {
            measure: "CVC intelligent",
            emissions: scope2Details.energyConsumptionEmissions * 0.7, // Réduction de 30%
          },
          {
            measure: "Énergie renouvelable",
            emissions: scope2Details.energyConsumptionEmissions * 0.4, // Réduction de 60%
          },
        ];

        newCharts.energyEfficiency = new Chart(
          energyEfficiencyChartRef.current,
          {
            type: "bar",
            data: {
              labels: efficiencyData.map((d) => d.measure),
              datasets: [
                {
                  label: "Émissions (tCO₂)",
                  data: efficiencyData.map((d) => d.emissions),
                  backgroundColor: ["#328E6E", "#67AE6E", "#90C67C", "#E1EEBC"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              indexAxis: 'y',
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Impact des mesures d'efficacité énergétique",
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Émissions (tCO₂)",
                  },
                },
              },
            },
          }
        );
      }

      // Graphique d'optimisation du transport (Bar Chart)
      if (transportOptimizationChartRef.current && scope3Details.transportEmissions > 0) {
        const optimizationData = [
          {
            mode: "Transport actuel",
            emissions: scope3Details.transportEmissions,
          },
          {
            mode: "Véhicules électriques",
            emissions: scope3Details.transportEmissions * 0.5, // Réduction de 50%
          },
          {
            mode: "Optimisation des itinéraires",
            emissions: scope3Details.transportEmissions * 0.7, // Réduction de 30%
          },
          {
            mode: "Préférence ferroviaire",
            emissions: scope3Details.transportEmissions * 0.6, // Réduction de 40%
          },
        ];

        newCharts.transportOptimization = new Chart(
          transportOptimizationChartRef.current,
          {
            type: "bar",
            data: {
              labels: optimizationData.map((d) => d.mode),
              datasets: [
                {
                  label: "Émissions (tCO₂)",
                  data: optimizationData.map((d) => d.emissions),
                  backgroundColor: ["#328E6E", "#4299e1", "#94d82d", "#f59f00"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Stratégies de réduction des émissions de transport",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Émissions (tCO₂)",
                  },
                },
              },
            },
          }
        );
      }

      // Graphique d'impact de la gestion des déchets (Doughnut Chart)
      if (wasteManagementChartRef.current && scope3Details.wasteEmissions > 0) {
        const wasteData = [
          {
            strategy: "Déchets actuels",
            emissions: scope3Details.wasteEmissions,
          },
          {
            strategy: "Programme de recyclage",
            emissions: scope3Details.wasteEmissions * 0.5, // Réduction de 50%
          },
          {
            strategy: "Déchets-à-Énergie",
            emissions: scope3Details.wasteEmissions * 0.4, // Réduction de 60%
          },
          {
            strategy: "Compostage",
            emissions: scope3Details.wasteEmissions * 0.6, // Réduction de 40%
          },
        ];

        newCharts.wasteManagement = new Chart(
          wasteManagementChartRef.current,
          {
            type: "doughnut",
            data: {
              labels: wasteData.map((d) => d.strategy),
              datasets: [
                {
                  label: "Émissions (tCO₂)",
                  data: wasteData.map((d) => d.emissions),
                  backgroundColor: ["#328E6E", "#67AE6E", "#90C67C", "#E1EEBC"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Impact des stratégies de gestion des déchets",
                },
              },
            },
          }
        );
      }

      // Graphique de réduction des voyages d'affaires (Polar Area Chart)
      if (businessTravelChartRef.current && scope3Details.businessTravelEmissions > 0) {
        const travelData = [
          {
            strategy: "Voyages actuels",
            emissions: scope3Details.businessTravelEmissions,
          },
          {
            strategy: "Réunions virtuelles",
            emissions: scope3Details.businessTravelEmissions * 0.3, // Réduction de 70%
          },
          {
            strategy: "Voyages en train",
            emissions: scope3Details.businessTravelEmissions * 0.4, // Réduction de 60%
          },
          {
            strategy: "Politique de voyage",
            emissions: scope3Details.businessTravelEmissions * 0.5, // Réduction de 50%
          },
        ];

        newCharts.businessTravel = new Chart(
          businessTravelChartRef.current,
          {
            type: "polarArea",
            data: {
              labels: travelData.map((d) => d.strategy),
              datasets: [
                {
                  label: "Émissions (tCO₂)",
                  data: travelData.map((d) => d.emissions),
                  backgroundColor: ["#328E6E", "#4299e1", "#94d82d", "#f59f00"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Stratégies de réduction des émissions de voyages d'affaires",
                },
              },
            },
          }
        );
      }

      // Graphique de comparaison de l'efficacité des carburants (Bar Chart - horizontal)
      if (fuelEfficiencyChartRef.current && scope1Details.fuelEmissions > 0) {
        const fuelData = [
          {
            fuel: "Diesel",
            emissions: 2.68, // kg CO2 par litre
          },
          {
            fuel: "Essence",
            emissions: 2.31, // kg CO2 par litre
          },
          {
            fuel: "Gaz naturel",
            emissions: 1.89, // kg CO2 par m3
          },
          {
            fuel: "Biodiesel (B100)",
            emissions: 0.33, // kg CO2 par litre
          },
          {
            fuel: "Biogaz",
            emissions: 0.21, // kg CO2 par m3
          },
          {
            fuel: "Hydrogène (Vert)",
            emissions: 0.01, // kg CO2 par kg
          },
        ];

        newCharts.fuelEfficiency = new Chart(
          fuelEfficiencyChartRef.current,
          {
            type: "bar",
            data: {
              labels: fuelData.map((d) => d.fuel),
              datasets: [
                {
                  label: "Émissions (kg CO₂ par unité)",
                  data: fuelData.map((d) => d.emissions),
                  backgroundColor: [
                    "#ef4444", // Rouge pour diesel (émissions les plus élevées)
                    "#f97316", // Orange pour essence
                    "#f59e0b", // Ambre pour gaz naturel
                    "#84cc16", // Citron pour biodiesel
                    "#10b981", // Émeraude pour biogaz
                    "#06b6d4", // Cyan pour hydrogène (émissions les plus faibles)
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              ...chartOptions,
              indexAxis: 'y',
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Comparaison de l'intensité carbone des types de carburant",
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Intensité carbone (kg CO₂ par unité)",
                  },
                },
              },
            },
          }
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des graphiques:", error);
    }

    setCharts(newCharts);
  };

  // Générer des recommandations basées sur les données d'émissions
  const getRecommendations = () => {
    const recommendations = [];
    const emissionTotals = calculateTotalEmissions;
    const scope1Details = getScope1Details();
    const scope2Details = getScope2Details();
    const scope3Details = getScope3Details();
    
    let idCounter = 1;

    // Recommandations Scope 1
    if (report.scope1 && emissionTotals.scope1 > 0) {
      if (scope1Details.fuelEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Transition vers des carburants à faible teneur en carbone",
          description:
            "Passez des carburants à fortes émissions (par exemple, le diesel) à des alternatives à faible émission de carbone comme les biocarburants ou l'hydrogène vert pour votre flotte et vos machines. Cela peut réduire considérablement vos émissions directes tout en maintenant l'efficacité opérationnelle. Commencez par un programme pilote pour un sous-ensemble de votre flotte afin d'évaluer les performances et le retour sur investissement avant une mise en œuvre complète.",
          impact: `Potentiel de réduction des émissions de Scope 1 d'environ ${formatNumber(
            scope1Details.fuelEmissions * 0.3
          )} tCO₂ par an.`,
          scope: "Scope 1",
          priority: "Élevée",
          potential: scope1Details.fuelEmissions * 0.3,
          payback: "2-3 ans",
          difficulty: "Moyenne",
          sources: [
            {
              title: "GIEC, 2022: Changement climatique 2022: Atténuation du changement climatique",
              url: "https://www.ipcc.ch/report/ar6/wg3/",
            },
            {
              title: "AIE, 2023: Le rôle des carburants à faible teneur en carbone dans la transition énergétique propre",
              url: "https://www.iea.org/reports/the-role-of-low-carbon-fuels-in-the-clean-energy-transition",
            },
          ],
        });
      }
      if (scope1Details.productionEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Optimiser les processus de production",
          description:
            "Implémentez des technologies écoénergétiques dans les processus de production, telles que l'automatisation avancée, les systèmes de récupération de chaleur et la planification optimisée des équipements. Cela peut conduire à la fois à une réduction des émissions et à des économies de coûts opérationnels. Envisagez de réaliser un audit énergétique pour identifier les opportunités d'amélioration les plus impactantes.",
          impact: `Pourrait réduire les émissions liées à la production jusqu'à ${formatNumber(
            scope1Details.productionEmissions * 0.25
          )} tCO₂ par an.`,
          scope: "Scope 1",
          priority: "Moyenne",
          potential: scope1Details.productionEmissions * 0.25,
          payback: "1-4 ans",
          difficulty: "Moyenne",
          sources: [
            {
              title: "AIE, 2023: Rapport sur l'efficacité énergétique 2023",
              url: "https://www.iea.org/reports/energy-efficiency-2023",
            },
            {
              title: "EPA, 2022: Efficacité énergétique dans les processus industriels",
              url: "https://www.epa.gov/energy/industrial-processes",
            },
          ],
        });
      }
    }

    // Recommandations Scope 2
    if (report.scope2 && emissionTotals.scope2 > 0) {
      if (scope2Details.energyConsumptionEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Adopter des sources d'énergie renouvelable",
          description:
            "Approvisionnez-vous en électricité auprès de fournisseurs d'énergie renouvelable ou installez des systèmes solaires/éoliens sur site pour réduire la dépendance à l'électricité basée sur les combustibles fossiles. Commencez par une étude de faisabilité pour déterminer les solutions d'énergie renouvelable les plus rentables pour vos emplacements spécifiques et vos modèles de consommation d'énergie.",
          impact: `Réduction potentielle de ${formatNumber(
            scope2Details.energyConsumptionEmissions * 0.6
          )} tCO₂ dans les émissions de Scope 2.`,
          scope: "Scope 2",
          priority: "Élevée",
          potential: scope2Details.energyConsumptionEmissions * 0.6,
          payback: "4-8 ans",
          difficulty: "Moyenne",
          sources: [
            {
              title: "IRENA, 2023: Feuille de route pour l'énergie renouvelable",
              url: "https://www.irena.org/publications/2023/renewable-energy-roadmap",
            },
            {
              title: "NREL, 2023: Énergie renouvelable pour bâtiments commerciaux",
              url: "https://www.nrel.gov/commercial/renewable-energy.html",
            },
          ],
        });
      }
      if (scope2Details.coolingEmissions > 0 || scope2Details.heatingEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Moderniser les systèmes CVC",
          description:
            "Installez des systèmes CVC intelligents avec des technologies de refroidissement et de chauffage écoénergétiques pour minimiser la consommation d'énergie. Intégrez des contrôles intelligents et des systèmes de zonage pour optimiser la régulation de la température en fonction de l'occupation et des modèles d'utilisation. L'entretien régulier et la surveillance des performances peuvent améliorer davantage l'efficacité.",
          impact: `Pourrait économiser jusqu'à ${formatNumber(
            (scope2Details.coolingEmissions + scope2Details.heatingEmissions) * 0.3
          )} tCO₂ par an.`,
          scope: "Scope 2",
          priority: "Moyenne",
          potential: (scope2Details.coolingEmissions + scope2Details.heatingEmissions) * 0.3,
          payback: "3-5 ans",
          difficulty: "Moyenne",
          sources: [
            {
              title: "US DOE, 2022: Contrats de performance d'économie d'énergie pour les systèmes CVC",
              url: "https://www.energy.gov/eere/buildings/energy-savings-performance-contracting",
            },
            {
              title: "ASHRAE, 2023: Guide de conception de systèmes CVC avancés",
              url: "https://www.ashrae.org/technical-resources/bookstore/advanced-hvac-systems",
            },
          ],
        });
      }
    }

    // Recommandations Scope 3
    if (report.scope3 && emissionTotals.scope3 > 0) {
      if (scope3Details.transportEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Optimiser la logistique et le transport",
          description:
            "Passez aux véhicules électriques pour le transport à courte distance, optimisez les itinéraires de livraison à l'aide de logiciels logistiques basés sur l'IA et privilégiez le rail plutôt que la route pour les expéditions longue distance. Collaborez avec des partenaires logistiques pour établir des objectifs de durabilité partagés et mettre en œuvre des initiatives conjointes de réduction des émissions.",
          impact: `Potentiel de réduction des émissions de transport de ${formatNumber(
            scope3Details.transportEmissions * 0.4
          )} tCO₂ par an.`,
          scope: "Scope 3",
          priority: "Élevée",
          potential: scope3Details.transportEmissions * 0.4,
          payback: "2-5 ans",
          difficulty: "Moyenne",
          sources: [
            {
              title: "Smart Freight Centre, 2023: Cadre du Conseil mondial des émissions logistiques",
              url: "https://www.smartfreightcentre.org/en/how-to-implement-items/what-is-glec-framework/58/",
            },
            {
              title: "McKinsey, 2022: Décarbonation de la chaîne d'approvisionnement mondiale",
              url: "https://www.mckinsey.com/capabilities/operations/our-insights/decarbonizing-global-supply-chains",
            },
          ],
        });
      }
      if (scope3Details.wasteEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Améliorer la gestion des déchets",
          description:
            "Mettez en œuvre des programmes de recyclage complets et collaborez avec des installations de valorisation énergétique des déchets pour réduire les émissions liées à l'élimination des déchets. Adoptez les principes de l'économie circulaire pour minimiser la génération de déchets à la source. Effectuez des audits de déchets pour identifier les principaux flux de déchets et développer des stratégies de réduction ciblées.",
          impact: `Pourrait réduire les émissions liées aux déchets de ${formatNumber(
            scope3Details.wasteEmissions * 0.5
          )} tCO₂ par an.`,
          scope: "Scope 3",
          priority: "Moyenne",
          potential: scope3Details.wasteEmissions * 0.5,
          payback: "1-3 ans",
          difficulty: "Faible",
          sources: [
            {
              title: "EPA, 2023: Promotion de la gestion durable des matériaux",
              url: "https://www.epa.gov/smm/advancing-sustainable-materials-management-facts-and-figures-report",
            },
            {
              title: "Fondation Ellen MacArthur, 2023: Économie circulaire en entreprise",
              url: "https://ellenmacarthurfoundation.org/topics/business/overview",
            },
          ],
        });
      }
      if (scope3Details.businessTravelEmissions > 0) {
        recommendations.push({
          id: idCounter++,
          title: "Réduire les émissions des voyages d'affaires",
          description:
            "Encouragez les réunions virtuelles et incitez à des options de voyage à faible émission de carbone comme le train pour les voyages d'affaires. Développez une politique de voyage durable qui intègre des budgets carbone pour différents types de voyages d'affaires. Investissez dans une technologie de vidéoconférence de haute qualité pour rendre les réunions virtuelles plus efficaces et engageantes.",
          impact: `Réduction potentielle de ${formatNumber(
            scope3Details.businessTravelEmissions * 0.3
          )} tCO₂ par an.`,
          scope: "Scope 3",
          priority: "Moyenne",
          potential: scope3Details.businessTravelEmissions * 0.3,
          payback: "1-2 ans",
          difficulty: "Faible",
          sources: [
            {
              title: "WRI, 2022: Protocole GES Chaîne de valeur (Scope 3)",
              url: "https://ghgprotocol.org/standards/scope-3-standard",
            },
            {
              title: "WBCSD, 2023: Cadre des voyages d'affaires durables",
              url: "https://www.wbcsd.org/Programs/Climate-and-Energy/Climate/SOS-1.5/Resources/Sustainable-Business-Travel",
            },
          ],
        });
      }
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  // Fonction pour déterminer la classe de couleur pour les badges de priorité
  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case "élevée":
      case "high":
        return "bg-danger";
      case "moyenne":
      case "medium":
        return "bg-warning";
      case "faible":
      case "low":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  // Crée un graphique pour chaque recommandation
  const createRecommendationCharts = () => {
    recommendations.forEach((rec, index) => {
      const chartRef = document.getElementById(`chart-${rec.id}`);
      if (chartRef) {
        const existingChart = Chart.getChart(chartRef);
        if (existingChart) {
          existingChart.destroy();
        }

        let data = [];
        let backgroundColor = [];
        let labels = [];

        // Personnaliser les données du graphique en fonction du type de recommandation
        if (rec.title.includes("carburant") || rec.title.includes("Fuel")) {
          data = [2.68, 2.31, 1.89, 0.33, 0.21, 0.01];
          labels = ["Diesel", "Essence", "Gaz naturel", "Biodiesel", "Biogaz", "Hydrogène vert"];
          backgroundColor = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4"];
        } else if (rec.title.includes("énergie") || rec.title.includes("Renewable")) {
          data = [100, 60, 0, 2, 4, 6];
          labels = ["Charbon", "Gaz naturel", "Solaire", "Éolien", "Hydro", "Biomasse"];
          backgroundColor = ["#ef4444", "#f97316", "#10b981", "#06b6d4", "#3b82f6", "#84cc16"];
        } else if (rec.title.includes("transport") || rec.title.includes("voyage")) {
          data = [170, 140, 104, 14, 6, 1];
          labels = ["Avion", "Voiture (Essence)", "Voiture (Diesel)", "Train", "Bus", "Véhicule électrique"];
          backgroundColor = ["#ef4444", "#f97316", "#f59e0b", "#3b82f6", "#84cc16", "#10b981"];
        } else if (rec.title.includes("déchet")) {
          data = [600, 240, 70, 18];
          labels = ["Décharge", "Incinération", "Recyclage", "Compostage"];
          backgroundColor = ["#ef4444", "#f97316", "#10b981", "#84cc16"];
        } else if (rec.title.includes("CVC") || rec.title.includes("HVAC")) {
          data = [100, 70, 45, 30];
          labels = ["CVC standard", "CVC haute efficacité", "CVC intelligent", "Pompe à chaleur"];
          backgroundColor = ["#ef4444", "#f97316", "#10b981", "#06b6d4"];
        } else if (rec.title.includes("production")) {
          data = [100, 80, 60, 40];
          labels = ["Processus actuel", "Processus optimisé", "Récupération de chaleur", "Automatisation avancée"];
          backgroundColor = ["#ef4444", "#f97316", "#10b981", "#06b6d4"];
        } else {
          data = [100, rec.potential / (rec.potential * 0.3) * 100];
          labels = ["Émissions actuelles", "Avec recommandation mise en œuvre"];
          backgroundColor = ["#ef4444", "#10b981"];
        }

        new Chart(chartRef, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Émissions (échelle relative)",
                data: data,
                backgroundColor: backgroundColor,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Comparaison d'impact",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    });
  };

  useEffect(() => {
    if (recommendations.length > 0 && activeTab === "recommendations") {
      // Utiliser un délai pour s'assurer que le DOM est mis à jour avant d'essayer d'accéder aux éléments canvas
      const timer = setTimeout(() => {
        createRecommendationCharts();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [recommendations, activeTab]);

  return (
    <div className="container-xl">
      {/* Section des graphiques */}
      {report?.includeCharts === "yes" && (
        <div className="row row-cards mb-4">
          <div className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  Réductions potentielles des émissions par scope
                </h3>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <canvas
                    id="emissionReductionPotentialChart"
                    ref={emissionReductionPotentialChartRef}
                  ></canvas>
                </div>
                <p className="text-muted mt-2">
                  <small>
                    Source: GIEC, 2022: Changement climatique 2022: Atténuation du
                    changement climatique; AIE, 2023: Feuille de route Net Zéro.
                  </small>
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  Comparaison de l'intensité carbone des types de carburant
                </h3>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <canvas
                    id="fuelEfficiencyChart"
                    ref={fuelEfficiencyChartRef}
                  ></canvas>
                </div>
                <p className="text-muted mt-2">
                  <small>
                    Source: AIE, 2024: Émissions de gaz à effet de serre issues de l'énergie; EPA, 2023: Facteurs d'émission pour les inventaires de gaz à effet de serre.
                  </small>
                </p>
              </div>
            </div>
          </div>
          {calculateTotalEmissions.scope2 > 0 && (
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Impact des mesures d'efficacité énergétique
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <canvas
                      id="energyEfficiencyChart"
                      ref={energyEfficiencyChartRef}
                    ></canvas>
                  </div>
                  <p className="text-muted mt-2">
                    <small>
                      Source: US DOE, 2023: Rapports sur l'efficacité énergétique et les
                      énergies renouvelables; IRENA, 2023: Coûts de production d'énergie renouvelable.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
          {calculateTotalEmissions.scope3 > 0 && (
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Stratégies de réduction des émissions de transport
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <canvas
                      id="transportOptimizationChart"
                      ref={transportOptimizationChartRef}
                    ></canvas>
                  </div>
                  <p className="text-muted mt-2">
                    <small>
                      Source: Smart Freight Centre, 2023: Conseil mondial
                      des émissions logistiques; AIE, 2023: L'avenir des
                      véhicules électriques.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
          {calculateTotalEmissions.scope3 > 0 && (
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Impact des stratégies de gestion des déchets
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <canvas
                      id="wasteManagementChart"
                      ref={wasteManagementChartRef}
                    ></canvas>
                  </div>
                  <p className="text-muted mt-2">
                    <small>
                      Source: EPA, 2023: Promotion de la gestion durable des
                      matériaux; UE, 2023: Plan d'action pour l'économie circulaire.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
          {calculateTotalEmissions.scope3 > 0 && (
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Stratégies de réduction des émissions des voyages d'affaires
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <canvas
                      id="businessTravelChart"
                      ref={businessTravelChartRef}
                    ></canvas>
                  </div>
                  <p className="text-muted mt-2">
                    <small>
                      Source: WRI, 2022: Protocole GES Chaîne de valeur (Scope
                      3); IATA, 2023: Stratégies d'aviation durable.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section de recommandations avec défilement */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">
            <IconBulb size={24} className="me-2" />
            Recommandations pour la réduction des émissions
          </h3>
        </div>
        <div className="card-body">
          <p className="text-secondary mb-4">
            Faites défiler pour explorer des recommandations personnalisées afin de réduire votre
            empreinte carbone dans les différents scopes.
          </p>
          {recommendations.length > 0 ? (
            <div
              className="d-flex flex-nowrap overflow-x-auto pb-3"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "thin",
              }}
            >
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="card flex-shrink-0 mx-2"
                  style={{
                    width: "300px",
                    scrollSnapAlign: "start",
                  }}
                >
                  <div className="card-body">
                    <h4 className="card-title">{rec.title}</h4>
                    <p className="text-secondary">{rec.description}</p>
                    <p className="text-primary fw-bold">{rec.impact}</p>
                    <p className="text-muted">
                      <small>Source: {rec.sources[0].title}</small>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              Aucune recommandation spécifique disponible sur la base des données actuelles.
              Veuillez vous assurer que les données d'émissions sont complètes pour tous les scopes pertinents.
            </div>
          )}
        </div>
      </div>
 
      {/* CSS en ligne pour le conteneur avec défilement */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default RecommendationsTab;