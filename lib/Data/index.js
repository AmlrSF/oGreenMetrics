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
  Ruler,
  UserRoundCog,
  ShieldUser,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/Dashboard/Admin" },
  {
    icon: Users2,
    service: "userManagement",
    label: "Users",
    href: "/Dashboard/Admin/users",
  },
  {
    icon: Building,
    service: "companyManagement",
    label: "Companies",
    href: "/Dashboard/Admin/companies",
  },
  {
    icon: ShieldUser,
    service: "roleManagement",
    label: "Role Management",
    href: "/Dashboard/Admin/Roles-management",
  },
  {
    icon: UserRoundCog,
    service: "roleManagement",
    label: "User Management",
    href: "/Dashboard/Admin/Users-management",
  },
  { icon: Settings, label: "Settings", href: "/Dashboard/Admin/settings" },
  { icon: UserCircle, label: "Profile", href: "/Dashboard/Admin/profile" },
];

const userMenuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/Dashboard/User",
  },
  {
    icon: Ruler,
    label: "Measures",
    type: "dropdown",
    children: [
      {
        icon: GanttChartSquare,
        label: "Scope 1",
        href: "/Dashboard/User/scope1",
      },
      {
        icon: Gauge,
        label: "Scope 2",
        href: "/Dashboard/User/scope2",
      },
      {
        icon: BarChart3,
        label: "Scope 3",
        href: "/Dashboard/User/scope3",
      },
    ],
  },
  {
    icon: FileText,
    label: "Reports",
    href: "/Dashboard/User/reports",
  },
  {
    icon: Target,
    label: "Goals",
    href: "/Dashboard/User/goals",
  },
  {
    icon: UserCircle,
    label: "Profile",
    href: "/Dashboard/User/profile",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/Dashboard/User/settings",
  },
];

const tabs = {
  transport: {
    id: "transport",
    label: "Transport",
    headers: [
      "Purpose",
      "Distance",
      "Poids",
      "Mode",
      "Type",
      "Emissions",
      "CreatedAt",
      "Actions",
    ],
    fields: [
      {
        name: "purpose",
        label: "Purpose of Transport",
        type: "text",
        placeholder: "Purpose (e.g., Business, Leisure)",
        required: true,
      },
      {
        name: "distance",
        label: "Distance",
        type: "number",
        placeholder: "Distance en km",
        required: true,
        min: 0,
      },
      {
        name: "poids",
        label: "Nombre de personnes",
        type: "number",
        placeholder: "Nombre de personnes",
        required: true,
        min: 0,
      },
      {
        name: "mode",
        label: "Mode de Transport",
        type: "select",
        placeholder: "Sélectionnez un mode",
        required: true,
        options: [
          { value: "Rail", label: "Rail" },
          { value: "Sea", label: "Mer" },
          { value: "Air", label: "Air" },
          { value: "Land", label: "Terrestre" },
        ],
      },
      {
        name: "type",
        label: "Type de Transport",
        type: "select",
        placeholder: "Sélectionnez un type",
        required: true,
        options: [],
        dynamicOptions: {
          Rail: [
            { value: "Train", label: "Train" },
            { value: "Tram", label: "Tram" },
            { value: "Metro", label: "Métro" },
          ],
          Sea: [
            { value: "Boat", label: "Bateau" },
            { value: "Ferry", label: "Ferry" },
            { value: "Submarine", label: "Sous-marin" },
          ],
          Air: [
            { value: "Airplane", label: "Avion" },
            { value: "Helicopter", label: "Hélicoptère" },
            { value: "Airship", label: "Dirigeable" },
          ],
          Land: [
            { value: "Car", label: "Voiture" },
            { value: "Bus", label: "Bus" },
            { value: "Truck", label: "Camion" },
            { value: "Bike", label: "Vélo" },
            { value: "Scooter", label: "Scooter" },
          ],
        },
      },
    ],
  },

  dechets: {
    id: "dechets",
    label: "Déchets",
    headers: [
      "Name",
      "Type",
      "Poids",
      "Methode",
      "Emissions",
      "CreatedAt",
      "Actions",
    ],
    fields: [
      {
        name: "name",
        label: "Nom",
        type: "text",
        placeholder: "Nom du déchet",
        required: true,
      },
      {
        name: "type",
        label: "Type",
        type: "select",
        placeholder: "Choisir un type de déchet",
        required: true,
        options: [
          { value: "Papier", label: "Papier" },
          { value: "Plastique", label: "Plastique" },
          { value: "Organique", label: "Organique" },
          { value: "Métal", label: "Métal" },
          { value: "Verre", label: "Verre" },
          { value: "Électronique", label: "Électronique" },
        ],
      },
      {
        name: "poids",
        label: "Poids (tonnes)",
        type: "number",
        placeholder: "Poids en tonnes",
        required: true,
        min: 0,
      },
      {
        name: "methode",
        label: "Méthode",
        type: "select",
        placeholder: "Choisir une méthode",
        required: true,
        options: [
          { value: "Recycling", label: "Recyclage" },
          { value: "Landfill", label: "Enfouissement" },
        ],
      },
    ],
  },

  equipement: {
    id: "equipement",
    label: "Biens d'équipement",
    headers: [
      "Name",
      "Category",
      "COST",
      "Lifetime",
      "Emissions",
      "CreatedAt",
      "Actions",
    ],
    fields: [
      {
        name: "name",
        label: "Nom",
        type: "text",
        placeholder: "Nom de l'équipement",
        required: true,
      },
      {
        name: "category",
        label: "Catégorie",
        type: "select",
        placeholder: "Choisir une catégorie",
        required: true,
        options: [
          {
            value: "Manufacturing Equipment",
            label: "Équipement de fabrication",
          },
          { value: "Vehicles", label: "Véhicules" },
          { value: "Buildings", label: "Bâtiments" },
          { value: "IT Equipment", label: "Équipement informatique" },
        ],
      },
      {
        name: "cost",
        label: "Coût",
        type: "number",
        placeholder: "Coût en €",
        required: true,
        min: 0,
      },
      {
        name: "lifetime",
        label: "Durée de vie",
        type: "number",
        placeholder: "Durée de vie en années",
        required: true,
        min: 1,
      },
    ],
  },
  
  voyage: {
    id: "voyage",
    label: "Voyage d'affaires",
    headers: ["Type", "Distance", "Description", "Action"],
    fields: [
      {
        name: "type",
        label: "Type",
        type: "select",
        placeholder: "Choisir un type de voyage",
        required: true,
        options: [
          { value: "Avion", label: "Avion" },
          { value: "Train", label: "Train" },
          { value: "Voiture", label: "Voiture" },
          { value: "Bus", label: "Bus" },
        ],
      },
      {
        name: "distance",
        label: "Distance",
        type: "number",
        placeholder: "Distance en km",
        required: true,
        min: 0,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Description",
        rows: 3,
      },
    ],
  },
  "biens-services": {
    id: "biens-services",
    label: "Biens et services achetés",
    headers: ["Titre", "Type", "Quantité", "Description", "Action"],
    fields: [
      {
        name: "titre",
        label: "Titre",
        type: "text",
        placeholder: "Titre",
        required: true,
      },
      {
        name: "type",
        label: "Type",
        type: "select",
        placeholder: "Choisir un type",
        required: true,
        options: [
          { value: "Matériel", label: "Matériel" },
          { value: "Service", label: "Service" },
          { value: "Logiciel", label: "Logiciel" },
        ],
      },
      {
        name: "quantite",
        label: "Quantité",
        type: "number",
        placeholder: "Quantité",
        required: true,
        min: 0,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Description",
        rows: 3,
      },
    ],
  },

  "deplacement-employes": {
    id: "deplacement-employes",
    label: "Déplacements des employés",
    headers: ["Distance", "Nb d'employés", "Nb de voyages par jour", "Action"],
    fields: [
      {
        name: "distance",
        label: "Distance",
        type: "number",
        placeholder: "Distance en km",
        required: true,
        min: 0,
      },
      {
        name: "nbEmployes",
        label: "Nombre d'employés",
        type: "number",
        placeholder: "Nombre d'employés",
        required: true,
        min: 1,
      },
      {
        name: "nbVoyages",
        label: "Nombre de voyages par jour",
        type: "number",
        placeholder: "Nombre de voyages par jour",
        required: true,
        min: 0,
      },
    ],
  },
};

export { menuItems, userMenuItems, tabs };
