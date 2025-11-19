import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GraficoMortalidade from "../components/GraficoMortalidade";
import "../styles/Home.css";
import "../styles/Tema.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loadingQuizStatus, setLoadingQuizStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Pega usuário e token do localStorage
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      setUser(null);
      setLoadingQuizStatus(false);
      return;
    }

    setUser(storedUser);

    // Verifica se já fez o quiz
    const checkQuizStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/quizresultado/${storedUser.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setQuizCompleted(false);
          } else {
            throw new Error("Erro ao buscar resultado do quiz");
          }
        } else {
          setQuizCompleted(true);
        }
      } catch (error) {
        console.error(error);
        setQuizCompleted(false);
      } finally {
        setLoadingQuizStatus(false);
      }
    };

    checkQuizStatus();
  }, []);

  const handleQuizClick = () => {
    if (!user) return;
    if (quizCompleted) {
      // Vai para a página do resultado salvo
      navigate(`/quizresultado/${user.id}`);
    } else {
      // Inicia o quiz
      navigate("/quiz");
    }
  };

  return (
    <div className="home-container page-content">
      <div className="home-hero">
        <div className="overlay"></div>
        <div className="home-content">
<h1>Bem-vindo ao Checkup Azul</h1>

<p>
  O <strong>Novembro Azul</strong> é um movimento internacional dedicado à conscientização sobre a saúde masculina.  
  Ele surgiu para lembrar que muitos homens ainda deixam sua saúde em segundo plano, seja por falta de tempo, medo, vergonha ou pela ideia errada de que “homem não adoece”. A campanha reforça a importância do autocuidado, da prevenção e da realização de consultas regulares — especialmente quando falamos de câncer de próstata, doenças cardíacas, saúde mental e qualidade de vida.
</p>

<p>
  A verdade é que se cuidar não deveria ser um tabu. É um ato de coragem, maturidade e responsabilidade consigo mesmo e com quem você ama. Pequenas escolhas feitas no dia a dia podem transformar completamente a forma como você se sente, vive e envelhece.
</p>

<p>
  Pensando nisso, criamos o <strong>Quiz Checkup Azul</strong>.  
  Ele foi desenvolvido para ajudar você a entender melhor como anda sua rotina de autocuidado. As perguntas são rápidas e abordam hábitos essenciais, como alimentação, sono, exercícios, exames preventivos e saúde mental.
</p>

<p>
  Ao final do quiz, você receberá uma análise personalizada com orientações práticas que podem fazer diferença real no seu bem-estar. O objetivo não é julgar, mas ajudar você a enxergar oportunidades de melhorar sua qualidade de vida de forma simples, acessível e sem pressão.
</p>

<p>
  Dedicar alguns minutos para responder o quiz pode ser o primeiro passo para criar uma relação mais saudável com seu próprio corpo e mente.  
  Vamos começar essa jornada juntos?
</p>



          {loadingQuizStatus ? (
            <button className="quiz-button-home" disabled>
              Carregando status...
            </button>
          ) : user ? (
            <button className="quiz-button-home" onClick={handleQuizClick}>
              {quizCompleted ? "Ver o seu resultado" : "Iniciar Quiz"}
            </button>
          ) : (
            <p className="login-text">
              Faça <strong>login ou cadastre-se</strong> para acessar o Quiz de Saúde Masculina.
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
