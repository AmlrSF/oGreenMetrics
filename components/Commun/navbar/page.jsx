"use client";
import React, { useState, useEffect } from "react";
import { IconBell } from "@tabler/icons-react"; 
import { getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/components/Commun/context/NotificationContext";

const Navbar = ({ user, isAdmin }) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, markAsRead, markAllRead } = useNotifications();
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  
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

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllRead = () => {
    markAllRead();
    setShowNotifications(false);  
  };

  return (
    <nav className="position-sticky sticky-top navbar  py-2 navbar-expand-lg" style={{ backgroundColor: "#8ebe21" }}>
      <div className="container-xl d-flex justify-content-end px-4">
        <div className="d-flex align-items-center gap-3">
          {/* Notification bell */}
          <div className="position-relative">
            <button
              className="btn position-relative"
              style={{ border: "none", background: "none" }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <IconBell size={20} className="text-white" />
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div
                className="position-absolute end-0 mt-2 shadow-lg rounded-3 bg-white"
                style={{ width: "320px", zIndex: 1000, maxHeight: "400px", overflowY: "auto" }}
              >
                <div className="p-2 border-bottom d-flex justify-content-between align-items-center">
                  <h6 className="m-0">Notifications</h6>
                  {unreadCount > 0 && (
                    <button
                      className="btn btn-sm btn-link text-decoration-none"
                      onClick={handleMarkAllRead}
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>
                <div>
                  {notifications.length === 0 ? (
                    <div className="p-3 text-center text-muted">Aucune notification</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-bottom notification-item ${
                          !notification.read ? "bg-light" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleMarkAsRead(notification.id)}>
                        <div className="d-flex">
                          </div>
                          <div>
                            <div className="fw-semibold">{notification.title}</div>
                            <div className="text-muted small">{notification.message}</div>
                            <div className="text-muted small mt-1">{notification.time}</div>
                          </div>
                        </div>
                 
                    ))
                  )}
                </div>
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
                    height: "25px",}}
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