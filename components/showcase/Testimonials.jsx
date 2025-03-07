import React from 'react'
import Image from 'next/image'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria L.",
      position: "Directrice RSE",
      image: "/testimonials.png",
      text: "\"Grâce à GreenMetric, nous avons découvert des sources d'émissions que nous ignorions et avons pu mettre en place des actions concrètes pour les réduire. Une solution intuitive et très efficace.\""
    },
    {
      name: "Thomas M.",
      position: "CEO, Textile Tech",
      image: "/testimonials.png",
      text: "\"GreenMetric nous a permis de mesurer précisément notre empreinte carbone et d'identifier les actions prioritaires pour la réduire. Ce processus nous a aidés à devenir plus écologiquement responsables, ce qui fait la différence pour nos clients.\""
    },
    {
      name: "Sophie B.",
      position: "Responsable Environnement",
      image: "/testimonials.png",
      text: "\"L'interface détaillée mais simple nous permet de suivre nos progrès de manière transparente. L'outil est très précis et le support a toujours été à l'écoute pour répondre à nos questions spécifiques.\""
    }
  ]
  
  return (
    <section className="container my-5 py-5">
      <h2 className="text-center mb-5">Témoignages</h2>
      
      <div className="row g-4">
        {testimonials.map((testimonial, index) => (
          <div className="col-md-4" key={index}>
            <div className="card h-100 border rounded-4 p-4 shadow-sm">
              <div className="d-flex align-items-center mb-3">
                <Image 
                  src={testimonial.image} 
                  alt="Portrait" 
                  width={50} 
                  height={50} 
                  className="rounded-circle me-3"
                />
                <div>
                  <h5 className="mb-0 fw-bold">{testimonial.name}</h5>
                  <p className="mb-0 small text-muted">{testimonial.position}</p>
                </div>
              </div>
              <p className="card-text small">{testimonial.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials