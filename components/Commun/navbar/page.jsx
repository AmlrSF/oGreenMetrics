import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { getInitials } from "@/lib/Utils";
import { useRouter } from "next/navigation";

const Navbar = ({ user, isAdmin, notifications = [] }) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavigation = () => {
    router.push(`/Dashboard/${isAdmin ? 'Admin' : 'User'}/profile`);
  };

  const markAsRead = (id) => {
    // This would ideally call an API to mark notification as read
    if (notifications.onMarkRead) {
      notifications.onMarkRead(id);
    }
  };

  return (
    <nav
      className="navbar py-2 navbar-expand-lg"
      style={{ backgroundColor: "#8ebe21" }}
    >
      <div className="container-xl d-flex justify-content-end px-4">
        <div className="d-flex align-items-center gap-3">
          {/* Notification bell */}
          <div className="position-relative">
            <button
              className="btn position-relative"
              style={{ border: "none", background: "none" }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} className="text-white" />
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notification dropdown */}
            {showNotifications && (
              <div className="position-absolute end-0 mt-2 shadow-lg rounded-3 bg-white" 
                   style={{ width: "320px", zIndex: 1000, maxHeight: "400px", overflowY: "auto" }}>
                <div className="p-2 border-bottom d-flex justify-content-between align-items-center">
                  <h6 className="m-0">Notifications</h6>
                  {unreadCount > 0 && (
                    <button className="btn btn-sm btn-link text-decoration-none" 
                            onClick={() => notifications.markAllRead && notifications.markAllRead()}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div>
                  {notifications.length === 0 ? (
                    <div className="p-3 text-center text-muted">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <div key={notification.id || index} 
                           className={`p-3 border-bottom notification-item ${!notification.read ? 'bg-light' : ''}`}
                           onClick={() => markAsRead(notification.id)}>
                        <div className="d-flex">
                          <div className={`me-3 rounded-circle p-2 d-flex align-items-center justify-content-center ${notification.type === 'achievement' ? 'bg-success bg-opacity-10' : 'bg-primary bg-opacity-10'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={notification.type === 'achievement' ? 'text-success' : 'text-primary'}>
                              {notification.type === 'achievement' ? (
                                <><path d="M8 21h8"></path><path d="M12 21v-8.5"></path><path d="M8.5 2.5a4 4 0 0 1 7 0 4 4 0 0 0 2 3.5 4 4 0 0 1 0 6 4 4 0 0 0-2 3.5 4 4 0 0 1-7 0 4 4 0 0 0-2-3.5 4 4 0 0 1 0-6 4 4 0 0 0 2-3.5"></path><path d="M12 12l-1-2 1-2 1 2-1 2"></path></>
                              ) : (
                                <><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></>
                              )}
                            </svg>
                          </div>
                          <div>
                            <div className="fw-semibold">{notification.title}</div>
                            <div className="text-muted small">{notification.message}</div>
                            <div className="text-muted small mt-1">{notification.time}</div>
                          </div>
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
                width: "25px",
                height: "25px",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              {user?.photo_de_profil ? (
                <img
                  src={user?.photo_de_profil}
                  alt={`${user?.prenom} ${user?.nom}`}
                  className="rounded-circle w-[50px] h-[50px]"
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