import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * AuthCallback — handles the redirect from Google OAuth.
 *
 * The backend redirects here with:
 *   /auth/callback?token=JWT_TOKEN&user=JSON_ENCODED_USER
 */
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userRaw = searchParams.get("user");

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        login(user, token);
        toast.success(`Welcome, ${user.name}!`);
        // login() in AuthContext already navigates — but add fallback
      } catch {
        toast.error("Google login failed. Please try again.");
        navigate("/login");
      }
    } else {
      toast.error("Google login failed. Please try again.");
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoMark}>
          <span style={styles.logoText}>AG</span>
        </div>
        <div style={styles.spinner} />
        <p style={styles.label}>Signing you in…</p>
        <p style={styles.sub}>Please wait while we verify your Google account.</p>
      </div>

      <style>{`
        @keyframes ag-spin { to { transform: rotate(360deg); } }
        @keyframes ag-fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "hsl(37, 47%, 96%)",
    fontFamily: "'Lato', sans-serif",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.25rem",
    animation: "ag-fadeUp 0.45s ease both",
  },
  logoMark: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "1.5px solid hsl(44, 55%, 54%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "0.25rem",
  },
  logoText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.3rem",
    fontWeight: 500,
    color: "hsl(44, 55%, 54%)",
    letterSpacing: "0.08em",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "2.5px solid hsl(36, 18%, 82%)",
    borderTopColor: "hsl(44, 55%, 54%)",
    borderRadius: "50%",
    animation: "ag-spin 0.8s linear infinite",
  },
  label: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.3rem",
    color: "hsl(35, 25%, 13%)",
    fontWeight: 500,
    margin: 0,
  },
  sub: {
    fontSize: "0.8rem",
    color: "hsl(30, 8%, 52%)",
    margin: 0,
  },
};

export default AuthCallback;
