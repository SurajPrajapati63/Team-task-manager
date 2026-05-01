import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, CheckSquare, FolderKanban, LogOut, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Dashboard", icon: BarChart3 },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/tasks", label: "Tasks", icon: CheckSquare },
    ...(isAdmin ? [{ to: "/team", label: "Team", icon: Users }] : [])
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Team Task</div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className="nav-link">
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">{user.role}</p>
            <h1>Welcome, {user.name}</h1>
          </div>
          <button className="icon-button" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
