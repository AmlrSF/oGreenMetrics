"use client";

import Navbar from "@/components/Commun/navbar/page";
import Sidebar from "@/components/Commun/sidebar/page";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Commun/Loader/page";
import VerificationRequired from "@/components/VerificationRequired";

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  let rolesNeedsToBeverified = ["régulier", "entreprise"];
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();

  const naviagteToLoginPage  = ()=>{
    push('/login')
  }

  useEffect(() => {
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
  }, []);

  if (isLoading) {
    return <Loader />;
  } 
    

  if (
    user?.isVerified === false &&
    rolesNeedsToBeverified.includes(user?.role)
  ) {
    return <VerificationRequired naviagteToLoginPage={naviagteToLoginPage}/>
  }

  return (
    <div className="d-flex" style={{ background: "#f9fafb" }}>
      <Sidebar user={user} isAdmin={false} />
      <div className="d-flex flex-column flex-grow">
        <Navbar user={user} />
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
