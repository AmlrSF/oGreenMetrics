"use client";

import Navbar from "@/components/Commun/navbar/page";
import Sidebar from "@/components/Commun/sidebar/page";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  let rolesNeedsToBeverified = ["régulier", "entreprise"];
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
  
  if (
    user?.isVerified === false &&
    rolesNeedsToBeverified.includes(user?.role)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full mx-4 p-8 bg-white rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-[#8EBE21]/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-[#8EBE21]" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Verification Required
              </h1>
              <p className="text-gray-600 text-lg">
                Your account needs to be verified before you can access the
                dashboard.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => push("/login")}
              className="px-8 py-3 bg-[#8EBE21] hover:bg-[#7da81d] text-white rounded-xl font-medium shadow-lg shadow-[#8EBE21]/20 transition-all"
            >
              Return to Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} isAdmin={false} />
      <div className="flex flex-col flex-grow">
        <Navbar user={user} />
        <main className="flex-grow ">{children}</main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default DashboardLayout;
