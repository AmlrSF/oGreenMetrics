import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer z-10 footer-transparent position-relative ">
      <div 
        className="position-absolute start-0 end-0 top-0 bottom-0"
        style={{
          backgroundImage: "url('/footer.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="position-absolute start-0 end-0 top-0 bottom-0 
      bg-dark opacity-70" />
      
      <div className="container position-relative ftr">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-12 col-md-4">
            <Link href="/" className="d-inline-block mb-3">
              <Image 
                src="/Group.png" 
                alt="Green Metric" 
                width={150} 
                height={40}
              />
            </Link>
            <p className="text-white small mb-3">
              Plateforme de mesure de l'empreinte carbone pour les entreprises
            </p>
            <div className="d-flex gap-3">
              <SocialIcon Icon={Facebook} />
              <SocialIcon Icon={Twitter} />
              <SocialIcon Icon={Linkedin} />
              <SocialIcon Icon={Instagram} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-4">
            <h5 className="text-white text-uppercase fw-medium mb-2">Accueil</h5>
            <ul className="list-unstyled ps-0">
              <FooterLink href="/" text="Accueil" />
              <FooterLink href="/services" text="Services" />
              <FooterLink href="/about" text="À propos de nous" />
              <FooterLink href="/contact" text="Contact" />
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-4">
            <h5 className="text-white text-uppercase fw-medium mb-2">Nous contacter</h5>
            <div className="ps-0">
              <ContactInfo Icon={MapPin} text="123 rue de la Terre, 75000 Paris" />
              <ContactInfo Icon={Phone} text="+33 1 23 45 67 89" />
              <ContactInfo Icon={Mail} text="contact@greenmetric.com" />
            </div>
          </div>
        </div>

        <hr className="border-dark my-4" />

        {/* Bottom Bar */}
        <div className="text-center py-3">
          <p className="text-white small mb-0">
            © GreenMetric 2025. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialIcon = ({ Icon }) => (
  <Link href="#" className="text-white text-decoration-none hover-opacity-75">
    <Icon size={20} />
  </Link>
);

const FooterLink = ({ href, text }) => (
  <li className="mb-2">
    <Link href={href} className="text-white text-decoration-none hover-text-white">
      {text}
    </Link>
  </li>
);

const ContactInfo = ({ Icon, text }) => (
  <p className="text-white small mb-2 d-flex align-items-center">
    <Icon size={16} className="me-2" />
    {text}
  </p>
);

export default Footer;