import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import PageWrapper from './components/PageWrapper'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Profile from './pages/Profile'
import IssueCertificatePage from './pages/Certificate/IssueCertificate'
import ResultPage from './pages/Certificate/ResultPage'
import AddResultPage from './pages/Certificate/AddResultPage'
function App() {
  return (
    <Router>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path = "/Certificates" element = {<IssueCertificatePage />} />
          <Route path = "/ResultTest" element = {<ResultPage />} />
          <Route path = "/AddResultTest" element = {<AddResultPage />} />
        </Routes>
      </PageWrapper>
    </Router>
  )
}

export default App
