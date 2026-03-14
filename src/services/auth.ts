import api from './api'

export async function register(email: string, password: string, passwordConfirmation: string) {
  const response = await api.post('/register', {
    email,
    password,
    password_confirmation: passwordConfirmation
  })
  return response.data
}

export async function login(email: string, password: string) {
  const response = await api.post('/login', { email, password })
  return response.data
}