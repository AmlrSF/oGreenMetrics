"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";
 
const Navbar = ({ user, isAdmin }) => {
  const router = useRouter(); 
  
 
  const handleNavigation = () => {
    router.push(`/Dashboard/${isAdmin ? "Admin" : "User"}/profile`);
  };
 

  return (
    <nav className="navbar py-2 navbar-expand-lg" style={{ backgroundColor: "#8ebe21" }}>
      <div className="container-xl d-flex justify-content-end px-4">
        <div className="d-flex align-items-center gap-3">
          {/* Notification bell */}
          <div className="position-relative">
            <button
              className="btn position-relative"
              style={{ border: "none", background: "none" }}
             >
              <Bell size={20} className="text-white" />
             
            </button>

            {/* Notification dropdown */}
               <div
                className="position-absolute end-0 mt-2 shadow-lg rounded-3 bg-white"
                style={{ width: "320px", zIndex: 1000, maxHeight: "400px", overflowY: "auto" }}
              >
               
                <div>
                  
                </div>
              </div>
           </div>

          {/* Profile */}
          <div
            onClick={handleNavigation}
            className="d-flex align-items-center border rounded-pill p-1"
            style={{ cursor: "pointer", backgroundColor: "#ffffff30" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: "25px",
                height: "25px",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              {user?.photo_de_profil ? (
                <img
                  src={user?.photo_de_profil}
                  alt={`${user?.prenom} ${user?.nom}`}
                  className="rounded-circle"
                />
              ) : (
                <span style={{ color: "#8ebe21" }}>{getInitials(user?.prenom, user?.nom)}</span>
              )}
            </div>
            <span className="d-none d-sm-inline-block text-white fw-medium ms-2 pe-2">
              {user?.prenom} {user?.nom}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;