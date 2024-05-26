import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import Home from "./pages/Home"
import AuthProvider from "./context/auth"

function App() {
  return (
    <AuthProvider>
      {/* AuthProvider children start */}
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      {/* AuthProvider children end */}
    </AuthProvider>
  )
}

export default App
