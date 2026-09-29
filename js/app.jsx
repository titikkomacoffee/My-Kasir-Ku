import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { useState } from 'react'
import Navbar from './components/common/Navbar.jsx'
import Sidebar from './components/common/Sidebar.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Dashboard from './pages/anggota/Dashboard.jsx'
import Simpanan from './pages/anggota/Simpanan.jsx'
import Pinjaman from './pages/anggota/Pinjaman.jsx'
import Angsuran from './pages/anggota/Angsuran.jsx'
import DashboardAdmin from './pages/pengurus/DashboardAdmin.jsx'
import KelolaAnggota from './pages/pengurus/KelolaAnggota.jsx'
import VerifikasiPinjaman from './pages/pengurus/VerifikasiPinjaman.jsx'
import LaporanKeuangan from './pages/pengurus/LaporanKeuangan.jsx'
import NotFound from './pages/NotFound.jsx'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={()=>setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 bg-[#f6f7fb] overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/anggota/simpanan" element={<Simpanan />} />
            <Route path="/anggota/pinjaman" element={<Pinjaman />} />
            <Route path="/anggota/angsuran" element={<Angsuran />} />
            <Route path="/pengurus" element={<ProtectedRoute allowedRoles={['owner','admin','pengurus']}><DashboardAdmin /></ProtectedRoute>} />
            <Route path="/pengurus/anggota" element={<ProtectedRoute allowedRoles={['owner','admin']}><KelolaAnggota /></ProtectedRoute>} />
            <Route path="/pengurus/pinjaman" element={<ProtectedRoute allowedRoles={['owner','admin']}><VerifikasiPinjaman /></ProtectedRoute>} />
            <Route path="/pengurus/laporan" element={<ProtectedRoute allowedRoles={['owner','admin']}><LaporanKeuangan /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/Tri-Putra-Abadi">
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/*" element={<ProtectedRoute><Layout /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
