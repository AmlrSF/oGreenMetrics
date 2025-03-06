"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { LogOut, Menu, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { menuItems, userMenuItems } from "@/lib/Data/";
import toast from "react-hot-toast";

const Sidebar = ({ user, isAdmin }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      setItems(menuItems);
    } else {
      setItems(userMenuItems);
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:4000/users/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      console.log(data);

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
      className={`flex flex-col  bg-white shadow-sm transition-all 
        duration-300 ease-in-out ${isCollapsed ? `w-20` : `w-64`}`}
    >
      <div
        className="flex h-16 items-center 
      justify-between  px-4"
      >
        {!isCollapsed && (
          <Image
            src="/logo.png"
            width={150}
            height={150}
            alt="logo"
            style={{ width: "auto", height: "auto" }}
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`rounded-lg p-1.5 hover:bg-gray-100 ${
            isCollapsed ? `mx-auto` : ``
          }`}
        >
          {isCollapsed ? (
            <Menu size={24} className="text-gray-600" />
          ) : (
            <ChevronLeft size={24} className="text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex flex-col flex-grow space-y-1 p-3">
        {items?.map((item, index) => (
          <Link key={index} href={item.href} passHref>
            <div
              className={`flex items-center cursor-pointer
          rounded-lg px-3 py-2.5 text-gray-700 
          hover:bg-[#8EBE21] hover:text-white
          transition-all group ${isCollapsed ? `justify-center` : `gap-3`}`}
            >
              <item.icon size={22} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {isCollapsed && (
                <div
                  className="absolute left-20 hidden rounded-md
            bg-gray-900 px-2 py-1 text-sm text-white group-hover:block"
                >
                  {item.label}
                </div>
              )}
            </div>
          </Link>
        ))}

        <button
          onClick={logout}
          className={`mt-auto flex items-center rounded-lg px-3 py-2.5 text-red-500 hover:bg-red-50 transition-all group ${
            isCollapsed ? `justify-center` : `gap-3`
          }`}
        >
          <LogOut size={22} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
          {isCollapsed && (
            <div className="absolute left-20 hidden rounded-md bg-gray-900 px-2 py-1 text-sm text-white group-hover:block">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
