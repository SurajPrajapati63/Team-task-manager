import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import TaskForm from "../components/TaskForm.jsx";
import TaskTable from "../components/TaskTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Tasks() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", sortBy: "due_date", order: "ASC" });

  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);

  const loadTasks = () => api.get("/tasks", { params }).then(({ data }) => setTasks(data.tasks));

  useEffect(() => {
    loadTasks();
  }, [params]);

  useEffect(() => {
    api.get("/projects").then(({ data }) => setProjects(data.projects));
    if (isAdmin) api.get("/users", { params: { role: "Member" } }).then(({ data }) => setMembers(data.users));
  }, [isAdmin]);

  const saveTask = async (payload) => {
    if (selectedTask) {
      await api.put(`/tasks/${selectedTask.id}`, payload);
      setSelectedTask(null);
    } else {
      await api.post("/tasks", payload);
    }
    loadTasks();
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}/status`, { status });
    loadTasks();
  };

  const remove = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  const updateFilter = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <section className="page-stack">
      {isAdmin && (
        <TaskForm
          projects={projects}
          members={members}
          selectedTask={selectedTask}
          onCancel={() => setSelectedTask(null)}
          onSubmit={saveTask}
        />
      )}

      <div className="panel filter-bar">
        <input name="search" value={filters.search} onChange={updateFilter} placeholder="Search tasks" />
        <select name="status" value={filters.status} onChange={updateFilter}>
          <option value="">All statuses</option>
          {["Pending", "In Progress", "Completed"].map((status) => <option key={status}>{status}</option>)}
        </select>
        <select name="priority" value={filters.priority} onChange={updateFilter}>
          <option value="">All priorities</option>
          {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}
        </select>
        <select name="sortBy" value={filters.sortBy} onChange={updateFilter}>
          <option value="due_date">Due date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
          <option value="created_at">Created</option>
          <option value="title">Title</option>
        </select>
        <select name="order" value={filters.order} onChange={updateFilter}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>

      <TaskTable tasks={tasks} isAdmin={isAdmin} onStatus={updateStatus} onEdit={setSelectedTask} onDelete={remove} />
    </section>
  );
}
