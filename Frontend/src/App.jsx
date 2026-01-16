import { Routes, Route, Navigate } from "react-router";



import Auth from "./pages/Auth"

export default function App(){
  
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <Auth />
        }
      />
    </Routes>
  )
}