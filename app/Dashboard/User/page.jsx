"use client";
import React, { useEffect, useState } from "react";

const CompanyDash = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserReponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const UseData = await UserReponse.json();
        if (UseData?.user) {
          setUser(UseData.user);
          const CompanyResponse = await 
          fetch(`http://localhost:4000/GetCompanyByOwnerID/${UseData?.user?._id}`, {
            method: "GET"
          });
          const CompanyData = await CompanyResponse.json();
          console.log(CompanyData);
          //company id
          
        } else {
          setError("User not found");
        }
      } catch (error) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p className="text-center text-secondary">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  return (
    <div className="flex flex-wrap gap-4 p-5">
      <h2 className="w-full text-lg font-semibold">
        Welcome, {user?.name || "User"}!
      </h2>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="card card-sm w-72">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="subheader">Sales</div>
                <div className="dropdown">
                  <a
                    className="text-muted"
                    href="#"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Last 7 days
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item active" href="#">
                      Last 7 days
                    </a>
                    <a className="dropdown-item" href="#">
                      Last 30 days
                    </a>
                    <a className="dropdown-item" href="#">
                      Last 3 months
                    </a>
                  </div>
                </div>
              </div>
              <div className="h1 mb-3">75%</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CompanyDash;
