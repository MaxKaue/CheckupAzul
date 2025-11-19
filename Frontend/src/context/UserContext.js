import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedId = localStorage.getItem("user_id");

    if (storedUser && storedId) {
      const parsed = JSON.parse(storedUser);
      parsed.id = Number(storedId);   // <-- adiciona o id corretamente
      setUser(parsed);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
