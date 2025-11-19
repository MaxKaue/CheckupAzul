const API_URL = "http://localhost:3000";

export async function login(email, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer login");
  }

  return await response.json();
}

export async function getUsuarios() {
  const response = await fetch(`${API_URL}/usuarios`);
  return await response.json();
}


export async function register(nome_usuario, email, senha) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome_usuario, email, senha }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.erro || "Erro ao registrar usuário");
  }

  return await response.json();
}
