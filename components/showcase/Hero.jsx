import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Partners, Calculator } from "@/components/showcase";

const Hero = () => {
  return (
    <>
      <section id="home" className="relative">
        <div
          className="container h-100 hero min-h-[90vh] 
      d-flex align-items-center "
        >
          <div
            className="d-flex align-items-center 
      justify-content-center "
          >
            <div className="col-md-6 px-4 mb-8 mb-md-0">
              <h1 className="display-5 fw-bold mb-4">
                Maîtrisez vos émissions, décarbonez votre entreprise
              </h1>
              <p className="text-muted mb-4">
                Profitez d'une plateforme de durabilité certifiée et de
                l'accompagnement d'experts pour amorcer votre transition bas
                carbone et réduire l'empreinte carbone de votre entreprise, tout
                cela en moins de 15 min de connexion.
              </p>
              <Link
                href="/contact"
                className="bg-[#8ebe21] text-white font-medium rounded-lg py-2 px-6 fw-bold"
              >
                Contactez-nous
              </Link>
            </div>
            <div className="col-md-6 px-4 d-flex justify-content-center">
              <Image
                src="/analytics.png"
                alt="Dashboard carbone"
                width={400}
                height={400}
                className="img-fluid"
              />
            </div>
          </div>
        </div>
        <svg
          className="absolute bottom-0 w-full
      left-0 mb-[-35px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#8ebe21"
            fillOpacity="1"
            d="M0,224L40,213.3C80,203,160,181,240,186.7C320,192,400,224,480,234.7C560,245,640,235,720,240C800,245,880,267,960,245.3C1040,224,1120,160,1200,138.7C1280,117,1360,139,1400,149.3L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </section>
      
    </>
  );
};

export default Hero;
