import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="container py-5">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="fw-bold mb-3">Maîtrisez vos émissions, décarbonez votre entreprise</h1>
          <p className="text-muted mb-4">
            Profitez d'une plateforme de durabilité certifiée et de l'accompagnement
            d'experts pour amorcer votre transition bas carbone et réduire l'empreinte
            carbone de votre entreprise, tout cela en moins de 15 min de connexion.
          </p>
          <Link href="/contact" className="btn btn-success rounded-pill px-4 py-2">
            Contactez-nous
          </Link>
        </div>
        <div className="col-lg-6">
          <div className="position-relative">
            <Image 
              src="/Auth illustrations/signup.png" 
              alt="Dashboard carbone" 
              width={500} 
              height={400} 
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero