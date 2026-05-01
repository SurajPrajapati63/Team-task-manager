import { Edit, Trash2 } from "lucide-react";
import { formatDate, isOverdue, priorityClass } from "../utils/format";

export default function TaskTable({ tasks, isAdmin, onStatus, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Project</th>
            <th>Assignee</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={isOverdue(task) ? "overdue-row" : ""}>
              <td>
                <strong>{task.title}</strong>
                <span>{task.description}</span>
              </td>
              <td>{task.project_name}</td>
              <td>{task.assignee_name || "Unassigned"}</td>
              <td>
                <span className={priorityClass(task.priority)}>{task.priority}</span>
              </td>
              <td>
                <select value={task.status} onChange={(event) => onStatus(task.id, event.target.value)}>
                  {["Pending", "In Progress", "Completed"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td>{formatDate(task.due_date)}</td>
              <td>
                {isAdmin ? (
                  <div className="row-actions">
                    <button className="ghost" onClick={() => onEdit(task)} title="Edit task">
                      <Edit size={16} />
                    </button>
                    <button className="ghost danger-text" onClick={() => onDelete(task.id)} title="Delete task">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <span className="muted">Status only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tasks.length === 0 && <p className="empty">No tasks found.</p>}
    </div>
  );
}
