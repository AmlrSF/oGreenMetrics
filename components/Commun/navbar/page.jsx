"use client";

import React, { useState, useEffect } from "react";
import { getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";
import { IconBell, IconX, IconUser, IconBuilding } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

const Navbar = ({ user, isAdmin }) => {
  const router = useRouter();
  const [userNotifications, setUserNotifications] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async (userId) => {
    try {
      // Récupérer les notifications utilisateur
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

      // Récupérer les notifications admin
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
        // Mettre à jour les deux listes de notifications
        setUserNotifications(userNotifications.filter((n) => n._id !== notificationId));
        setAdminNotifications(adminNotifications.filter((n) => n._id !== notificationId));
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
    if (user?._id || isAdmin) {
      fetchNotifications(user?._id);
      const intervalId = setInterval(() => {
        fetchNotifications(user?._id);
      }, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [user, isAdmin]);

  // Compter les notifications non lues
  const unreadUserCount = userNotifications.filter((n) => !n.is_read).length;
  const unreadAdminCount = adminNotifications.filter((n) => !n.is_read).length;
  const totalUnreadCount = unreadUserCount + unreadAdminCount;

  // Combiner toutes les notifications
  const allNotifications = [...userNotifications, ...adminNotifications];
  
  // Trier par date (les plus récentes en premier)
  allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
              {totalUnreadCount > 0 && (
                <span className="badge bg-red-500 position-absolute top-0 end-0">
                  {totalUnreadCount}
                </span>
              )}
              <span className="d-none d-sm-inline-block text-white fw-medium ms-2 pe-2">
                Notifications
              </span>
            </div>
            {showNotifications && (
              <div
                className="position-absolute end-0 mt-2 p-3 bg-white border rounded shadow"
                style={{ width: "350px", zIndex: 1000, maxHeight: "500px", overflowY: "auto" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Notifications</h6>
                 </div>
                
                {allNotifications.length === 0 ? (
                  <p className="text-muted">Aucune notification</p>
                ) : (
                  allNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`d-flex align-items-start mb-2 p-2 border-bottom ${!notification.is_read ? 'bg-light' : ''}`}
                    >
                      <div className="flex-grow-1">
                        <p className="mb-1">{notification.message}</p>
                        {(notification.type === 'admin_user_reminder' || notification.type === 'admin_company_reminder') && notification.entity_id && (
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
                            minute: "2-digit"
                          })}
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