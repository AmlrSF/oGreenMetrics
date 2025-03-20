import React from "react";
import { Bell } from "lucide-react";
import { getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";

const Navbar = ({ user }) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/Admin/profile");
  };

  return (
    <nav className="navbar py-2 navbar-expand-lg navbar-light
     bg-white ">
      <div className="container-fluid d-flex justify-content-end px-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn position-relative" style={{ border: "none", background: "none" }}>
            <Bell size={20} className="text-secondary" />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </button>

          <div
            onClick={handleNavigation}
            className="d-flex align-items-center cursor-pointer border rounded-pill p-1"
            style={{ cursor: "pointer" }}
          >
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: "40px", height: "40px" }}>
              {user?.photo_de_profil ? (
                <img
                  src={user?.photo_de_profil}
                  alt={`${user?.prenom} ${user?.nom}`}
                  className="rounded-circle w-100 h-100"
                />
              ) : (
                getInitials(user?.prenom, user?.nom)
              )}
            </div>
            <span className="d-none d-sm-inline-block text-muted fw-medium ms-2 pe-2">
              {user?.prenom} {user?.nom}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
