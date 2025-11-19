import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';
import "../styles/Tema.css";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accessMenuOpen, setAccessMenuOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    // Carrega o tema salvo
const temaSalvo = localStorage.getItem("tema");
if (temaSalvo) {
  document.documentElement.setAttribute("data-theme", temaSalvo); 
}

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setAccessMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await fetch("http://localhost:3000/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_token: token }),
        });
      } catch (err) {
        console.error("Erro ao fazer logout:", err);
      }
    }

    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setUser(null);
    setIsMenuOpen(false);
    navigate("/");

    setTimeout(() => window.location.reload(), 5);
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleAccessMenu = () => setAccessMenuOpen(prev => !prev);

  const aplicarTema = (tema) => {
  if (tema === "padrao") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("tema");
  } else {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
  }
};


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Checkup Azul</Link>
      </div>

      <div className="navbar-right" ref={menuRef}>

        {/* === BOTÃO DE ACESSIBILIDADE === */}
        <button
          className="accessibility-button"
          onClick={toggleAccessMenu}
        >
          ♿
        </button>

        {/* MENU DE ACESSIBILIDADE (PROVISÓRIO) */}
        {accessMenuOpen && (
          <div className="accessibility-menu">
           <button onClick={() => aplicarTema("alto-contraste")}>Alto Contraste</button>
           <button onClick={() => aplicarTema("tons-suaves")}>Tons Suaves</button>
           <button onClick={() => aplicarTema("dark-mode")}>Modo Escuro</button>
           <button onClick={() => aplicarTema("padrao")}>Padrão</button>
        </div>
        )}

        {/* === MENU DO USUÁRIO === */}
        {user ? (
          <div className="dropdown-menu-container">
            <button onClick={toggleMenu} className="menu-button">☰</button>

            {isMenuOpen && (
              <div className="dropdown-content">
                <div className="dropdown-item user-info" style={{ fontWeight: 'bold' }}>
                  Olá, {user.email.split('@')[0]}
                </div>

                <hr style={{ margin: 0, borderColor: '#333' }} />

                <Link to="/" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                  🏠 Home
                </Link>

                <button onClick={handleLogout} className="dropdown-item logout-button">
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/cadastro" className="nav-button signup-btn">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}
