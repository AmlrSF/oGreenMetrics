"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Menu, ChevronLeft, ChevronDown } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userMenuItems, menuItems } from "@/lib/Data";

const Sidebar = ({ user, isAdmin }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(isAdmin ? menuItems : userMenuItems);
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:4000/users/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        Cookies.remove("auth_token");
        toast.success(data?.message);
        router.push("/login");
      } else {
        console.error("Logout failed:", data.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`} style={{ backgroundColor: "white", display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className="sidebar-header d-flex align-items-center justify-content-between p-3">
        {!isCollapsed && <Image src="/logo.png" width={150} height={150} alt="logo" />}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="btn btn-outline-secondary">
          {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      <div className="sidebar-content p-3 flex-grow-1">
        <ul className="nav flex-column">
          {items.map((item) => (
            <li key={item.label} className="nav-item">
              {item.type === "dropdown" ? (
                <>
                  <a
                    href="#"
                    className="nav-link d-flex align-items-center justify-content-between"
                    onClick={() => toggleDropdown(item.label)}
                    style={{ paddingRight: isCollapsed ? "8px" : "16px" }}
                  >
                    <item.icon size={22} className="me-2" style={{ marginLeft: isCollapsed ? "auto" : "0" }} />
                    {!isCollapsed && <span>{item.label}</span>}
                    {!isCollapsed && (
                      <ChevronDown className={`ms-auto ${openDropdown === item.label ? "rotate-180" : ""}`} />
                    )}
                  </a>
                  <ul className={`nav flex-column ${openDropdown === item.label ? "d-block" : "d-none"} `}>
                    {item.children.map((child) => (
                      <li key={child.label} className="nav-item">
                        <Link href={child.href} className="nav-link d-flex align-items-center">
                          <child.icon size={20} className="me-2" />
                          {!isCollapsed && <span>{child.label}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={item.href} className="nav-link d-flex align-items-center" style={{ paddingRight: isCollapsed ? "8px" : "16px" }}>
                  <item.icon size={22} className="me-2" style={{ marginLeft: isCollapsed ? "auto" : "0" }} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer p-3 mt-auto">
        <button onClick={logout} className="btn btn-danger w-100 justify-content-between d-flex align-items-center">
          <LogOut size={22} className="" style={{ marginLeft: isCollapsed ? "auto" : "0" }} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;