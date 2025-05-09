"use client";

import Navbar from "@/components/Commun/navbar/page";
import Sidebar from "@/components/Commun/sidebar/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Commun/Loader/page";
import VerificationRequired from "@/components/VerificationRequired";

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const rolesNeedsToBeverified = ["régulier", "entreprise"];
  const [isLoading, setIsLoading] = useState(true);
  const { push, back } = useRouter();

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      setIsCollapsed(saved ? JSON.parse(saved) : false);
    }
  }, []);

  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();

        if (data?.user) {
          if(data?.user?.role === 'régulier'){
            setUser(data.user);
            setIsLoading(false);
          }else{
            back();
          }
         
        } else {
          push("/login");
        }
      } catch (error) {
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

  if (isLoading) return <Loader />;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        user={user}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main 
        className="flex-1 flex flex-col overflow-auto transition-all duration-300"
        style={{ 
          marginLeft: isCollapsed ? "60px" : "260px",
          transition: "margin-left 0.3s ease"
        }}
      >
        <Navbar user={user} isAdmin={user?.role === "Admin" || !!user?.AdminRoles} toggleSidebar={toggleSidebar} />
        <div className="p-4 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;