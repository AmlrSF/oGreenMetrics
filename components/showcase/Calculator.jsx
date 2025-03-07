"use client"
import React, { useState } from 'react'

const Calculator = () => {
  const [emailInput, setEmailInput] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Email submitted:', emailInput)
  }
  
  return (
    <section className="container my-5 py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Calculez votre empreinte carbone</h2>
        <p className="text-muted">Évaluez les informations clés pour estimer vos émissions de CO₂</p>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="d-flex">
            <input 
              type="email" 
              className="form-control me-2" 
              placeholder="Calculez vos émissions web " 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-success px-4">
              Calculer
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Calculator