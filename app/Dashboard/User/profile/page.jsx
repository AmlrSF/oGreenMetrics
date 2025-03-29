import React from 'react'

const page = () => {
  return (
    <div className="container-xl py-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title m-0">Personal Account</h2>
            <span className="badge bg-primary">Active</span>
          </div>

          <div className="hr-text mb-4">Profile Details</div>
          
          <div className="row align-items-center mb-4">
            <div className="col-auto">
              <span className="avatar avatar-xl rounded-circle bg-blue-lt">JD</span>
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-outline-primary btn-pill">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
                  <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                </svg>
                Change photo
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label">Nom</label>
              <input type="text" className="form-control" placeholder="Votre nom" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Prénom</label>
              <input type="text" className="form-control" placeholder="Votre prénom" />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Email</label>
            <div className="row g-2">
              <div className="col-md-8">
                <div className="input-icon">
                  <span className="input-icon-addon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                      <path d="M3 7l9 6l9 -6"></path>
                    </svg>
                  </span>
                  <input type="email" className="form-control" placeholder="your@email.com" />
                </div>
                <small className="form-hint text-muted">This contact will be shown to others publicly, so choose it carefully.</small>
              </div>
              <div className="col-auto">
                <button type="button" className="btn btn-primary btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                    <path d="M16 5l3 3"></path>
                  </svg>
                  Change
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Mot de passe</label>
            <button type="button" className="btn btn-outline-danger">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-key" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l6.558 -6.558l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z"></path>
                <path d="M15 9h.01"></path>
              </svg>
              Reset Password
            </button>
            <small className="form-hint d-block mt-1">You can set a permanent password if you don't want to use temporary login codes.</small>
          </div>

          <div className="card mt-5 mb-4">
            <div className="ribbon ribbon-top ribbon-bookmark bg-azure">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z"></path>
                <path d="M14 9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-2"></path>
                <path d="M3 16l18 0"></path>
              </svg>
            </div>
            <div className="card-body">
              <h3 className="card-title">Company Account</h3>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nom d'entreprise</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M3 21l18 0"></path>
                        <path d="M5 21v-14l8 -4v18"></path>
                        <path d="M19 21v-10l-6 -4"></path>
                        <path d="M9 9l0 .01"></path>
                        <path d="M9 12l0 .01"></path>
                        <path d="M9 15l0 .01"></path>
                        <path d="M9 18l0 .01"></path>
                      </svg>
                    </span>
                    <input type="text" className="form-control" placeholder="Nom d'entreprise" />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Matricule fiscale</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"></path>
                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"></path>
                        <path d="M16 5l3 3"></path>
                      </svg>
                    </span>
                    <input type="text" className="form-control" placeholder="Matricule fiscale" />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Numéro de téléphone</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
                      </svg>
                    </span>
                    <input type="tel" className="form-control" placeholder="+216 XX XXX XXX" />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date de fondation</label>
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"></path>
                        <path d="M16 3v4"></path>
                        <path d="M8 3v4"></path>
                        <path d="M4 11h16"></path>
                        <path d="M11 15h1"></path>
                        <path d="M12 15v3"></path>
                      </svg>
                    </span>
                    <input type="date" className="form-control" />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Adresse</label>
                  <textarea className="form-control" rows="3" placeholder="Adresse complète"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-5">
            <div className="btn-list">
              <button type="button" className="btn btn-ghost-danger me-1">Cancel</button>
              <button type="button" className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-floppy" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path>
                  <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                  <path d="M14 4l0 4l-6 0l0 -4"></path>
                </svg>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page