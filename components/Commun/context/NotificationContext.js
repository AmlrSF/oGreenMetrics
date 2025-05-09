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
  const [userId, setUserId] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const authRes = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const authData = await authRes.json();
        if (authData?.user?._id) {
          setUserId(authData.user._id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Load notifications from localStorage once userId is available
  useEffect(() => {
    if (!userId) return;

    const storageKey = `notifications_${userId}`;
    try {
      const storedNotifications = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setNotifications(storedNotifications);
    } catch (error) {
      console.error("Error loading notifications from localStorage:", error);
      localStorage.setItem(storageKey, JSON.stringify([]));
    }
  }, [userId]);

  // Add new notification
  const addNotification = (notification) => {
    if (!userId) {
      console.warn("Tried to add notification before userId was loaded");
      return;
    }

    const storageKey = `notifications_${userId}`;

    // Avoid duplicate achievement notifications
    if (notification.type === "achievement" && notification.goalId) {
      const exists = notifications.some(
        (n) => n.type === "achievement" && n.goalId === notification.goalId
      );
      if (exists) return;
    }

    const newNotification = {
      id: Date.now().toString(),
      read: false,
      time: new Date().toLocaleString(),
      ...notification,
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving notifications:", error);
      }
      return updated;
    });

    toast.success(notification.message, {
      duration: 5000,
      dismissible: true,
    });
  };

  // Mark one notification as read
  const markAsRead = (id) => {
    if (!userId) return;
    const storageKey = `notifications_${userId}`;

    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error("Error updating notification:", error);
      }
      return updated;
    });
  };

  // Mark all as read
  const markAllRead = () => {
    if (!userId) return;
    const storageKey = `notifications_${userId}`;

    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error("Error updating all notifications:", error);
      }
      return updated;
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
