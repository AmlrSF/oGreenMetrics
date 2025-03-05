'use client'

import Navbar from "@/components/Commun/navbar/page";
import Sidebar from "@/components/Commun/sidebar/page";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const DashboardLayout = ({ children }) => {

  const [user,setUser] = useState(null);


  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include", 
        });

        const data = await response.json();


        if (data?.user) {
          console.log(data?.user);
          setUser(data?.user)
        } else {
          push("/login");
        }
      } catch (error) {
        console.error("Authorization failed:", error);
        push("/login");
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex flex-col flex-grow">
        <Navbar user={user} />
        <main className="flex-grow ">{children}</main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default DashboardLayout;
