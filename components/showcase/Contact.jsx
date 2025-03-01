import React from 'react';

const Contact = () => {
  return (
    <div className="container-xl py-4 rounded">
      <div className="card">
        <div className="card-body ">
          <form>
            <div className="mb-3">
              <label className="form-label">Email :</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Tapez votre adresse e-mail"
                required
              />
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Nom :</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tapez votre nom"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prénom :</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tapez votre prénom"
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
                placeholder=""
                required
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end bg-">
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