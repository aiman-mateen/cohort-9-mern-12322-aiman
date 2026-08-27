import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Star,
  Users,
  Settings,
  LogOut,
  Menu,
  PenLine,
} from "lucide-react";

const Sidebar = ({ activeTab, onTabChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
      if (tab === "dashboard") {
          navigate("/dashboard");
        } else if (tab === "all") {
          navigate("/dashboard/all");
        } else if (tab === "favorites") {
          navigate("/dashboard/favorites");
        } else if (tab === "shared") {
          navigate("/dashboard/shared");
        } else if (tab === "settings") {
          navigate("/dashboard/settings");
        }  
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">
          <PenLine size={19} />
        </span>

        <span>Jot</span>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Open navigation menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-section-title">Workspace</p>

          <button
            type="button"
            className={`nav-item ${
              currentPath === "/dashboard" ? "active" : ""
            }`}
            onClick={() => handleTabChange("dashboard")}
          >
            <LayoutDashboard className="nav-icon" size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              currentPath === "/dashboard/all" ? "active" : ""
            }`}
            onClick={() => handleTabChange("all")}
          >
            <FileText className="nav-icon" size={18} />
            <span>All Notes</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              currentPath === "/dashboard/favorites" ? "active" : ""
            }`}
            onClick={() => handleTabChange("favorites")}
          >
            <Star className="nav-icon" size={18} />
            <span>Favorites</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              currentPath === "/dashboard/shared" ? "active" : ""
            }`}
            onClick={() => handleTabChange("shared")}
          >
            <Users className="nav-icon" size={18} />
            <span>Shared</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className={`nav-item ${
            currentPath === "/dashboard/settings" ? "active" : ""
          }`}
          onClick={() => handleTabChange("settings")}
        >
          <Settings className="nav-icon" size={18} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="nav-item logout"
          onClick={handleLogout}
        >
          <LogOut className="nav-icon" size={18} />
          <span>Logout</span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="mobile-menu-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span>Menu</span>

              <button
                type="button"
                className="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                ×
              </button>
            </div>

            <nav className="mobile-menu-nav">
              <button
                type="button"
                className={`mobile-menu-item ${
                  activeTab === "dashboard" ? "active" : ""
                }`}
                onClick={() => handleTabChange("dashboard")}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                className={`mobile-menu-item ${
                  activeTab === "all" ? "active" : ""
                }`}
                onClick={() => handleTabChange("all")}
              >
                <FileText size={18} />
                <span>All Notes</span>
              </button>

              <button
                type="button"
                className={`mobile-menu-item ${
                  activeTab === "favorites" ? "active" : ""
                }`}
                onClick={() => handleTabChange("favorites")}
              >
                <Star size={18} />
                <span>Favorites</span>
              </button>

              <button
                type="button"
                className={`mobile-menu-item ${
                  activeTab === "shared" ? "active" : ""
                }`}
                onClick={() => handleTabChange("shared")}
              >
                <Users size={18} />
                <span>Shared</span>
              </button>

              <button
                type="button"
                className={`mobile-menu-item ${
                  activeTab === "settings" ? "active" : ""
                }`}
                onClick={() => handleTabChange("settings")}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>

              <button
                type="button"
                className="mobile-menu-item logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;