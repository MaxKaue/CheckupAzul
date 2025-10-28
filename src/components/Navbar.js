import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseService'; 
import { signOut } from 'firebase/auth';
import '../styles/Navbar.css'; 

export default function Navbar() {
    const [currentUser, setCurrentUser] = useState(null);
    // Estado para controlar a visibilidade do menu dropdown (Sanduíche)
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    
    const navigate = useNavigate();
    // Referência para fechar o menu ao clicar fora do dropdown
    const menuRef = useRef(null); 

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });

        // Lógica para fechar o menu ao clicar fora
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsMenuOpen(false); // Fecha o menu
            navigate('/');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };
    
    // Função para alternar o estado do menu principal
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // Função auxiliar para fechar o menu após um clique em um link
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    }

    return (
        <nav className="navbar">
            
            {/* LADO ESQUERDO: Logo */}
            <div className="navbar-left">
                {/* Garanta que a classe 'logo' está no CSS para formatar */}
                <Link to="/" className="logo">
                    Checkup Azul
                </Link>
            </div>
            
            {/* LADO DIREITO: Itens de navegação */}
            <div className="navbar-right" ref={menuRef}> 
                
                {currentUser ? (
                    // --- MENU SANDUÍCHE/DROP-DOWN PARA USUÁRIO LOGADO ---
                    <div className="dropdown-menu-container">
                        {/* BOTÃO SANDUÍCHE/MENU PRINCIPAL */}
                        <button onClick={toggleMenu} className="menu-button">
                            ☰
                        </button>
                        
                        {isMenuOpen && (
                            <div className="dropdown-content">
                                {/* ITEM 1: Nome do Usuário (apenas visual, não clicável) */}
                                <div className="dropdown-item user-info" style={{ fontWeight: 'bold' }}>
                                    Olá, {currentUser.email.split('@')[0]}
                                </div>
                                <hr style={{margin: '0', borderColor: '#333'}} /> 

                                {/* ITEM 2: Rotas Principais */}
                                <Link 
                                    to="/" 
                                    className="dropdown-item" 
                                    onClick={handleLinkClick}
                                >
                                    🏠 Home / Quiz
                                </Link>

                                {/* ITEM 3: Lembretes */}
                                <Link 
                                    to="/lembretes" 
                                    className="dropdown-item" 
                                    onClick={handleLinkClick}
                                >
                                    📅 Meus Lembretes
                                </Link>

                                {/* ITEM FINAL: Logout */}
                                <button 
                                    onClick={handleLogout} 
                                    className="dropdown-item logout-button"
                                >
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // --- LINKS PARA USUÁRIO NÃO LOGADO (sem dropdown) ---
                    <>
                        {/* Links visíveis diretamente na barra para não logados */}
                        <Link to="/login" className="nav-button">Login</Link>
                        <Link to="/cadastro" className="nav-button signup-btn">Cadastrar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}