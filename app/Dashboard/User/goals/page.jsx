"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  IconCheck,
  IconPlus,
  IconPencil,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconBuildingFactory,
  IconBolt,
  IconTruck,
  IconWorld,
  IconTarget,
  IconInfoCircle,
  IconEdit,
} from "@tabler/icons-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GoalsPage = () => {
  const [company, setCompany] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEmissions, setCurrentEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0,
  });
  const [initialEmissions, setInitialEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0,
  });
  const [goalsList, setGoalsList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: "Objectif de Réduction Carbone",
    year: new Date().getFullYear(),
    scope1Goal: 0,
    scope2Goal: 0,
    scope3Goal: 0,
    description: "",
  });
  const [selectedScopes, setSelectedScopes] = useState({
    scope1: false,
    scope2: false,
    scope3: false,
  });
  const [validationErrors, setValidationErrors] = useState({
    scope1Goal: "",
    scope2Goal: "",
    scope3Goal: "",
    general: "",
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const sumEmissions = (arr) => {
    if (!arr || !Array.isArray(arr)) return 0;
    return arr.reduce((sum, item) => sum + parseFloat(item.emissions || 0), 0);
  };

  const handleGoalChange = (field, value) => {
    let newValue = value;
    if (field === "year") {
      newValue = parseInt(value) || new Date().getFullYear();
    } else if (["scope1Goal", "scope2Goal", "scope3Goal"].includes(field)) {
      newValue = parseFloat(value) || 0;

      const scopeNumber = field.replace("scope", "").replace("Goal", "");
      const currentValue = currentEmissions[`scope${scopeNumber}`];

      if (newValue > 0 && newValue >= currentValue) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: `L'objectif doit être inférieur aux émissions actuelles (${currentValue} tCO₂e)`,
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    }

    setNewGoal((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const toggleScope = (scopeNumber) => {
    const scopeKey = `scope${scopeNumber}`;

    setSelectedScopes((prev) => {
      const newState = { ...prev, [scopeKey]: !prev[scopeKey] };

      if (!newState[scopeKey]) {
        setNewGoal((prevGoal) => ({
          ...prevGoal,
          [`${scopeKey}Goal`]: 0,
        }));

        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [`${scopeKey}Goal`]: "",
        }));
      }

      return newState;
    });
  };

  const fetchAndCalculateEmissions = async (companyId) => {
    try {
      const reportRes = await fetch(`http://localhost:4000/report/full/${companyId}`, {
        credentials: "include",
      });
      const reportJson = await reportRes.json();
      const reportData = reportJson.data;

      const scope1Fuel = reportData.scope1Data?.fuelCombution?.[0]?.totalEmissions || 0;
      const scope1Production = reportData.scope1Data?.production?.[0]?.totalEmissions || 0;
      const scope1 = parseFloat(scope1Fuel) + parseFloat(scope1Production);

      const scope2Heating = reportData.scope2Data?.heating?.totalEmissions || 0;
      const scope2Cooling = reportData.scope2Data?.cooling?.totalEmissions || 0;
      const scope2Energy = reportData.scope2Data?.energyConsumption?.emissions || 0;
      const scope2 =
        parseFloat(scope2Heating) + parseFloat(scope2Cooling) + parseFloat(scope2Energy);

      const scope3 =
        sumEmissions(reportData.scope3Data?.transport) +
        sumEmissions(reportData.scope3Data?.dechet) +
        sumEmissions(reportData.scope3Data?.capitalGood) +
        sumEmissions(reportData.scope3Data?.businessTravel);

      const total = scope1 + scope2 + scope3;

      // Placeholder for initial emissions (e.g., 20% higher than current)
      // Replace with actual historical data from your backend
      const initialScope1 = scope1 * 1.2;
      const initialScope2 = scope2 * 1.2;
      const initialScope3 = scope3 * 1.2;
      const initialTotal = initialScope1 + initialScope2 + initialScope3;

      return {
        current: {
          scope1: parseFloat(scope1.toFixed(2)),
          scope2: parseFloat(scope2.toFixed(2)),
          scope3: parseFloat(scope3.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
        },
        initial: {
          scope1: parseFloat(initialScope1.toFixed(2)),
          scope2: parseFloat(initialScope2.toFixed(2)),
          scope3: parseFloat(initialScope3.toFixed(2)),
          total: parseFloat(initialTotal.toFixed(2)),
        },
      };
    } catch (error) {
      console.error("Error calculating emissions:", error);
      toast.error("Échec du calcul des émissions actuelles");
      return {
        current: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
        initial: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
      };
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const res = await fetch(`http://localhost:4000/notifications/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      } else {
        toast.error(data.message || "Échec de la récupération des notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Échec de la récupération des notifications");
    }
  };

  const validateGoals = () => {
    const errors = {
      scope1Goal: "",
      scope2Goal: "",
      scope3Goal: "",
      general: "",
    };

    if (newGoal.name.trim() === "") {
      errors.general = "Le nom de l'objectif est requis";
      setValidationErrors(errors);
      return { valid: false, messages: [errors.general] };
    }

    const hasSelectedScope = selectedScopes.scope1 || selectedScopes.scope2 || selectedScopes.scope3;
    if (!hasSelectedScope) {
      errors.general = "Veuillez sélectionner au moins un scope";
      setValidationErrors(errors);
      return { valid: false, messages: [errors.general] };
    }

    let hasValidGoal = false;

    if (selectedScopes.scope1) {
      if (newGoal.scope1Goal <= 0) {
        errors.scope1Goal = "Veuillez entrer une valeur d'objectif supérieure à 0";
      } else if (newGoal.scope1Goal >= currentEmissions.scope1) {
        errors.scope1Goal = `L'objectif doit être inférieur aux émissions actuelles (${currentEmissions.scope1} tCO₂e)`;
      } else {
        hasValidGoal = true;
      }
    }

    if (selectedScopes.scope2) {
      if (newGoal.scope2Goal <= 0) {
        errors.scope2Goal = "Veuillez entrer une valeur d'objectif supérieure à 0";
      } else if (newGoal.scope2Goal >= currentEmissions.scope2) {
        errors.scope2Goal = `L'objectif doit être inférieur aux émissions actuelles (${currentEmissions.scope2} tCO₂e)`;
      } else {
        hasValidGoal = true;
      }
    }

    if (selectedScopes.scope3) {
      if (newGoal.scope3Goal <= 0) {
        errors.scope3Goal = "Veuillez entrer une valeur d'objectif supérieure à 0";
      } else if (newGoal.scope3Goal >= currentEmissions.scope3) {
        errors.scope3Goal = `L'objectif doit être inférieur aux émissions actuelles (${currentEmissions.scope3} tCO₂e)`;
      } else {
        hasValidGoal = true;
      }
    }

    if (!hasValidGoal) {
      if (!errors.general) {
        errors.general = "Au moins un scope sélectionné doit avoir un objectif valide";
      }
      setValidationErrors(errors);
      return {
        valid: false,
        messages: [
          errors.general,
          errors.scope1Goal,
          errors.scope2Goal,
          errors.scope3Goal,
        ].filter(Boolean),
      };
    }

    setValidationErrors(errors);
    return { valid: true, messages: [] };
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();

    if (!company?._id) {
      toast.error("Entreprise non trouvée");
      return;
    }

    const { valid, messages } = validateGoals();
    if (!valid) {
      messages.forEach((msg) => toast.error(msg));
      return;
    }

    try {
      const payload = {
        ...newGoal,
        company_id: company._id,
        scope1Goal: selectedScopes.scope1 ? newGoal.scope1Goal : 0,
        scope2Goal: selectedScopes.scope2 ? newGoal.scope2Goal : 0,
        scope3Goal: selectedScopes.scope3 ? newGoal.scope3Goal : 0,
        initialScope1: initialEmissions.scope1,
        initialScope2: initialEmissions.scope2,
        initialScope3: initialEmissions.scope3,
      };

      payload.totalGoal =
        (selectedScopes.scope1 ? parseFloat(newGoal.scope1Goal) : 0) +
        (selectedScopes.scope2 ? parseFloat(newGoal.scope2Goal) : 0) +
        (selectedScopes.scope3 ? parseFloat(newGoal.scope3Goal) : 0);

      const res = await fetch("http://localhost:4000/goals/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setNewGoal({
        name: "Objectif de Réduction Carbone",
        year: new Date().getFullYear(),
        scope1Goal: 0,
        scope2Goal: 0,
        scope3Goal: 0,
        description: "",
      });

      setSelectedScopes({
        scope1: false,
        scope2: false,
        scope3: false,
      });
      setShowAddModal(false);
      fetchGoals(company._id);
      if (user?._id) fetchNotifications(user._id);
    } catch (err) {
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();

    if (!editingGoal?._id) {
      toast.error("Aucun objectif sélectionné pour la mise à jour");
      return;
    }

    let hasError = false;
    let errorMessages = [];

    if (editingGoal.scope1Goal > 0 && editingGoal.scope1Goal >= currentEmissions.scope1) {
      errorMessages.push(
        `L'objectif Scope 1 doit être inférieur aux émissions actuelles (${currentEmissions.scope1} tCO₂e)`
      );
      hasError = true;
    }

    if (editingGoal.scope2Goal > 0 && editingGoal.scope2Goal >= currentEmissions.scope2) {
      errorMessages.push(
        `L'objectif Scope 2 doit être inférieur aux émissions actuelles (${currentEmissions.scope2} tCO₂e)`
      );
      hasError = true;
    }

    if (editingGoal.scope3Goal > 0 && editingGoal.scope3Goal >= currentEmissions.scope3) {
      errorMessages.push(
        `L'objectif Scope 3 doit être inférieur aux émissions actuelles (${currentEmissions.scope3} tCO₂e)`
      );
      hasError = true;
    }

    if (editingGoal.scope1Goal <= 0 && editingGoal.scope2Goal <= 0 && editingGoal.scope3Goal <= 0) {
      errorMessages.push("Au moins un scope doit avoir une valeur d'objectif supérieure à 0");
      hasError = true;
    }

    if (hasError) {
      errorMessages.forEach((msg) => toast.error(msg));
      return;
    }

    try {
      const updatedGoal = {
        ...editingGoal,
        totalGoal:
          parseFloat(editingGoal.scope1Goal || 0) +
          parseFloat(editingGoal.scope2Goal || 0) +
          parseFloat(editingGoal.scope3Goal || 0),
        initialScope1: initialEmissions.scope1,
        initialScope2: initialEmissions.scope2,
        initialScope3: initialEmissions.scope3,
      };

      const res = await fetch(`http://localhost:4000/goals/${editingGoal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedGoal),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating goal");

      setShowEditModal(false);
      fetchGoals(company._id);
      if (user?._id) fetchNotifications(user._id);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet objectif?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/goals/${goalId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      fetchGoals(company._id);
      if (user?._id) fetchNotifications(user._id);
    } catch (err) {
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const checkAchievedGoals = async (companyId, emissions, userId) => {
    try {
      const res = await fetch(`http://localhost:4000/goals/check-attainment/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentEmissions: emissions.current, userId }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to check goal attainment");
      }
      fetchGoals(companyId);
      if (userId) fetchNotifications(userId);
    } catch (error) {
      console.error("Error checking goal attainment:", error);
      toast.error("Échec de la vérification des objectifs atteints");
    }
  };

  const fetchGoals = async (companyId) => {
    try {
      const res = await fetch(`http://localhost:4000/goals/all/${companyId}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const updatedGoals = data.data.map((goal) => {
          const isScope1Achieved = goal.scope1Goal === 0 || currentEmissions.scope1 <= goal.scope1Goal;
          const isScope2Achieved = goal.scope2Goal === 0 || currentEmissions.scope2 <= goal.scope2Goal;
          const isScope3Achieved = goal.scope3Goal === 0 || currentEmissions.scope3 <= goal.scope3Goal;

          let status = "pending";
          if (isScope1Achieved && isScope2Achieved && isScope3Achieved) {
            status = "achieved";
          } else {
            const totalScopes = [
              goal.scope1Goal > 0 ? 1 : 0,
              goal.scope2Goal > 0 ? 1 : 0,
              goal.scope3Goal > 0 ? 1 : 0,
            ].reduce((a, b) => a + b, 0);

            const scope1Progress =
              goal.scope1Goal > 0
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      ((currentEmissions.scope1 - goal.scope1Goal) /
                        (goal.initialScope1 || initialEmissions.scope1)) *
                        100
                    )
                  )
                : 0;
            const scope2Progress =
              goal.scope2Goal > 0
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      ((currentEmissions.scope2 - goal.scope2Goal) /
                        (goal.initialScope2 || initialEmissions.scope2)) *
                        100
                    )
                  )
                : 0;
            const scope3Progress =
              goal.scope3Goal > 0
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      ((currentEmissions.scope3 - goal.scope3Goal) /
                        (goal.initialScope3 || initialEmissions.scope3)) *
                        100
                    )
                  )
                : 0;

            const totalProgress =
              totalScopes > 0 ? (scope1Progress + scope2Progress + scope3Progress) / totalScopes : 0;

            status = totalProgress > 50 ? "in-progress" : "pending";
          }

          return {
            ...goal,
            status,
          };
        });

        setGoalsList(updatedGoals);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Échec de la récupération des objectifs");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const authRes = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const authData = await authRes.json();
        const userId = authData?.user?._id;
        if (!userId) throw new Error("Non autorisé");

        setUser(authData.user);

        const compRes = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userId}`,
          { credentials: "include" }
        );
        const compData = await compRes.json();
        setCompany(compData.data);

        const emissions = await fetchAndCalculateEmissions(compData.data._id);
        setCurrentEmissions(emissions.current);
        setInitialEmissions(emissions.initial);

        await fetchGoals(compData.data._id);
        await fetchNotifications(userId);

        await checkAchievedGoals(compData.data._id, emissions, userId);
      } catch (err) {
        console.error(err);
        toast.error("Échec de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      if (company?._id && user?._id) {
        fetchAndCalculateEmissions(company._id)
          .then((emissions) => {
            setCurrentEmissions(emissions.current);
            setInitialEmissions(emissions.initial);
            fetchGoals(company._id);
            checkAchievedGoals(company._id, emissions, user._id);
          })
          .catch((error) => console.error("Error in periodic check:", error));
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [company]);

  const getScopeColor = (scope) => {
    switch (scope) {
      case 1:
        return "bg-red";
      case 2:
        return "bg-blue";
      case 3:
        return "bg-green";
      default:
        return "bg-azure";
    }
  };

  const getGoalStatus = (goal) => {
    const isScope1Achieved = goal.scope1Goal === 0 || currentEmissions.scope1 <= goal.scope1Goal;
    const isScope2Achieved = goal.scope2Goal === 0 || currentEmissions.scope2 <= goal.scope2Goal;
    const isScope3Achieved = goal.scope3Goal === 0 || currentEmissions.scope3 <= goal.scope3Goal;

    if (isScope1Achieved && isScope2Achieved && isScope3Achieved) {
      return { status: "achieved", badgeClass: "bg-success" };
    } else {
      let activeScopes = 0;
      let totalProgress = 0;

      if (goal.scope1Goal > 0) {
        activeScopes++;
        if (currentEmissions.scope1 > goal.scope1Goal) {
          const reductionNeeded = (goal.initialScope1 || initialEmissions.scope1) - goal.scope1Goal;
          const reductionAchieved = (goal.initialScope1 || initialEmissions.scope1) - currentEmissions.scope1;
          const progressPercent = (reductionAchieved / reductionNeeded) * 100;
          totalProgress += Math.min(100, Math.max(0, progressPercent));
        } else {
          totalProgress += 100;
        }
      }

      if (goal.scope2Goal > 0) {
        activeScopes++;
        if (currentEmissions.scope2 > goal.scope2Goal) {
          const reductionNeeded = (goal.initialScope2 || initialEmissions.scope2) - goal.scope2Goal;
          const reductionAchieved = (goal.initialScope2 || initialEmissions.scope2) - currentEmissions.scope2;
          const progressPercent = (reductionAchieved / reductionNeeded) * 100;
          totalProgress += Math.min(100, Math.max(0, progressPercent));
        } else {
          totalProgress += 100;
        }
      }

      if (goal.scope3Goal > 0) {
        activeScopes++;
        if (currentEmissions.scope3 > goal.scope3Goal) {
          const reductionNeeded = (goal.initialScope3 || initialEmissions.scope3) - goal.scope3Goal;
          const reductionAchieved = (goal.initialScope3 || initialEmissions.scope3) - currentEmissions.scope3;
          const progressPercent = (reductionAchieved / reductionNeeded) * 100;
          totalProgress += Math.min(100, Math.max(0, progressPercent));
        } else {
          totalProgress += 100;
        }
      }

      const averageProgress = activeScopes > 0 ? totalProgress / activeScopes : 0;

      if (averageProgress > 75) {
        return { status: "in-progress", badgeClass: "bg-warning" };
      } else {
        return { status: "pending", badgeClass: "bg-danger" };
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEditGoal = (goal) => {
    setEditingGoal({
      ...goal,
      scope1Goal: parseFloat(goal.scope1Goal || 0),
      scope2Goal: parseFloat(goal.scope2Goal || 0),
      scope3Goal: parseFloat(goal.scope3Goal || 0),
      totalGoal: parseFloat(goal.totalGoal || 0),
    });
    setShowEditModal(true);
  };

  const calculateTotalGoal = () => {
    return (
      (selectedScopes.scope1 ? parseFloat(newGoal.scope1Goal || 0) : 0) +
      (selectedScopes.scope2 ? parseFloat(newGoal.scope2Goal || 0) : 0) +
      (selectedScopes.scope3 ? parseFloat(newGoal.scope3Goal || 0) : 0)
    ).toFixed(2);
  };

  const calculatePotentialReduction = () => {
    const totalGoal = parseFloat(calculateTotalGoal());
    const reduction = currentEmissions.total - totalGoal;
    return {
      amount: reduction > 0 ? reduction.toFixed(2) : "0.00",
      percentage:
        reduction > 0 && currentEmissions.total > 0
          ? ((reduction / currentEmissions.total) * 100).toFixed(1)
          : "0.0",
    };
  };

  // Bar chart data and options
  const chartData = {
    labels: ["Scope 1", "Scope 2", "Scope 3", "Total"],
    datasets: [
      {
        label: "Émissions Initiales (tCO₂e)",
        data: [
          initialEmissions.scope1,
          initialEmissions.scope2,
          initialEmissions.scope3,
          initialEmissions.total,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Émissions Actuelles (tCO₂e)",
        data: [
          currentEmissions.scope1,
          currentEmissions.scope2,
          currentEmissions.scope3,
          currentEmissions.total,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGoals = goalsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(goalsList.length / itemsPerPage);

  return (
    <div className="page-wrapper">
      <Toaster position="top-right" />
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Objectifs de Réduction d'Émissions</h2>
              <div className="text-muted mt-1">
                Fixez et suivez les objectifs de réduction carbone de votre entreprise
              </div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button
                  type="button"
                  className="btn btn-primary d-none d-sm-inline-block"
                  onClick={() => setShowAddModal(true)}
                >
                  Ajouter un nouvel objectif
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-sm-none btn-icon"
                  onClick={() => setShowAddModal(true)}
                >
                  <IconPlus />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showSuccessAlert && (
          <div className="alert alert-success alert-dismissible" role="alert">
            <div className="d-flex">
              <div>
                <IconCheck className="icon alert-icon" />
              </div>
              <div>{alertMessage}</div>
            </div>
            <a className="btn-close" onClick={() => setShowSuccessAlert(false)}></a>
          </div>
        )}

        <div className="page-body">
          <div className="row row-cards">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Aperçu des Émissions Actuelles</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="card card-sm">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <span className="bg-red text-white avatar">
                                <IconBuildingFactory />
                              </span>
                            </div>
                            <div className="col">
                              <div className="font-weight-medium">
                                Scope 1: {currentEmissions.scope1} tCO₂e
                              </div>
                              <div className="text-muted">Émissions directes</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card card-sm">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <span className="bg-blue text-white avatar">
                                <IconBolt />
                              </span>
                            </div>
                            <div className="col">
                              <div className="font-weight-medium">
                                Scope 2: {currentEmissions.scope2} tCO₂e
                              </div>
                              <div className="text-muted">
                                Émissions indirectes liées à l'énergie
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card card-sm">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <span className="bg-green text-white avatar">
                                <IconTruck />
                              </span>
                            </div>
                            <div className="col">
                              <div className="font-weight-medium">
                                Scope 3: {currentEmissions.scope3} tCO₂e
                              </div>
                              <div className="text-muted">Autres émissions indirectes</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="card card-sm">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <span className="bg-azure text-white avatar">
                              <IconWorld />
                            </span>
                          </div>
                          <div className="col">
                            <div className="font-weight-medium">
                              Émissions Totales: {currentEmissions.total} tCO₂e
                            </div>
                            <div className="text-muted">Empreinte carbone globale</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Vos Objectifs de Réduction</h3>
                </div>
                <div className="card-body">
                  {goalsList.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">
                        <IconTarget size={48} />
                      </div>
                      <p className="empty-title">Aucun objectif de réduction pour l'instant</p>
                      <p className="empty-subtitle text-muted">
                        Commencez par ajouter votre premier objectif de réduction d'émissions
                      </p>
                      <div className="empty-action">
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowAddModal(true)}
                        >
                          <IconPlus className="icon" />
                          Ajouter un objectif
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table">
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Année</th>
                            <th>Scope 1</th>
                            <th>Scope 2</th>
                            <th>Scope 3</th>
                            <th>Total</th>
                            <th>Statut</th>
                            <th>Créé le</th>
                            <th className="w-1">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentGoals.map((goal) => {
                            const isScope1Achieved =
                              goal.scope1Goal === 0 || currentEmissions.scope1 <= goal.scope1Goal;
                            const isScope2Achieved =
                              goal.scope2Goal === 0 || currentEmissions.scope2 <= goal.scope2Goal;
                            const isScope3Achieved =
                              goal.scope3Goal === 0 || currentEmissions.scope3 <= goal.scope3Goal;
                            const allScopesAchieved =
                              isScope1Achieved && isScope2Achieved && isScope3Achieved;

                            return (
                              <tr key={goal._id}>
                                <td>
                                  <span
                                    className="avatar avatar-md text-white me-1"
                                    style={{ backgroundColor: "#263589", verticalAlign: "middle" }}
                                  >
                                    {goal.name.charAt(0)}
                                  </span>
                                  <span style={{ verticalAlign: "middle" }}>{goal.name}</span>
                                </td>
                                <td>{goal.year}</td>
                                <td>
                                  {goal.scope1Goal > 0 ? (
                                    <span className={isScope1Achieved ? "text-success" : ""}>
                                      {goal.scope1Goal} tCO₂e
                                      {isScope1Achieved && " ✓"}
                                    </span>
                                  ) : "-"}
                                </td>
                                <td>
                                  {goal.scope2Goal > 0 ? (
                                    <span className={isScope2Achieved ? "text-success" : ""}>
                                      {goal.scope2Goal} tCO₂e
                                      {isScope2Achieved && " ✓"}
                                    </span>
                                  ) : "-"}
                                </td>
                                <td>
                                  {goal.scope3Goal > 0 ? (
                                    <span className={isScope3Achieved ? "text-success" : ""}>
                                      {goal.scope3Goal} tCO₂e
                                      {isScope3Achieved && " ✓"}
                                    </span>
                                  ) : "-"}
                                </td>
                                <td>{goal.totalGoal.toFixed(1)} tCO₂e</td>
                                <td>
                                  {allScopesAchieved && (
                                    <span className="badge bg-green-lt">Atteint</span>
                                  )}
                                  {!allScopesAchieved && (
                                    <span className="badge bg-yellow-lt">En cours</span>
                                  )}
                                </td>
                                <td className="text-muted">{formatDate(goal.createdAt)}</td>
                                <td>
                                  <div className="btn-list flex-nowrap">
                                    <button
                                      className="btn btn-sm btn-icon btn-ghost-secondary"
                                      onClick={() => handleEditGoal(goal)}
                                    >
                                      <IconEdit size={18} />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-icon btn-ghost-secondary text-danger"
                                      onClick={() => handleDeleteGoal(goal._id)}
                                    >
                                      <IconTrash size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {goalsList.length > 0 && (
                    <div className="card-footer d-flex align-items-center">
                      <p className="m-0 text-muted">
                        Affichage de <span>{indexOfFirstItem + 1}</span> à{" "}
                        <span>{Math.min(indexOfLastItem, goalsList.length)}</span> sur{" "}
                        <span>{goalsList.length}</span> entrées
                      </p>
                      <ul className="pagination m-0 ms-auto">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            <IconChevronLeft size={18} />
                          </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => (
                          <li
                            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                            key={i}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}

                        <li
                          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            <IconChevronRight size={18} />
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAddModal && (
          <div
            className="modal modal-blur show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Ajouter un nouvel objectif de réduction d'émissions</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleAddGoal}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nom de l'objectif</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: Objectif de réduction carbone 2025"
                        value={newGoal.name}
                        onChange={(e) => handleGoalChange("name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Année cible</label>
                      <input
                        type="number"
                        min={new Date().getFullYear()}
                        max={new Date().getFullYear() + 30}
                        className="form-control"
                        value={newGoal.year}
                        onChange={(e) => handleGoalChange("year", e.target.value)}
                        required
                      />
                    </div>

                    {validationErrors.general && (
                      <div className="alert alert-danger mb-3" role="alert">
                        {validationErrors.general}
                      </div>
                    )}

                    <div className="form-label mb-2">Sélectionnez les scopes pour définir des objectifs</div>
                    <div className="form-selectgroup-boxes row mb-3">
                      <div className="col-md-4">
                        <label className={`form-selectgroup-item ${selectedScopes.scope1 ? "active" : ""}`}>
                          <input
                            type="checkbox"
                            name="scope-1"
                            value="1"
                            className="form-selectgroup-input"
                            checked={selectedScopes.scope1}
                            onChange={() => toggleScope(1)}
                          />
                          <span className="form-selectgroup-label d-flex align-items-center p-3">
                            <span className="me-3">
                              <span className="form-selectgroup-check"></span>
                            </span>
                            <span className="form-selectgroup-label-content">
                              <span className="form-selectgroup-title strong mb-1">Scope 1</span>
                              <span className="d-block text-secondary">
                                Actuel: {currentEmissions.scope1} tCO₂e
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className={`form-selectgroup-item ${selectedScopes.scope2 ? "active" : ""}`}>
                          <input
                            type="checkbox"
                            name="scope-2"
                            value="1"
                            className="form-selectgroup-input"
                            checked={selectedScopes.scope2}
                            onChange={() => toggleScope(2)}
                          />
                          <span className="form-selectgroup-label d-flex align-items-center p-3">
                            <span className="me-3">
                              <span className="form-selectgroup-check"></span>
                            </span>
                            <span className="form-selectgroup-label-content">
                              <span className="form-selectgroup-title strong mb-1">Scope 2</span>
                              <span className="d-block text-secondary">
                                Actuel: {currentEmissions.scope2} tCO₂e
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className={`form-selectgroup-item ${selectedScopes.scope3 ? "active" : ""}`}>
                          <input
                            type="checkbox"
                            name="scope-3"
                            value="1"
                            className="form-selectgroup-input"
                            checked={selectedScopes.scope3}
                            onChange={() => toggleScope(3)}
                          />
                          <span className="form-selectgroup-label d-flex align-items-center p-3">
                            <span className="me-3">
                              <span className="form-selectgroup-check"></span>
                            </span>
                            <span className="form-selectgroup-label-content">
                              <span className="form-selectgroup-title strong mb-1">Scope 3</span>
                              <span className="d-block text-secondary">
                                Actuel: {currentEmissions.scope3} tCO₂e
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {selectedScopes.scope1 && (
                      <div className="mb-3">
                        <label className="form-label">Objectif Scope 1 (tCO₂e)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={currentEmissions.scope1 - 0.01}
                          className={`form-control ${validationErrors.scope1Goal ? "is-invalid" : ""}`}
                          placeholder="Émissions cibles en tCO₂e"
                          value={newGoal.scope1Goal}
                          onChange={(e) => handleGoalChange("scope1Goal", e.target.value)}
                          required={selectedScopes.scope1}
                        />
                        {validationErrors.scope1Goal ? (
                          <div className="invalid-feedback">{validationErrors.scope1Goal}</div>
                        ) : (
                          <small className="form-hint">
                            Votre objectif doit être inférieur aux émissions actuelles (
                            {currentEmissions.scope1} tCO₂e)
                          </small>
                        )}
                      </div>
                    )}

                    {selectedScopes.scope2 && (
                      <div className="mb-3">
                        <label className="form-label">Objectif Scope 2 (tCO₂e)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={currentEmissions.scope2 - 0.01}
                          className={`form-control ${validationErrors.scope2Goal ? "is-invalid" : ""}`}
                          placeholder="Émissions cibles en tCO₂e"
                          value={newGoal.scope2Goal}
                          onChange={(e) => handleGoalChange("scope2Goal", e.target.value)}
                          required={selectedScopes.scope2}
                        />
                        {validationErrors.scope2Goal ? (
                          <div className="invalid-feedback">{validationErrors.scope2Goal}</div>
                        ) : (
                          <small className="form-hint">
                            Votre objectif doit être inférieur aux émissions actuelles (
                            {currentEmissions.scope2} tCO₂e)
                          </small>
                        )}
                      </div>
                    )}

                    {selectedScopes.scope3 && (
                      <div className="mb-3">
                        <label className="form-label">Objectif Scope 3 (tCO₂e)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={currentEmissions.scope3 - 0.01}
                          className={`form-control ${validationErrors.scope3Goal ? "is-invalid" : ""}`}
                          placeholder="Émissions cibles en tCO₂e"
                          value={newGoal.scope3Goal}
                          onChange={(e) => handleGoalChange("scope3Goal", e.target.value)}
                          required={selectedScopes.scope3}
                        />
                        {validationErrors.scope3Goal ? (
                          <div className="invalid-feedback">{validationErrors.scope3Goal}</div>
                        ) : (
                          <small className="form-hint">
                            Votre objectif doit être inférieur aux émissions actuelles (
                            {currentEmissions.scope3} tCO₂e)
                          </small>
                        )}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Description (Optionnel)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Décrivez votre stratégie de réduction"
                        value={newGoal.description}
                        onChange={(e) => handleGoalChange("description", e.target.value)}
                      ></textarea>
                    </div>

                    {(selectedScopes.scope1 || selectedScopes.scope2 || selectedScopes.scope3) && (
                      <div className="alert alert-info" role="alert">
                        <div className="d-flex">
                          <div>
                            <IconInfoCircle className="icon alert-icon" />
                          </div>
                          <div>
                            <h4 className="alert-title">Aperçu de l'objectif</h4>
                            <div className="text-muted">
                              Objectif total: {calculateTotalGoal()} tCO₂e
                            </div>
                            <div className="text-muted">
                              Réduction potentielle: {calculatePotentialReduction().amount} tCO₂e (
                              {calculatePotentialReduction().percentage}%)
                            </div>
                            <div className="text-muted mt-2">
                              <strong>Statut de l'objectif:</strong> L'objectif sera atteint lorsque vos
                              émissions actuelles seront inférieures ou égales à la valeur cible.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-link link-secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ms-auto"
                      disabled={!(selectedScopes.scope1 || selectedScopes.scope2 || selectedScopes.scope3)}
                    >
                      <IconPlus className="icon" />
                      Ajouter l'objectif
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showEditModal && editingGoal && (
          <div
            className="modal modal-blur show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Modifier l'objectif de réduction d'émissions</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleUpdateGoal}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nom de l'objectif</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingGoal.name}
                        onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Année cible</label>
                      <input
                        type="number"
                        min={new Date().getFullYear()}
                        max={new Date().getFullYear() + 30}
                        className="form-control"
                        value={editingGoal.year}
                        onChange={(e) =>
                          setEditingGoal({
                            ...editingGoal,
                            year: parseInt(e.target.value) || new Date().getFullYear(),
                          })
                        }
                        required
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">
                            Objectif Scope 1 (tCO₂e)
                            <span className="form-label-description">
                              {editingGoal.scope1Goal > 0 &&
                                currentEmissions.scope1 > 0 &&
                                `${((1 - editingGoal.scope1Goal / currentEmissions.scope1) * 100).toFixed(1)}% de réduction`}
                            </span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={currentEmissions.scope1}
                            className="form-control"
                            value={editingGoal.scope1Goal}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              setEditingGoal({ ...editingGoal, scope1Goal: value });
                            }}
                          />
                          <small
                            className={`form-hint ${
                              editingGoal.scope1Goal >= currentEmissions.scope1 &&
                              editingGoal.scope1Goal > 0
                                ? "text-danger"
                                : ""
                            }`}
                          >
                            {editingGoal.scope1Goal >= currentEmissions.scope1 &&
                            editingGoal.scope1Goal > 0
                              ? "L'objectif doit être inférieur aux émissions actuelles"
                              : "Émissions actuelles: " + currentEmissions.scope1 + " tCO₂e"}
                          </small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">
                            Objectif Scope 2 (tCO₂e)
                            <span className="form-label-description">
                              {editingGoal.scope2Goal > 0 &&
                                currentEmissions.scope2 > 0 &&
                                `${((1 - editingGoal.scope2Goal / currentEmissions.scope2) * 100).toFixed(1)}% de réduction`}
                            </span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={currentEmissions.scope2}
                            className="form-control"
                            value={editingGoal.scope2Goal}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              setEditingGoal({ ...editingGoal, scope2Goal: value });
                            }}
                          />
                          <small
                            className={`form-hint ${
                              editingGoal.scope2Goal >= currentEmissions.scope2 &&
                              editingGoal.scope2Goal > 0
                                ? "text-danger"
                                : ""
                            }`}
                          >
                            {editingGoal.scope2Goal >= currentEmissions.scope2 &&
                            editingGoal.scope2Goal > 0
                              ? "L'objectif doit être inférieur aux émissions actuelles"
                              : "Émissions actuelles: " + currentEmissions.scope2 + " tCO₂e"}
                          </small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">
                            Objectif Scope 3 (tCO₂e)
                            <span className="form-label-description">
                              {editingGoal.scope3Goal > 0 &&
                                currentEmissions.scope3 > 0 &&
                                `${((1 - editingGoal.scope3Goal / currentEmissions.scope3) * 100).toFixed(1)}% de réduction`}
                            </span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={currentEmissions.scope3}
                            className="form-control"
                            value={editingGoal.scope3Goal}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              setEditingGoal({ ...editingGoal, scope3Goal: value });
                            }}
                          />
                          <small
                            className={`form-hint ${
                              editingGoal.scope3Goal >= currentEmissions.scope3 &&
                              editingGoal.scope3Goal > 0
                                ? "text-danger"
                                : ""
                            }`}
                          >
                            {editingGoal.scope3Goal >= currentEmissions.scope3 &&
                            editingGoal.scope3Goal > 0
                              ? "L'objectif doit être inférieur aux émissions actuelles"
                              : "Émissions actuelles: " + currentEmissions.scope3 + " tCO₂e"}
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editingGoal.description || ""}
                        onChange={(e) =>
                          setEditingGoal({ ...editingGoal, description: e.target.value })
                        }
                      ></textarea>
                    </div>

                    <div className="alert alert-info" role="alert">
                      <div className="d-flex">
                        <div>
                          <IconInfoCircle className="icon alert-icon" />
                        </div>
                        <div>
                          <h4 className="alert-title">Aperçu de l'objectif modifié</h4>
                          <div className="text-muted">
                            Objectif total: {editingGoal.totalGoal.toFixed(2)} tCO₂e
                          </div>
                          <div className="text-muted">
                            Réduction potentielle: {(currentEmissions.total - editingGoal.totalGoal).toFixed(2)} tCO₂e (
                            {currentEmissions.total > 0
                              ? ((1 - editingGoal.totalGoal / currentEmissions.total) * 100).toFixed(1)
                              : 0.0}%)
                          </div>
                          <div className="text-muted mt-2">
                            <strong>Statut de l'objectif:</strong> L'objectif sera atteint lorsque vos
                            émissions actuelles seront inférieures ou égales à la valeur cible.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-link link-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary ms-auto">
                      <IconCheck className="icon" />
                      Mettre à jour l'objectif
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;