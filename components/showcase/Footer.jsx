import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative   bg-gray-900 z-[-10] pt-[250px]">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/footer.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',

        }}
      />
      {/* Black overlay with 0.3 opacity */}
      <div className="absolute inset-0 bg-black opacity-70" />
      
      <div className="relative  min-h-[25vh] container mx-auto px-4">
        <div className="footer-section container-card-3 items-center ">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/Group.png" 
                alt="Green Metric" 
                width={150} 
                height={40}
               
              />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Plateforme de mesure de l'empreinte carbone pour les entreprises
            </p>
            <div className="flex space-x-4">
              <SocialIcon Icon={Facebook} />
              <SocialIcon Icon={Twitter} />
              <SocialIcon Icon={Linkedin} />
              <SocialIcon Icon={Instagram} />
            </div>
          </div>

          {/* Quick Links */}
          <div className='min-w-[200px]'>
            <h5 className="text-white uppercase text-sm font-medium mb-1">Accueil</h5>
            <ul className="pl-4 ">
              <FooterLink href="/" text="Accueil" />
              <FooterLink href="/services" text="Services" />
              <FooterLink href="/about" text="À propos de nous" />
              <FooterLink href="/contact" text="Contact" />
            </ul>
          </div>

          {/* Contact */}
          <div className='min-w-[200px]'>
            <h5 className="text-white uppercase text-sm font-medium mb-1">Nous contacter</h5>
            <div className="pl-4 ">
              <ContactInfo Icon={MapPin} text="123 rue de la Terre, 75000 Paris" />
              <ContactInfo Icon={Phone} text="+33 1 23 45 67 89" />
              <ContactInfo Icon={Mail} text="contact@greenmetric.com" />
            </div>
          </div>
        </div>

        <hr className="border-black my-0 " />

        {/* Bottom Bar */}
        <div className="flex items-center justify-center py-2">
          <p className="text-gray-400 text-sm mb-0">
            © GreenMetric 2025. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialIcon = ({ Icon }) => (
  <Link href="#" className="text-white hover:text-gray-300 transition-colors">
    <Icon size={20} />
  </Link>
);

const FooterLink = ({ href, text }) => (
  <li>
    <Link href={href} className="text-gray-400 text-sm hover:text-white transition-colors">
      {text}
    </Link>
  </li>
);

const ContactInfo = ({ Icon, text }) => (
  <p className="text-gray-400 text-sm mb-0 flex items-center">
    <Icon size={16} className="mr-2" />
    {text}
  </p>
);

export default Footer;