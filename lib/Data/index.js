
import {
  LayoutDashboard as Dashboard,
  Users2 as Users,
  Building,
  Settings,
  UserCircle,
  RollerCoaster
} from "lucide-react";


export const  menuItems = [
  { icon: Dashboard, label: "Dashboard", href: "/Dashboard/Admin" },
  { icon: Users, label: "Users", href: "/Dashboard/Admin/users" },
  { icon: Building, label: "Companies", href: "/Dashboard/Admin/companies" },
  { icon: RollerCoaster, label: "Roles", href:  "/Dashboard/Admin/roles"},
  { icon: Settings, label: "Settings", href: "/Dashboard/Admin/settings" },
  { icon: UserCircle, label: "Profile", href: "/Dashboard/Admin/profile" },
];