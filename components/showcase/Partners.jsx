import React from 'react'
import Image from 'next/image'

const Partners = () => {
  const partners = [
    {
      name: "Iset Mahdia",
      logo: "/iset.png",
    },
    {
      name: "Pixelium",
      logo: "/pixel.png",
    }
  ]
  
  return (
    <section className="container my-5 py-4">
      <h2 className="text-center mb-5">Nos partenaires</h2>
      
      <div className="row justify-content-center">
        {partners.map((partner, index) => (
          <div className="col-md-3 col-6 text-center" key={index}>
            <Image 
              src={partner.logo} 
              alt={partner.name} 
              width={150} 
              height={80} 
              className="img-fluid mb-3"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Partners