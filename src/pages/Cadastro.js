import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Cadastro.css";
import { register } from "../services/api"; // Importando a função do api.js

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      // Usa a função do api.js para cadastrar
      await register(nome, email, senha);

      alert("Cadastro realizado com sucesso!");
      navigate("/login"); // Redireciona para a página de login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="cadastro-container">
      <h2 className="cadastro-title">CheckupAzul</h2>
      <form onSubmit={handleCadastro} className="cadastro-form">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" className="cadastro-button">
          Cadastrar
        </button>
      </form>
      <p className="cadastro-links">
        Já tem uma conta? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
