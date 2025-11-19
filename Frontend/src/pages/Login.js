import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/Login.css";
import "../styles/Tema.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao fazer login");
      }

      // Salva no localStorage e atualiza o context
      localStorage.setItem("usuario", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user.id);
      setUser(data.user);

      navigate("/"); // Redireciona para Home
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">CheckupAzul</h2>
      <form onSubmit={handleLogin} className="login-form">
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
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p className="login-links">
        Ainda não tem uma conta? <Link to="/cadastro">Cadastrar-se</Link>
      </p>
    </div>
  );
}
