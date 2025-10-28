import React, { useState, useEffect } from "react";
// IMPORTAÇÕES DO FIREBASE: auth, db e funções do Firestore e Auth
import { auth, db } from '../services/firebaseService'; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/Quiz.css";

// Novo array de perguntas com 3 opções e pontuações secretas
const perguntas = [
    { 
        id: 1, 
        pergunta: "Com que frequência você realiza exames de rotina (check-up médico)?", 
        opcoes: [
            { texto: "Anualmente ou a cada 6 meses.", pontuacao: 3 },
            { texto: "Apenas quando sinto algum sintoma ou dor.", pontuacao: 1 },
            { texto: "Raramente ou nunca fiz exames preventivos.", pontuacao: 0 }
        ] 
    },
    { 
        id: 2, 
        pergunta: "Qual é o seu nível de atividade física semanal?", 
        opcoes: [
            { texto: "Pratico exercícios moderados ou intensos 3 ou mais vezes por semana.", pontuacao: 3 },
            { texto: "Pratico exercícios 1 a 2 vezes por semana, de forma leve.", pontuacao: 1 },
            { texto: "Raramente ou nunca pratico atividades físicas.", pontuacao: 0 }
        ] 
    },
    { 
        id: 3, 
        pergunta: "Como você avalia a qualidade e a duração do seu sono?", 
        opcoes: [
            { texto: "Durmo de 7 a 9 horas e acordo sentindo-me bem e disposto.", pontuacao: 3 },
            { texto: "Durmo de 5 a 6 horas por noite e, às vezes, acordo cansado.", pontuacao: 1 },
            { texto: "Durmo menos de 5 horas ou lido frequentemente com insônia.", pontuacao: 0 }
        ] 
    },
    { 
        id: 4, 
        pergunta: "Sua alimentação diária é composta principalmente por:", 
        opcoes: [
            { texto: "Refeições caseiras balanceadas, com vegetais, frutas e proteínas.", pontuacao: 3 },
            { texto: "Alimentos variados, mas com consumo ocasional de fast-food e doces.", pontuacao: 1 },
            { texto: "Principalmente alimentos processados, frituras e bebidas açucaradas.", pontuacao: 0 }
        ] 
    },
    { 
        id: 5, 
        pergunta: "Qual é a sua relação com o tabagismo?", 
        opcoes: [
            { texto: "Nunca fumei.", pontuacao: 3 },
            { texto: "Já fui fumante, mas parei completamente.", pontuacao: 1 },
            { texto: "Fumo regularmente (cigarro, narguilé ou eletrônico).", pontuacao: 0 }
        ] 
    },
    { 
        id: 6, 
        pergunta: "Com que frequência você consome bebidas alcoólicas?", 
        opcoes: [
            { texto: "Raramente, apenas em ocasiões sociais ou não bebo.", pontuacao: 3 },
            { texto: "1 a 2 vezes por semana, em quantidade moderada.", pontuacao: 1 },
            { texto: "Consumo diariamente ou bebo em grandes quantidades.", pontuacao: 0 }
        ] 
    },
    { 
        id: 7, 
        pergunta: "Você dedica tempo regular ao cuidado da sua saúde mental e emocional?", 
        opcoes: [
            { texto: "Sim, pratico meditação, hobbies ou busco terapia/aconselhamento.", pontuacao: 3 },
            { texto: "Apenas cuido da saúde mental quando o estresse se torna extremo.", pontuacao: 1 },
            { texto: "Não dou nenhuma atenção especial à minha saúde mental.", pontuacao: 0 }
        ] 
    },
    { 
        id: 8, 
        pergunta: "Durante longos períodos de trabalho ou estudo, você costuma fazer pausas?", 
        opcoes: [
            { texto: "Sim, faço pausas curtas e regulares (a cada 1-2 horas) para esticar e relaxar.", pontuacao: 3 },
            { texto: "Faço pausas apenas quando estou sentindo dor ou exaustão.", pontuacao: 1 },
            { texto: "Raramente ou nunca me permito pausas, prefiro terminar rápido.", pontuacao: 0 }
        ] 
    },
    { 
        id: 9, 
        pergunta: "Você se hidrata corretamente ao longo do dia?", 
        opcoes: [
            { texto: "Bebo a quantidade ideal (cerca de 2L) ou mais, diariamente.", pontuacao: 3 },
            { texto: "Bebo água, mas muitas vezes me esqueço e não alcanço a meta ideal.", pontuacao: 1 },
            { texto: "Bebo muito pouco (menos de 1L) e prefiro sucos/refrigerantes.", pontuacao: 0 }
        ] 
    },
    { 
        id: 10, 
        pergunta: "Sua rotina inclui tempo para lazer, hobbies ou atividades sociais?", 
        opcoes: [
            { texto: "Sim, tenho atividades de lazer e sociais reservadas semanalmente.", pontuacao: 3 },
            { texto: "Tenho lazer apenas esporadicamente, quando sobra tempo.", pontuacao: 1 },
            { texto: "Minha rotina é só trabalho/obrigações e não sobra tempo para lazer.", pontuacao: 0 }
        ] 
    }
];

const getResultado = (pontuacao) => {
    if (pontuacao >= 26) {
        return { 
            titulo: "Parabéns: Nível de Cuidado Excepcional!", 
            texto: "Você demonstra um nível notável de atenção e cuidado com sua saúde física e mental. Seus hábitos são exemplares. Continue mantendo esse foco no bem-estar!" 
        };
    } else if (pontuacao >= 19) {
        return { 
            titulo: "Muito Bom: Bons Hábitos Estabelecidos", 
            texto: "Você tem uma base sólida de cuidados com a saúde. Seus hábitos são majoritariamente saudáveis, mas existem áreas que podem ser otimizadas para alcançar o bem-estar total." 
        };
    } else if (pontuacao >= 10) {
        return { 
            titulo: "Atenção Necessária: Hábitos Inconsistentes", 
            texto: "Seu nível de cuidado é inconsistente e hábitos regulares precisam ser estabelecidos. É importante identificar as áreas de risco (como sono ou alimentação) e buscar melhorias consistentes." 
        };
    } else {
        return { 
            titulo: "Alerta Vermelho: Cuidado Urgente!", 
            texto: "Você demonstrou ter vários hábitos de alto risco e falta de cuidado consistente com a saúde. É crucial buscar ajuda profissional e mudar sua rotina imediatamente para prevenir problemas de saúde futuros." 
        };
    }
};


export default function Quiz() {
    // === ESTADOS ===
    const [respostas, setRespostas] = useState({});
    const [resultado, setResultado] = useState(null); // Resultado da sessão atual
    const [currentUser, setCurrentUser] = useState(null); // Usuário logado
    const [loading, setLoading] = useState(true); // Estado de carregamento inicial
    const [existingResult, setExistingResult] = useState(null); // Resultado salvo no Firestore

    // === LÓGICA DE FIREBASE ===

    // Função para buscar resultado existente no Firestore
    const fetchExistingResult = async (uid) => {
        try {
            const docRef = doc(db, "quiz_results", uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Recalcula o texto do resultado com base na pontuação salva
                const calculatedResult = getResultado(data.score); 
                setExistingResult({ ...data, ...calculatedResult });
            }
        } catch (error) {
            console.error("Erro ao buscar resultado do quiz existente:", error);
        } finally {
            setLoading(false);
        }
    };

    // Função para salvar o resultado no Firestore
    const saveResult = async (uid, totalScore, finalResult) => {
        try {
            const docRef = doc(db, "quiz_results", uid);
            await setDoc(docRef, {
                uid: uid,
                score: totalScore,
                result_title: finalResult.titulo,
                result_text: finalResult.texto,
                completed_at: new Date(),
            });
            // Após salvar, atualiza o resultado existente para que o botão Home mude
            setExistingResult({ 
                uid: uid, score: totalScore, completed_at: new Date(), ...finalResult 
            });
        } catch (error) {
            console.error("Erro ao salvar o resultado do quiz:", error);
        }
    };
    
    // Hook para verificar login e buscar resultado
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                fetchExistingResult(user.uid);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);


    // === LÓGICA DO QUIZ ===

    const handleChange = (id, pontuacao) => {
        setRespostas(prev => ({ ...prev, [id]: pontuacao }));
    };
    
    const isQuizCompleto = Object.keys(respostas).length === perguntas.length;

    const handleSubmit = async () => {
        if (!isQuizCompleto) {
            alert("Por favor, responda a todas as perguntas antes de enviar.");
            return;
        }

        const pontuacaoTotal = Object.values(respostas).reduce((acc, currentScore) => acc + currentScore, 0);
        const finalResult = getResultado(pontuacaoTotal); 

        if (currentUser) {
            await saveResult(currentUser.uid, pontuacaoTotal, finalResult);
        }
        
        // Exibe o resultado localmente, substituindo o formulário
        setResultado(finalResult);
    };

    // Função para iniciar um novo quiz (escondendo o resultado existente)
    const handleRefazerQuiz = () => {
        setExistingResult(null); // Esconde o resultado salvo
        setResultado(null); // Garante que o resultado da sessão anterior não apareça
        setRespostas({}); // Limpa as respostas
    }

    // === RENDERIZAÇÃO CONDICIONAL ===
    
    // 1. Loading
    if (loading) {
        return <div className="quiz-container"><p>Carregando status do quiz...</p></div>;
    }

    // 2. Resultado Salvo Anteriomente (apenas se o usuário estiver logado e tiver um resultado)
    if (existingResult && !resultado) { // Se houver resultado salvo E não houver resultado novo
        return (
            <div className="quiz-resultado-container page-wrapper">
                <h2 className="resultado-titulo">Seu Último Resultado Salvo</h2>
                <h3 className="resultado-titulo">{existingResult.titulo}</h3>
                <p className="resultado-texto">{existingResult.texto}</p>
                <div className="resultado-pontuacao">
                   <p>Sua pontuação total foi: **{existingResult.score}/30**</p>
                </div>
                <button onClick={handleRefazerQuiz} className="quiz-button submit-button">
                    Refazer Quiz
                </button>
            </div>
        );
    }
    
    // 3. Resultado Recém-Concluído (Após submeter o formulário)
    if (resultado) {
        const pontuacaoTotal = Object.values(respostas).reduce((acc, currentScore) => acc + currentScore, 0);
        return (
            <div className="quiz-resultado-container page-wrapper">
                <h2 className="resultado-titulo">Seu Resultado</h2>
                <h3 className="resultado-titulo">{resultado.titulo}</h3>
                <p className="resultado-texto">{resultado.texto}</p>
                <div className="resultado-pontuacao">
                   <p>Sua pontuação total foi: **{pontuacaoTotal}/30**</p>
                </div>
                {!currentUser && (
                    <p className="login-text">
                        **Faça login** para salvar este resultado e acompanhar seu progresso!
                    </p>
                )}
            </div>
        );
    }

    // 4. Formulário do Quiz (Padrão)
    return (
        <div className="quiz-container page-wrapper">
            <h2 className="quiz-header-title">Check-up de Hábitos de Saúde</h2>
            <p className="quiz-instruction">Responda às perguntas abaixo para avaliar seus hábitos de saúde e bem-estar. Não há respostas certas ou erradas; o objetivo é a sua autoavaliação.</p>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {perguntas.map(q => (
                    <div key={q.id} className="quiz-question-block">
                        <p className="question-text">{q.id}. {q.pergunta}</p>
                        <div className="options-group">
                            {q.opcoes.map(o => (
                                <label key={o.texto} className="option-label">
                                    <input
                                        type="radio"
                                        name={`pergunta-${q.id}`}
                                        value={o.pontuacao} 
                                        onChange={() => handleChange(q.id, o.pontuacao)}
                                        checked={respostas[q.id] === o.pontuacao}
                                    />
                                    <span className="option-text">{o.texto}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                
                <div>
                <button 
                    type="submit" 
                    className="quiz-button submit-button"
                    disabled={!isQuizCompleto}
                >
                    {isQuizCompleto ? "Ver Meu Resultado" : `Responder ${perguntas.length - Object.keys(respostas).length} perguntas restantes`}
                </button>
                </div>
            </form>
        </div>
    );
}