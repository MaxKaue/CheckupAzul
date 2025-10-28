import { useState } from "react";
import { auth } from "../services/firebaseService";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Tema.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/"); // Redireciona para Home, que vai mostrar o Quiz
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container"> {/* CLASSE PRINCIPAL */}
      <h2 className="login-title">CheckupAzul</h2> {/* CLASSE DO TÍTULO */}
      <form onSubmit={handleLogin} className="login-form"> {/* CLASSE DO FORM */}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
        <button type="submit" className="login-button">Login</button> {/* CLASSE DO BOTÃO */}
      </form>
      <p className="login-links">
        Ainda não tem uma conta? <Link to="/cadastro">Cadastrar-se</Link>
      </p>
    </div>
  );
}
