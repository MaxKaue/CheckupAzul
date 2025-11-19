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
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    const user_id = localStorage.getItem("user_id");

    if (!storedUser || !token || !user_id) {
      setUser(null);
      setLoadingQuizStatus(false);
      return;
    }

    setUser({ ...storedUser, id: Number(user_id) });

    const checkQuizStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/quizresultado/${user_id}`);

        if (response.status === 404) {
          setQuizCompleted(false);
        } else if (response.ok) {
          setQuizCompleted(true);
        } else {
          throw new Error("Erro ao buscar resultado do quiz");
        }
      } catch (err) {
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
      navigate(`/quizresultado/${user.id}`);
    } else {
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
            O <strong>Novembro Azul</strong> incentiva os homens a cuidarem mais da própria saúde,
            combatendo o medo e a falta de informação que ainda fazem muitos evitarem exames e
            cuidados preventivos importantes.
          </p>

          <p>
            Para ajudar nessa jornada, criamos o <strong>Checkup Azul</strong>: um questionário
            rápido que avalia seus hábitos e oferece uma análise simples e personalizada para
            melhorar sua saúde e bem-estar.
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
