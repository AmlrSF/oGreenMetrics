import React from 'react'

const page = () => {
  return (
    <div>
   
 
        <div className="col-md-9 ml-10 mt-4">
          <div  >
            <div  >
              <h2 className="mb-4">Personal Account</h2>

              <h3 className="card-title">Profile Details</h3>

              <div className="row align-items-center mb-3">
                <div className="col-auto">
                  <span className="avatar avatar-lg"></span>
                </div>
                <div className="col-auto">
                  <button type="button" className="btn btn-outline-primary">
                    Change photo
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input type="text" className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Prénom</label>
                <input type="text" className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="row g-2">
                  <div className="col-auto">
                    <input type="email" className="form-control" />
                  </div>
                  <div className="col-auto">
                    <button type="button" className="btn btn-primary">
                      Change
                    </button>
                  </div>
                </div>
                <small className="form-hint">This contact will be shown to others publicly, so choose it carefully.</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <button type="button" className="btn btn-outline-secondary">
                  Reset Password
                </button>
                <small className="form-hint d-block mt-1">You can set a permanent password if you don't want to use temporary login codes.</small>
              </div>

           
 
              <div >
                <h2 className="mb-4">Company Account</h2>

                <div className="mb-3">
                  <label className="form-label">Nom d'entreprise</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Matricule fiscale</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Numéro de téléphone</label>
                  <input type="tel" className="form-control" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Adresse</label>
                  <textarea className="form-control" rows="3"></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Date de fondation</label>
                  <input type="date" className="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
                  <button type="button" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
      </div> 
  )
}

export default page