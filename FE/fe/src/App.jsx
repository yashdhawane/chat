import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Chat from './components/Chat'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  )
}

export default App
