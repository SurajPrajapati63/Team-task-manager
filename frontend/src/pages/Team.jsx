import { useEffect, useState } from "react";
import api from "../api/client";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [assignment, setAssignment] = useState({ projectId: "", userId: "" });

  const load = () => {
    api.get("/users", { params: { role: "Member" } }).then(({ data }) => setMembers(data.users));
    api.get("/projects").then(({ data }) => setProjects(data.projects));
  };

  const loadProjectMembers = (projectId) => {
    if (!projectId) {
      setProjectMembers([]);
      return;
    }
    api.get(`/projects/${projectId}/members`).then(({ data }) => setProjectMembers(data.members));
  };

  useEffect(() => {
    load();
  }, []);

  const assign = async (event) => {
    event.preventDefault();
    await api.post(`/projects/${assignment.projectId}/members`, { userId: assignment.userId });
    loadProjectMembers(assignment.projectId);
    setAssignment((current) => ({ ...current, userId: "" }));
  };

  const remove = async (userId) => {
    await api.delete(`/projects/${assignment.projectId}/members/${userId}`);
    loadProjectMembers(assignment.projectId);
  };

  return (
    <section className="page-stack">
      <form className="panel form-grid" onSubmit={assign}>
        <select
          value={assignment.projectId}
          onChange={(e) => {
            setAssignment({ ...assignment, projectId: e.target.value });
            loadProjectMembers(e.target.value);
          }}
          required
        >
          <option value="">Project</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <select value={assignment.userId} onChange={(e) => setAssignment({ ...assignment, userId: e.target.value })} required>
          <option value="">Member</option>
          {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
        </select>
        <button type="submit">Add Member</button>
      </form>

      {assignment.projectId && (
        <section className="panel">
          <h2>Project Members</h2>
          <div className="cards-grid">
            {projectMembers.map((member) => (
              <article className="mini-card" key={member.id}>
                <strong>{member.name}</strong>
                <span>{member.email}</span>
                <button className="secondary danger-text" onClick={() => remove(member.id)}>Remove</button>
              </article>
            ))}
            {projectMembers.length === 0 && <p className="empty">No members assigned to this project.</p>}
          </div>
        </section>
      )}

      <div className="cards-grid">
        {members.map((member) => (
          <article className="mini-card" key={member.id}>
            <strong>{member.name}</strong>
            <span>{member.email}</span>
            <span>{member.role}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
