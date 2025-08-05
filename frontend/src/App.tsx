import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChallengeForm from "./pages/ChallengeForm";
import ChallengeList from "./pages/ChallengeList";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ChallengeForm />} />
        <Route path="/list" element={<ChallengeList />} />
      </Routes>
    </BrowserRouter>
  );
}
