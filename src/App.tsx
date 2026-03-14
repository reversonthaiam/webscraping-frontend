import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Tasks } from "./pages/Tasks";
import { TaskDetail } from "./pages/TaskDetail";

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          🤖 Web Scraping Manager
        </h2>
        <p className="text-xs text-gray-400 mb-4">Portfolio Project</p>

        <p className="text-sm text-gray-600 mb-4">
          A microservices system that automates vehicle listing data collection
          from Webmotors. Users create scraping tasks with a listing URL and the
          system automatically extracts brand, model and price asynchronously.
        </p>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            🛠️ Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Ruby on Rails",
              "JWT",
              "Sidekiq",
              "Redis",
              "Nokogiri",
              "PostgreSQL",
              "Docker",
              "React",
              "TypeScript",
            ].map((tech) => (
              <span
                key={tech}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            🏗️ Architecture
          </p>
          <p className="text-xs text-gray-500">
            3 independent Rails microservices (auth, notifications, scraping
            manager) communicating via REST APIs, with async job processing via
            Sidekiq + Redis.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            ⚠️ Running the project
          </p>
          <p className="text-xs text-gray-500 mb-2">
            The frontend is deployed but the backend requires Docker:
          </p>
          <code className="text-xs text-blue-600 block">
            git clone github.com/reversonthaiam/webscraping-manager
          </code>
          <code className="text-xs text-blue-600 block mt-1">
            docker compose up --build
          </code>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Want to see a live demo or have any questions? Feel free to reach out!
        </p>

        <div className="flex gap-3">
          <a
            href="https://github.com/reversonthaiam/webscraping-frontend"
            target="_blank"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2 rounded-lg"
          >
            GitHub
          </a>
          <a
            href="mailto:reversonthayan@gmail.com"
            className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg"
          >
            Contact me
          </a>
          <button
            onClick={onClose}
            className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 rounded-lg"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showModal, setShowModal] = useState(true);

  return (
    <BrowserRouter>
      <AuthProvider>
        {showModal && <InfoModal onClose={() => setShowModal(false)} />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <PrivateRoute>
                <TaskDetail />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
