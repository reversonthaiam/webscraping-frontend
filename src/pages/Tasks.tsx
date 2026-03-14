import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, deleteTask, type Task } from "../services/tasks";
import { useAuth } from "../contexts/AuthContext";

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      await createTask(title, url);
      setTitle("");
      setUrl("");
      await loadTasks();
    } catch {
      setError("Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to remove this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function statusColor(status: Task["status"]) {
    const colors = {
      pendente: "bg-yellow-100 text-yellow-700",
      processando: "bg-blue-100 text-blue-700",
      concluida: "bg-green-100 text-green-700",
      falha: "bg-red-100 text-red-700",
    };
    return colors[status];
  }

  function statusLabel(status: Task["status"]) {
    const labels = {
      pendente: "Pending",
      processando: "Processing",
      concluida: "Completed",
      falha: "Failed",
    };
    return labels[status];
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">
          Web Scraping Manager
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            New Task
          </h2>

          <div className="bg-blue-50 text-blue-700 text-xs px-4 py-3 rounded-lg mb-4">
            
            <p>
              {" "}
              💡 To test the scraping flow, go to{" "}
              <a
                href="https://www.webmotors.com.br"
                target="_blank"
                className="underline font-medium"
              >
                webmotors.com.br
              </a>
            </p>
             open any vehicle listing and paste the URL below.
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
              required
            />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.webmotors.com.br/..."
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-3">
          {loading && (
            <p className="text-center text-gray-400 text-sm">
              Loading tasks...
            </p>
          )}

          {!loading && tasks.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              No tasks created yet.
            </p>
          )}

          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {task.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 break-all">
                    {task.url}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(task.status)}`}
                >
                  {statusLabel(task.status)}
                </span>
              </div>

              {task.status === "concluida" && (
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-400">Brand</p>
                    <p className="text-sm font-medium text-gray-700">
                      {task.brand}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Model</p>
                    <p className="text-sm font-medium text-gray-700">
                      {task.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-sm font-medium text-gray-700">
                      R$ {Number(task.price).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              )}

              {task.status === "falha" && (
                <p className="mt-3 text-xs text-red-500">
                  {task.error_message}
                </p>
              )}

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  View details
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-xs text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
