import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import './index.css'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

