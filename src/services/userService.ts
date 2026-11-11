import api from '../api/axios'
import type { CurrentUser } from '../types'

export async function getCurrentUser() {
  const { data } = await api.get<CurrentUser>('/users/current')
  return data
}
