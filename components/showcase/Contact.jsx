"use client";

import React from 'react';
import { sendForm } from '@emailjs/browser';

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await sendForm(
        'service_kxls9d4',  
        'template_rlqrokt',  
        e.target,
        'J6mVdNGhIYkX0YScB'  
      );
      alert('Message sent successfully!');
      e.target.reset();  
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container-xl py-4 rounded-2xl">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email :</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Tapez votre adresse e-mail"
                required
                name="email"
              />
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Nom :</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tapez votre nom"
                  name="user_name"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prénom :</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tapez votre prénom"
                  name="user_firstname"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label">
                Quelle est la raison de votre contact aujourd'hui ? 
                <span className="text-danger">*</span>
              </label>
              <div className="text-muted small mb-2">
                Merci de nous donner plus de détails sur votre demande
              </div>
              <textarea 
                className="form-control" 
                rows="4" 
                required
                name="message"
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="submit" 
                className="btn btn-success px-5"
              >
                Soumettez
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;