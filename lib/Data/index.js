import {
  LayoutDashboard,
  Users2,
  Building,
  Settings,
  UserCircle,
  RollerCoaster,
  GanttChartSquare, 
  Gauge,
  BarChart3,
  FileText,
  Target,
  Ruler
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/Dashboard/Admin" },
  { icon: Users2, label: "Users", href: "/Dashboard/Admin/users" },
  { icon: Building, label: "Companies", href: "/Dashboard/Admin/companies" },
  { icon: RollerCoaster, label: "Roles", href: "/Dashboard/Admin/Roles"},
  { icon: Settings, label: "Settings", href: "/Dashboard/Admin/settings" },
  { icon: UserCircle, label: "Profile", href: "/Dashboard/Admin/Profile" },
];

const userMenuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/Dashboard/User"
  },
  {
    icon: Ruler,
    label: "Measures",
    type: "dropdown",
    children: [
      {
        icon: GanttChartSquare,
        label: "Scope 1",
        href: "/Dashboard/User/scope1"
      },
      {
        icon: Gauge,
        label: "Scope 2",
        href: "/Dashboard/User/scope2"
      },
      {
        icon: BarChart3,
        label: "Scope 3",
        href: "/Dashboard/User/scope3"
      }
    ]
  },
  {
    icon: FileText,
    label: "Reports",
    href: "/Dashboard/User/reports"
  },
  {
    icon: Target,
    label: "Goals",
    href: "/Dashboard/User/goals"
  },
  {
    icon: UserCircle,
    label: "Profile",
    href: "/Dashboard/User/profile"
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/Dashboard/User/settings"
  }
];
export { menuItems, userMenuItems };