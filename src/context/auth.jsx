/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebaseConfig"
import Loading from "../components/Loading"
// Create a new context
export const AuthContext = createContext()
// Create a new provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // Track the user's login status
  useEffect(() => {
    // onAuthStateChanged is a listener that is called whenever the user's login status changes
    // And this takes auth authentication instance and it will return user
    onAuthStateChanged(auth, user => {
      setUser(user)
      // Set loading to false after the user's login status has been determined
      setLoading(false)
    })
  }, [])

  if (loading) {
    // if the user's login status is still being determined, display a loading spinner
    return <Loading />
  }
  // else render the children from App.jsx
  // Pass the user's login status to the value prop of the provider, use aywhere in the app with useContext
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export default AuthProvider

