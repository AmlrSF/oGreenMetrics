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
    <section className="container min-h-[40vh] ">
      <h2 className="text-center my-8 text-4xl font-bold">Nos partenaires</h2>
      
      <div className="d-flex gap-10 h-full mt-10 
      justify-content-center items-center">
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