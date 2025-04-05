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
  let rolesNeedsToBeverified = ["régulier", "entreprise"];
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();

  const naviagteToLoginPage = () => {
    push("/login");
  };

  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    setIsCollapsed(savedSidebarState ? JSON.parse(savedSidebarState) : false);

    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();

        if (data?.user && rolesNeedsToBeverified.includes(data.user.role)) {
          setUser(data.user);
          setIsLoading(false);
        } else {
          console.log("Invalid role or no user, redirecting to login");
          push("/login");
        }
      } catch (error) {
        console.error("Authorization failed:", error);
        push("/login");
      }
    };

    checkAuth();

    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      setIsCollapsed(savedState ? JSON.parse(savedState) : false);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (
    user?.isVerified === false &&
    rolesNeedsToBeverified.includes(user?.role)
  ) {
    return <VerificationRequired naviagteToLoginPage={naviagteToLoginPage} />;
  }

  return (
    <div className="min-vh-100 d-flex">
      <div 
        className="position-fixed h-100"
        style={{ 
          width: isCollapsed ? "5rem" : "16rem",
          transition: "width 0.3s ease",
          zIndex: 1030
        }}
      >
        <Sidebar user={user} isAdmin={false} />
      </div>
      
      <div 
        className="flex-grow-1"
        style={{ 
          marginLeft: isCollapsed ? "5rem" : "16rem",
          transition: "margin-left 0.3s ease",
          background: "#f9fafb",
          minHeight: "100vh",
          width: "100%"
        }}
      >
        <Navbar user={user} />
        <main className="p-3">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;