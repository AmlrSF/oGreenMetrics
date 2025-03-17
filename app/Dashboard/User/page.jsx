import React from 'react';

const CompanyDash = () => {
  return (
    <div className="flex flex-wrap gap-4 p-5">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="card card-sm w-72">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="subheader">Sales</div>
              <div className="dropdown">
                <a className="text-muted" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Last 7 days
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a className="dropdown-item active" href="#">Last 7 days</a>
                  <a className="dropdown-item" href="#">Last 30 days</a>
                  <a className="dropdown-item" href="#">Last 3 months</a>
                </div>
              </div>
            </div>
            <div className="h1 mb-3">75%</div>
          
             
          </div>
        </div>
      ))}
    </div>
  );
}

export default CompanyDash;
