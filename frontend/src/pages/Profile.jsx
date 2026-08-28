import "../App.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Eye, EyeOff} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Toast from "../components/Toast";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [originalName, setOriginalName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [passwordErrors, setPasswordErrors] = useState({
  current: "",
  new: "",
  confirm: "",
});

  const hasProfileChanges = name.trim() !== originalName;

const isPasswordFormFilled =
  currentPassword.trim() !== "" &&
  newPassword.trim() !== "" &&
  confirmPassword.trim() !== "";


  useEffect(() => {
  document.documentElement.setAttribute(
    "data-theme",
    darkMode ? "dark" : "light"
  );

  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
        setName(data.user.name);
        setOriginalName(data.user.name);
        setEmail(data.user.email);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError("");

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(
        "http://localhost:5000/api/auth/profile-image",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload profile image");
      }

      setUser(data.user);

      localStorage.setItem("user", JSON.stringify(data.user));

      setToast({
        type: "success",
        message: "Profile image updated successfully",
      });
    } catch (error) {
      setError(error.message);

      setToast({
        type: "error",
        message: error.message,
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!name.trim()) {
    setError("Name is required.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    setIsSaving(true);
    setError("");

    const response = await fetch(
      "http://localhost:5000/api/auth/profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update profile"
      );
    }

    setUser(data.user);
    setName(data.user.name);
    setOriginalName(data.user.name);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setToast({
      type: "success",
      message: "Profile updated successfully",
    });
  } catch (error) {
    setError(error.message);

    setToast({
      type: "error",
      message: error.message,
    });
  } finally {
    setIsSaving(false);
  }
};
 const handlePasswordChange = async (event) => {
  event.preventDefault();

  const errors = {
    current: "",
    new: "",
    confirm: "",
  };

  if (!currentPassword.trim()) {
    errors.current = "Current password is required.";
  }

  if (!newPassword.trim()) {
    errors.new = "New password is required.";
  } else if (newPassword.length < 6) {
    errors.new = "Password must be at least 6 characters.";
  }

  if (!confirmPassword.trim()) {
    errors.confirm = "Please confirm your new password.";
  } else if (newPassword !== confirmPassword) {
    errors.confirm = "Passwords do not match.";
  }

  setPasswordErrors(errors);

  if (errors.current || errors.new || errors.confirm) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    setIsChangingPassword(true);

    const response = await fetch(
      "http://localhost:5000/api/auth/password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.message === "Current password is incorrect") {
        setPasswordErrors({
          current: "Current password is incorrect.",
          new: "",
          confirm: "",
        });
      } else {
        setPasswordErrors({
          current: "",
          new: data.message || "Failed to update password.",
          confirm: "",
        });
      }

      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordErrors({
      current: "",
      new: "",
      confirm: "",
    });

    setToast({
      type: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    setPasswordErrors({
      current: "Unable to update password. Please try again.",
      new: "",
      confirm: "",
    });
  } finally {
    setIsChangingPassword(false);
  }
};



  if (isLoading) {
    return (
      <div className="app">
        <Sidebar onTabChange={() => {}} />

        <main className="main-content">
          <Topbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode((prev) => !prev)}
          />
          <section className="profile-page">
            <p>Loading profile...</p>
          </section>
        </main>
      </div>
    );
  }
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((prev) => !prev)}
        />

        <section className="profile-page">
          <div className="profile-page-header">
            <p className="dashboard-eyebrow">Account</p>
            <h1>My Profile</h1>
            <p className="dashboard-subtitle">
              Manage your account information.
            </p>
          </div>

          {/* {error && (
            <div className="notes-state">
              <p>{error}</p>
            </div>
          )} */}

          {user && (
          <>
            <div className="profile-card">
              <div className="profile-avatar-large">
                {user.profileImage ? (
                  <img
                    src={`http://localhost:5000${user.profileImage}`}
                    alt="Profile"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>

              <label className="profile-image-upload">
                Change Photo
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                />
              </label>

              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="profile-name">Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-email">Email</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    readOnly
                  />
                </div>

                <div className="profile-actions">
                  <button
                    type="button"
                    className="modal-cancel"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="modal-create"
                    disabled={isSaving || !hasProfileChanges}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            <div className="profile-card password-card">
              <div className="profile-page-header">
                <p className="dashboard-eyebrow">Security</p>
                <h2>Change Password</h2>
                <p className="dashboard-subtitle">
                  Update your password to keep your account secure.
                </p>
              </div>

              <form
                className="profile-form"
                onSubmit={handlePasswordChange}
              >
                <div className="form-group">
                  <label htmlFor="current-password">
                    Current Password
                  </label>

                 <div className="password-input-wrapper">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {passwordErrors.current && (
                    <p className="field-error">
                      {passwordErrors.current}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="new-password">
                    New Password
                  </label>

                 <div className="password-input-wrapper">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setPasswordErrors((prev) => ({
                          ...prev, new: "",
                        }));
                      }
                      }
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {passwordErrors.new && (
                    <p className="field-error">
                      {passwordErrors.new}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">
                    Confirm New Password
                  </label>

                  <div className="password-input-wrapper">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => 
                        {
                          setConfirmPassword(event.target.value);
                          setPasswordErrors((prev)=> ({
                            ...prev, confirm: "",
                          }));
                        
                        }}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {passwordErrors.confirm && (
                    <p className="field-error">
                      {passwordErrors.confirm}
                    </p>
                  )}
                </div>

                <div className="profile-actions">
                  <button
                    type="submit"
                    className="modal-create"
                    disabled={
                      isChangingPassword ||
                      !currentPassword.trim() ||
                      !newPassword.trim() ||
                      !confirmPassword.trim()
                    }
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
        </section>
      </main>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Profile;

