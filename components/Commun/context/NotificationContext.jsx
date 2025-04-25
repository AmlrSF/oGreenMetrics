"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";

const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  markAsRead: () => {},
  markAllRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage when the component mounts
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      setNotifications(storedNotifications);
    } catch (error) {
      console.error("Error loading notifications from localStorage:", error);
      // Reset localStorage if there's an error
      localStorage.setItem('notifications', JSON.stringify([]));
    }
  }, []);

  // Add notification function
  const addNotification = (notification) => {
    // Check if this is an achievement notification and if we already have one for this goal
    if (notification.type === 'achievement' && notification.goalId) {
      // Check if we already have a notification for this goal
      const existingNotification = notifications.find(
        n => n.type === 'achievement' && n.goalId === notification.goalId
      );
      
      if (existingNotification) {
        // We already notified about this goal achievement
        return;
      }
    }
    
    const newNotification = {
      id: Date.now().toString(),
      read: false,
      time: new Date().toLocaleString(),
      ...notification,
    };

    setNotifications((prev) => {
      const updatedNotifications = [newNotification, ...prev];
      // Safely update localStorage
      try {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error("Error saving notifications to localStorage:", error);
      }
      return updatedNotifications;
    });

    // Make the toast dismissable
    toast.success(notification.message, {
      duration: 5000,
      dismissible: true,
    });
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      // Update localStorage safely
      try {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error("Error updating notifications in localStorage:", error);
      }
      return updatedNotifications;
    });
  };

  // Mark all notifications as read
  const markAllRead = () => {
    setNotifications((prev) => {
      const updatedNotifications = prev.map((notif) => ({ ...notif, read: true }));
      // Update localStorage safely
      try {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error("Error updating all notifications in localStorage:", error);
      }
      return updatedNotifications;
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;