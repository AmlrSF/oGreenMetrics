"use client";

import Navbar from "@/components/Commun/navbar/page";
import Sidebar from "@/components/Commun/sidebar/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
            className="w-20 h-20"
          >
            <Loader2 className="w-20 h-20 text-[#8EBE21]" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.3, 0.6, 0.3],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-0 bg-[#8EBE21] rounded-full blur-xl opacity-20"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-800">
            Loading your dashboard
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we verify your access
          </p>
        </motion.div>
      </div>
    );
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
