import { Eye, EyeOff, LockKeyhole, Mail, Pencil } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setIsLoading(true);

  try {
    const data = await loginUser({
      email: email.trim(),
      password,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">
            <Pencil size={18} />
          </span>
          <span>Jot</span>
        </div>

        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your workspace.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <div className="input-wrapper">
              <Mail size={17} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

              
              <div className="input-wrapper password-wrapper">
            <LockKeyhole size={17} />

            <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
            </div>
            </div>

          {error && (
            <p className="field-error auth-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="auth-submit">
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <a href="/register">Create one</a>
        </p>
      </section>
    </main>
  );
};

export default Login;