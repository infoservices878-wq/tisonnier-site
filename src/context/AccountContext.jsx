import { createContext, useContext, useState } from "react";

const AccountContext = createContext(null);
const STORAGE_KEY = "ossau-bois-account";
const CREDENTIALS_STORAGE_KEY = "ossau-bois-account-credentials";

function readStoredCredentials() {
  try {
    const credentials = JSON.parse(localStorage.getItem(CREDENTIALS_STORAGE_KEY));
    return credentials && typeof credentials === "object" ? credentials : {};
  } catch {
    return {};
  }
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  });
  const [authError, setAuthError] = useState("");

  const register = async (details) => {
    setAuthError("");
    const email = details.email.trim().toLowerCase();
    const credentials = readStoredCredentials();
    if (credentials[email]) {
      setAuthError("Cette adresse e-mail est déjà enregistrée. Connectez-vous.");
      return false;
    }
    const nextAccount = { name: details.name.trim(), email };
    credentials[email] = await hashPassword(details.password);
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAccount));
    setAccount(nextAccount);
    return true;
  };

  const login = async (details) => {
    setAuthError("");
    const email = details.email.trim().toLowerCase();
    const credentials = readStoredCredentials();
    if (!credentials[email] || credentials[email] !== await hashPassword(details.password)) {
      setAuthError("E-mail ou mot de passe incorrect.");
      return false;
    }
    const nextAccount = { name: email.split("@")[0], email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAccount));
    setAccount(nextAccount);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAccount(null);
  };

  return <AccountContext.Provider value={{ account, authError, register, login, logout }}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within AccountProvider");
  return context;
}
