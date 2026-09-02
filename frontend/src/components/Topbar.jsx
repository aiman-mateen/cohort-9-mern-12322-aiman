import { Bell, Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ searchQuery, onSearchChange, darkMode, onToggleTheme }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  
  return (
    <header className="topbar">
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search your notes..."
          aria-label="Search your notes"
        />
      </div>

      <div className="topbar-actions">

        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button type="button" className="icon-button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <button type="button" className="profile-button" onClick={() => navigate("/profile")}>
          <span className="profile-avatar">{userInitial}</span>
          <span className="profile-info">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">My workspace</span>
          </span>

          <ChevronDown className="profile-chevron" size={16} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;