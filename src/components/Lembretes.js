import { useState, useEffect, useContext } from "react";
import { db } from "../services/firebaseService";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { UserContext } from "../context/UserContext";

export default function Lembretes() {
  const { user } = useContext(UserContext);
  const [descricao, setDescricao] = useState("");
  const [lembretes, setLembretes] = useState([]);

  useEffect(() => {
    const fetchLembretes = async () => {
      if (!user) return;
      const querySnapshot = await getDocs(collection(db, "lembretes"));
      setLembretes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchLembretes();
  }, [user]);

  const adicionarLembrete = async () => {
    if (!descricao) return;
    await addDoc(collection(db, "lembretes"), { descricao, userId: user.uid, concluido: false });
    setDescricao("");
    setLembretes(prev => [...prev, { descricao, userId: user.uid, concluido: false }]);
  };

  const marcarConcluido = async (id) => {
    const docRef = doc(db, "lembretes", id);
    await updateDoc(docRef, { concluido: true });
    setLembretes(prev => prev.map(l => l.id === id ? { ...l, concluido: true } : l));
  };

  return (
    <div>
      <h2>Lembretes de Saúde</h2>
      <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Exame de sangue" />
      <button onClick={adicionarLembrete}>Adicionar</button>
      <ul>
        {lembretes.map(l => (
          <li key={l.id}>
            {l.descricao} - {l.concluido ? "✅" : "⏳"}
            {!l.concluido && <button onClick={() => marcarConcluido(l.id)}>Concluir</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
