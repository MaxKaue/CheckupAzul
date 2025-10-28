import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// IMPORTAÇÃO DOS ESTILOS
import "../styles/Tema.css";    
import "../styles/GraficoMortalidade.css"; 
// Certifique-se de que GraficoMortalidade.css e theme.css (se usado) estão acessíveis.

export default function GraficoMortalidade() {
  const ref = useRef(null);
  
  const [visao, setVisao] = useState("total");
  const TOTAL_GERAL = 815322; 

  const dadosMensal = [
    { mes: "Jan", Feminino: 31166, Masculino: 33635 },
    { mes: "Fev", Feminino: 28526, Masculino: 31540 },
    { mes: "Mar", Feminino: 32799, Masculino: 36295 },
    { mes: "Abr", Feminino: 33055, Masculino: 36204 },
    { mes: "Mai", Feminino: 35158, Masculino: 37396 },
    { mes: "Jun", Feminino: 34076, Masculino: 36534 },
    { mes: "Jul", Feminino: 35152, Masculino: 38039 },
    { mes: "Ago", Feminino: 34812, Masculino: 36872 },
    { mes: "Set", Feminino: 32622, Masculino: 34412 },
    { mes: "Out", Feminino: 32074, Masculino: 34137 },
    { mes: "Nov", Feminino: 30461, Masculino: 32691 },
    { mes: "Dez", Feminino: 31382, Masculino: 33484 },
  ];

  const dadosTotal = [
    {
      categoria: "Total Consolidado",
      Feminino: 394083,
      Masculino: 421239,
    },
  ];
  
  const toggleVisao = () => {
    setVisao(visao === "total" ? "mensal" : "total");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
  }, []);

  const renderizarGrafico = () => {
    const data = visao === "total" ? dadosTotal : dadosMensal;
    const dataKeyX = visao === "total" ? "categoria" : "mes";

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {/* Cor do stroke no CartesianGrid pode ser definida por variável CSS global se necessário */}
          <CartesianGrid strokeDasharray="3 3" stroke="#444" /> 
          
          {/* Os 'fill' no recharts aceitam variáveis CSS ou hex codes */}
          <XAxis dataKey={dataKeyX} tick={{ fill: "var(--cor-principal)", fontSize: 12 }} />
          <YAxis tick={{ fill: "var(--cor-principal)", fontSize: 12 }} />

          <Tooltip 
            formatter={(value) => [value.toLocaleString('pt-BR'), 'Casos']}
          />
          <Legend />
          
          {/* Cores definidas usando as variáveis CSS para facilidade de tema */}
          <Bar dataKey="Feminino" fill="var(--cor-terciaria)" name="Feminino" />
          <Bar dataKey="Masculino" fill="var(--cor-principal)" name="Masculino" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div ref={ref} className="grafico-container fade-in">
      <h2>
        {visao === "total"
          ? "Totais Consolidados de Casos por Gênero no Brasil"
          : "Distribuição Mensal de Casos por Gênero no Brasil"}
      </h2>
      <p>(Total Geral Feminino + Masculino: {TOTAL_GERAL.toLocaleString('pt-BR')})</p>

      {renderizarGrafico()}

      {/* Botão usa a classe CSS "toggle-button" */}
      <button 
        onClick={toggleVisao}
        className="toggle-button"
      >
        {visao === "total" ? "Ver Distribuição Mensal (Jan-Dez)" : "Ver Totais Consolidados"}
      </button>

      {/* Texto de conscientização usa a classe CSS "conscientizacao" */}
      <div className="conscientizacao">
        <h3>A sua saúde não é um jogo.</h3>
        <p>
          Os números de mortalidade entre a população masculina no Brasil acendem um alerta. 
          Enquanto as <strong className="destaque-texto">causas externas</strong> (como acidentes e violência) 
          dominam as estatísticas em homens jovens, o risco de morte prematura por doenças 
          que poderiam ser prevenidas é alarmante na vida adulta.
        </p>
        
        <p>
          As doenças do aparelho circulatório, câncer e problemas digestivos estão entre as 
          principais responsáveis por tirar a vida de milhares de homens todos os anos. 
          O cuidado e a prevenção são as suas maiores defesas.
        </p>
        <p style={{marginBottom: '2.5rem'}}>
          Principais Focos de Risco para a Saúde Masculina:
        </p>
        <ul>
          <li>✓ Doenças do Aparelho Circulatório (Infarto, AVC, Hipertensão)</li>
          <li>✓ Neoplasias (Câncer, com destaque para pulmão e próstata)</li>
          <li>✓ Doenças do Aparelho Digestivo e Alcoólicas</li>
          <li>✓ Doenças do Aparelho Respiratório</li>
        </ul>
        <p style={{marginTop: '2.5rem'}}>
          Não espere o pior. Fazer check-ups regulares e procurar apoio psicológico não é 
          sinal de fraqueza, é um ato de <strong className="destaque-texto">responsabilidade</strong> com o seu futuro e sua família.
        </p>
      </div>
      <div>
        <p>
          Além dos riscos físicos, o <strong className="destaque-texto">bem-estar mental</strong> exige atenção imediata. 
          Doenças como a depressão, muitas vezes ignoradas ou mascaradas, podem levar a graves 
          consequências. Cuidar da mente é tão vital quanto cuidar do corpo. Se precisar de ajuda, 
          procure um profissional de saúde mental ou <strong className="destaque-texto">ligue 188 (CVV).</strong>
        </p>
     </div> 
    </div>
  );
}