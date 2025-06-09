"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";
import { IconBell, IconX, IconUser, IconBuilding } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

const Navbar = ({ user, isAdmin }) => {
  const router = useRouter();
  const [userNotifications, setUserNotifications] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(
    async (userId) => { 
      setLoading(true);

      try {
        // Fetch user notifications
        if (userId) {
          const userRes = await fetch(`http://localhost:4000/notifications/${userId}`, {
            credentials: "include",
          });
          const userData = await userRes.json();
          if (userData.success) {
            setUserNotifications(userData.data);
          } else {
            toast.error(userData.message || "Échec de la récupération des notifications utilisateur");
          }
        }

        // Fetch admin notifications
        if (isAdmin) {
          const adminRes = await fetch(`http://localhost:4000/admin/notifications`, {
            credentials: "include",
          });
          const adminData = await adminRes.json();
          if (adminData.success) {
            setAdminNotifications(adminData.data);
          } else {
            toast.error(adminData.message || "Échec de la récupération des notifications admin");
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Échec de la récupération des notifications");
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();

    try {
      const res = await fetch(`http://localhost:4000/notifications/${notificationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUserNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        setAdminNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        toast.success("Notification supprimée");
      } else {
        toast.error(data.message || "Échec de la suppression de la notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Échec de la suppression de la notification");
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();

    try {
      const res = await fetch(`http://localhost:4000/notifications/${notificationId}/read`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setUserNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, is_read: true } : n))
        );
        setAdminNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, is_read: true } : n))
        );
      } else {
        toast.error(data.message || "Échec de la mise à jour de la notification");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Échec de la mise à jour de la notification");
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

  const toggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications(user?._id);
    }
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    if (user?._id || isAdmin) {
      fetchNotifications(user?._id);

      // Refresh notifications every 30 seconds
      const intervalId = setInterval(() => {
        fetchNotifications(user?._id);
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [user, isAdmin, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationPanel = document.getElementById("notification-panel");
      const notificationButton = document.getElementById("notification-button");

      if (
        showNotifications &&
        notificationPanel &&
        !notificationPanel.contains(event.target) &&
        notificationButton &&
        !notificationButton.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const unreadUserCount = userNotifications.filter((n) => !n.is_read).length;
  const unreadAdminCount = adminNotifications.filter((n) => !n.is_read).length;
  const totalUnreadCount = unreadUserCount + unreadAdminCount;

  const allNotifications = [...userNotifications, ...adminNotifications];
  allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <nav className="position-sticky sticky-top navbar py-2 navbar-expand-lg" style={{ backgroundColor: "#8ebe21" }}>
      <div className="container-xl d-flex justify-content-end px-4">
        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <div className="position-relative">
            <div
              id="notification-button"
              className="d-flex align-items-center border rounded-pill p-1"
              style={{ cursor: "pointer", backgroundColor: "#ffffff30" }}
              onClick={toggleNotifications}
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
              {totalUnreadCount > 0 && (
                <span className="badge bg-white position-absolute top-0 end-0">
                  {totalUnreadCount}
                </span>
              )} 
            </div>

            {showNotifications && (
              <div
                id="notification-panel"
                className="position-absolute end-0 mt-2 p-3 bg-white border rounded shadow"
                style={{ width: "350px", zIndex: 1000, maxHeight: "500px", overflowY: "auto" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Notifications</h6>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => fetchNotifications(user?._id)}
                    disabled={loading}
                  >
                    {loading ? "Actualisation..." : "Actualiser"}
                  </button>
                </div>

                {allNotifications.length === 0 ? (
                  <p className="text-muted">Aucune notification</p>
                ) : (
                  allNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`d-flex align-items-start mb-2 p-2 border-bottom ${!notification.is_read ? "bg-light" : ""}`}
                      onClick={(e) => handleMarkAsRead(notification._id, e)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="flex-grow-1">
                        <p className="mb-1">{notification.message}</p>
                        {(notification.type === "admin_user_reminder" || notification.type === "admin_company_reminder") &&
                          notification.entity_id && (
                            <div>
                              <small className="text-muted">
                                <span className="d-inline-flex align-items-center me-1">
                                  {notification.entity_type === "Company" ? (
                                    <IconBuilding size={14} className="me-1" />
                                  ) : (
                                    <IconUser size={14} className="me-1" />
                                  )}
                                </span>
                                {notification.entity_type === "Company"
                                  ? `Entreprise: ${notification.entity_id.nom_entreprise}`
                                  : `Utilisateur: ${notification.entity_id.prenom} ${notification.entity_id.nom}`}
                              </small>
                              <small className="d-block text-muted">
                                Statut: {notification.entity_id.isVerified ? "Vérifié" : "Non vérifié"}
                              </small>
                            </div>
                          )}
                        <small className="text-muted d-block">
                          {new Date(notification.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-icon btn-ghost-secondary"
                        onClick={(e) => handleDeleteNotification(notification._id, e)}
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
                <span style={{ color: "#8ebe21" }}>
                  {getInitials(user?.prenom, user?.nom)}
                </span>
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