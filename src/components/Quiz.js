import React, { useState } from "react";
import "../styles/Quiz.css";

export default function Quiz() {
  const perguntas = [
    {
      pergunta: "Com que frequência você realiza exames de rotina (check-up médico)?",
      opcoes: [
        { texto: "Anualmente ou a cada 6 meses.", valor: 3 },
        { texto: "Apenas quando sinto algum sintoma ou dor.", valor: 1 },
        { texto: "Raramente ou nunca fiz exames preventivos.", valor: 0 },
      ],
    },
    {
      pergunta: "Qual é o seu nível de atividade física semanal?",
      opcoes: [
        { texto: "Pratico exercícios moderados ou intensos 3 ou mais vezes por semana.", valor: 3 },
        { texto: "Pratico exercícios 1 a 2 vezes por semana, de forma leve.", valor: 1 },
        { texto: "Raramente ou nunca pratico atividades físicas.", valor: 0 },
      ],
    },
    {
      pergunta: "Como você avalia a qualidade e a duração do seu sono?",
      opcoes: [
        { texto: "Durmo de 7 a 9 horas e acordo sentindo-me bem e disposto.", valor: 3 },
        { texto: "Durmo de 5 a 6 horas por noite e, às vezes, acordo cansado.", valor: 1 },
        { texto: "Durmo menos de 5 horas ou lido frequentemente com insônia.", valor: 0 },
      ],
    },
    {
      pergunta: "Sua alimentação diária é composta principalmente por:",
      opcoes: [
        { texto: "Refeições caseiras balanceadas, com vegetais, frutas e proteínas.", valor: 3 },
        { texto: "Alimentos variados, mas com consumo ocasional de fast-food e doces.", valor: 1 },
        { texto: "Principalmente alimentos processados, frituras e bebidas açucaradas.", valor: 0 },
      ],
    },
    {
      pergunta: "Qual é a sua relação com o tabagismo?",
      opcoes: [
        { texto: "Nunca fumei.", valor: 3 },
        { texto: "Já fui fumante, mas parei completamente.", valor: 1 },
        { texto: "Fumo regularmente (cigarro, narguilé ou eletrônico).", valor: 0 },
      ],
    },
    {
      pergunta: "Com que frequência você consome bebidas alcoólicas?",
      opcoes: [
        { texto: "Raramente, apenas em ocasiões sociais ou não bebo.", valor: 3 },
        { texto: "1 a 2 vezes por semana, em quantidade moderada.", valor: 1 },
        { texto: "Consumo diariamente ou bebo em grandes quantidades.", valor: 0 },
      ],
    },
    {
      pergunta: "Você dedica tempo regular ao cuidado da sua saúde mental e emocional?",
      opcoes: [
        { texto: "Sim, pratico meditação, hobbies ou busco terapia/aconselhamento.", valor: 3 },
        { texto: "Apenas cuido da saúde mental quando o estresse se torna extremo.", valor: 1 },
        { texto: "Não dou nenhuma atenção especial à minha saúde mental.", valor: 0 },
      ],
    },
    {
      pergunta: "Durante longos períodos de trabalho ou estudo, você costuma fazer pausas?",
      opcoes: [
        { texto: "Sim, faço pausas curtas e regulares (a cada 1-2 horas) para esticar e relaxar.", valor: 3 },
        { texto: "Faço pausas apenas quando estou sentindo dor ou exaustão.", valor: 1 },
        { texto: "Raramente ou nunca me permito pausas, prefiro terminar rápido.", valor: 0 },
      ],
    },
    {
      pergunta: "Você se hidrata corretamente ao longo do dia?",
      opcoes: [
        { texto: "Bebo a quantidade ideal (cerca de 2L) ou mais, diariamente.", valor: 3 },
        { texto: "Bebo água, mas muitas vezes me esqueço e não alcanço a meta ideal.", valor: 1 },
        { texto: "Bebo muito pouco (menos de 1L) e prefiro sucos/refrigerantes.", valor: 0 },
      ],
    },
    {
      pergunta: "Sua rotina inclui tempo para lazer, hobbies ou atividades sociais?",
      opcoes: [
        { texto: "Sim, tenho atividades de lazer e sociais reservadas semanalmente.", valor: 3 },
        { texto: "Tenho lazer apenas esporadicamente, quando sobra tempo.", valor: 1 },
        { texto: "Minha rotina é só trabalho/obrigações e não sobra tempo para lazer.", valor: 0 },
      ],
    },
  ];

  const [etapa, setEtapa] = useState(0);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [finalResult, setFinalResult] = useState(null);

  const handleResposta = (valor) => {
    const novaPontuacao = pontuacaoTotal + valor;
    const novasRespostas = { ...respostas, [etapa]: valor };
    setPontuacaoTotal(novaPontuacao);
    setRespostas(novasRespostas);

    if (etapa + 1 < perguntas.length) {
      setEtapa(etapa + 1);
    } else {
      calcularResultado(novaPontuacao, novasRespostas);
    }
  };

const calcularResultado = (pontuacao, respostasUsuario) => {
  let titulo = "";
  let texto = "";

  if (pontuacao >= 26) {
    titulo = "Parabéns: Nível de Cuidado Excepcional!";
    texto =
      "Você demonstra um nível notável de atenção e cuidado com sua saúde física e mental. Seus hábitos são exemplares. Continue mantendo esse foco no bem-estar!";
  } else if (pontuacao >= 19) {
    titulo = "Muito Bom: Bons Hábitos Estabelecidos";
    texto =
      "Você tem uma base sólida de cuidados com a saúde. Seus hábitos são majoritariamente saudáveis, mas existem áreas que podem ser otimizadas para alcançar o bem-estar total.";
  } else if (pontuacao >= 10) {
    titulo = "Atenção Necessária: Hábitos Inconsistentes";
    texto =
      "Seu nível de cuidado é inconsistente e hábitos regulares precisam ser estabelecidos. É importante identificar as áreas de risco (como sono ou alimentação) e buscar melhorias consistentes.";
  } else {
    titulo = "Alerta Vermelho: Cuidado Urgente!";
    texto =
      "Você demonstrou ter vários hábitos de alto risco e falta de cuidado consistente com a saúde. É crucial buscar ajuda profissional e mudar sua rotina imediatamente para prevenir problemas de saúde futuros.";
  }

  // 👉 AQUI SALVA NO BACKEND
  salvarNoServidor(titulo, texto, pontuacao, respostasUsuario);

  setFinalResult({ titulo, texto });
};

const salvarNoServidor = async (titulo, texto, pontuacao, respostasUsuario) => {
  try {
    await fetch("http://localhost:3000/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: Number(localStorage.getItem("user_id")),
        total_score: pontuacao,
        result_title: titulo,
        result_text: texto,
        answers: respostasUsuario,
        question_count: perguntas.length
      })
    });
  } catch (error) {
    console.error("Erro ao enviar quiz:", error);
  }
};

  return (
    <div className="quiz-container">
      {!finalResult ? (
        <div className="quiz-pergunta">
          <h2>{perguntas[etapa].pergunta}</h2>
          <div className="quiz-opcoes">
            {perguntas[etapa].opcoes.map((opcao, index) => (
              <button
                key={index}
                onClick={() => handleResposta(opcao.valor)}
                className="quiz-botao"
              >
                {opcao.texto}
              </button>
            ))}
          </div>
          <p className="quiz-progresso">
            Pergunta {etapa + 1} de {perguntas.length}
          </p>
        </div>
      ) : (
        <div className="quiz-resultado">
          <h2>{finalResult.titulo}</h2>
          <p>{finalResult.texto}</p>
          <p className="quiz-score">Pontuação total: {pontuacaoTotal}</p>
          <button
            className="quiz-botao"
            onClick={() => {
              setFinalResult(null);
              setEtapa(0);
              setPontuacaoTotal(0);
              setRespostas({});
            }}
          >
            Refazer Quiz
          </button>
        </div>
      )}
    </div>
  );
}
