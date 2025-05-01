import {
  IconLayoutDashboard,
  IconUsers,
  IconBuilding,
  IconSettings,
  IconUserCircle,
  IconGauge,
  IconChartBar,
  IconFileText,
  IconTarget,
  IconRuler,
  IconUserCog,
  IconShield,
  IconChevronDown,
  IconChevronRight,
  IconList
} from '@tabler/icons-react';


const menuItems = [
  { icon: IconLayoutDashboard, label: "Dashboard", href: "/Dashboard/Admin" },
  { icon: IconUsers, label: "Users", href: "/Dashboard/Admin/users" },
  { icon: IconBuilding, label: "Companies", href: "/Dashboard/Admin/companies" },
  { icon: IconShield, label: "Role Management", href: "/Dashboard/Admin/Roles-management" },
  { icon: IconUserCog, label: "User Management", href: "/Dashboard/Admin/Users-management" },
  { icon: IconSettings, label: "Settings", href: "/Dashboard/Admin/settings" },
  { icon: IconUserCircle, label: "Profile", href: "/Dashboard/Admin/profile" }
];

const userMenuItems = [
  { icon: IconLayoutDashboard, label: "Dashboard", href: "/Dashboard/User" },
  {
    icon: IconRuler,
    label: "Measures",
    type: "dropdown",
    children: [
      { icon: IconChartBar, label: "Scope 1", href: "/Dashboard/User/scope1" },
      { icon: IconGauge, label: "Scope 2", href: "/Dashboard/User/scope2" },
      { icon: IconChartBar, label: "Scope 3", href: "/Dashboard/User/scope3" }
    ]
  },
  { icon: IconFileText, label: "Reports", href: "/Dashboard/User/reports" },
  { icon: IconTarget, label: "Goals", href: "/Dashboard/User/goals" },
  { icon: IconUserCircle, label: "Profile", href: "/Dashboard/User/profile" },
  { icon: IconSettings, label: "Settings", href: "/Dashboard/User/settings" }
];

const websiteMenuItems = [
  { icon: IconLayoutDashboard, label: "Dashboard", href: "/Dashboard/Regular" },
    { icon: IconList, label: "Sites", href: "/Dashboard/Regular/Sites" },
    { icon: IconChartBar, label: "Emission Calculator", href: "/Dashboard/Regular/calculator" },
    { icon: IconFileText, label: "Emission Reports", href: "/Dashboard/Regular/reports" },
    { icon: IconUserCircle, label: "Profile", href: "/Dashboard/Regular/profile" },
    { icon: IconSettings, label: "Settings", href: "/Dashboard/Regular/settings" }
];

const tabs = {
  transport: {
    id: "transport",
    label: "Transport",
    unit1: "KgCo2",
    unit2: "Km",
    headers: [
      "purpose",
      "distance",
      "poids",
      "mode",
      "createdAt",
      "Actions",
    ],
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
      }
    ],
  },

  dechets: {
    id: "dechets",
    label: "Déchets",
    unit1: "TCo2",
    unit2: "Tonne",
    headers: [
      "name",
      "type",
      "poids",
      "methode",  
      "createdAt",
      "Actions",
    ],
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
    headers: [
      "name",
      "category",
      "cost",
      "lifetime",
      
      "createdAt",
      "Actions",
    ],
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
    headers: [
      "titre",
      "type",
      "sousType",
      "quantite",
      
      "createdAt",
      "Action",
    ],
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
          { value: "Buildings", label: "Buildings" },
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
          Buildings: [
            { value: "NaturalGas", label: "Natural gas heating" },
            { value: "OilHeating", label: "Oil heating" },
            { value: "CommercialOps", label: "Building operations" },
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
    headers: [
      "purpose",
      "distance",
      "mode",
      "type",
      "createdAt",
      "Actions",
    ],
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

export { menuItems, userMenuItems, tabs, websiteMenuItems };
