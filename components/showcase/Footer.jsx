import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <Link href="/" className="d-inline-block mb-4">
              <Image 
                src="/logo.png" 
                alt="Green Metric" 
                width={120} 
                height={40} 
              />
            </Link>
            <p className="small mb-4">
              Plateforme de mesure de l'empreinte carbone pour les entreprises
            </p>
            <div className="d-flex gap-2">
              <Link href="#" className="text-white">
                <i className="bi bi-facebook"></i>
              </Link>
              <Link href="#" className="text-white">
                <i className="bi bi-twitter-x"></i>
              </Link>
              <Link href="#" className="text-white">
                <i className="bi bi-linkedin"></i>
              </Link>
              <Link href="#" className="text-white">
                <i className="bi bi-instagram"></i>
              </Link>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3 small text-uppercase">Accueil</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/" className="text-white-50 small text-decoration-none">Accueil</Link>
              </li>
              <li className="mb-2">
                <Link href="/services" className="text-white-50 small text-decoration-none">Services</Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="text-white-50 small text-decoration-none">À propos de nous</Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="text-white-50 small text-decoration-none">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3 small text-uppercase">Mentions légales</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/terms" className="text-white-50 small text-decoration-none">Conditions générales</Link>
              </li>
              <li className="mb-2">
                <Link href="/privacy" className="text-white-50 small text-decoration-none">Politique de confidentialité</Link>
              </li>
              <li className="mb-2">
                <Link href="/legal" className="text-white-50 small text-decoration-none">Mentions légales</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-4 col-md-4">
            <h5 className="mb-3 small text-uppercase">Nous contacter</h5>
            <p className="text-white-50 small mb-2">
              <i className="bi bi-geo-alt me-2"></i> 123 rue de la Terre, 75000 Paris
            </p>
            <p className="text-white-50 small mb-2">
              <i className="bi bi-telephone me-2"></i> +33 1 23 45 67 89
            </p>
            <p className="text-white-50 small mb-2">
              <i className="bi bi-envelope me-2"></i> contact@greenmetric.com
            </p>
          </div>
        </div>
        
        <hr className="border-secondary" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="text-white-50 small mb-2 mb-md-0">
            © GreenMetric 2025. Tous droits réservés.
          </p>
          <div className="d-flex gap-2">
            <Link href="#" className="text-white">
              <i className="bi bi-facebook"></i>
            </Link>
            <Link href="#" className="text-white">
              <i className="bi bi-twitter-x"></i>
            </Link>
            <Link href="#" className="text-white">
              <i className="bi bi-linkedin"></i>
            </Link>
            <Link href="#" className="text-white">
              <i className="bi bi-instagram"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer