import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthed } from "./auth";
import ProtectedRoute from "./components/ProtectedRoute";

import ChallengeForm from "./pages/ChallengeForm";
import ChallengeList from "./pages/ChallengeList";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import Navbar from "./components/Navbar";
import ChallengeDetail from "./pages/ChallengeDetail"
import ChallengeEdit from "./pages/ChallengeEdit";

export default function App() {
  const authed = isAuthed();
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={authed ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/challenge/:id" element={ <ProtectedRoute> <ChallengeDetail /> </ProtectedRoute> } />
          <Route path="/list" element={ <ProtectedRoute requireRole="admin"> <ChallengeList /> </ProtectedRoute> } />
          <Route path="/create-challenge" element={ <ProtectedRoute requireRole="admin"> <ChallengeForm /> </ProtectedRoute> } />
          <Route path="/challenge/:id/edit" element={ <ProtectedRoute requireRole="admin"> <ChallengeEdit /> </ProtectedRoute> } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
