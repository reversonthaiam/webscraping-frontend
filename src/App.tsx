import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './routes/PrivateRoute'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Tasks } from './pages/Tasks'
import { TaskDetail } from './pages/TaskDetail'

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">⚠️ Important Notice</h2>
        <p className="text-sm text-gray-600 mb-4">
          This is a portfolio project. The frontend is deployed, but the backend services require Docker to run locally.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">To run the full project:</p>
          <code className="text-xs text-blue-600 block">git clone github.com/your-username/webscraping-manager</code>
          <code className="text-xs text-blue-600 block mt-1">docker compose up --build</code>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Need help running the project or want to see a live demo? Feel free to reach out — I'm happy to assist!
        </p>
        <div className="flex gap-3">
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
  )
}

function App() {
  const [showModal, setShowModal] = useState(true)

  return (
    <BrowserRouter>
      <AuthProvider>
        {showModal && <InfoModal onClose={() => setShowModal(false)} />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          } />
          <Route path="/tasks/:id" element={
            <PrivateRoute>
              <TaskDetail />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App