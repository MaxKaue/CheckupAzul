import React, { useEffect, useState } from "react";
// Importações de Firebase e Roteamento
import { Link } from 'react-router-dom'; // <--- Importado para navegação
import { auth, db } from "../services/firebaseService";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // <--- Importado para Firestore
// Componentes
import Quiz from "../components/Quiz"; // Manter, mas o componente será usado via rota /quiz
import GraficoMortalidade from "../components/GraficoMortalidade";
import "../styles/Home.css";

export default function Home() {
    const [user, setUser] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false); // NOVO ESTADO
    const [loadingQuizStatus, setLoadingQuizStatus] = useState(true); // NOVO ESTADO

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            
            // --- LÓGICA DE VERIFICAÇÃO DO QUIZ ---
            if (u) {
                try {
                    const docRef = doc(db, "quiz_results", u.uid);
                    const docSnap = await getDoc(docRef);
                    setQuizCompleted(docSnap.exists()); // True se o documento existir
                } catch (error) {
                    console.error("Erro ao verificar status do quiz:", error);
                    setQuizCompleted(false); // Assume não completado em caso de erro
                }
            } else {
                setQuizCompleted(false); // Reseta se deslogar
            }
            setLoadingQuizStatus(false); // Finaliza o loading
        });
        
        return () => unsubscribe();
    }, []); 

    // Removemos handleStartQuiz e a renderização condicional do Quiz aqui,
    // pois a navegação agora será via <Link to="/quiz">.
    
    // O Quiz.js deve ser acessado pela rota /quiz, e ele cuidará de mostrar
    // o resultado ou o formulário, conforme a lógica que adicionamos lá.

    // === Renderiza a Home (Hero Section e Gráfico) ===
    return (
        <div className="home-container page-wrapper">
            <div className="home-hero">
                <div className="overlay"></div>
                <div className="home-content">
                    <h1>Bem-vindo ao Checkup Azul</h1>
                    <p>
                        Cuidar da saúde é um ato de coragem e autocuidado. <br />
                        Aqui no <strong>Checkup Azul</strong>, você encontra artigos sobre
                        saúde masculina que descomplicam o que realmente importa — corpo,
                        mente e bem-estar.
                    </p>
                    <p>
                        Além disso, você pode participar do nosso <strong>Quiz interativo</strong>,
                        que vai te ajudar a descobrir como está a sua rotina de cuidados e
                        indicar dicas personalizadas para melhorar seus hábitos e alcançar
                        uma vida mais equilibrada. <br />
                        Comece hoje mesmo o seu Checkup Azul — pequenas mudanças fazem uma
                        grande diferença!
                    </p>

                    {loadingQuizStatus ? (
                         <button className="quiz-button-home" disabled>
                            Carregando status...
                        </button>
                    ) : user ? (
                        <Link to="/quiz"> {/* Usa Link para navegar */}
                            <button className="quiz-button-home">
                                {/* NOVO: Texto condicional */}
                                {quizCompleted ? 'Visualizar Resultado' : 'Iniciar Quiz'}
                            </button>
                        </Link>
                    ) : (
                        <p className="login-text">
                            Faça **login ou cadastre-se** para acessar o Quiz de Saúde Masculina.
                        </p>
                    )}
                </div>
            </div>
        
            <section className="grafico-section">
                <GraficoMortalidade />
            </section>
            
        </div>
    );
}