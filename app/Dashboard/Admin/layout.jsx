"use client";

import Loader from "@/components/Commun/Loader/page";
import Navbar from "@/components/Commun/navbar/page";
import Sidebar from "@/components/Commun/sidebar/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { push, back } = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      setIsCollapsed(saved ? JSON.parse(saved) : false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();

        if (data?.user) {
           setUser(data.user);
          if (data?.user?.role === "Admin" ||  data?.user?.AdminRoles) {
           
            setIsLoading(false);
           
            if (data?.user?.AdminRoles) {
              let adminRole = data?.user?.AdminRoles;
              console.log(adminRole);
  
              if (adminRole?.companyManagement == "00") {
                push("/Dashboard/Admin");
              }
  
              if (adminRole?.roleManagement == "00") {
                push("/Dashboard/Admin");
              }
  
              if (adminRole?.userManagement == "00") {
                push("/Dashboard/Admin");
              }
            }

           
          } else{
            back();
          }

        }else{
          push("/login");
        }

      } catch (error) {
        console.error("Authorization failed:", error);
        push("/login");
      }
    };

    checkAuth();
    const handleStorageChange = (e) => {
      if (e.key === "sidebarCollapsed") {
        setIsCollapsed(e.newValue ? JSON.parse(e.newValue) : false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [push]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  if (isLoading  ) {
    return <Loader />;
  }

  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        user={user}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div
        className="flex-1 flex flex-col overflow-auto transition-all duration-300"
        style={{
          marginLeft: isCollapsed ? "60px" : "260px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Navbar
          user={user}
          isAdmin={user?.role === "Admin" || user?.AdminRoles}
        />
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
