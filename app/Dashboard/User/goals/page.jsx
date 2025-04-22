"use client";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Create a notification context (add this to a separate file in your project)
export const NotificationContext = React.createContext({
  notifications: [],
  addNotification: () => {},
  markAsRead: () => {},
  markAllRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GoalsPage = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEmissions, setCurrentEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0,
  });
  const [goalsList, setGoalsList] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: 'Carbon Reduction Goal',
    year: new Date().getFullYear(),
    scope1Goal: 0,
    scope2Goal: 0,
    scope3Goal: 0,
    description: '',
  });
  const [selectedScopes, setSelectedScopes] = useState({
    scope1: false,
    scope2: false,
    scope3: false
  });
  const [validationErrors, setValidationErrors] = useState({
    scope1Goal: '',
    scope2Goal: '',
    scope3Goal: '',
    general: ''
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Add notification function
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(), // Use a more robust ID in production
      read: false,
      time: new Date().toLocaleString(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a toast for immediate feedback
    toast.success(notification.message);
    
    // Store in localStorage (optional - for persistence between page reloads)
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([newNotification, ...storedNotifications]));
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    // Update localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify(
      storedNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    ));
  };

  // Mark all notifications as read
  const markAllRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    
    // Update localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify(
      storedNotifications.map(notif => ({ ...notif, read: true }))
    ));
  };

  const sumEmissions = (arr) => {
    if (!arr || !Array.isArray(arr)) return 0;
    return arr.reduce((sum, item) => sum + parseFloat(item.emissions || 0), 0);
  };

  const calculateProgress = (current, goal) => {
    if (!goal || goal <= 0 || current <= 0) return 0;
    const reduction = current - goal;
    return reduction <= 0 ? 0 : ((reduction / current) * 100).toFixed(1);
  };

  const getReductionNeeded = (current, goal) => {
    return goal >= current ? 0 : (current - goal).toFixed(1);
  };

  const getReductionPercentage = (current, goal) => {
    return goal >= current || current === 0
      ? 0
      : (((current - goal) / current) * 100).toFixed(1);
  };

  const handleGoalChange = (field, value) => {
    // Update the goal
    let newValue = value;
    if (field === 'year') {
      newValue = parseInt(value) || new Date().getFullYear();
    } else if (['scope1Goal', 'scope2Goal', 'scope3Goal'].includes(field)) {
      newValue = parseFloat(value) || 0;
      
      // Validate the value in real-time
      const scopeNumber = field.replace('scope', '').replace('Goal', '');
      const currentValue = currentEmissions[`scope${scopeNumber}`];
      
      if (newValue > 0 && newValue >= currentValue) {
        setValidationErrors(prev => ({
          ...prev,
          [field]: `Goal must be less than current emissions (${currentValue} tCO₂e)`
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }
    
    setNewGoal(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const toggleScope = (scopeNumber) => {
    const scopeKey = `scope${scopeNumber}`;
    
    setSelectedScopes(prev => {
      const newState = { ...prev, [scopeKey]: !prev[scopeKey] };
      
      // If scope is being deselected, reset its goal value and validation error
      if (!newState[scopeKey]) {
        setNewGoal(prevGoal => ({
          ...prevGoal,
          [`${scopeKey}Goal`]: 0
        }));
        
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          [`${scopeKey}Goal`]: ''
        }));
      }
      
      return newState;
    });
  };

  const fetchAndCalculateEmissions = async (companyId) => {
    try {
      const reportRes = await fetch(
        `http://localhost:4000/report/full/${companyId}`
      );
      const reportJson = await reportRes.json();
      const reportData = reportJson.data;

      const scope1Fuel =
        reportData.scope1Data?.fuelCombution?.[0]?.totalEmissions || 0;
      const scope1Production =
        reportData.scope1Data?.production?.[0]?.totalEmissions || 0;
      const scope1 = parseFloat(scope1Fuel) + parseFloat(scope1Production);

      const scope2Heating = reportData.scope2Data?.heating?.totalEmissions || 0;
      const scope2Cooling = reportData.scope2Data?.cooling?.totalEmissions || 0;
      const scope2Energy =
        reportData.scope2Data?.energyConsumption?.emissions || 0;
      const scope2 =
        parseFloat(scope2Heating) +
        parseFloat(scope2Cooling) +
        parseFloat(scope2Energy);

      const scope3 =
        sumEmissions(reportData.scope3Data?.transport) +
        sumEmissions(reportData.scope3Data?.dechet) +
        sumEmissions(reportData.scope3Data?.capitalGood) +
        sumEmissions(reportData.scope3Data?.businessTravel);

      const total = scope1 + scope2 + scope3;

      return {
        scope1: parseFloat(scope1.toFixed(2)),
        scope2: parseFloat(scope2.toFixed(2)),
        scope3: parseFloat(scope3.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      };
    } catch (error) {
      console.error("Error calculating emissions:", error);
      toast.error("Failed to calculate current emissions");
      return { scope1: 0, scope2: 0, scope3: 0, total: 0 };
    }
  };

  const validateGoals = () => {
    // Reset validation errors
    const errors = {
      scope1Goal: '',
      scope2Goal: '',
      scope3Goal: '',
      general: ''
    };
    
    // Name validation
    if (newGoal.name.trim() === '') {
      errors.general = 'Goal name is required';
      setValidationErrors(errors);
      return { valid: false, messages: [errors.general] };
    }
    
    // Check if at least one scope is selected
    const hasSelectedScope = selectedScopes.scope1 || selectedScopes.scope2 || selectedScopes.scope3;
    if (!hasSelectedScope) {
      errors.general = 'Please select at least one scope';
      setValidationErrors(errors);
      return { valid: false, messages: [errors.general] };
    }
    
    // Validate each selected scope has a valid goal value
    let hasValidGoal = false;
    
    if (selectedScopes.scope1) {
      if (newGoal.scope1Goal <= 0) {
        errors.scope1Goal = 'Please enter a goal value greater than 0';
      } else if (newGoal.scope1Goal >= currentEmissions.scope1) {
        errors.scope1Goal = `Goal must be less than current emissions (${currentEmissions.scope1} tCO₂e)`;
      } else {
        hasValidGoal = true;
      }
    }
    
    if (selectedScopes.scope2) {
      if (newGoal.scope2Goal <= 0) {
        errors.scope2Goal = 'Please enter a goal value greater than 0';
      } else if (newGoal.scope2Goal >= currentEmissions.scope2) {
        errors.scope2Goal = `Goal must be less than current emissions (${currentEmissions.scope2} tCO₂e)`;
      } else {
        hasValidGoal = true;
      }
    }
    
    if (selectedScopes.scope3) {
      if (newGoal.scope3Goal <= 0) {
        errors.scope3Goal = 'Please enter a goal value greater than 0';
      } else if (newGoal.scope3Goal >= currentEmissions.scope3) {
        errors.scope3Goal = `Goal must be less than current emissions (${currentEmissions.scope3} tCO₂e)`;
      } else {
        hasValidGoal = true;
      }
    }
    
    // Make sure at least one selected scope has a valid goal
    if (!hasValidGoal) {
      if (!errors.general) {
        errors.general = 'At least one selected scope must have a valid goal';
      }
      setValidationErrors(errors);
      return { 
        valid: false, 
        messages: [
          errors.general,
          errors.scope1Goal,
          errors.scope2Goal,
          errors.scope3Goal
        ].filter(Boolean) 
      };
    }
    
    setValidationErrors(errors);
    return { 
      valid: true, 
      messages: [] 
    };
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    
    if (!company?._id) {
      toast.error("Company not found");
      return;
    }

    const { valid, messages } = validateGoals();
    if (!valid) {
      messages.forEach(msg => toast.error(msg));
      return;
    }

    try {
      // Prepare the payload with goals only for selected scopes
      const payload = {
        ...newGoal,
        company_id: company._id,
        // Only include goals for selected scopes
        scope1Goal: selectedScopes.scope1 ? newGoal.scope1Goal : 0,
        scope2Goal: selectedScopes.scope2 ? newGoal.scope2Goal : 0,
        scope3Goal: selectedScopes.scope3 ? newGoal.scope3Goal : 0,
      };
      
      // Calculate total goal from selected scopes
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
      
      // Clear form
      setNewGoal({
        name: 'Carbon Reduction Goal',
        year: new Date().getFullYear(),
        scope1Goal: 0,
        scope2Goal: 0,
        scope3Goal: 0,
        description: '',
      });
      
      // Reset selected scopes
      setSelectedScopes({
        scope1: false,
        scope2: false,
        scope3: false
      });
      
      // Close modal
      setShowAddModal(false);
      
      // Show success alert
      setAlertMessage('Goal added successfully!');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
      // Refresh goals list
      fetchGoals(company._id);
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    
    if (!editingGoal?._id) {
      toast.error("No goal selected for update");
      return;
    }

    // Validate that all goal values are valid
    let hasError = false;
    let errorMessages = [];
    
    if (editingGoal.scope1Goal > 0 && editingGoal.scope1Goal >= currentEmissions.scope1) {
      errorMessages.push(`Scope 1 goal must be less than current emissions (${currentEmissions.scope1} tCO₂e)`);
      hasError = true;
    }
    
    if (editingGoal.scope2Goal > 0 && editingGoal.scope2Goal >= currentEmissions.scope2) {
      errorMessages.push(`Scope 2 goal must be less than current emissions (${currentEmissions.scope2} tCO₂e)`);
      hasError = true;
    }
    
    if (editingGoal.scope3Goal > 0 && editingGoal.scope3Goal >= currentEmissions.scope3) {
      errorMessages.push(`Scope 3 goal must be less than current emissions (${currentEmissions.scope3} tCO₂e)`);
      hasError = true;
    }
    
    // Make sure at least one scope has a goal
    if (editingGoal.scope1Goal <= 0 && editingGoal.scope2Goal <= 0 && editingGoal.scope3Goal <= 0) {
      errorMessages.push("At least one scope must have a goal value greater than 0");
      hasError = true;
    }
    
    if (hasError) {
      errorMessages.forEach(msg => toast.error(msg));
      return;
    }

    try {
      // Calculate the updated total goal
      const updatedGoal = {
        ...editingGoal,
        totalGoal: 
          parseFloat(editingGoal.scope1Goal || 0) + 
          parseFloat(editingGoal.scope2Goal || 0) + 
          parseFloat(editingGoal.scope3Goal || 0)
      };

      const res = await fetch(`http://localhost:4000/goals/${editingGoal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedGoal),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // Close modal
      setShowEditModal(false);
      
      // Show success alert
      setAlertMessage('Goal updated successfully!');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
      // Refresh goals list
      fetchGoals(company._id);
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
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
      
      // Show success alert
      setAlertMessage('Goal deleted successfully!');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
      // Refresh goals list
      fetchGoals(company._id);
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Check if any goals have been achieved
  const checkAchievedGoals = (goals, emissions) => {
    const achievedGoals = [];
    
    goals.forEach(goal => {
      const previousStatus = goal.status || 'pending';
      
      // Check if all selected scopes are achieved
      const isScope1Achieved = goal.scope1Goal === 0 || emissions.scope1 <= goal.scope1Goal;
      const isScope2Achieved = goal.scope2Goal === 0 || emissions.scope2 <= goal.scope2Goal;
      const isScope3Achieved = goal.scope3Goal === 0 || emissions.scope3 <= goal.scope3Goal;
      
      const allScopesAchieved = isScope1Achieved && isScope2Achieved && isScope3Achieved;
      
      // If the goal is newly achieved, add it to the list
      if (allScopesAchieved && previousStatus !== 'achieved') {
        achievedGoals.push({
          ...goal,
          newlyAchieved: true
        });
        
        // Update the goal status on the server
        fetch(`http://localhost:4000/goals/${goal._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...goal, status: 'achieved' }),
        }).catch(error => console.error("Error updating goal status:", error));
      }
    });
    
    return achievedGoals;
  };

  const fetchGoals = async (companyId) => {
    try {
      const res = await fetch(`http://localhost:4000/goals/all/${companyId}`);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Check for newly achieved goals
        const achievedGoals = checkAchievedGoals(data.data, currentEmissions);
        
        // Update the goals list with status information
        const updatedGoals = data.data.map(goal => {
          const isScope1Achieved = goal.scope1Goal === 0 || currentEmissions.scope1 <= goal.scope1Goal;
          const isScope2Achieved = goal.scope2Goal === 0 || currentEmissions.scope2 <= goal.scope2Goal;
          const isScope3Achieved = goal.scope3Goal === 0 || currentEmissions.scope3 <= goal.scope3Goal;
          
          let status = 'pending';
          if (isScope1Achieved && isScope2Achieved && isScope3Achieved) {
            status = 'achieved';
          } else {
            // Calculate progress
            const totalScopes = [
              goal.scope1Goal > 0 ? 1 : 0,
              goal.scope2Goal > 0 ? 1 : 0, 
              goal.scope3Goal > 0 ? 1 : 0
            ].reduce((a, b) => a + b, 0);
            
            const scope1Progress = goal.scope1Goal > 0 ? 
              Math.min(100, Math.max(0, (1 - (currentEmissions.scope1 - goal.scope1Goal) / currentEmissions.scope1) * 100)) : 0;
            const scope2Progress = goal.scope2Goal > 0 ? 
              Math.min(100, Math.max(0, (1 - (currentEmissions.scope2 - goal.scope2Goal) / currentEmissions.scope2) * 100)) : 0;
            const scope3Progress = goal.scope3Goal > 0 ? 
              Math.min(100, Math.max(0, (1 - (currentEmissions.scope3 - goal.scope3Goal) / currentEmissions.scope3) * 100)) : 0;
            
            const totalProgress = totalScopes > 0 ? 
              (scope1Progress + scope2Progress + scope3Progress) / totalScopes : 0;
            
            status = totalProgress > 50 ? 'in-progress' : 'pending';
          }
          
          return {
            ...goal,
            status
          };
        });
        
        setGoalsList(updatedGoals);
        
        // Create notifications for newly achieved goals
        achievedGoals.forEach(goal => {
          addNotification({
            type: 'achievement',
            title: 'Goal Achieved! 🎉',
            message: `You've achieved your "${goal.name}" emission reduction goal!`,
            time: new Date().toLocaleString()
          });
        });
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
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
        if (!userId) throw new Error("Unauthorized");

        const compRes = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userId}`
        );
        const compData = await compRes.json();
        setCompany(compData.data);

        const emissions = await fetchAndCalculateEmissions(compData.data._id);
        setCurrentEmissions(emissions);

        // Fetch all goals
        await fetchGoals(compData.data._id);
        
        // Load stored notifications
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        setNotifications(storedNotifications);
        
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up periodic check for achieved goals (every 30 minutes)
    const intervalId = setInterval(() => {
      if (company?._id) {
        fetchAndCalculateEmissions(company._id)
          .then(emissions => {
            setCurrentEmissions(emissions);
            fetchGoals(company._id);
          })
          .catch(error => console.error("Error in periodic check:", error));
      }
    }, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

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
        if (!userId) throw new Error("Unauthorized");

        const compRes = await fetch(
          `http://localhost:4000/GetCompanyByOwnerID/${userId}`
        );
        const compData = await compRes.json();
        setCompany(compData.data);

        const emissions = await fetchAndCalculateEmissions(compData.data._id);
        setCurrentEmissions(emissions);

        // Fetch all goals
        await fetchGoals(compData.data._id);
        
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getScopeColor = (scope) => {
    switch(scope) {
      case 1: return "bg-red";
      case 2: return "bg-blue";
      case 3: return "bg-green";
      default: return "bg-azure";
    }
  };

  const getScopeChartColor = (scope, alpha = 1) => {
    switch(scope) {
      case 1: return `rgba(220, 53, 69, ${alpha})`;
      case 2: return `rgba(13, 110, 253, ${alpha})`;
      case 3: return `rgba(25, 135, 84, ${alpha})`;
      default: return `rgba(23, 162, 184, ${alpha})`;
    }
  };

  const getPercentOfTotal = (value) => {
    if (!currentEmissions.total) return 0;
    return ((value / currentEmissions.total) * 100).toFixed(1);
  };

  // Chart.js data setup
  const chartData = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [
      {
        label: 'Current Emissions',
        data: [currentEmissions.scope1, currentEmissions.scope2, currentEmissions.scope3],
        backgroundColor: [
          getScopeChartColor(1, 0.8),
          getScopeChartColor(2, 0.8),
          getScopeChartColor(3, 0.8),
        ],
        borderColor: [
          getScopeChartColor(1, 1),
          getScopeChartColor(2, 1),
          getScopeChartColor(3, 1),
        ],
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Emissions by Scope',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + ' tCO₂e';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'tCO₂e'
        }
      }
    }
  };

  const getGoalStatus = (goal) => {
    const isScope1Achieved = goal.scope1Goal === 0 || currentEmissions.scope1 <= goal.scope1Goal;
    const isScope2Achieved = goal.scope2Goal === 0 || currentEmissions.scope2 <= goal.scope2Goal;
    const isScope3Achieved = goal.scope3Goal === 0 || currentEmissions.scope3 <= goal.scope3Goal;
    
    if (isScope1Achieved && isScope2Achieved && isScope3Achieved) {
      return { status: 'achieved', badgeClass: 'bg-success' };
    } else {
      const scope1Progress = goal.scope1Goal > 0 ? 
        (1 - (currentEmissions.scope1 / goal.scope1Goal)) * 100 : 0;
      const scope2Progress = goal.scope2Goal > 0 ? 
        (1 - (currentEmissions.scope2 / goal.scope2Goal)) * 100 : 0;
      const scope3Progress = goal.scope3Goal > 0 ? 
        (1 - (currentEmissions.scope3 / goal.scope3Goal)) * 100 : 0;
      
      const totalProgress = 
        (scope1Progress + scope2Progress + scope3Progress) / 
        ((goal.scope1Goal > 0 ? 1 : 0) + (goal.scope2Goal > 0 ? 1 : 0) + (goal.scope3Goal > 0 ? 1 : 0) || 1);
      
      if (totalProgress > 50) {
        return { status: 'in-progress', badgeClass: 'bg-warning' };
      } else {
        return { status: 'pending', badgeClass: 'bg-danger' };
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowEditModal(true);
  };

  // Calculate current total goal value for preview
  const calculateTotalGoal = () => {
    return (
      (selectedScopes.scope1 ? parseFloat(newGoal.scope1Goal || 0) : 0) + 
      (selectedScopes.scope2 ? parseFloat(newGoal.scope2Goal || 0) : 0) + 
      (selectedScopes.scope3 ? parseFloat(newGoal.scope3Goal || 0) : 0)
    ).toFixed(2);
  };

  // Calculate potential reduction
  const calculatePotentialReduction = () => {
    const totalGoal = parseFloat(calculateTotalGoal());
    const reduction = currentEmissions.total - totalGoal;
    return {
      amount: reduction > 0 ? reduction.toFixed(2) : '0.00',
      percentage: reduction > 0 && currentEmissions.total > 0 
        ? ((reduction / currentEmissions.total) * 100).toFixed(1) 
        : '0.0'
    };
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Emission Reduction Goals</h2>
              <div className="text-muted mt-1">
                Set and track your company's carbon reduction targets
              </div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button 
                  type="button" 
                  className="btn btn-primary d-none d-sm-inline-block" 
                  onClick={() => setShowAddModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                  </svg>
                  Add New Goal
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary d-sm-none btn-icon" 
                  onClick={() => setShowAddModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccessAlert && (
          <div className="alert alert-success alert-dismissible" role="alert">
            <div className="d-flex">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
              </div>
              <div>{alertMessage}</div>
            </div>
            <a className="btn-close" onClick={() => setShowSuccessAlert(false)}></a>
          </div>
        )}

        <div className="page-body">
          {loading ? (
            <div className="card">
              <div className="card-body text-center py-4">
                <div className="spinner-border text-blue" role="status"></div>
                <div className="mt-3">Loading emission data...</div>
              </div>
            </div>
          ) : (
            <div className="row row-cards">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Current Emissions</h3>
                  </div>
                  <div className="card-body">
                    <div className="space-y-4">
                      {["scope1", "scope2", "scope3"].map((scope, i) => {
                        const scopeNumber = i + 1;
                        const value = currentEmissions[scope];
                        const percentage = getPercentOfTotal(value);
                        return (
                          <div key={scope}>
                            <div className="d-flex justify-content-between mb-1">
                              <div>Scope {scopeNumber}</div>
                              <div className="d-flex align-items-center">
                                <span className="text-muted me-2">{percentage}%</span>
                                <span className="ms-auto">{value} tCO₂e</span>
                              </div>
                            </div>
                            <div className="progress">
                              <div className={`progress-bar ${getScopeColor(scopeNumber)}`} 
                                style={{width: `${percentage}%`}}></div>
                            </div>
                          </div>
                        );
                      })} 
                      <div className="hr-text">Total</div> 
                      <div className="d-flex align-items-center">
                        <div className="h1 mb-0 me-2">{currentEmissions.total}</div>
                        <div className="me-auto">
                          <div className="text-muted">tCO₂e</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mt-3">
                  <div className="card-body">
                    <div style={{ height: "280px" }}>
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Your Reduction Goals</h3>
                  </div>
                  <div className="card-body">
                    {goalsList.length === 0 ? (
                      <div className="empty">
                        <div className="empty-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-target" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                          </svg>
                        </div>
                        <p className="empty-title">No reduction goals yet</p>
                        <p className="empty-subtitle text-muted">
                          Start by adding your first emission reduction goal
                        </p>
                        <div className="empty-action">
                          <button 
                            className="btn btn-primary" 
                            onClick={() => setShowAddModal(true)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M12 5l0 14" />
                              <path d="M5 12l14 0" />
                            </svg>
                            Add Goal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-vcenter card-table">
                          <thead>
                            <tr>
                              <th>Goal Name</th>
                              <th>Year</th>
                              <th>Scope 1</th>
                              <th>Scope 2</th>
                              <th>Scope 3</th>
                              <th>Total</th>
                              <th>Status</th>
                              <th>Created</th>
                              <th className="w-1">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {goalsList.map(goal => {
                              const { status, badgeClass } = getGoalStatus(goal);
                              return (
                                <tr key={goal._id}>
                                  <td>{goal.name}</td>
                                  <td>{goal.year}</td>
                                  <td>{goal.scope1Goal > 0 ? `${goal.scope1Goal} tCO₂e` : '-'}</td>
                                  <td>{goal.scope2Goal > 0 ? `${goal.scope2Goal} tCO₂e` : '-'}</td>
                                  <td>{goal.scope3Goal > 0 ? `${goal.scope3Goal} tCO₂e` : '-'}</td>
                                  <td>{goal.totalGoal.toFixed(1)} tCO₂e</td>
                                  <td>
                                    <span className={`badge ${badgeClass}`}>
                                      {status === 'achieved' && 'Achieved'}
                                      {status === 'in-progress' && 'In Progress'}
                                      {status === 'pending' && 'Pending'}
                                    </span>
                                  </td>
                                  <td className="text-muted">{formatDate(goal.createdAt)}</td>
                                  <td>
                                    <div className="btn-list flex-nowrap">
                                      <button 
                                        className="btn btn-sm btn-icon btn-ghost-secondary"
                                        onClick={() => handleEditGoal(goal)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                                          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                                          <path d="M16 5l3 3"></path>
                                        </svg>
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-icon btn-ghost-secondary text-danger"
                                        onClick={() => handleDeleteGoal(goal._id)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                          <path d="M4 7l16 0"></path>
                                          <path d="M10 11l0 6"></path>
                                          <path d="M14 11l0 6"></path>
                                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                                        </svg>
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="modal modal-blur show" style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Emission Reduction Goal</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddGoal}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Goal Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. 2025 Carbon Reduction Target"
                      value={newGoal.name}
                      onChange={(e) => handleGoalChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Target Year</label>
                    <input
                      type="number"
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 30}
                      className="form-control"
                      value={newGoal.year}
                      onChange={(e) => handleGoalChange('year', e.target.value)}
                      required
                    />
                  </div>

                  {validationErrors.general && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {validationErrors.general}
                    </div>
                  )}

                  <div className="form-label mb-2">Select Scopes to Set Goals For</div>
                  <div className="form-selectgroup-boxes row mb-3">
                    <div className="col-md-4">
                      <label className={`form-selectgroup-item ${selectedScopes.scope1 ? 'active' : ''}`}>
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
                              Current: {currentEmissions.scope1} tCO₂e
                            </span>
                          </span>
                        </span>
                      </label>
                    </div>
                    <div className="col-md-4">
                      <label className={`form-selectgroup-item ${selectedScopes.scope2 ? 'active' : ''}`}>
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
                              Current: {currentEmissions.scope2} tCO₂e
                            </span>
                          </span>
                        </span>
                      </label>
                    </div>
                    <div className="col-md-4">
                      <label className={`form-selectgroup-item ${selectedScopes.scope3 ? 'active' : ''}`}>
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
                              Current: {currentEmissions.scope3} tCO₂e
                            </span>
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {selectedScopes.scope1 && (
                    <div className="mb-3">
                      <label className="form-label">Scope 1 Goal (tCO₂e)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={currentEmissions.scope1 - 0.01}
                        className={`form-control ${validationErrors.scope1Goal ? 'is-invalid' : ''}`}
                        placeholder="Target emissions in tCO₂e"
                        value={newGoal.scope1Goal}
                        onChange={(e) => handleGoalChange('scope1Goal', e.target.value)}
                        required={selectedScopes.scope1}
                      />
                      {validationErrors.scope1Goal ? (
                        <div className="invalid-feedback">{validationErrors.scope1Goal}</div>
                      ) : (
                        <small className="form-hint">
                          Your goal should be less than current emissions ({currentEmissions.scope1} tCO₂e)
                        </small>
                      )}
                    </div>
                  )}

                  {selectedScopes.scope2 && (
                    <div className="mb-3">
                      <label className="form-label">Scope 2 Goal (tCO₂e)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={currentEmissions.scope2 - 0.01}
                        className={`form-control ${validationErrors.scope2Goal ? 'is-invalid' : ''}`}
                        placeholder="Target emissions in tCO₂e"
                        value={newGoal.scope2Goal}
                        onChange={(e) => handleGoalChange('scope2Goal', e.target.value)}
                        required={selectedScopes.scope2}
                      />
                      {validationErrors.scope2Goal ? (
                        <div className="invalid-feedback">{validationErrors.scope2Goal}</div>
                      ) : (
                        <small className="form-hint">
                          Your goal should be less than current emissions ({currentEmissions.scope2} tCO₂e)
                        </small>
                      )}
                    </div>
                  )}

                  {selectedScopes.scope3 && (
                    <div className="mb-3">
                      <label className="form-label">Scope 3 Goal (tCO₂e)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={currentEmissions.scope3 - 0.01}
                        className={`form-control ${validationErrors.scope3Goal ? 'is-invalid' : ''}`}
                        placeholder="Target emissions in tCO₂e"
                        value={newGoal.scope3Goal}
                        onChange={(e) => handleGoalChange('scope3Goal', e.target.value)}
                        required={selectedScopes.scope3}
                      />
                      {validationErrors.scope3Goal ? (
                        <div className="invalid-feedback">{validationErrors.scope3Goal}</div>
                      ) : (
                        <small className="form-hint">
                          Your goal should be less than current emissions ({currentEmissions.scope3} tCO₂e)
                        </small>
                      )}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Description (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe your reduction strategy"
                      value={newGoal.description}
                      onChange={(e) => handleGoalChange('description', e.target.value)}
                    ></textarea>
                  </div>

                  {(selectedScopes.scope1 || selectedScopes.scope2 || selectedScopes.scope3) && (
                    <div className="alert alert-info" role="alert">
                      <div className="d-flex">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 9h.01"></path>
                            <path d="M11 12h1v4h1"></path>
                            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="alert-title">Target Preview</h4>
                          <div className="text-muted">
                            Total goal: {calculateTotalGoal()} tCO₂e
                          </div>
                          <div className="text-muted">
                            Potential reduction: {calculatePotentialReduction().amount} tCO₂e ({calculatePotentialReduction().percentage}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-link link-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary ms-auto"
                    disabled={!(selectedScopes.scope1 || selectedScopes.scope2 || selectedScopes.scope3)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 5l0 14" />
                      <path d="M5 12l14 0" />
                    </svg>
                    Add Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditModal && editingGoal && (
        <div className="modal modal-blur show" style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Emission Reduction Goal</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateGoal}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Goal Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingGoal.name}
                      onChange={(e) => setEditingGoal({...editingGoal, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Target Year</label>
                    <input
                      type="number"
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 30}
                      className="form-control"
                      value={editingGoal.year}
                      onChange={(e) => setEditingGoal({...editingGoal, year: parseInt(e.target.value)})}
                      required
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">
                          Scope 1 Goal (tCO₂e)
                          <span className="form-label-description">
                            {editingGoal.scope1Goal > 0 && `${((1 - editingGoal.scope1Goal / currentEmissions.scope1) * 100).toFixed(1)}% reduction`}
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
                            if (value === 0 || value < currentEmissions.scope1) {
                              setEditingGoal({...editingGoal, scope1Goal: value});
                            }
                          }}
                        />
                        <small className={`form-hint ${editingGoal.scope1Goal >= currentEmissions.scope1 && editingGoal.scope1Goal > 0 ? 'text-danger' : ''}`}>
                          {editingGoal.scope1Goal >= currentEmissions.scope1 && editingGoal.scope1Goal > 0 
                            ? 'Goal must be less than current emissions' 
                            : 'Current emissions: ' + currentEmissions.scope1 + ' tCO₂e'}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">
                          Scope 2 Goal (tCO₂e)
                          <span className="form-label-description">
                            {editingGoal.scope2Goal > 0 && `${((1 - editingGoal.scope2Goal / currentEmissions.scope2) * 100).toFixed(1)}% reduction`}
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
                            if (value === 0 || value < currentEmissions.scope2) {
                              setEditingGoal({...editingGoal, scope2Goal: value});
                            }
                          }}
                        />
                        <small className={`form-hint ${editingGoal.scope2Goal >= currentEmissions.scope2 && editingGoal.scope2Goal > 0 ? 'text-danger' : ''}`}>
                          {editingGoal.scope2Goal >= currentEmissions.scope2 && editingGoal.scope2Goal > 0
                            ? 'Goal must be less than current emissions' 
                            : 'Current emissions: ' + currentEmissions.scope2 + ' tCO₂e'}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">
                          Scope 3 Goal (tCO₂e)
                          <span className="form-label-description">
                            {editingGoal.scope3Goal > 0 && `${((1 - editingGoal.scope3Goal / currentEmissions.scope3) * 100).toFixed(1)}% reduction`}
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
                            if (value === 0 || value < currentEmissions.scope3) {
                              setEditingGoal({...editingGoal, scope3Goal: value});
                            }
                          }}
                        />
                        <small className={`form-hint ${editingGoal.scope3Goal >= currentEmissions.scope3 && editingGoal.scope3Goal > 0 ? 'text-danger' : ''}`}>
                          {editingGoal.scope3Goal >= currentEmissions.scope3 && editingGoal.scope3Goal > 0
                            ? 'Goal must be less than current emissions' 
                            : 'Current emissions: ' + currentEmissions.scope3 + ' tCO₂e'}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editingGoal.description || ''}
                      onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="alert alert-info" role="alert">
                    <div className="d-flex">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M12 9h.01"></path>
                          <path d="M11 12h1v4h1"></path>
                          <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="alert-title">Target Preview</h4>
                        <div className="text-muted">
                          Total goal: {(
                            parseFloat(editingGoal.scope1Goal || 0) + 
                            parseFloat(editingGoal.scope2Goal || 0) + 
                            parseFloat(editingGoal.scope3Goal || 0)
                          ).toFixed(2)} tCO₂e
                        </div>
                        <div className="text-muted">
                          Potential reduction: {(
                            currentEmissions.total - (
                              parseFloat(editingGoal.scope1Goal || 0) + 
                              parseFloat(editingGoal.scope2Goal || 0) + 
                              parseFloat(editingGoal.scope3Goal || 0)
                            )
                          ).toFixed(2)} tCO₂e ({(
                            ((currentEmissions.total - (
                              parseFloat(editingGoal.scope1Goal || 0) + 
                              parseFloat(editingGoal.scope2Goal || 0) + 
                              parseFloat(editingGoal.scope3Goal || 0)
                            )) / currentEmissions.total) * 100
                          ).toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-link link-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary ms-auto"
                    disabled={
                      (editingGoal.scope1Goal >= currentEmissions.scope1 && editingGoal.scope1Goal > 0) ||
                      (editingGoal.scope2Goal >= currentEmissions.scope2 && editingGoal.scope2Goal > 0) ||
                      (editingGoal.scope3Goal >= currentEmissions.scope3 && editingGoal.scope3Goal > 0) ||
                      (editingGoal.scope1Goal <= 0 && editingGoal.scope2Goal <= 0 && editingGoal.scope3Goal <= 0)
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-floppy" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path>
                      <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                      <path d="M14 4l0 4l-6 0l0 -4"></path>
                    </svg>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;