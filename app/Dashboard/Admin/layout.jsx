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
  const { push } = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();
        if (data?.user) {
          setUser(data?.user);

          if (data?.user?.role == "Admin") {
            push("/Dashboard/Admin");
          }

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
    

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} isAdmin={true} />
      <div className="flex flex-col flex-grow">
        <Navbar user={user} />
        <main className="flex-grow">{children}</main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default DashboardLayout;
