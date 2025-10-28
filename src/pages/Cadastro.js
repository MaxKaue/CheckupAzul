import { useState } from "react";
import { auth, db } from "../services/firebaseService";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Cadastro.css";


export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, "usuarios", userCredential.user.uid), { nome, email });
      navigate("/"); // Redireciona para Home, que mostra o Quiz
    } catch (error) {
      alert(error.message);
    }
  };

  return (
        <div className="cadastro-container"> {/* CLASSE PRINCIPAL */}
            <h2 className="cadastro-title">CheckupAzul</h2> {/* CLASSE DO TÍTULO */}
            <form onSubmit={handleCadastro} className="cadastro-form"> {/* CLASSE DO FORM */}
            <input type="nome" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
            <button type="submit" className="cadastro-button">cadastro</button> {/* CLASSE DO BOTÃO */}
            </form>
                <p className="cadastro-links">
                    Já tem uma conta? <Link to="/login">Login</Link>
                </p>
        </div>
  );
}
