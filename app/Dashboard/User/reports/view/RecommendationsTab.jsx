"use client";

import React from "react";
import { IconBulb, IconLeaf, IconRecycle, IconTrendingDown, IconSun, IconWind,IconTruck } from "@tabler/icons-react";

const RecommendationsTab = ({
  report,
  calculateTotalEmissions,
  getScope1Details,
  getScope2Details,
  getScope3Details
}) => {
  // Generate recommendations based on emissions data
  const generateRecommendations = () => {
    const scope1Details = getScope1Details();
    const scope2Details = getScope2Details();
    const scope3Details = getScope3Details();
    
    const recommendations = [];
    
    // Scope 1 recommendations
    if (scope1Details.fuelEmissions > 0) {
      recommendations.push({
        scope: "scope1",
        area: "Combustion de carburant",
        icon: <IconTrendingDown size={24} className="text-blue" />,
        title: "Optimisation de l'utilisation des carburants",
        description: "Réduire la consommation de carburant en optimisant l'utilisation des machines et en investissant dans des technologies plus efficaces.",
        actions: [
          "Remplacer progressivement les équipements fonctionnant aux combustibles fossiles par des alternatives électriques",
          "Mettre en place un programme de maintenance préventive pour assurer l'efficacité des machines",
          "Former les opérateurs aux pratiques d'économie de carburant"
        ],
        potentialReduction: "15-25%",
        priority: scope1Details.fuelEmissions > 50 ? "Élevée" : "Moyenne"
      });
    }
    
    if (scope1Details.productionEmissions > 0) {
      recommendations.push({
        scope: "scope1",
        area: "Processus de production",
        icon: <IconRecycle size={24} className="text-blue" />,
        title: "Optimisation des processus de production",
        description: "Améliorer l'efficacité des processus de production pour réduire les émissions directes.",
        actions: [
          "Réaliser un audit des processus de production pour identifier les sources de gaspillage",
          "Moderniser les équipements de production pour améliorer l'efficacité énergétique",
          "Mettre en œuvre des techniques de production plus propres et économes en ressources"
        ],
        potentialReduction: "10-20%",
        priority: scope1Details.productionEmissions > 30 ? "Élevée" : "Moyenne"
      });
    }
    
    // Scope 2 recommendations
    if (scope2Details.energyConsumptionEmissions > 0) {
      recommendations.push({
        scope: "scope2",
        area: "Consommation d'électricité",
        icon: <IconSun size={24} className="text-purple" />,
        title: "Transition vers des sources d'énergie renouvelable",
        description: "Réduire les émissions indirectes en passant à des sources d'énergie plus propres.",
        actions: [
          "Souscrire à un contrat d'électricité verte certifiée",
          "Installer des panneaux solaires sur les toits disponibles",
          "Évaluer la faisabilité d'autres sources d'énergie renouvelable sur site"
        ],
        potentialReduction: "50-100%",
        priority: scope2Details.energyConsumptionEmissions > 40 ? "Élevée" : "Moyenne"
      });
    }
    
    if (scope2Details.coolingEmissions > 0 || scope2Details.heatingEmissions > 0) {
      recommendations.push({
        scope: "scope2",
        area: "Chauffage et refroidissement",
        icon: <IconLeaf size={24} className="text-purple" />,
        title: "Amélioration de l'efficacité thermique",
        description: "Optimiser les systèmes de chauffage et de refroidissement pour réduire la consommation d'énergie.",
        actions: [
          "Améliorer l'isolation des bâtiments",
          "Installer des systèmes de gestion intelligente de la température",
          "Remplacer les équipements obsolètes par des alternatives plus efficaces",
          "Mettre en place une récupération de la chaleur résiduelle"
        ],
        potentialReduction: "20-30%",
        priority: (scope2Details.coolingEmissions + scope2Details.heatingEmissions) > 25 ? "Élevée" : "Moyenne"
      });
    }
    
    // Scope 3 recommendations
    if (scope3Details.transportEmissions > 0) {
      recommendations.push({
        scope: "scope3",
        area: "Transport et logistique",
        icon: <IconTruck size={24} className="text-green" />,
        title: "Optimisation logistique et mobilité durable",
        description: "Réduire les émissions liées au transport des marchandises et aux déplacements professionnels.",
        actions: [
          "Optimiser les itinéraires de livraison et le taux de remplissage des véhicules",
          "Favoriser les transporteurs engagés dans des démarches de réduction d'émissions",
          "Mettre en place une politique de télétravail et de réunions virtuelles",
          "Encourager l'utilisation de modes de transport à faible impact"
        ],
        potentialReduction: "15-35%",
        priority: scope3Details.transportEmissions > 20 ? "Élevée" : "Moyenne"
      });
    }
    
    if (scope3Details.wasteEmissions > 0) {
      recommendations.push({
        scope: "scope3",
        area: "Gestion des déchets",
        icon: <IconRecycle size={24} className="text-green" />,
        title: "Réduction et valorisation des déchets",
        description: "Minimiser la production de déchets et améliorer leur valorisation.",
        actions: [
          "Mettre en place une stratégie zéro déchet",
          "Améliorer le tri des déchets et leur recyclage",
          "Développer des partenariats pour la réutilisation des matériaux",
          "Former le personnel aux bonnes pratiques de gestion des déchets"
        ],
        potentialReduction: "40-60%",
        priority: scope3Details.wasteEmissions > 15 ? "Élevée" : "Moyenne"
      });
    }
    
    // General recommendations
    recommendations.push({
      scope: "general",
      area: "Gouvernance et suivi",
      icon: <IconBulb size={24} className="text-yellow" />,
      title: "Mise en place d'une stratégie carbone",
      description: "Structurer une approche globale de réduction des émissions de gaz à effet de serre.",
      actions: [
        "Définir des objectifs de réduction d'émissions à court, moyen et long terme",
        "Mettre en place un système de mesure et de suivi régulier des émissions",
        "Intégrer la performance carbone dans les critères d'évaluation des projets",
        "Former et sensibiliser les collaborateurs aux enjeux climatiques"
      ],
      potentialReduction: "Transversale",
      priority: "Élevée"
    });
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <div className="row row-cards">
      <div className="col-12 mb-3">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <IconBulb className="me-2" size={20} />
              Recommandations pour réduire votre empreinte carbone
            </h3>
          </div>
          <div className="card-body">
            <p className="text-muted mb-4">
              Sur la base de votre bilan carbone, nous avons identifié plusieurs opportunités de réduction des émissions.
              Ces recommandations sont adaptées à votre profil d'émissions et aux meilleures pratiques sectorielles.
            </p>
            
            <div className="d-flex align-items-center mb-4">
              <div className="me-4">
                <div className="row g-2 text-center">
                  <div className="col-4">
                    <div className="badge bg-blue-lt p-2 w-100">Scope 1</div>
                  </div>
                  <div className="col-4">
                    <div className="badge bg-purple-lt p-2 w-100">Scope 2</div>
                  </div>
                  <div className="col-4">
                    <div className="badge bg-green-lt p-2 w-100">Scope 3</div>
                  </div>
                </div>
              </div>
              <div className="ms-auto">
                <div className="row g-2 text-center">
                  <div className="col-auto">
                    <div className="badge bg-red-lt p-2">Priorité: Élevée</div>
                  </div>
                  <div className="col-auto">
                    <div className="badge bg-orange-lt p-2">Priorité: Moyenne</div>
                  </div>
                  <div className="col-auto">
                    <div className="badge bg-teal-lt p-2">Priorité: Faible</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {recommendations.map((recommendation, index) => (
        <div className="col-md-6 mb-3" key={index}>
          <div className="card">
            <div className="card-status-top bg-primary"></div>
            <div className="card-header">
              <div className="card-actions">
                <span className={`badge ${recommendation.scope === "scope1" ? "bg-blue-lt" : recommendation.scope === "scope2" ? "bg-purple-lt" : recommendation.scope === "scope3" ? "bg-green-lt" : "bg-yellow-lt"}`}>
                  {recommendation.scope === "scope1" ? "Scope 1" : recommendation.scope === "scope2" ? "Scope 2" : recommendation.scope === "scope3" ? "Scope 3" : "Général"}
                </span>
                <span className={`badge ms-2 ${recommendation.priority === "Élevée" ? "bg-red-lt" : recommendation.priority === "Moyenne" ? "bg-orange-lt" : "bg-teal-lt"}`}>
                  Priorité: {recommendation.priority}
                </span>
              </div>
              <h3 className="card-title d-flex align-items-center">
                {recommendation.icon}
                <span className="ms-2">{recommendation.title}</span>
              </h3>
            </div>
            <div className="card-body">
              <h4 className="card-subtitle text-muted mb-3">{recommendation.area}</h4>
              <p>{recommendation.description}</p>
              
              <div className="mt-4">
                <h5>Actions recommandées :</h5>
                <ul className="list-group list-group-flush">
                  {recommendation.actions.map((action, actionIndex) => (
                    <li className="list-group-item" key={actionIndex}>
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <span className="badge bg-primary text-white">
                            {actionIndex + 1}
                          </span>
                        </div>
                        <div className="col">
                          {action}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {recommendation.potentialReduction !== "Transversale" && (
                <div className="mt-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">Réduction potentielle :</div>
                    <div className="ms-auto">
                      <strong className="text-success">{recommendation.potentialReduction}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="col-12 mt-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <IconLeaf size={24} className="text-green me-3" />
              <div>
                <h4 className="m-0">Prochaines étapes</h4>
              </div>
            </div>
            <p className="mt-3">
              Pour maximiser l'impact de ces recommandations, nous vous suggérons de :
            </p>
            <ol className="mt-2">
              <li>Hiérarchiser les actions en fonction de leur potentiel de réduction et de votre capacité à les mettre en œuvre</li>
              <li>Élaborer un plan d'action détaillé avec des objectifs clairs et des échéances</li>
              <li>Désigner des responsables pour chaque initiative</li>
              <li>Mettre en place des indicateurs de suivi pour mesurer les progrès</li>
              <li>Communiquer régulièrement sur les initiatives et les résultats obtenus</li>
            </ol>
            <div className="alert alert-info mt-3">
              <div className="d-flex">
                <div>
                  <IconWind className="me-2" />
                </div>
                <div>
                  Pour aller plus loin, envisagez de faire appel à nos experts pour un accompagnement personnalisé 
                  dans la mise en œuvre de ces recommandations et l'élaboration d'une stratégie de décarbonation à long terme.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsTab;