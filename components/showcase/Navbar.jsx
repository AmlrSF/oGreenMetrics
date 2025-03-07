import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav className="container-fluid py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand">
          <Image src="/logo.png" alt="Green Metric" width={120} height={40} />
        </Link>
        
        <div className="d-flex align-items-center">
          <ul className="nav me-4">
            <li className="nav-item">
              <Link href="/" className="nav-link">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link href="/services" className="nav-link">Services</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">À propos de nous</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>
          
         
          
          <Link href="/login" className="btn btn-success rounded-pill px-4">
          Commencez
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar