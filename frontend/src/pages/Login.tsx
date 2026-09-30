import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../utils/errorMessage";
import { ShoppingBag, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login({ email, password });
      navigate("/products");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Invalid email or password."));
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
          <h1>Welcome back</h1>
          <p>
            Sign in to access your cart, orders, and saved addresses.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
                autoComplete="current-password"
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
            <LogIn size={18} />
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </Button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account <ArrowRight size={14} style={{ display: "inline" }} />
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
