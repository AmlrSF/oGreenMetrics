"use client";

import React, { useState, useEffect } from "react";
import { getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";
import { IconBell, IconX } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

const Navbar = ({ user, isAdmin }) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const handleDeleteNotification = async (notificationId) => {
    try {
      const res = await fetch(`http://localhost:4000/notifications/${notificationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.filter((n) => n._id !== notificationId));
        toast.success("Notification supprimée");
      } else {
        toast.error(data.message || "Échec de la suppression de la notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Échec de la suppression de la notification");
    }
  };

  const handleNavigation = () => {
    switch (user?.role) {
      case "Admin":
        router.push("/Dashboard/Admin/profile");
        break;
      case "entreprise":
        router.push("/Dashboard/User/profile");
        break;
      case "régulier":
        router.push("/Dashboard/Regular/profile");
        break;
      default:
        console.warn("Unknown role:", user?.role);
        router.push("/");
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications(user._id);
      // Poll for new notifications every 5 minutes
      const intervalId = setInterval(() => {
        fetchNotifications(user._id);
      }, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <nav
      className="position-sticky sticky-top navbar py-2 navbar-expand-lg"
      style={{ backgroundColor: "#8ebe21" }}
    >
      <div className="container-xl d-flex justify-content-end px-4">
        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <div className="position-relative">
            <div
              className="d-flex align-items-center border rounded-pill p-1"
              style={{ cursor: "pointer", backgroundColor: "#ffffff30" }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#fff",
                }}
              >
                <IconBell size={18} style={{ color: "#8ebe21" }} />
              </div>
              {unreadCount > 0 && (
                <span className="badge bg-danger position-absolute top-0 end-0">
                  {unreadCount}
                </span>
              )}
              <span className="d-none d-sm-inline-block text-white fw-medium ms-2 pe-2">
                Notifications
              </span>
            </div>
            {showNotifications && (
              <div
                className="position-absolute end-0 mt-2 p-3 bg-white border rounded shadow"
                style={{ width: "300px", zIndex: 1000 }}
              >
                <h6 className="mb-3">Notifications</h6>
                {notifications.length === 0 ? (
                  <p className="text-muted">Aucune notification</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="d-flex align-items-start mb-2 p-2 border-bottom"
                    >
                      <div className="flex-grow-1">
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">
                          {new Date(notification.createdAt).toLocaleDateString("fr-FR")}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-icon btn-ghost-secondary"
                        onClick={() => handleDeleteNotification(notification._id)}
                      >
                        <IconX size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div
            onClick={handleNavigation}
            className="d-flex align-items-center border rounded-pill p-1"
            style={{ cursor: "pointer", backgroundColor: "#ffffff30" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              {user?.photo_de_profil ? (
                <img
                  src={user?.photo_de_profil}
                  alt={`${user?.prenom} ${user?.nom}`}
                  className="rounded-circle"
                  style={{
                    width: "25px",
                    height: "25px",
                  }}
                />
              ) : (
                <span style={{ color: "#8ebe21" }}>{getInitials(user?.prenom, user?.nom)}</span>
              )}
            </div>
            <span className="d-none d-sm-inline-block text-white fw-medium ms-2 pe-2">
              {user?.prenom} {user?.nom}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;