import { useEffect, useState } from "react";
import "../styles/QuizResultado.css";
import "../styles/Tema.css";

export default function QuizResultado() {
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));

    if (!storedUser || !storedUser.id) {
      setErro("Nenhum usuário encontrado no sistema.");
      return;
    }

    const user_id = storedUser.id;

    async function carregarResultado() {
      try {
        const res = await fetch(`http://localhost:3000/quizresultado/${user_id}`);
        const dados = await res.json();

        if (!res.ok) {
          setErro(dados.erro || "Erro ao carregar resultado");
          return;
        }

        setResultado(dados);
      } catch (err) {
        console.error(err);
        setErro("Erro ao conectar ao servidor");
      }
    }

    carregarResultado();
  }, []);

  if (erro) {
    return (
      <div className="qr-container">
        <h2 className="qr-erro">{erro}</h2>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="qr-container">
        <h2>Carregando resultado...</h2>
      </div>
    );
  }

  function formatarData(dataISO) {
  const data = new Date(dataISO);

  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${horas}:${minutos} ${dia}/${mes}/${ano}`;
}


  return (
    <div className="qr-container">
      <h1 className="qr-titulo">Resultado do Quiz</h1>

      <div className="qr-card-principal">
        <h2>{resultado.result_title}</h2>
        <p>{resultado.result_text}</p>

        <p className="qr-score"><strong>Pontuação total:</strong> {resultado.total_score}</p>

        <p className="qr-data">
          <strong>Feito em:</strong>{" "}
          {resultado.created_at
            ? formatarData(resultado.created_at)

            : "—"
          }
        </p>
      </div>

      <h2 className="qr-subtitulo">Suas respostas</h2>

      <div className="qr-lista">
        {resultado.perguntas?.map((item, index) => (
          <div key={index} className="qr-card">
            <h3 className="qr-pergunta">{index + 1}. {item.pergunta}</h3>

            <p className="qr-resposta">
              <strong>Sua resposta:</strong> {item.resposta_texto}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
