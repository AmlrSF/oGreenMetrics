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
    <section className="container h-50 d-flex gap-10 h-100 
      justify-content-center flex-column align-items-center ">
      <h2 className="text-center my-8 text-fs-2 font-bold mb-10">Nos partenaires</h2>
      
      <div className="d-flex gap-5  h-100 mt-5
      justify-content-center align-items-center">
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