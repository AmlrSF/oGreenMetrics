import React from "react";
import { Star, StarHalf } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria L.",
      position: "Directrice RSE",
      image: "/testimonials.png",
      text: '"Grâce à GreenMetric, nous avons découvert des sources d\'émissions que nous ignorions et avons pu mettre en place des actions concrètes pour les réduire. Une solution intuitive et très efficace."',
      stars: 4,
    },
    {
      name: "Thomas M.",
      position: "CEO, Textile Tech",
      image: "/testimonials.png",
      text: '"GreenMetric nous a permis de mesurer précisément notre empreinte carbone et d\'identifier les actions prioritaires pour la réduire. Ce processus nous a aidés à devenir plus écologiquement responsables, ce qui fait la différence pour nos clients."',
      stars: 5,
    },
    {
      name: "Sophie B.",
      position: "Responsable Environnement",
      image: "/testimonials.png",
      text: "\"L'interface détaillée mais simple nous permet de suivre nos progrès de manière transparente. L'outil est très précis et le support a toujours été à l'écoute pour répondre à nos questions spécifiques.\"",
      stars: 4.5,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="icon icon-filled text-yellow"
          style={{ width: '1rem', height: '1rem' }}
        />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="icon icon-filled text-yellow"
          style={{ width: '1rem', height: '1rem' }}
        />
      );
    }

    // Add remaining empty stars
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-star-${i}`}
          className="icon text-yellow"
          style={{ width: '1rem', height: '1rem' }}
        />
      );
    }

    return stars;
  };

  return (
    <section className="py-4 mb-6"
     style={{ backgroundColor: '#8ebe21', minHeight: '30vh' }}>
      <div className="container">
        <h2 className="text-center text-4xl font-bold text-white mb-4">
          Témoignages
        </h2>

        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div className="col-md-4" key={index}>
              <div className="card h-100 rounded-3 p-3 shadow-sm">
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar me-3">
                    <img
                      src={testimonial.image}
                      alt="Portrait"
                      className="rounded-circle"
                    />
                  </span>
                  <div>
                    <h5 className="mb-0 fw-bold">{testimonial.name}</h5>
                    <p className="mb-0 text-muted small">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
                <div className="mb-3 d-flex align-items-center">
                  {renderStars(testimonial.stars)}
                </div>
                <p className="card-text text-muted small">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;