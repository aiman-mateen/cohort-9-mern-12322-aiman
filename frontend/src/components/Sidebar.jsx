import { useNavigate } from "react-router-dom";
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

const Sidebar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          onClick={() => {
            setIsMobileMenuOpen(true);
          }}
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-section-title">Workspace</p>

          <button className="nav-item active">
            <LayoutDashboard className="nav-icon" size={18} />
            <span>Dashboard</span>
          </button>

          <button className="nav-item">
            <FileText className="nav-icon" size={18} />
            <span>All Notes</span>
          </button>

          <button className="nav-item">
            <Star className="nav-icon" size={18} />
            <span>Favorites</span>
          </button>

          <button className="nav-item">
            <Users className="nav-icon" size={18} />
            <span>Shared</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <Settings className="nav-icon" size={18} />
          <span>Settings</span>
        </button>

        <button className="nav-item logout" onClick={handleLogout}>
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
                className="mobile-menu-item active"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                className="mobile-menu-item"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText size={18} />
                <span>All Notes</span>
              </button>

              <button
                type="button"
                className="mobile-menu-item"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star size={18} />
                <span>Favorites</span>
              </button>

              <button
                type="button"
                className="mobile-menu-item"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users size={18} />
                <span>Shared</span>
              </button>

              <button
                type="button"
                className="mobile-menu-item"
                onClick={() => setIsMobileMenuOpen(false)}
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