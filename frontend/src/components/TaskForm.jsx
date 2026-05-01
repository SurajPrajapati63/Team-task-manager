import { useEffect, useState } from "react";

const initial = {
  projectId: "",
  title: "",
  description: "",
  assignedTo: "",
  status: "Pending",
  priority: "Medium",
  dueDate: ""
};

export default function TaskForm({ projects, members, onSubmit, selectedTask, onCancel }) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (selectedTask) {
      setForm({
        projectId: selectedTask.project_id || "",
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        assignedTo: selectedTask.assigned_to || "",
        status: selectedTask.status || "Pending",
        priority: selectedTask.priority || "Medium",
        dueDate: selectedTask.due_date?.slice(0, 10) || ""
      });
    }
  }, [selectedTask]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.projectId || !form.title || !form.dueDate) return;
    onSubmit({
      ...form,
      projectId: form.projectId,
      assignedTo: form.assignedTo || null
    });
    setForm(initial);
  };

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <select name="projectId" value={form.projectId} onChange={update} required>
        <option value="">Project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <input name="title" value={form.title} onChange={update} placeholder="Task title" required minLength="2" />
      <select name="assignedTo" value={form.assignedTo} onChange={update}>
        <option value="">Unassigned</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      <select name="priority" value={form.priority} onChange={update}>
        {["Low", "Medium", "High", "Critical"].map((priority) => (
          <option key={priority}>{priority}</option>
        ))}
      </select>
      <select name="status" value={form.status} onChange={update}>
        {["Pending", "In Progress", "Completed"].map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
      <input type="date" name="dueDate" value={form.dueDate} onChange={update} required />
      <textarea name="description" value={form.description} onChange={update} placeholder="Description" />
      <div className="actions">
        <button type="submit">{selectedTask ? "Update Task" : "Create Task"}</button>
        {selectedTask && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
