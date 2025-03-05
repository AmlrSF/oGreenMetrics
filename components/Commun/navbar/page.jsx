import React from "react";
import { Bell } from "lucide-react";
import { getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";

const Navbar = ({ user }) => {
  //console.log(user);
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/Admin/profile"); 
  };
  
  return (
    <div className="flex h-16 bg-white shadow-sm">
      <div className="flex flex-grow items-center justify-end px-6">
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div onClick={handleNavigation} className="flex items-center cursor-pointer gap-3 rounded-full border p-1">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
              {user?.photo_de_profil ? (
                <img
                  src={user?.photo_de_profil}
                  alt={`${user?.prenom} ${user?.nom}`}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                getInitials(user?.prenom, user?.nom)
              )}
            </div>
            <span className="hidden sm:bmock text-sm font-medium text-gray-700">
              {user?.prenom} {user?.nom}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
