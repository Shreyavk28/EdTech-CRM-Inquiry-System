import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LockKeyhole, Mail, GraduationCap, ArrowLeft, Eye, EyeOff,
  ShieldCheck, Sparkles
} from "lucide-react";
import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/api/admin/login", { email, password });
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminDetails", JSON.stringify(response.data.admin));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hunar-login-page">
      <section className="hunar-login-art">
        <Link to="/" className="hunar-brand login-brand">
          <span className="hunar-brand-mark"><GraduationCap size={25} /></span>
          <span>K12 <b>Hunar</b></span>
        </Link>
        <div className="login-art-copy">
          <span className="eyebrow"><Sparkles size={14} /> TEAM WORKSPACE</span>
          <h1>Good things happen when <em>learning leads.</em></h1>
          <p>Manage conversations, support learners and keep every inquiry moving forward.</p>
          <div className="login-art-note"><ShieldCheck size={18} /><span>Secure access for authorized administrators</span></div>
        </div>
        <div className="login-orbit" aria-hidden="true"><span /><span /><span /><b>H</b></div>
        <small className="login-art-foot">© 2026 K12 Hunar · Inquiry Management</small>
      </section>

      <section className="hunar-login-content">
        <div className="hunar-login-card">
          <span className="login-kicker">ADMINISTRATOR ACCESS</span>
          <h2>Welcome back.</h2>
          <p className="login-intro">Sign in to continue to your workspace.</p>

          {error && <div className="hunar-alert error"><ShieldCheck size={18} />{error}</div>}

          <form onSubmit={handleLogin} className="hunar-login-form">
            <label className="hunar-field">
              <span>Email address</span>
              <div className="hunar-input-icon"><Mail size={17} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required /></div>
            </label>

            <label className="hunar-field">
              <span>Password</span>
              <div className="hunar-input-icon">
                <LockKeyhole size={17} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <button type="submit" className="hunar-login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in to dashboard"} <span>→</span>
            </button>
          </form>

          <div className="login-security"><ShieldCheck size={15} /> Your session is protected.</div>
          <Link to="/" className="hunar-back-link"><ArrowLeft size={15} /> Back to inquiry form</Link>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;
