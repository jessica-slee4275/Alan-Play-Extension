import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthed } from "./auth";
import ProtectedRoute from "./components/ProtectedRoute";

import ChallengeForm from "./pages/ChallengeForm";
import ChallengeList from "./pages/ChallengeList";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import Navbar from "./components/Navbar";

export default function App() {
  const authed = isAuthed();
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={authed ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-challenge" element={ <ProtectedRoute> <ChallengeForm /> </ProtectedRoute> } />
        <Route path="/list" element={ <ProtectedRoute> <ChallengeList /> </ProtectedRoute> } />
        <Route path="*" element={<Navigate to={authed ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
