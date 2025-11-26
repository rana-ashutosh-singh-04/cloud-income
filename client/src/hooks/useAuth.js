import { create } from 'zustand'
import { api, setAuth } from '../lib/api'


export const useAuth = create((set, get) => ({
user: null,
token: null,
loading: false,


initFromStorage: () => {
const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user') || 'null')
if (token) setAuth(token)
set({ token, user })
},


signup: async (payload) => {
set({ loading: true })
try {
const { data } = await api.post('/auth/signup', payload)
localStorage.setItem('token', data.token)
localStorage.setItem('user', JSON.stringify(data.user))
setAuth(data.token)
set({ user: data.user, token: data.token, loading: false })
} catch (e) { set({ loading: false }); throw e }
},


login: async (payload) => {
set({ loading: true })
try {
const { data } = await api.post('/auth/login', payload)
localStorage.setItem('token', data.token)
localStorage.setItem('user', JSON.stringify(data.user))
setAuth(data.token)
set({ user: data.user, token: data.token, loading: false })
} catch (e) { set({ loading: false }); throw e }
},


logout: () => {
localStorage.removeItem('token')
localStorage.removeItem('user')
setAuth(null)
set({ user: null, token: null })
},
}))