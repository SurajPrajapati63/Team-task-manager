export function formatDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString();
}

export function isOverdue(task) {
  return task.status !== "Completed" && new Date(task.due_date) < new Date(new Date().toDateString());
}

export function priorityClass(priority) {
  return {
    Low: "badge neutral",
    Medium: "badge info",
    High: "badge warning",
    Critical: "badge danger"
  }[priority] || "badge";
}
