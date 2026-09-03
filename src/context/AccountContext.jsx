import { createContext, useContext, useState } from "react";

const AccountContext = createContext(null);
const STORAGE_KEY = "ossau-bois-account";

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  });

  const register = (details) => {
    const nextAccount = { name: details.name, email: details.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAccount));
    setAccount(nextAccount);
  };

  const login = (details) => {
    const nextAccount = { name: details.name || details.email.split("@")[0], email: details.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAccount));
    setAccount(nextAccount);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAccount(null);
  };

  return <AccountContext.Provider value={{ account, register, login, logout }}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within AccountProvider");
  return context;
}
