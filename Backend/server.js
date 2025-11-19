import express from "express";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

const { Pool } = pkg;
const app = express();
app.use(express.json());
app.use(cors()); // Permite requisições do front-end
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});


// Teste de conexão
pool.connect()
  .then(() => console.log("✅ Conectado ao PostgreSQL!"))
  .catch((err) => console.error("❌ Erro ao conectar ao banco:", err));

// ================= USUÁRIOS ==================

app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});



// Registro de usuário
app.post("/register", async (req, res) => {
  const { nome_usuario, email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (nome_usuario, email, senha_hash) VALUES ($1, $2, $3) RETURNING *",
      [nome_usuario, email, hashedPassword]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
});

// Login de usuário
// Login de usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      return res.status(400).json({ erro: "Senha incorreta" });
    }

    // Gera token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "SECRET_KEY_AQUI",
      { expiresIn: "1d" }
    );

    // Armazena token no banco
    await pool.query(
      "INSERT INTO UserSessions (user_id, session_token) VALUES ($1, $2)",
      [user.id, token]
    );

    // Retorna informações para o frontend
    res.json({
      user: { id: user.id, nome_usuario: user.nome_usuario, email: user.email },
      token
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});


// Logout de usuário
app.post("/logout", async (req, res) => {
  const { session_token } = req.body;

  try {
    if (!session_token) {
      return res.status(400).json({ erro: "Token da sessão não fornecido" });
    }

    const result = await pool.query(
      "DELETE FROM UserSessions WHERE session_token = $1 RETURNING *",
      [session_token]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Sessão não encontrada" });
    }

    res.json({ sucesso: true, mensagem: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao deslogar:", error);
    res.status(500).json({ erro: "Erro ao realizar logout" });
  }
});



// Retorna todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nome_usuario, email FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});

// ================= QUIZ ==================

// Salvar resultado do quiz
app.post("/quiz", async (req, res) => {
  const {
    user_id,
    total_score,
    result_title,
    result_text,
    answers,
    created_at,
    question_count
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO quiz_resultadoss 
       (user_id, total_score, result_title, result_text, answers, question_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [user_id, total_score, result_title, result_text, answers, question_count, created_at]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao salvar resultado do quiz:", error);
    res.status(500).json({ erro: "Erro ao salvar resultado do quiz" });
  }
});




// Buscar resultado do quiz por usuário
app.get("/quizresultado/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM quiz_resultadoss WHERE user_id = $1 ORDER BY id DESC LIMIT 1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.json({ error: "Nenhum resultado encontrado." });
    }

    const quiz = result.rows[0];

    // IMPORTANTE: Suas perguntas precisam estar iguais às do front
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

    const respostasUsuario = quiz.answers; // JSON salvo no banco

    // MONTA A LISTA FINAL
    const perguntasRespondidas = perguntas.map((item, index) => {
      const respostaValor = respostasUsuario[index]; // ex: 3,1,0

      const respostaTexto = item.opcoes.find(o => o.valor === respostaValor)?.texto || "Não respondida";

      return {
        pergunta: item.pergunta,
        resposta_valor: respostaValor,
        resposta_texto: respostaTexto
      };
    });

    return res.json({
      result_title: quiz.result_title,
      result_text: quiz.result_text,
      total_score: quiz.total_score,
      perguntas: perguntasRespondidas,
      created_at: quiz.created_at,
    });
  } catch (error) {
    console.error("Erro ao buscar resultado do quiz:", error);
    res.status(500).json({ error: "Erro ao buscar dados." });
  }
});



// ================= SERVIDOR ==================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
