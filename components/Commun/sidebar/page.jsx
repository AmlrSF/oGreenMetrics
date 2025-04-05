import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Menu, ChevronLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { userMenuItems, menuItems } from "@/lib/Data";

const Sidebar = ({ user, isAdmin }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      if (user?.role === "Admin") {
        setItems(
          menuItems.filter(
            item => item.label !== "Profile" && item.label !== "Settings"
          )
        );
      } else if (user?.AdminRoles) {
        const filteredMenuItems = menuItems.filter(item => {
          if (!item?.service) return true;
          return user.AdminRoles[item?.service] !== '00';
        });
  
        setItems(
          filteredMenuItems.filter(
            item => item.label !== "Profile" && item.label !== "Settings"
          )
        );
      }
    } else {
      setItems(
        userMenuItems.filter(
          item => item.label !== "Profile" && item.label !== "Settings"
        )
      );
    }
  }, [isAdmin, user]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

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
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div
      className={`position-fixed top-0 start-0 bottom-0 overflow-y-auto bg-white shadow-sm ${
        isCollapsed ? "collapsed" : ""
      }`}
      style={{
        display: "flex",
        flexDirection: "column",
        zIndex: 1030,
        width: isCollapsed ? "5rem" : "16rem",
        transition: "width 0.3s ease"
      }}
    >
      <div
        className={`d-flex align-items-center p-3 border-bottom ${
          isCollapsed ? "justify-content-center" : "justify-content-between"
        }`}
      >
        {!isCollapsed && (
          <div className="d-flex align-items-start flex-column">
            <span className="fs-6 fw-bold text-primary">Green</span>
            <span className="fs-5 fw-bold text-success">Metrics</span>
          </div>
        )}
        <div
          onClick={toggleCollapse}
          className="btn btn-link p-1"
          style={{ cursor: "pointer" }}
        >
          {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
        </div>
      </div>

      <div className="p-3 flex-grow-1">
        <ul className="nav flex-column">
          {items.map((item) => (
            <li key={item.label} className="nav-item mb-1">
              {item.type === "dropdown" ? (
                <>
                  <a
                    href="#"
                    className="nav-link d-flex align-items-center py-2 px-3 text-dark text-decoration-none"
                    onClick={() => toggleDropdown(item.label)}
                    style={{
                      backgroundColor: openDropdown === item.label ? "#f8f9fa" : "",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = openDropdown === item.label ? "#f8f9fa" : ""}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <item.icon size={22} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`ms-auto ${openDropdown === item.label ? "rotate-180" : ""}`}
                        style={{ transition: "transform 0.3s ease" }}
                      />
                    )}
                  </a>
                  <div
                    className={`nav flex-column ms-3 mt-1 ${
                      openDropdown === item.label ? "d-block" : "d-none"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="nav-link d-flex align-items-center py-2 px-3 text-dark text-decoration-none"
                        style={{ borderRadius: "4px" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                      >
                        <child.icon size={20} className="me-2" />
                        {!isCollapsed && <span>{child.label}</span>}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="nav-link d-flex align-items-center py-2 px-3 text-dark text-decoration-none"
                  style={{ borderRadius: "4px" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                >
                  <item.icon size={22} className="me-2" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-top p-3">
        <ul className="nav flex-column mb-3">
          {["Profile", "Settings"].map((label) => {
            const item = (isAdmin ? menuItems : userMenuItems).find(
              (i) => i.label === label
            );
            return (
              item && (
                <li key={item.label} className="nav-item mb-1">
                  <Link
                    href={item.href}
                    className="nav-link d-flex align-items-center py-2 px-3 text-dark text-decoration-none"
                    style={{ borderRadius: "4px" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    <item.icon size={22} className="me-2" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            );
          })}
        </ul>

        <button
          onClick={logout}
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <LogOut size={22} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;