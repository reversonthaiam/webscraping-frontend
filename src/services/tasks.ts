import api from './api'

export interface Task {
  id: number
  title: string
  status: 'pendente' | 'processando' | 'concluida' | 'falha'
  url: string
  brand: string | null
  model: string | null
  price: string | null
  error_message: string | null
  completed_at: string | null
  user_email: string
  created_at: string
  updated_at: string
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get('/tasks')
  return response.data
}

export async function getTask(id: number): Promise<Task> {
  const response = await api.get(`/tasks/${id}`)
  return response.data
}

export async function createTask(title: string, url: string): Promise<Task> {
  const response = await api.post('/tasks', { title, url })
  return response.data.task
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`)
}