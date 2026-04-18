import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Account created! Please enter the 6-digit code sent to your email.");
        setForm({ name: "", email: "", password: "" });
        navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
      } else {
        toast.error(data.message || "Signup failed");
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
        @keyframes ag-spin    { to { transform: rotate(360deg); } }
        @keyframes ag-fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ag-slideIn { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ag-orbFloat {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.08); }
        }

        /* ── Page wrapper ── */
        .ags-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Lato', sans-serif;
          background-color: hsl(37,47%,96%);
        }

        /* ── Left panel — hidden on mobile, shown md+ ── */
        .ags-panel {
          display: none;
          flex: 0 0 42%;
          position: relative;
          background: linear-gradient(155deg, hsl(35,25%,13%) 0%, hsl(30,20%,18%) 60%, hsl(35,15%,22%) 100%);
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .ags-panel { display: flex; }
        }
        .ags-panel-overlay {
          position: absolute; inset: 0;
          background-image: radial-gradient(ellipse at 70% 30%, hsla(44,55%,54%,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .ags-orb {
          position: absolute; bottom: -15%; left: 50%;
          width: 340px; height: 340px; border-radius: 50%;
          background: radial-gradient(circle, hsla(44,55%,54%,0.07) 0%, transparent 70%);
          animation: ag-orbFloat 8s ease-in-out infinite;
          pointer-events: none;
        }
        .ags-panel-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; justify-content: center;
          padding: 4rem 3.5rem;
          animation: ag-slideIn 0.7s ease both;
        }
        .ags-logo-mark {
          width: 64px; height: 64px; border-radius: 50%;
          border: 1.5px solid hsl(44,55%,54%);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 2.5rem;
        }
        .ags-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 500;
          color: hsl(44,55%,54%); letter-spacing: 0.08em;
        }
        .ags-panel-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem; font-weight: 400;
          color: hsl(40,20%,90%); line-height: 1.25; margin-bottom: 1rem;
        }
        .ags-panel-sub {
          font-size: 0.875rem; color: hsl(36,10%,62%);
          line-height: 1.8; max-width: 280px; margin-bottom: 2rem;
        }
        .ags-panel-divider {
          width: 40px; height: 1px;
          background: hsl(44,55%,54%); opacity: 0.6; margin-bottom: 2rem;
        }
        .ags-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.9rem; }
        .ags-feature-item {
          font-size: 0.825rem; color: hsl(36,10%,68%);
          display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.03em;
        }
        .ags-check-icon { color: hsl(44,55%,54%); font-size: 0.6rem; }

        /* ── Right form panel ── */
        .ags-form-panel {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 5rem 1.25rem 2.5rem; /* top pad for navbar on mobile */
        }
        @media (min-width: 768px) {
          .ags-form-panel { padding: 2rem 2.5rem; }
        }

        /* ── Card ── */
        .ags-card {
          width: 100%; max-width: 420px;
          animation: ag-fadeUp 0.55s ease both;
        }

        .ags-card-header { margin-bottom: 2.25rem; }
        .ags-gold-line {
          width: 32px; height: 2px; background: hsl(44,55%,54%);
          margin-bottom: 1.25rem; border-radius: 2px;
        }
        .ags-eyebrow {
          font-size: 0.7rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: hsl(44,55%,54%); margin-bottom: 0.5rem;
        }
        .ags-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 5vw, 2.4rem);
          font-weight: 500; color: hsl(35,25%,13%);
          line-height: 1.1; margin-bottom: 0.5rem;
        }
        .ags-subheading {
          font-size: 0.875rem; color: hsl(30,8%,46%); line-height: 1.6;
        }

        /* ── Form ── */
        .ags-form { display: flex; flex-direction: column; gap: 1.75rem; }

        .ags-field-wrap { position: relative; padding-top: 1.25rem; }

        .ags-label {
          position: absolute; top: 1.35rem; left: 0;
          font-size: 0.85rem; transform-origin: left top;
          transition: transform 0.2s ease, color 0.2s ease;
          pointer-events: none; letter-spacing: 0.02em;
          color: hsl(30,8%,46%);
        }
        .ags-label.active { transform: translateY(-22px) scale(0.8); }

        .ags-input {
          width: 100%; background: transparent;
          border: none; border-bottom: 1.5px solid hsl(36,18%,78%);
          outline: none; padding: 0.5rem 0;
          font-size: 0.925rem; color: hsl(35,25%,13%);
          font-family: 'Lato', sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }
        .ags-input.focused {
          border-bottom-color: hsl(44,55%,54%);
          box-shadow: 0 1px 0 0 hsl(44,55%,54%);
        }

        .ags-eye-btn {
          position: absolute; right: 0; top: 1.5rem;
          background: none; border: none; cursor: pointer;
          padding: 0.25rem; color: hsl(30,8%,58%);
          display: flex; align-items: center;
        }

        .ags-hint {
          font-size: 0.72rem; color: hsl(30,8%,58%);
          margin-top: -1rem; letter-spacing: 0.01em;
        }

        /* ── Primary button ── */
        .ags-primary-btn {
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
        .ags-primary-btn:hover:not(:disabled) { background: hsl(35,25%,20%); }
        .ags-primary-btn:active:not(:disabled) { transform: scale(0.98); }
        .ags-primary-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .ags-spinner {
          width: 14px; height: 14px;
          border: 2px solid hsla(40,20%,93%,0.3);
          border-top-color: hsl(40,20%,93%);
          border-radius: 50%;
          animation: ag-spin 0.7s linear infinite;
          display: inline-block; flex-shrink: 0;
        }

        /* ── Terms ── */
        .ags-terms-text {
          margin-top: 1.25rem; font-size: 0.73rem;
          color: hsl(30,8%,55%); text-align: center; line-height: 1.7;
        }
        .ags-terms-link { color: hsl(44,55%,54%); text-decoration: none; }
        .ags-terms-link:hover { text-decoration: underline; }

        /* ── Switch text ── */
        .ags-switch-text {
          margin-top: 1rem; font-size: 0.8rem;
          color: hsl(30,8%,52%); text-align: center;
        }
        .ags-switch-link {
          color: hsl(44,55%,54%); text-decoration: none;
          font-weight: 600; letter-spacing: 0.02em;
        }
        .ags-switch-link:hover { text-decoration: underline; }

        /* ── Mobile brand bar ── */
        .ags-mobile-brand {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.75rem;
        }
        @media (min-width: 768px) { .ags-mobile-brand { display: none; } }
        .ags-mobile-logo {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1.5px solid hsl(44,55%,54%);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ags-mobile-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 500;
          color: hsl(44,55%,54%); letter-spacing: 0.08em;
        }
        .ags-mobile-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; color: hsl(35,25%,13%); font-weight: 500;
        }
      `}</style>

      <div className="ags-page">
        {/* ── Left decorative panel (tablet/desktop only) ── */}
        <div className="ags-panel">
          <div className="ags-panel-overlay" />
          <div className="ags-orb" />
          <div className="ags-panel-content">
            <div className="ags-logo-mark">
              <span className="ags-logo-text">AG</span>
            </div>
            <h2 className="ags-panel-heading">Begin Your<br />Pashmina Journey</h2>
            <p className="ags-panel-sub">
              Create your account and discover the world's finest heritage textiles.
            </p>
            <div className="ags-panel-divider" />
            <ul className="ags-feature-list">
              {["Exclusive member pricing", "Early access to new arrivals", "Lifetime craftsmanship guarantee"].map((f) => (
                <li key={f} className="ags-feature-item">
                  <span className="ags-check-icon">✦</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right / form panel ── */}
        <div className="ags-form-panel">
          <div className="ags-card">

            {/* Mobile-only brand bar */}
            <div className="ags-mobile-brand">
              <div className="ags-mobile-logo">
                <span className="ags-mobile-logo-text">AG</span>
              </div>
              <span className="ags-mobile-brand-name">AG Pashmina</span>
            </div>

            {/* Header */}
            <div className="ags-card-header">
              <div className="ags-gold-line" />
              <p className="ags-eyebrow">AG Pashmina</p>
              <h1 className="ags-heading">Create Account</h1>
              <p className="ags-subheading">Join the AG Pashmina family today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="ags-form">

              {/* Full Name */}
              <div className="ags-field-wrap">
                <label
                  className={`ags-label${form.name || focused === "name" ? " active" : ""}`}
                  style={{ color: focused === "name" ? gold : undefined }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  required
                  className={`ags-input${focused === "name" ? " focused" : ""}`}
                />
              </div>

              {/* Email */}
              <div className="ags-field-wrap">
                <label
                  className={`ags-label${form.email || focused === "email" ? " active" : ""}`}
                  style={{ color: focused === "email" ? gold : undefined }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                  className={`ags-input${focused === "email" ? " focused" : ""}`}
                />
              </div>

              {/* Password */}
              <div className="ags-field-wrap">
                <label
                  className={`ags-label${form.password || focused === "password" ? " active" : ""}`}
                  style={{ color: focused === "password" ? gold : undefined }}
                >
                  Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required
                  className={`ags-input${focused === "password" ? " focused" : ""}`}
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="ags-eye-btn"
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

              <p className="ags-hint">Use 8+ characters with a mix of letters &amp; numbers</p>

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="ags-primary-btn">
                {isLoading ? (
                  <>
                    <span className="ags-spinner" />
                    Creating Account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="ags-terms-text">
              By creating an account you agree to our{" "}
              <Link to="/terms" className="ags-terms-link">Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="ags-terms-link">Privacy Policy</Link>.
            </p>

            <p className="ags-switch-text">
              Already have an account?{" "}
              <Link to="/login" className="ags-switch-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
