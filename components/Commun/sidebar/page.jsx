import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Menu, ChevronLeft, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userMenuItems, menuItems } from "@/lib/Data";

const Sidebar = ({ user, isAdmin }) => {

  console.log(user);
  

  const [isCollapsed, setIsCollapsed] = useState(false);
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
  
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
  
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isAdmin, user]);

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
    <div
      className={`sidebar navbar-vertical shadow-md ${
        isCollapsed ? "sidebar-collapsed" : ""
      }`}
      style={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
     
      <div
        className={`sidebar-header d-flex gap-6 align-items-center p-3 ${
          isCollapsed ? "justify-content-center" : "justify-content-between"
        }`}
      >
        {!isCollapsed && (
          <div className="d-flex justify-content-center p-3 align-items-start flex-column font-extrabold leading-[0.8]">
            <span className="text-[15px] text-[#263589]">Green</span>
            <span className="text-[20px] text-[#8EBE21]">Metrics</span>
          </div>
        )}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="cursor-pointer"
        >
          {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
        </div>
      </div>
      <div className="sidebar-content p-3 flex-grow-1">
        <ul className="nav flex-column">
          {items.map((item) => (
            <li key={item.label} className="nav-item">
              {item.type === "dropdown" ? (
                <>
                  <a
                    href="#"
                    className={`nav-link d-flex gap-3 align-items-center ${
                      isCollapsed
                        ? "justify-content-center"
                        : "justify-content-start"
                    }`}
                    onClick={() => toggleDropdown(item.label)}
                  >
                    <item.icon size={22} />
                    {!isCollapsed && (
                      <>
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`${
                            openDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </a>
                  <ul
                    className={`nav flex-column ${
                      openDropdown === item.label ? "d-block" : "d-none"
                    }`}
                  >
                    {item.children.map((child) => (
                      <li key={child.label} className="nav-item">
                        <Link
                          href={child.href}
                          className={`nav-link d-flex align-items-center ${
                            isCollapsed ? "" : "ml-9"
                          }`}
                        >
                          <child.icon size={20} className="me-2" />
                          {!isCollapsed && <span>{child.label}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`nav-link d-flex gap-3 align-items-center ${
                    isCollapsed
                      ? "justify-content-center"
                      : "justify-content-start"
                  }`}
                >
                  <item.icon size={22} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer p-3 mt-auto">
        <ul className="nav flex-column mb-3">
          {["Profile", "Settings"].map((label) => {
            const item = (isAdmin ? menuItems : userMenuItems).find(
              (i) => i.label === label
            );
            return (
              item && (
                <li key={item.label} className="nav-item">
                  <Link
                    href={item.href}
                    className={`nav-link d-flex gap-3 align-items-center ${
                      isCollapsed
                        ? "justify-content-center"
                        : "justify-content-start"
                    }`}
                  >
                    <item.icon size={22} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            );
          })}
        </ul>

        <button
          onClick={logout}
          className={`btn btn-danger w-100 d-flex align-items-center ${
            isCollapsed ? "justify-content-center" : "justify-content-between"
          }`}
        >
          <LogOut size={22} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;