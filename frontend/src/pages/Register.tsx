import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import { ShoppingBag, UserPlus, ArrowRight, Eye, EyeOff } from "lucide-react";
import { getErrorMessage } from "../utils/errorMessage";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register({ email, password, fullName });
      navigate("/login", { state: { registered: true } });
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Registration failed. Email may already be in use."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo auth-brand">
            <ShoppingBag size={32} />
            <span>NovaCart</span>
          </div>
          <h1>Create your account</h1>
          <p>
            Create your account to unlock instant checkout and order tracking.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <Input
              id="fullName"
              type="text"
              placeholder="e.g. Akshitha Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              aria-label="Full name"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span className="field-hint">(min 6 characters)</span></label>
            <div className="password-field">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
                autoComplete="new-password"
                className="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="auth-submit"
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
          </Button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">
            Sign In <ArrowRight size={14} style={{ display: "inline" }} />
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
