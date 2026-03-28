import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useCurrentUser } from './store/useStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AthleteProfile from './pages/AthleteProfile'
import NewAthlete from './pages/NewAthlete'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/athlete/:id" element={<RequireAuth><AthleteProfile /></RequireAuth>} />
        <Route path="/athlete/new" element={<RequireAuth><NewAthlete /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
