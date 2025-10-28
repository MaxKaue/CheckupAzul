import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Quiz from "./components/Quiz"; // <<< IMPORTAÇÃO NECESSÁRIA
import Navbar from "./components/Navbar.js"; 
import Lembretes from "./pages/Lembretes";
import './styles/Tema.css'; // Adicionando importação de estilo global para garantir que o tema seja carregado

function App() {
  return (
    <Router>
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        {/* >>> ROTA DO QUIZ ADICIONADA <<< */}
        <Route path="/quiz" element={<Quiz />} />
        {/* Rota para o gerenciador de lembretes */}
        <Route path="/lembretes" element={<Lembretes />} />
      </Routes>
    </Router>
  );
}

export default App;
