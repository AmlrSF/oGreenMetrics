import React from "react";
import Image from "next/image";
import {
  Navbar,
  Footer,
} from "@/components/showcase";

const Services = () => {
  const serviceCards = [
    {
      title: "Mesure",
      icon: "/mesure.png",
      description:
        "Évaluez votre empreinte carbone actuelle. Collectez et analysez vos données pour avoir une vision claire de vos émissions de CO2 dans différents domaines.",
    },
    {
      title: "Analyse",
      icon: "/analyse.png",
      description:
        "Analysez les résultats, vos émissions et identifiez les points d'amélioration. Obtenez des recommandations adaptées à votre entreprise.",
    },
    {
      title: "Rapport",
      icon: "/rapport.png",
      description:
        "Générez des rapports détaillés et personnalisés sur votre empreinte carbone. Suivez vos progrès et partagez vos résultats avec vos parties prenantes.",
    },
  ];

  
  return (
    <>
      <Navbar />
      <section id="services" className="bg-prime py-5">
        <div className="container">
          <h2
            className="text-center font-bold text-white
         text-4xl mb-1"
          >
            Nos services
          </h2>
          <p className="text-center text-white mb-5">
            Mesurez, gérez et réduisez votre empreinte carbone avec notre
            solution et un accompagnement adapté
          </p>

          <div className="row g-4">
            {serviceCards.map((service, index) => (
              <div className="col-md-4" key={index}>
                <div className="card h-100 text-center rounded-xl border-0 p-4">
                  <div className="d-flex justify-content-center mb-3">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={50}
                      height={50}
                    />
                  </div>
                  <h4 className="card-title mb-3">{service.title}</h4>
                  <p className="card-text text-muted small">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Services;
