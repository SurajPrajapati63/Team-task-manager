const { Task } = require("./taskModel");
const { Project, toProject } = require("./projectModel");
const { User } = require("./userModel");

async function stats(user) {
  const taskQuery = user.role === "Admin" ? {} : { assigned_to: user.id };
  const tasks = await Task.find(taskQuery);
  const now = new Date();

  const taskStats = {
    total_tasks: tasks.length,
    completed_tasks: tasks.filter((task) => task.status === "Completed").length,
    pending_tasks: tasks.filter((task) => task.status === "Pending").length,
    in_progress_tasks: tasks.filter((task) => task.status === "In Progress").length,
    overdue_tasks: tasks.filter((task) => task.due_date < now && task.status !== "Completed").length
  };

  const projectQuery = user.role === "Admin" ? {} : { members: user.id };
  const projects = await Project.find(projectQuery).sort({ created_at: -1 });
  const projectStats = await Promise.all(
    projects.map(async (project) => {
      const query = { project_id: project._id };
      if (user.role !== "Admin") query.assigned_to = user.id;
      const projectTasks = await Task.find(query);
      const total = projectTasks.length;
      const completed = projectTasks.filter((task) => task.status === "Completed").length;
      return {
        ...toProject(project, { total_tasks: total, completed_tasks: completed }),
        progress: total ? Math.round((completed / total) * 100) : 0
      };
    })
  );

  const members = await User.find({ role: "Member", is_active: true }).sort({ name: 1 });
  const teamPerformance = await Promise.all(
    members.map(async (member) => {
      const memberTasks = await Task.find({ assigned_to: member._id });
      const overdue = memberTasks.filter((task) => task.due_date < now && task.status !== "Completed").length;
      return {
        id: member._id.toString(),
        name: member.name,
        total_tasks: memberTasks.length,
        completed_tasks: memberTasks.filter((task) => task.status === "Completed").length,
        overdue_tasks: overdue
      };
    })
  );

  teamPerformance.sort((a, b) => b.completed_tasks - a.completed_tasks || a.overdue_tasks - b.overdue_tasks);

  return {
    tasks: taskStats,
    projects: projectStats,
    teamPerformance: user.role === "Admin" ? teamPerformance : []
  };
}

module.exports = { stats };
