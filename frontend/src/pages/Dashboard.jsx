import { useEffect, useState } from "react";
import api from "../api/client";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p className="empty">Loading dashboard...</p>;

  return (
    <section className="page-stack">
      <div className="stats-grid">
        <StatCard label="Total Tasks" value={stats.tasks.total_tasks} />
        <StatCard label="Completed" value={stats.tasks.completed_tasks} tone="success" />
        <StatCard label="Pending" value={stats.tasks.pending_tasks} tone="warning" />
        <StatCard label="Overdue" value={stats.tasks.overdue_tasks} tone="danger" />
      </div>

      <section className="panel">
        <h2>Project Progress</h2>
        <div className="progress-list">
          {stats.projects.map((project) => (
            <div key={project.id} className="progress-item">
              <div>
                <strong>{project.name}</strong>
                <span>{project.completed_tasks || 0}/{project.total_tasks || 0} tasks</span>
              </div>
              <div className="progress-bar">
                <span style={{ width: `${project.progress}%` }} />
              </div>
              <b>{project.progress}%</b>
            </div>
          ))}
        </div>
      </section>

      {isAdmin && (
        <section className="panel">
          <h2>Team Performance</h2>
          <div className="cards-grid">
            {stats.teamPerformance.map((member) => (
              <article className="mini-card" key={member.id}>
                <strong>{member.name}</strong>
                <span>{member.completed_tasks || 0} completed</span>
                <span>{member.overdue_tasks || 0} overdue</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
