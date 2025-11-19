// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Quiz from "./components/Quiz";
import Navbar from "./components/Navbar";
import QuizResultado from "./components/QuizResultado";
import { UserProvider } from "./context/UserContext";
import Footer from "./components/Footer";
import './styles/Tema.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quizresultado/:userId" element={<QuizResultado />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
