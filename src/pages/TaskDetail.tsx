import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTask, type Task } from "../services/tasks";

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
    const interval = setInterval(async () => {
      try {
        const data = await getTask(Number(id));
        setTask(data);
        if (data.status === "concluida" || data.status === "falha") {
          clearInterval(interval);
        }
      } catch {
        navigate("/tasks");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function loadTask() {
    try {
      const data = await getTask(Number(id));
      setTask(data);
    } catch {
      navigate("/tasks");
    } finally {
      setLoading(false);
    }
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

  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );

  if (!task) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/tasks")}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-lg font-bold text-gray-800">Task Details</h1>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h2>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(task.status)}`}
            >
              {statusLabel(task.status)}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">URL</p>
              <a
                href={task.url}
                target="_blank"
                className="text-sm text-blue-500 hover:underline break-all"
              >
                {task.url}
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Created by</p>
              <p className="text-sm text-gray-700">{task.user_email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Created at</p>
              <p className="text-sm text-gray-700">
                {new Date(task.created_at).toLocaleString("en-US")}
              </p>
            </div>

            {task.completed_at && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Completed at</p>
                <p className="text-sm text-gray-700">
                  {new Date(task.completed_at).toLocaleString("en-US")}
                </p>
              </div>
            )}

            {task.status === "concluida" && (
              <div className="mt-2 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Collected Data
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Brand</p>
                    <p className="text-base font-bold text-gray-800">
                      {task.brand}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Model</p>
                    <p className="text-base font-bold text-gray-800">
                      {task.model}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Price</p>
                    <p className="text-base font-bold text-gray-800">
                      R$ {Number(task.price).toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {task.status === "falha" && (
              <div className="mt-2 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-red-600 mb-1">Error</p>
                <p className="text-sm text-red-500">{task.error_message}</p>
              </div>
            )}

            {(task.status === "pendente" || task.status === "processando") && (
              <div className="mt-2 pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-400">
                  Automatically refreshing every 3 seconds...
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}