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
    <section className="container
    text-center py-5">
      <h2 className="text-center my-8 fs-1 font-bold mb-10">Nos partenaires</h2>
      
      <div className="d-flex 
      justify-content-center gap-5 mt-5 align-items-center">
        {partners.map((partner, index) => (
          <div className="mb-0 h-full" key={index}>
            <Image 
              src={partner.logo} 
              alt={partner.name} 
              width={150} 
              height={80} 
              className="img-fluid "
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Partners