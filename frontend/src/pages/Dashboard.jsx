import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Inbox, Phone, CheckCircle, Search, LogOut, RefreshCw,
  GraduationCap, X, CalendarDays, Filter, LayoutDashboard, Mail,
  ChevronDown, BarChart3, MessageSquare, ArrowUpRight,
  Clock3, CircleCheck, Menu
} from "lucide-react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [userType, setUserType] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Use India time consistently and refresh while the dashboard remains open.
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30 * 1000);
    return () => clearInterval(timer);
  }, []);

  const indiaHour = Number(
    new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    }).format(currentTime)
  );

  const greeting =
    indiaHour < 12
      ? "Good morning"
      : indiaHour < 18
        ? "Good afternoon"
        : "Good evening";

  const displayedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(currentTime);

  const token = localStorage.getItem("adminToken");
  let admin = {};
  try {
    admin = JSON.parse(localStorage.getItem("adminDetails") || "{}");
  } catch {
    admin = {};
  }

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const fetchInquiries = useCallback(async (showRefresh = false) => {
    if (!token) {
      logout();
      return;
    }
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const [filteredResponse, allResponse] = await Promise.all([
        api.get("/api/inquiries", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            search: search.trim() || undefined,
            category: category || undefined,
            userType: userType || undefined,
            status: status || undefined,
          },
        }),
        api.get("/api/inquiries", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setInquiries(filteredResponse.data.inquiries || []);
      setAllInquiries(allResponse.data.inquiries || []);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setError(err.response?.data?.message || "Unable to load inquiries. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, search, category, userType, status, logout]);

  useEffect(() => {
    if (!token) {
      logout();
      return;
    }
    const delay = setTimeout(() => fetchInquiries(), search ? 350 : 0);
    return () => clearTimeout(delay);
  }, [token, search, category, userType, status, fetchInquiries, logout]);

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      setError("");
      await api.patch(
        `/api/inquiries/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchInquiries(true);
    } catch (err) {
      if (err.response?.status === 401) logout();
      else setError(err.response?.data?.message || "Unable to update inquiry status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => ({
    total: allInquiries.length,
    new: allInquiries.filter((i) => i.status === "New").length,
    contacted: allInquiries.filter((i) => i.status === "Contacted").length,
    resolved: allInquiries.filter((i) => i.status === "Resolved").length,
  }), [allInquiries]);

  const categoryStats = useMemo(() => {
    const labels = ["Scholarship", "Concert", "Admission", "General Query"];
    return labels.map((label) => ({
      label,
      value: allInquiries.filter((item) => item.category === label).length,
    }));
  }, [allInquiries]);

  const maxCategory = Math.max(1, ...categoryStats.map((item) => item.value));
  const completion = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const statCards = [
    { title: "Total inquiries", value: stats.total, icon: Users, color: "violet", note: "All submitted inquiries" },
    { title: "New inquiries", value: stats.new, icon: Inbox, color: "orange", note: "Awaiting response" },
    { title: "Contacted", value: stats.contacted, icon: Phone, color: "blue", note: "Currently in progress" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "green", note: "Successfully completed" },
  ];

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setUserType("");
    setStatus("");
  };
  const hasFilters = search || category || userType || status;
  const recentInquiries = [...allInquiries]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 4);

  const jumpToInquiries = () => {
    setActiveNav("inquiries");
    document.getElementById("inquiries")?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <div className="crm-dashboard crm-dashboard-v2">
      <aside className={`crm-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="crm-sidebar-brand">
          <span className="crm-logo"><GraduationCap size={23} /></span>
          <span><b>K12 Hunar</b><small>INQUIRY WORKSPACE</small></span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="crm-sidebar-nav">
          <button className={`sidebar-link ${activeNav === "overview" ? "active" : ""}`} onClick={() => { setActiveNav("overview"); window.scrollTo({ top: 0, behavior: "smooth" }); setSidebarOpen(false); }}>
            <LayoutDashboard size={18} /> <span>Overview</span>
          </button>
          <button className={`sidebar-link ${activeNav === "inquiries" ? "active" : ""}`} onClick={jumpToInquiries}>
            <MessageSquare size={18} /> <span>Inquiries</span><b>{stats.total}</b>
          </button>
          <button className={`sidebar-link ${activeNav === "analytics" ? "active" : ""}`} onClick={() => { setActiveNav("analytics"); document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" }); setSidebarOpen(false); }}>
            <BarChart3 size={18} /> <span>Analytics</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help-card">
            <span className="sidebar-help-icon"><GraduationCap size={18} /></span>
            <b>Keep every learner moving forward.</b>
            <small>Thoughtful conversations create meaningful opportunities.</small>
          </div>
          <button className="sidebar-logout" onClick={logout}><LogOut size={17} /> Sign out</button>
          <small className="sidebar-version">K12 HUNAR · ADMIN PORTAL</small>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <div className="crm-main-area">
        <header className="crm-topbar">
          <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="topbar-context"><span>Workspace</span><b>/ Dashboard</b></div>
          <div className="topbar-actions">
            <span className="topbar-date"><CalendarDays size={15} /> {displayedDate}</span>
            <span className="topbar-divider" />
            <div className="topbar-profile">
              <span className="topbar-avatar">{(admin.name || "A").charAt(0).toUpperCase()}</span>
              <span><small>Signed in as</small><b>{admin.name || "Admin"}</b></span>
            </div>
            <button className="topbar-logout" onClick={logout} title="Logout"><LogOut size={17} /></button>
          </div>
        </header>

        <main className="crm-content">
          <section className="crm-welcome-row">
            <div>
              <span className="crm-overline">ADMINISTRATION / OVERVIEW</span>
              <h1>{greeting}, {admin.name?.split(" ")[0] || "Admin"} <span>✦</span></h1>
              <p>Here’s what’s happening with your inquiries today.</p>
            </div>
            <button type="button" className="crm-refresh-button" onClick={() => fetchInquiries(true)} disabled={refreshing || loading}>
              <RefreshCw size={16} className={refreshing ? "dashboard-spin" : ""} /> {refreshing ? "Refreshing" : "Refresh data"}
            </button>
          </section>

          {error && <div className="crm-error-banner"><span>{error}</span><button onClick={() => setError("")}><X size={16} /></button></div>}

          <section className="crm-kpi-grid">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className={`crm-kpi-card kpi-${card.color}`}>
                  <div className="kpi-topline"><span>{card.title}</span><span className="kpi-icon"><Icon size={19} /></span></div>
                  <div className="kpi-value">{loading ? "—" : card.value}</div>
                  <div className="kpi-foot"><i />{card.note}</div>
                </article>
              );
            })}
          </section>

          <section className="crm-insights-grid" id="analytics">
            <article className="crm-panel category-panel">
              <div className="crm-panel-heading"><div><span className="panel-eyebrow">INQUIRY BREAKDOWN</span><h2>Inquiries by category</h2></div><span className="panel-heading-icon"><BarChart3 size={18} /></span></div>
              <div className="category-bars">
                {categoryStats.map((item, index) => (
                  <div className="category-bar-row" key={item.label}>
                    <div className="category-bar-label"><span>{item.label}</span><b>{item.value}</b></div>
                    <div className="category-track"><span className={`category-fill fill-${index}`} style={{ width: `${(item.value / maxCategory) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </article>
            <article className="crm-panel progress-panel">
              <div className="crm-panel-heading"><div><span className="panel-eyebrow">WORKFLOW HEALTH</span><h2>Resolution progress</h2></div><span className="panel-heading-icon green"><CircleCheck size={18} /></span></div>
              <div className="progress-content">
                <div className="progress-ring" style={{ "--progress": `${completion}%` }}><div><b>{completion}%</b><small>Resolved</small></div></div>
                <div className="progress-legend">
                  <div><i className="legend-new" /><span>New</span><b>{stats.new}</b></div>
                  <div><i className="legend-contacted" /><span>Contacted</span><b>{stats.contacted}</b></div>
                  <div><i className="legend-resolved" /><span>Resolved</span><b>{stats.resolved}</b></div>
                </div>
              </div>
              <p className="panel-footnote">Based on all inquiries received.</p>
            </article>
            <article className="crm-panel recent-panel">
              <div className="crm-panel-heading"><div><span className="panel-eyebrow">LATEST ACTIVITY</span><h2>Recent inquiries</h2></div><span className="panel-heading-icon amber"><Clock3 size={18} /></span></div>
              {recentInquiries.length ? (
                <div className="recent-list">
                  {recentInquiries.slice(0, 3).map((item) => (
                    <div className="recent-item" key={item.id}>
                      <span className="recent-avatar">{item.name?.charAt(0).toUpperCase()}</span>
                      <span className="recent-person"><b>{item.name}</b><small>{item.category}</small></span>
                      <span className={`recent-status recent-${(item.status || "new").toLowerCase()}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="recent-empty">No inquiries received yet.</p>}
              <button className="recent-view-all" onClick={jumpToInquiries}>View all inquiries <ArrowUpRight size={14} /></button>
            </article>
          </section>

          <section className="crm-inquiries-panel" id="inquiries">
            <div className="crm-inquiries-heading">
              <div className="crm-inquiries-title">
                <span className="inquiries-title-icon"><Inbox size={19} /></span>
                <div><h2>Inquiry management</h2><p>Review, organize and update incoming conversations.</p></div>
              </div>
              <span className="crm-record-count">{loading ? "Loading…" : `${inquiries.length} of ${stats.total} records`}</span>
            </div>

            <div className="crm-filter-area">
              <div className="crm-filter-title"><span><Filter size={15} /> Search & filters</span>{hasFilters && <button onClick={clearFilters}><X size={13} /> Clear all</button>}</div>
              <div className="crm-filter-grid">
                <label className="crm-search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or phone…" /></label>
                <label className="crm-select-box"><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category"><option value="">All categories</option><option value="Scholarship">Scholarship</option><option value="Concert">Concert</option><option value="Admission">Admission</option><option value="General Query">General Query</option></select><ChevronDown size={14} /></label>
                <label className="crm-select-box"><select value={userType} onChange={(e) => setUserType(e.target.value)} aria-label="Filter by user type"><option value="">All user types</option><option value="Parent">Parent</option><option value="Student">Student</option><option value="School">School</option></select><ChevronDown size={14} /></label>
                <label className="crm-select-box"><select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option value="">All status</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Resolved">Resolved</option></select><ChevronDown size={14} /></label>
              </div>
            </div>

            <div className="crm-table-scroll">
              <table className="crm-data-table">
                <thead><tr><th>Contact person</th><th>Contact details</th><th>User type</th><th>Category</th><th>Message</th><th>Date submitted</th><th>Status</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan="7"><div className="crm-table-state"><RefreshCw className="dashboard-spin" size={22} />Loading inquiries…</div></td></tr>
                    : inquiries.length === 0 ? <tr><td colSpan="7"><div className="crm-table-state empty"><Inbox size={30} /><b>No inquiries found</b><span>{hasFilters ? "Try changing or clearing your filters." : "New inquiries will appear here."}</span>{hasFilters && <button onClick={clearFilters}>Clear filters</button>}</div></td></tr>
                    : inquiries.map((item) => (
                      <tr key={item.id}>
                        <td><div className="crm-contact"><span className="crm-contact-avatar">{item.name?.charAt(0).toUpperCase()}</span><b>{item.name}</b></div></td>
                        <td><div className="crm-contact-info"><span><Mail size={13} />{item.email}</span><span><Phone size={13} />{item.phone}</span></div></td>
                        <td><span className="crm-user-chip">{item.user_type}</span></td>
                        <td><span className="crm-category-chip">{item.category}</span></td>
                        <td><p className="crm-message-cell" title={item.message}>{item.message}</p></td>
                        <td><span className="crm-date-cell"><CalendarDays size={13} />{item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span></td>
                        <td><div className="crm-status-wrap"><select aria-label={`Update status for ${item.name}`} disabled={updatingId === item.id} value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)} className={`crm-status-select crm-status-${(item.status || "new").toLowerCase()}`}><option value="New">New</option><option value="Contacted">Contacted</option><option value="Resolved">Resolved</option></select>{updatingId === item.id && <RefreshCw size={13} className="dashboard-spin" />}</div></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="crm-table-bottom"><span>Showing <b>{inquiries.length}</b> of <b>{stats.total}</b> total inquiries</span><span className="crm-db-status"><i /> Connected to database</span></div>
          </section>

          <footer className="crm-page-footer"><span>© 2026 K12 Hunar. All rights reserved.</span><span>Inquiry Management Workspace</span></footer>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
