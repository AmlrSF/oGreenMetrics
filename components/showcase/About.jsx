import React from 'react'
import Image from 'next/image'

const About = () => {
  return (
    <section className="container my-5 py-5">
      <h2 className="text-center mb-5">À propos de nous</h2>
      
      <div className="row align-items-center mb-5">
        <div className="col-lg-5">
          <Image 
            src="/factory.png" 
            alt="Durabilité" 
            width={400} 
            height={300} 
            className="img-fluid rounded-4 shadow"
          />
        </div>
        <div className="col-lg-7">
          <h3 className="fw-bold mb-3">Notre Engagement pour un Avenir Durable</h3>
          <p className="mb-4">
            Chez GreenMetric, nous nous engageons à aider les entreprises à mesurer leur
            empreinte carbone et à trouver des solutions pour la réduire. Grâce à l'utilisation
            de technologies de pointe et à notre expertise dans le domaine du développement
            durable, nous offrons des outils innovants et personnalisés qui permettent à nos
            clients d'avoir un impact environnemental positif des entreprises,
            tout en créant de la valeur financière pour leur activité.
          </p>
          
          <div className="mb-4">
            <h5 className="text-success fw-bold">Expertise</h5>
            <p className="small text-muted">
              Comprendre à votre côté: d'accompagner les entreprises dans la réduction
              de leur impact environnemental à travers des outils simples et une stratégie pour
              accélérer la transition vers une économie bas carbone.
            </p>
          </div>
          
          <div className="mb-4">
            <h5 className="text-success fw-bold">Valeurs</h5>
            <p className="small text-muted">
              Nous encourageons un monde où chaque entreprise prend des décisions
              responsables pour protéger notre planète et garantir un avenir plus durable
              pour les générations futures.
            </p>
          </div>
          
          <div>
            <h5 className="text-success fw-bold">Approche</h5>
            <p className="small text-muted">
              Transparence, innovation et responsabilité sont au cœur de notre démarche.
              Nous croyons en la puissance de la collaboration et de l'engagement à agir
              pour un avenir plus durable pour tous.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About