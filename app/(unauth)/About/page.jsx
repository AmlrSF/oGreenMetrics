import React from "react";
import Image from "next/image";
import {
  Navbar,
  Footer,
} from "@/components/showcase";

const About = () => {
  return (
    <>
      <Navbar />
      <section id="about" className="container min-h-screen my-5 py-5">
        <h2 className="text-center text-4xl font-bold mb-10">
          À propos de nous
        </h2>

        <div className="row align-items-center justify-content-between ">
          <div className="col-lg-5">
            <Image
              src="/factory.png"
              alt="Durabilité"
              width={300}
              height={300}
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div className="col-lg-7">
            <h3
              className="fw-bold text-2xl
           font-medium mb-1"
            >
              Notre Engagement pour un Avenir Durable
            </h3>
            <p className="mb-4 text-sm text-muted">
              Chez GreenMetric, nous nous engageons à aider les entreprises à
              mesurer leur empreinte carbone et à trouver des solutions pour la
              réduire. Grâce à l'utilisation de technologies de pointe et à
              notre expertise dans le domaine du développement durable, nous
              offrons des outils innovants et personnalisés qui permettent à nos
              clients d'avoir un impact environnemental positif des entreprises,
              tout en créant de la valeur financière pour leur activité.
            </p>

            <div className="mb-4">
              <h5 className="text-success text-lg fw-bold mb-0">Expertise</h5>
              <p className="small text-muted">
                Comprendre à votre côté: d'accompagner les entreprises dans la
                réduction de leur impact environnemental à travers des outils
                simples et une stratégie pour accélérer la transition vers une
                économie bas carbone.
              </p>
            </div>

            <div className="mb-4">
              <h5 className="text-success text-lg fw-bold mb-0">Valeurs</h5>
              <p className="small text-muted">
                Nous encourageons un monde où chaque entreprise prend des
                décisions responsables pour protéger notre planète et garantir
                un avenir plus durable pour les générations futures.
              </p>
            </div>

            <div>
              <h5 className="text-success text-lg fw-bold mb-0">Approche</h5>
              <p className="small text-muted">
                Transparence, innovation et responsabilité sont au cœur de notre
                démarche. Nous croyons en la puissance de la collaboration et de
                l'engagement à agir pour un avenir plus durable pour tous.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
