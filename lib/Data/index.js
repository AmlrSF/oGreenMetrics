import {
  IconLayoutDashboard,
  IconUsers,
  IconBuilding,
   IconUserCircle,
  IconGauge,
  IconChartBar,
  IconFileText,
  IconTarget,
  IconRuler,
  IconUserCog,
  IconUserShield,
  IconList,
} from "@tabler/icons-react";

const menuItems = [
  { icon: IconLayoutDashboard, label: "Dashboard", href: "/Dashboard/Admin" },
  {
    icon: IconUsers,
    service: "userManagement",
    label: "Users",
    href: "/Dashboard/Admin/users",
  },
  {
    icon: IconBuilding,
    service: "companyManagement",
    label: "Companies",
    href: "/Dashboard/Admin/companies",
  },
  {
    icon: IconUserShield,
    service: "roleManagement",
    label: "Role Management",
    href: "/Dashboard/Admin/Roles-management",
  },
  {
    icon: IconUserCog,
    service: "roleManagement",
    label: "User Management",
    href: "/Dashboard/Admin/Users-management",
  }, 
  { icon: IconUserCircle, label: "Profile", href: "/Dashboard/Admin/profile" },
];

const userMenuItems = [
  {
    icon: IconLayoutDashboard,
    label: "Dashboard",
    href: "/Dashboard/User",
  },
  {
    icon: IconRuler,
    label: "Measures",
    type: "dropdown",
    children: [
      {
        icon: IconChartBar,
        label: "Scope 1",
        href: "/Dashboard/User/scope1",
      },
      {
        icon: IconGauge,
        label: "Scope 2",
        href: "/Dashboard/User/scope2",
      },
      {
        icon: IconChartBar,
        label: "Scope 3",
        href: "/Dashboard/User/scope3",
      },
    ],
  },
  {
    icon: IconFileText,
    label: "Reports",
    href: "/Dashboard/User/reports",
  },
  {
    icon: IconTarget,
    label: "Goals",
    href: "/Dashboard/User/goals",
  },
  {
    icon: IconUserCircle,
    label: "Profile",
    href: "/Dashboard/User/profile",
  }, 
];

const websiteMenuItems = [
  { icon: IconLayoutDashboard, label: "Dashboard", href: "/Dashboard/Regular" },
  { icon: IconList, label: "Sites", href: "/Dashboard/Regular/Sites" },
  {
    icon: IconChartBar,
    label: "Emission Calculator",
    href: "/Dashboard/Regular/calculator",
  },
  {
    icon: IconFileText,
    label: "Emission Reports",
    href: "/Dashboard/Regular/reports",
  },
  {
    icon: IconUserCircle,
    label: "Profile",
    href: "/Dashboard/Regular/profile",
  },
  
];

const tabs = {
  transport: {
    id: "transport",
    label: "Transport",
    unit1: "KgCo2",
    unit2: "Km",
    isCollapsing: ["purpose"],
    headers: ["purpose", "distance", "poids", "mode", "createdAt", "Actions"],
    dataHeader: [
      "Nom", // Purpose
      "Distance", // Distance
      "Poids", // Weight
      "Mode", // Mode
      "Créé le", // createdAt
      "Actions", // Actions
    ],
    fields: [
      {
        name: "purpose",
        label: "Nom de transport",
        type: "text",
        placeholder: "Produit 1...",
        required: true,
      },
      {
        name: "distance",
        label: "Distance",
        type: "number",
        placeholder: "Distance en km",
        required: true,
        min: 1,
      },
      {
        name: "poids",
        label: "Poids",
        type: "number",
        placeholder: " Poids",
        required: true,
        min: 1,
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
    ],
  },

  dechets: {
    id: "dechets",
    label: "Déchets",
    unit1: "TCo2",
    unit2: "Tonne",
    isCollapsing: ["name"],
    headers: ["name", "type", "poids", "methode", "createdAt", "Actions"],
    dataHeader: [
      "Nom", // Name
      "Type", // Type
      "Poids", // Weight
      "Méthode", // Method
      "Créé le", // createdAt
      "Actions", // Actions
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
        min: 1,
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
    unit1: "TCo2",
    unit2: "$100k",
    isCollapsing: ["name"],
    headers: ["name", "category", "cost", "lifetime", "createdAt", "Actions"],
    dataHeader: [
      "Nom", // Name
      "Catégorie", // Category
      "Coût", // COST
      "Durée de vie", // Lifetime

      "Créé le", // createdAt
      "Actions", // Actions
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
          { value: "IconBuildings", label: "Bâtiments" },
          { value: "IT Equipment", label: "Équipement informatique" },
        ],
      },
      {
        name: "cost",
        label: "Coût",
        type: "number",
        placeholder: "Coût en €",
        required: true,
        min: 1,
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

  "biens-services": {
    id: "biens-services",
    unit1: "KgCo2",
    unit2: "Kg",
    label: "Biens et services achetés",
    isCollapsing: ["titre"],
    headers: ["titre", "type", "sousType", "quantite", "createdAt", "Action"],
    dataHeader: [
      "Titre", // Title
      "Type", // Type
      "Sous Type", // Sub-type
      "Quantité", // Quantity
      "Créé le", // createdAt
      "Actions", // Actions
    ],

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
          { value: "MineralIndustry", label: "Mineral Industry" },
          { value: "ChemicalIndustry", label: "Chemical Industry" },
          { value: "MetalIndustry", label: "Metal Industry" },
          { value: "IconBuildings", label: "IconBuildings" },
          { value: "Agriculture", label: "Agriculture" },
          { value: "WasteSector", label: "Waste Sector" },
          { value: "EUImporters", label: "EU Importers" },
          { value: "Service", label: "Service" },
        ],
      },
      {
        name: "sousType",
        label: "Sous-type",
        type: "select",
        placeholder: "Choisir un sous-type",
        required: true,
        options: [],
        dynamicOptions: {
          MineralIndustry: [
            { value: "Cement", label: "Cement production" },
            { value: "Lime", label: "Lime production" },
            { value: "Glass", label: "Glass production" },
          ],
          ChemicalIndustry: [
            { value: "Ammonia", label: "Ammonia production" },
            { value: "SodaAsh", label: "Soda Ash production" },
            { value: "Carbide", label: "Carbide production" },
          ],
          MetalIndustry: [
            { value: "IronSteel", label: "Iron and Steel production" },
            { value: "Magnesium", label: "Magnesium production" },
            { value: "Lead", label: "Lead production" },
            { value: "Zinc", label: "Zinc production" },
          ],
          IconBuildings: [
            { value: "NaturalGas", label: "Natural gas heating" },
            { value: "OilHeating", label: "Oil heating" },
            { value: "CommercialOps", label: "IconBuilding operations" },
          ],
          Agriculture: [
            { value: "Rice", label: "Rice cultivation" },
            { value: "Fertilizer", label: "Fertilizer application" },
            { value: "Soil", label: "Soil management" },
          ],
          WasteSector: [
            {
              value: "MunicipalWaste",
              label: "Municipal solid waste treatment",
            },
            { value: "Wastewater", label: "Wastewater treatment" },
            { value: "Composting", label: "Composting" },
            { value: "Incineration", label: "Incineration" },
          ],
          EUImporters: [
            { value: "Cement", label: "Cement" },
            { value: "IronSteel", label: "Iron and Steel" },
            { value: "Aluminum", label: "Aluminum" },
            { value: "Fertilizers", label: "Fertilizers" },
          ],
          Service: [{ value: "Service", label: "Service" }],
        },
      },
      {
        name: "quantite",
        label: "Quantité",
        type: "number",
        placeholder: "Quantité",
        required: true,
        min: 1,
      },
    ],
  },

  businessTravel: {
    id: "businessTravel",
    label: "Business Travel",
    unit1: "KgCo2",
    unit2: "Km",
    isCollapsing: ["purpose"],
    headers: ["purpose", "distance", "mode", "type", "createdAt", "Actions"],
    dataHeader: [
      "Name", // Purpose
      "Distance", // Distance
      "Mode", // Mode
      "Type", // Type
      "Créé le", // createdAt
      "Actions", // Actions
    ],
    fields: [
      {
        name: "purpose",
        label: "Purpose of Travel",
        type: "text",
        placeholder: "Purpose (e.g., Meeting, Conference)",
        required: true,
      },
      {
        name: "distance",
        label: "Distance",
        type: "number",
        placeholder: "Distance en km",
        required: true,
        min: 1,
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
          Rail: [{ value: "Train", label: "Train" }],
          Sea: [],
          Air: [
            { value: "Short-haul", label: "Air Short-haul flights" },
            { value: "Long-haul", label: "Air Long-haul flightss" },
          ],
          Land: [{ value: "Car", label: "Car Travel" }],
        },
      },
    ],
  },

  employesTransport: {
    id: "employesTransport",
    label: "Transport des Employés",
    unit1: "KgCo2",
    unit2: "Km",
    isCollapsing: ["nomBus", "depart", "destination", "matricule"],
    headers: [
      "nomBus",
      "matricule",
      "depart",
      "destination",
      "nombreEmployes",
      "distance",
      "mode",

      "createdAt",
      "Actions",
    ],
    dataHeader: [
      "Bus", // Bus
      "Matricule", // Matricule
      "Départ", // Depart
      "Destination", // Destination
      "Nombre d'employés", // Number of employees
      "Distance", // Distance
      "Mode", // Mode

      "Créé le", // createdAt
      "Actions", // Actions
    ],
    fields: [
      {
        name: "nomBus",
        label: "Nom du Bus",
        type: "text",
        placeholder: "Nom du bus",
        required: true,
      },
      {
        name: "matricule",
        label: "Matricule du Bus",
        type: "text",
        placeholder: "Matricule",
        required: true,
      },
      {
        name: "depart",
        label: "Point de départ",
        type: "text",
        placeholder: "Ex: Mahdia",
        required: true,
      },
      {
        name: "destination",
        label: "Destination",
        type: "text",
        placeholder: "Ex: Monastir",
        required: true,
      },
      {
        name: "nombreEmployes",
        label: "Nombre d'employés",
        type: "number",
        placeholder: "Nombre d'employés",
        required: true,
        min: 1,
      },
      {
        name: "distance",
        label: "Distance",
        type: "number",
        placeholder: "Distance en km",
        required: true,
        min: 1,
      },
      {
        name: "mode",
        label: "Mode de Transport",
        type: "select",
        placeholder: "Sélectionnez un mode",
        required: true,
        options: [
          { value: "Bus", label: "Bus" },
          { value: "Train", label: "Train" },
        ],
      },
    ],
  },
};

let roleTypes = {
  entreprise: "bg-purple-lt text-purple",
  régulier: "bg-cyan-lt text-cyan",
  Admin: "bg-red-lt text-red",
};

function getCountryCode(countryName) {
  switch (countryName) {
    case "Sweden":
      return "se";
    case "Lithuania":
      return "lt";
    case "France":
      return "fr";
    case "Austria":
      return "at";
    case "Latvia":
      return "lv";
    case "Finland":
      return "fi";
    case "Slovakia":
      return "sk";
    case "Denmark":
      return "dk";
    case "Belgium":
      return "be";
    case "Croatia":
      return "hr";
    case "Luxembourg":
      return "lu";
    case "Slovenia":
      return "si";
    case "Italy":
      return "it";
    case "Hungary":
      return "hu";
    case "Spain":
      return "es";
    case "United Kingdom":
      return "gb";
    case "Romania":
      return "ro";
    case "Portugal":
      return "pt";
    case "Ireland":
      return "ie";
    case "Germany":
      return "de";
    case "Bulgaria":
      return "bg";
    case "Netherlands":
      return "nl";
    case "Czechia":
      return "cz";
    case "Greece":
      return "gr";
    case "Malta":
      return "mt";
    case "Cyprus":
      return "cy";
    case "Poland":
      return "pl";
    case "Estonia":
      return "ee";
    default:
      return ""; // or return null / throw new Error("Unknown country")
  }
}

const industryBadgeColors = {
  "Cement production": "bg-blue-lt text-blue",
  "Lime production": "bg-cyan-lt text-cyan",
  "Glass Production": "bg-azure-lt text-azure",

  "Ammonia Production": "bg-green-lt text-green",
  "Soda Ash Production": "bg-lime-lt text-lime",
  "Carbide Production": "bg-teal-lt text-teal",

  "Iron and Steel Production": "bg-indigo-lt text-indigo",
  "Magnesium production": "bg-purple-lt text-purple",
  "Lead Production": "bg-pink-lt text-pink",
  "Zinc Production": "bg-red-lt text-red",

  "Natural gas heating": "bg-orange-lt text-orange",
  "Oil heating": "bg-yellow-lt text-yellow",
  "Commercial buildings operations": "bg-gray-lt text-gray",

  "Rice cultivation": "bg-green-lt text-green",
  "Fertilizer application": "bg-lime-lt text-lime",
  "Agricultural soil management": "bg-teal-lt text-teal",

  "Municipal solid waste treatment": "bg-red-lt text-red",
  "Wastewater treatment": "bg-blue-lt text-blue",
  Composting: "bg-azure-lt text-azure",
  Incineration: "bg-orange-lt text-orange",

  Cement: "bg-blue-lt text-blue",
  "Iron and steel": "bg-indigo-lt text-indigo",
  Aluminum: "bg-purple-lt text-purple",
  Fertilizers: "bg-green-lt text-green",

  Default: "bg-secondary-lt text-secondary",
};


export {
  menuItems,
  userMenuItems,
  tabs,
  getCountryCode,
  roleTypes,
  websiteMenuItems,
  industryBadgeColors,
};
