import api from '../api/axios'
import type { LoginPayload, LoginResponse, NewIdResponse, RegisterPayload } from '../types'

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<NewIdResponse>('/users/register', payload)
  return data // { id }
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data.token
}
