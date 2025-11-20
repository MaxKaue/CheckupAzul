Perfeito! Aqui está um **README completo pronto** para o seu projeto “Saúde Homem Web”, já adaptado para copiar e colar:

```markdown
# Checkup Azul

Projeto de um sistema de conscientização sobre saúde masculina, com quiz de hábitos de saúde e análise de resultados.

---

## Tecnologias utilizadas

**Frontend:**
- React 19
- React Router Dom 7
- Chart.js e Recharts
- CSS customizado

**Backend:**
- Node.js
- Express 5
- PostgreSQL
- bcrypt
- jsonwebtoken
- cors
- dotenv

**Infraestrutura / DevOps:**

- Docker & Docker Compose (para PostgreSQL e aplicação)
- pgAdmin (interface web para gerenciar o banco de dados PostgreSQL)

---

## Estrutura do Projeto

```

Saúde-Homem-Web/
├─ Frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ styles/
│  │  └─ pages/
│  ├─ package.json
│  └─ .env.example
├─ Backend/
│  ├─ routes/
│  ├─ controllers/
│  ├─ db/
│  ├─ package.json
│  └─ .env.example
└─ docker-compose.yml

````

---

## Configuração do Banco de Dados

As tabelas necessárias estão definidas no script SQL abaixo:

```sql
-- Table: public.usuarios
CREATE TABLE IF NOT EXISTS public.usuarios
(
    id integer NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass),
    nome_usuario character varying(100),
    email character varying(100) NOT NULL,
    senha_hash character varying(200) NOT NULL,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id),
    CONSTRAINT usuarios_email_key UNIQUE (email)
);

-- Table: public.quiz_resultadoss
CREATE TABLE IF NOT EXISTS public.quiz_resultadoss
(
    id integer NOT NULL DEFAULT nextval('quiz_resultadoss_id_seq'::regclass),
    user_id integer,
    total_score integer NOT NULL,
    result_title text NOT NULL,
    result_text text NOT NULL,
    answers jsonb NOT NULL,
    question_count integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT quiz_resultadoss_pkey PRIMARY KEY (id)
);

-- Table: public.usersessions
CREATE TABLE IF NOT EXISTS public.usersessions
(
    id integer NOT NULL DEFAULT nextval('usersessions_id_seq'::regclass),
    user_id integer,
    session_token text NOT NULL,
    criado_em timestamp without time zone DEFAULT now(),
    CONSTRAINT usersessions_pkey PRIMARY KEY (id),
    CONSTRAINT usersessions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.usuarios (id)
        ON DELETE CASCADE
);
````

> Dica: salve este script em um arquivo `init.sql` para criar o banco de dados automaticamente.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do frontend e backend baseado no `.env.example`.

Exemplo de `.env.example`:

```
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=...
DB_NAME=...
```

---

## Docker

Para subir o PostgreSQL e o pgAdmin, use o `docker-compose.yml`.

Ele já referencia variáveis de ambiente através do `.env`. Não inclua senhas diretamente no arquivo do docker.

**Comando para iniciar:**

```bash
docker-compose up -d
```

---

## Instalação

### Backend

```bash
cd Backend
npm install
npm run dev   # inicia em modo desenvolvimento
```

### Frontend

```bash
cd Frontend
npm install
npm start     # inicia a aplicação React
```

---

## Uso

1. Faça login ou cadastro.
2. Inicie o quiz de hábitos de saúde.
3. Ao finalizar, veja seu resultado com pontuação e análise.
4. Você pode refazer o quiz ou voltar para a página inicial.

---

## Rotas principais

**Backend (Express):**

| Método | Rota                      | Descrição                |
| ------ | ------------------------- | ------------------------ |
| POST   | `/login`                  | Autenticação do usuário  |
| POST   | `/register`               | Cadastro de novo usuário |
| GET    | `/quizresultado/:user_id` | Buscar resultado do quiz |
| POST   | `/quiz`                   | Salvar resultado do quiz |

---

## Observações

* Todas as senhas e variáveis sensíveis devem estar apenas no `.env`.
* O Docker cria containers separados para PostgreSQL e pgAdmin.
* Para outros desenvolvedores, basta copiar `.env.example` e criar suas variáveis locais.

---
