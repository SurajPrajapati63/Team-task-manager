import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/format";

const initial = { name: "", description: "", startDate: "", endDate: "" };

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initial);

  const load = () => api.get("/projects").then(({ data }) => setProjects(data.projects));

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/projects", form);
    setForm(initial);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <section className="page-stack">
      {isAdmin && (
        <form className="panel form-grid" onSubmit={submit}>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project name" minLength="2" required />
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <button type="submit">Create Project</button>
        </form>
      )}

      <div className="cards-grid">
        {projects.map((project) => {
          const progress = project.total_tasks ? Math.round((project.completed_tasks / project.total_tasks) * 100) : 0;
          return (
            <article className="project-card" key={project.id}>
              <div>
                <h2>{project.name}</h2>
                <p>{project.description || "No description"}</p>
              </div>
              <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
              <div className="progress-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
              <b>{progress}% complete</b>
              {isAdmin && <button className="secondary danger-text" onClick={() => remove(project.id)}>Delete</button>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
