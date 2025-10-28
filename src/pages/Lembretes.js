import React, { useState, useEffect } from "react";
// ALTERADO: Apenas as importações essenciais
import { auth, db } from "../services/firebaseService"; 
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import "../styles/Lembretes.css";

// Função para formatar a data
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // O Firestore pode retornar um objeto Timestamp, que tem um método toDate()
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
};

export default function Lembretes() {
    const [user, setUser] = useState(null);
    const [lembretes, setLembretes] = useState([]);
    const [novoLembrete, setNovoLembrete] = useState({ tipoExame: '', dataPrevista: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [emailStatus, setEmailStatus] = useState({}); // Para gerenciar status por item

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchLembretes(currentUser.uid);
            } else {
                setUser(null);
                setLembretes([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Função para buscar os lembretes do Firestore
    const fetchLembretes = async (uid) => {
        setLoading(true);
        setError('');
        try {
            const q = query(collection(db, "lembretes"), where("uidUsuario", "==", uid));
            const querySnapshot = await getDocs(q);
            const listaLembretes = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Ordena pelo mais próximo
            listaLembretes.sort((a, b) => a.dataPrevista.toDate() - b.dataPrevista.toDate());

            setLembretes(listaLembretes);
        } catch (err) {
            console.error("Erro ao buscar lembretes:", err);
            setError("Não foi possível carregar seus lembretes.");
        } finally {
            setLoading(false);
        }
    };

    // Função para adicionar um novo lembrete
    const handleAddLembrete = async (e) => {
        e.preventDefault();
        if (!user || !novoLembrete.tipoExame || !novoLembrete.dataPrevista) {
            setError("Preencha todos os campos.");
            return;
        }

        try {
            await addDoc(collection(db, "lembretes"), {
                uidUsuario: user.uid,
                tipoExame: novoLembrete.tipoExame,
                // Armazena a data como um objeto Date
                dataPrevista: new Date(novoLembrete.dataPrevista), 
                dataCriacao: new Date()
            });

            // Limpa o formulário e recarrega a lista
            setNovoLembrete({ tipoExame: '', dataPrevista: '' });
            fetchLembretes(user.uid);
        } catch (err) {
            console.error("Erro ao adicionar lembrete:", err);
            setError("Erro ao salvar o lembrete.");
        }
    };

    // Função para remover um lembrete
    const handleRemoveLembrete = async (id) => {
        try {
            await deleteDoc(doc(db, "lembretes", id));
            fetchLembretes(user.uid); // Recarrega a lista
        } catch (err) {
            console.error("Erro ao remover lembrete:", err);
            setError("Erro ao remover o lembrete.");
        }
    };
    
    // NOVO: Função para SIMULAR o envio de e-mail (retorna SUCESSO imediato)
    const handleTestEmail = async (lembrete) => {
        if (!user || !user.email) {
            alert("Erro: Usuário não logado ou e-mail indisponível.");
            return;
        }

        setEmailStatus(prev => ({ ...prev, [lembrete.id]: 'Enviando...' }));

        // Simula o tempo de uma chamada de API (500ms)
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        // Simulação: Sucesso Garantido para o template
        setEmailStatus(prev => ({ ...prev, [lembrete.id]: 'Enviado!' }));

        // Aqui é onde você adicionaria a lógica real do SendGrid/Cloud Function no futuro:
        /*
        const dataPrevistaFormatada = formatDate(lembrete.dataPrevista);
        const emailBody = `...`; // Corpo HTML

        try {
            await callSendEmailFunction({ 
                to: user.email,
                subject: `Lembrete: ${lembrete.tipoExame}`,
                html: emailBody
            });
            setEmailStatus(prev => ({ ...prev, [lembrete.id]: 'Enviado!' }));
        } catch (error) {
            setEmailStatus(prev => ({ ...prev, [lembrete.id]: 'Erro no servidor.' }));
        }
        */
    };
    // Fim da função de e-mail

    if (loading) {
        return <div className="loading-message page-wrapper">Carregando lembretes...</div>;
    }

    if (!user) {
        return <div className="error-message page-wrapper">Você precisa estar logado para gerenciar lembretes.</div>;
    }

    return (
        <div className="lembretes-container page-wrapper">
            <h2>📅 Gerenciador de Exames e Consultas</h2>
            <p className="instruction">Adicione exames preventivos e consultas de rotina para ser lembrado por e-mail.</p>

            {error && <div className="error-message">{error}</div>}

            {/* Formulário para Adicionar Lembrete */}
            <form onSubmit={handleAddLembrete} className="lembretes-form">
                <input
                    type="text"
                    placeholder="Tipo de Exame/Consulta (ex: Checkup Anual)"
                    value={novoLembrete.tipoExame}
                    onChange={(e) => setNovoLembrete({ ...novoLembrete, tipoExame: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={novoLembrete.dataPrevista}
                    onChange={(e) => setNovoLembrete({ ...novoLembrete, dataPrevista: e.target.value })}
                    required
                />
                <button type="submit" className="add-button">Adicionar Lembrete</button>
            </form>

            {/* Lista de Lembretes */}
            <div className="lembretes-list">
                <h3>Próximos Lembretes ({lembretes.length})</h3>
                {lembretes.length === 0 ? (
                    <p className="empty-message">Nenhum lembrete agendado. Adicione o seu primeiro!</p>
                ) : (
                    lembretes.map((lembrete) => (
                        <div key={lembrete.id} className="lembrete-item">
                            <div className="lembrete-info">
                                <h4>{lembrete.tipoExame}</h4>
                                <p>Data Prevista: 
                                    <span className="lembrete-date">
                                        {formatDate(lembrete.dataPrevista)}
                                    </span>
                                </p>
                            </div>
                            
                            {/* CONTROLES E ESTATUS */}
                            <div className="lembrete-actions">
                                {/* Botão de Teste de E-mail */}
                                <button
                                    onClick={() => handleTestEmail(lembrete)}
                                    className="test-email-button"
                                    disabled={emailStatus[lembrete.id] === 'Enviando...'}
                                >
                                    {emailStatus[lembrete.id] || 'Testar'}
                                </button>
                                
                                <button 
                                    onClick={() => handleRemoveLembrete(lembrete.id)} 
                                    className="remove-button"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}