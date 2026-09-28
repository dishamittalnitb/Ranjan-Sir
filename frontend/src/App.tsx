import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppSidebar } from './components/AppSidebar'
import FlowScreen from './pages/FlowScreen'
import ProfileScreen from './pages/ProfileScreen'

function Shell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f9fb]">
      <AppSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((v) => !v)} />
      <div className="flex-1 flex overflow-hidden min-w-0">
        <Routes>
          <Route path="/" element={<FlowScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
