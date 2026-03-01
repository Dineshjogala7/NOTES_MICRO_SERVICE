import Register from "../Auth/Register";
import Login from "../Auth/Login";
import Home from "./Home";
import Category from "./Category";
import Notes from "./Notes";
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
const ProtectedRoute = ({ children }) => {
  const getCookie = (cookieName) => {
    const match = document.cookie.split('; ').find(row => row.startsWith(cookieName));
    return match ? match.split('=')[1] : null;
  };
  const token = getCookie(import.meta.env.VITE_COOKIE_NAME);
  if (!token) return <Navigate to="/register" replace />
  return children
}

const App = () => {
  return (
    <div className="min-h-screen bg-yellow-200 flex items-center justify-center w-full">
      <Toaster position="top-center" />


      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/category/:categoryId" element={<ProtectedRoute><Category /></ProtectedRoute>} />
        <Route path="/note/:noteId" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;