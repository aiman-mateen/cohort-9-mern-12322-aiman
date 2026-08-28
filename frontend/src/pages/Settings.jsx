import "../App.css";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import Topbar from "../components/Topbar";

const Settings = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newValue = !prev;

      localStorage.setItem("theme", newValue ? "dark" : "light");

      document.documentElement.setAttribute(
        "data-theme",
        newValue ? "dark" : "light"
      );

      return newValue;
    });
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />

        <section className="dashboard">
          <div className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">Preferences</p>

              <h1>Settings</h1>

              <p className="dashboard-subtitle">
                Manage your account and application preferences.
              </p>
            </div>
          </div>


          <div className="profile-card">
            <div className="profile-page-header">
              <p className="dashboard-eyebrow">Account</p>

              <h2>Profile</h2>

              <p className="dashboard-subtitle">
                Manage your personal information and password.
              </p>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="modal-create"
                onClick={() => navigate("/profile")}
              >
                Manage Profile
              </button>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-page-header">
              <p className="dashboard-eyebrow">Appearance</p>

              <h2>Theme</h2>

              <p className="dashboard-subtitle">
                Choose between light and dark mode.
              </p>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="modal-create"
                onClick={toggleTheme}
              >
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>        
          </div>

          <div className="profile-card">
  <div className="profile-page-header">
    <p className="dashboard-eyebrow">Session</p>

    <h2>Logout</h2>

    <p className="dashboard-subtitle">
      Sign out of your Jot account on this device.
    </p>
  </div>

  <div className="profile-actions">
    <button
      type="button"
      className="modal-cancel"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }}
    >
      Logout
    </button>
  </div>
</div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
