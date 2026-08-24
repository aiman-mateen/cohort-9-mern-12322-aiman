import { Bell, Search, ChevronDown } from "lucide-react";

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search className="search-icon" size={18} />

        <input
          type="text"
          placeholder="Search your notes..."
          aria-label="Search your notes"
        />
      </div>

      <div className="topbar-actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <button className="profile-button">
          <span className="profile-avatar">A</span>

          <span className="profile-info">
            <span className="profile-name">Aiman</span>
            <span className="profile-role">My workspace</span>
          </span>

          <ChevronDown className="profile-chevron" size={16} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;