import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Show error if Google OAuth failed
  useEffect(() => {
    if (searchParams.get("error") === "google_failed") {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        toast.success("Welcome back!");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const gold = "hsl(44, 55%, 54%)";

  return (
    <>
      <style>{`
        /* ── Animations ── */
        @keyframes ag-spin   { to { transform: rotate(360deg); } }
        @keyframes ag-fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ag-slideIn { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }

        /* ── Layout ── */
        .ag-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Lato', sans-serif;
          background-color: hsl(37, 47%, 96%);
        }

        /* ── Left panel — hidden on mobile, shown on md+ ── */
        .ag-panel {
          display: none;
          flex: 0 0 42%;
          position: relative;
          background: linear-gradient(155deg, hsl(35,25%,13%) 0%, hsl(30,20%,18%) 60%, hsl(35,15%,22%) 100%);
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .ag-panel { display: flex; }
        }
        .ag-panel-overlay {
          position: absolute; inset: 0;
          background-image: radial-gradient(ellipse at 30% 70%, hsla(44,55%,54%,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .ag-panel-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; justify-content: center;
          padding: 4rem 3.5rem;
          animation: ag-slideIn 0.7s ease both;
        }
        .ag-logo-mark {
          width: 64px; height: 64px; border-radius: 50%;
          border: 1.5px solid hsl(44,55%,54%);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 2.5rem;
        }
        .ag-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 500;
          color: hsl(44,55%,54%); letter-spacing: 0.08em;
        }
        .ag-panel-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem; font-weight: 400;
          color: hsl(40,20%,90%); line-height: 1.25; margin-bottom: 1rem;
        }
        .ag-panel-sub {
          font-size: 0.875rem; color: hsl(36,10%,62%);
          line-height: 1.8; max-width: 280px; margin-bottom: 2rem;
        }
        .ag-panel-divider {
          width: 40px; height: 1px;
          background: hsl(44,55%,54%); opacity: 0.6; margin-bottom: 2rem;
        }
        .ag-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.9rem; }
        .ag-feature-item {
          font-size: 0.825rem; color: hsl(36,10%,68%);
          display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.03em;
        }
        .ag-check-icon { color: hsl(44,55%,54%); font-size: 0.6rem; }

        /* ── Right / form panel ── */
        .ag-form-panel {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 5rem 1.5rem 2rem; /* top pad handles navbar on mobile */
        }
        @media (min-width: 768px) {
          .ag-form-panel { padding: 2rem 2.5rem; }
        }

        /* ── Card ── */
        .ag-card {
          width: 100%; max-width: 420px;
          animation: ag-fadeUp 0.55s ease both;
        }

        .ag-card-header { margin-bottom: 2.25rem; }
        .ag-gold-line {
          width: 32px; height: 2px; background: hsl(44,55%,54%);
          margin-bottom: 1.25rem; border-radius: 2px;
        }
        .ag-eyebrow {
          font-size: 0.7rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: hsl(44,55%,54%); margin-bottom: 0.5rem;
        }
        .ag-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 5vw, 2.4rem);
          font-weight: 500; color: hsl(35,25%,13%);
          line-height: 1.1; margin-bottom: 0.5rem;
        }
        .ag-subheading {
          font-size: 0.875rem; color: hsl(30,8%,46%); line-height: 1.6;
        }

        /* ── Form ── */
        .ag-form { display: flex; flex-direction: column; gap: 1.75rem; }

        .ag-field-wrap { position: relative; padding-top: 1.25rem; }

        .ag-label {
          position: absolute; top: 1.35rem; left: 0;
          font-size: 0.85rem; transform-origin: left top;
          transition: transform 0.2s ease, color 0.2s ease;
          pointer-events: none; letter-spacing: 0.02em;
          color: hsl(30,8%,46%);
        }
        .ag-label.active { transform: translateY(-22px) scale(0.8); }

        .ag-input {
          width: 100%; background: transparent;
          border: none; border-bottom: 1.5px solid hsl(36,18%,78%);
          outline: none; padding: 0.5rem 0;
          font-size: 0.925rem; color: hsl(35,25%,13%);
          font-family: 'Lato', sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }
        .ag-input.focused {
          border-bottom-color: hsl(44,55%,54%);
          box-shadow: 0 1px 0 0 hsl(44,55%,54%);
        }

        .ag-eye-btn {
          position: absolute; right: 0; top: 1.5rem;
          background: none; border: none; cursor: pointer;
          padding: 0.25rem; color: hsl(30,8%,58%);
          display: flex; align-items: center;
        }

        .ag-forgot-row { display: flex; justify-content: flex-end; margin-top: -0.75rem; }
        .ag-forgot-link {
          font-size: 0.78rem; color: hsl(30,8%,50%); text-decoration: none;
          letter-spacing: 0.02em; transition: color 0.2s;
        }
        .ag-forgot-link:hover { color: hsl(44,55%,54%); }

        /* ── Primary button ── */
        .ag-primary-btn {
          width: 100%; padding: 0.875rem 1.5rem;
          background: hsl(35,25%,13%); color: hsl(40,20%,93%);
          border: none; border-radius: 2px;
          font-family: 'Lato', sans-serif; font-size: 0.8rem;
          font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; cursor: pointer;
          transition: background 0.25s ease, transform 0.15s ease;
          margin-top: 0.25rem;
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
        }
        .ag-primary-btn:hover:not(:disabled) { background: hsl(35,25%,20%); }
        .ag-primary-btn:active:not(:disabled) { transform: scale(0.98); }
        .ag-primary-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .ag-spinner {
          width: 14px; height: 14px;
          border: 2px solid hsla(40,20%,93%,0.3);
          border-top-color: hsl(40,20%,93%);
          border-radius: 50%;
          animation: ag-spin 0.7s linear infinite;
          display: inline-block; flex-shrink: 0;
        }

        /* ── Divider ── */
        .ag-divider {
          display: flex; align-items: center; gap: 1rem; margin: 0.1rem 0;
        }
        .ag-divider-line { flex: 1; height: 1px; background: hsl(36,18%,85%); }
        .ag-divider-text {
          font-size: 0.72rem; color: hsl(30,8%,55%);
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        /* ── Google button ── */
        .ag-google-btn {
          width: 100%; padding: 0.8rem 1.5rem;
          background: transparent; border: 1px solid hsl(36,18%,82%);
          border-radius: 2px; font-family: 'Lato', sans-serif;
          font-size: 0.82rem; color: hsl(35,25%,20%);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          letter-spacing: 0.04em;
          transition: border-color 0.2s, color 0.2s;
        }
        .ag-google-btn:hover { border-color: hsl(44,55%,54%); color: hsl(44,55%,54%); }

        /* ── Switch text ── */
        .ag-switch-text {
          margin-top: 2rem; font-size: 0.8rem;
          color: hsl(30,8%,52%); text-align: center;
        }
        .ag-switch-link {
          color: hsl(44,55%,54%); text-decoration: none;
          font-weight: 600; letter-spacing: 0.02em;
        }
        .ag-switch-link:hover { text-decoration: underline; }

        /* ── Mobile branding bar (shown instead of left panel) ── */
        .ag-mobile-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }
        @media (min-width: 768px) {
          .ag-mobile-brand { display: none; }
        }
        .ag-mobile-logo {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1.5px solid hsl(44,55%,54%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ag-mobile-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 500;
          color: hsl(44,55%,54%); letter-spacing: 0.08em;
        }
        .ag-mobile-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; color: hsl(35,25%,13%); font-weight: 500;
        }
      `}</style>

      <div className="ag-page">
        {/* ── Left decorative panel (tablet/desktop only) ── */}
        <div className="ag-panel">
          <div className="ag-panel-overlay" />
          <div className="ag-panel-content">
            <div className="ag-logo-mark">
              <span className="ag-logo-text">AG</span>
            </div>
            <h2 className="ag-panel-heading">Woven with<br />Heritage &amp; Grace</h2>
            <p className="ag-panel-sub">
              The finest Pashmina crafts, curated for the discerning few.
            </p>
            <div className="ag-panel-divider" />
            <ul className="ag-feature-list">
              {["Exclusive collections", "Worldwide free shipping", "Certified authentic Pashmina"].map((f) => (
                <li key={f} className="ag-feature-item">
                  <span className="ag-check-icon">✦</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right / form panel ── */}
        <div className="ag-form-panel">
          <div className="ag-card">

            {/* Mobile-only brand bar */}
            <div className="ag-mobile-brand">
              <div className="ag-mobile-logo">
                <span className="ag-mobile-logo-text">AG</span>
              </div>
              <span className="ag-mobile-brand-name">AG Pashmina</span>
            </div>

            {/* Header */}
            <div className="ag-card-header">
              <div className="ag-gold-line" />
              <p className="ag-eyebrow">AG Pashmina</p>
              <h1 className="ag-heading">Welcome Back</h1>
              <p className="ag-subheading">Sign in to your account to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="ag-form">

              {/* Email */}
              <div className="ag-field-wrap">
                <label className={`ag-label${email || focused === "email" ? " active" : ""}`}
                  style={{ color: focused === "email" ? gold : undefined }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                  className={`ag-input${focused === "email" ? " focused" : ""}`}
                />
              </div>

              {/* Password */}
              <div className="ag-field-wrap">
                <label className={`ag-label${password || focused === "password" ? " active" : ""}`}
                  style={{ color: focused === "password" ? gold : undefined }}>
                  Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required
                  className={`ag-input${focused === "password" ? " focused" : ""}`}
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="ag-eye-btn"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Forgot link */}
              <div className="ag-forgot-row">
                <Link to="/forgot-password" className="ag-forgot-link">Forgot password?</Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="ag-primary-btn">
                {isLoading ? (
                  <>
                    <span className="ag-spinner" />
                    Signing In…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="ag-divider">
                <span className="ag-divider-line" />
                <span className="ag-divider-text">or</span>
                <span className="ag-divider-line" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={() => { window.location.href = "http://localhost:5000/api/auth/google"; }}
                className="ag-google-btn"
              >
                <svg style={{ marginRight: "10px" }} height="18" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="ag-switch-text">
              Don't have an account?{" "}
              <Link to="/signup" className="ag-switch-link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
