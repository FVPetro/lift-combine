import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Athlete, AssessmentSession, MockUser } from '../types'
import { MOCK_ATHLETES, MOCK_USERS } from '../data/mockData'

interface AppStore {
  // Auth
  currentUser: MockUser | null
  login: (email: string, password: string) => boolean
  logout: () => void

  // Athletes
  athletes: Athlete[]
  addAthlete: (athlete: Athlete) => void
  updateAthlete: (id: string, updates: Partial<Athlete>) => void
  deleteAthlete: (id: string) => void

  // Sessions
  addSession: (athleteId: string, session: AssessmentSession) => void
  updateSession: (athleteId: string, sessionId: string, updates: Partial<AssessmentSession>) => void
  deleteSession: (athleteId: string, sessionId: string) => void

  // UI state
  selectedSessionId: string | null
  setSelectedSessionId: (id: string | null) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      athletes: [],
      selectedSessionId: null,

      login: (email, password) => {
        const user = MOCK_USERS.find(u => u.email === email && u.password === password)
        if (user) {
          set({ currentUser: user })
          return true
        }
        return false
      },

      logout: () => set({ currentUser: null }),

      addAthlete: (athlete) =>
        set(state => ({ athletes: [...state.athletes, athlete] })),

      updateAthlete: (id, updates) =>
        set(state => ({
          athletes: state.athletes.map(a => a.id === id ? { ...a, ...updates } : a),
        })),

      deleteAthlete: (id) =>
        set(state => ({ athletes: state.athletes.filter(a => a.id !== id) })),

      addSession: (athleteId, session) =>
        set(state => ({
          athletes: state.athletes.map(a =>
            a.id === athleteId ? { ...a, sessions: [...a.sessions, session] } : a
          ),
        })),

      updateSession: (athleteId, sessionId, updates) =>
        set(state => ({
          athletes: state.athletes.map(a =>
            a.id === athleteId
              ? {
                  ...a,
                  sessions: a.sessions.map(s =>
                    s.id === sessionId ? { ...s, ...updates } : s
                  ),
                }
              : a
          ),
        })),

      deleteSession: (athleteId, sessionId) =>
        set(state => ({
          athletes: state.athletes.map(a =>
            a.id === athleteId
              ? { ...a, sessions: a.sessions.filter(s => s.id !== sessionId) }
              : a
          ),
        })),

      setSelectedSessionId: (id) => set({ selectedSessionId: id }),
    }),
    {
      name: 'lift-combine-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        athletes: state.athletes,
      }),
    }
  )
)

export const useCurrentUser = () => useStore(s => s.currentUser)
export const useAthletes = () => useStore(s => s.athletes)
export const useAthlete = (id: string) => useStore(s => s.athletes.find(a => a.id === id))
