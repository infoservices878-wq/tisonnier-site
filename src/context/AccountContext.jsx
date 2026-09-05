import { createContext, useContext, useEffect, useState } from "react";

const AccountContext = createContext(null);
const STORAGE_KEY = "ossau-bois-account";
const WORDPRESS_API_URL = (import.meta.env.VITE_WORDPRESS_API_URL || "").replace(/\/+$/, "");

function readStoredAccount() {
  try {
    const account = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return account?.token && account?.email ? account : null;
  } catch {
    return null;
  }
}

async function authRequest(path, options = {}) {
  if (!WORDPRESS_API_URL) {
    throw new Error("La connexion client n'est pas configurée.");
  }

  const response = await fetch(`${WORDPRESS_API_URL}/wp-json/ossau/v1/auth/${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || "Une erreur est survenue. Veuillez réessayer.");
    error.code = payload.code || "";
    throw error;
  }

  return payload;
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(readStoredAccount);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const saveAccount = (nextAccount) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAccount));
    setAccount(nextAccount);
  };

  const loadOrders = async (token = account?.token) => {
    if (!token) return;
    setIsLoadingOrders(true);
    try {
      const payload = await authRequest("orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(payload.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!account?.token) return;

    authRequest("me", {
      headers: { Authorization: `Bearer ${account.token}` },
    })
      .then((payload) => saveAccount({ ...payload.user, token: account.token }))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAccount(null);
      });
  }, []);

  useEffect(() => {
    if (account?.token) loadOrders(account.token);
    else setOrders([]);
  }, [account?.token]);

  const register = async (details) => {
    setAuthError("");
    setIsAuthenticating(true);
    try {
      const payload = await authRequest("register", {
        method: "POST",
        body: JSON.stringify({
          name: details.name.trim(),
          email: details.email.trim().toLowerCase(),
          password: details.password,
        }),
      });
      return payload;
    } catch (error) {
      setAuthError(error.message || "Impossible de créer le compte.");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const login = async (details) => {
    setAuthError("");
    setIsAuthenticating(true);
    try {
      const payload = await authRequest("login", {
        method: "POST",
        body: JSON.stringify({
          email: details.email.trim().toLowerCase(),
          password: details.password,
        }),
      });
      saveAccount(payload.user);
      return true;
    } catch (error) {
      setAuthError(error.message || "E-mail ou mot de passe incorrect.");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const forgotPassword = async (email) => {
    setAuthError("");
    setIsAuthenticating(true);
    try {
      await authRequest("forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      return true;
    } catch (error) {
      setAuthError(error.message || "Impossible d'envoyer l'e-mail de réinitialisation.");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const resetPassword = async (details) => {
    setAuthError("");
    setIsAuthenticating(true);
    try {
      await authRequest("reset-password", {
        method: "POST",
        body: JSON.stringify(details),
      });
      return true;
    } catch (error) {
      setAuthError(error.message || "Impossible de modifier le mot de passe.");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const verifyEmail = async (details) => {
    setAuthError("");
    setIsAuthenticating(true);
    try {
      await authRequest("verify-email", {
        method: "POST",
        body: JSON.stringify(details),
      });
      return true;
    } catch (error) {
      setAuthError(error.message || "Impossible de confirmer cette adresse e-mail.");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    const token = account?.token;
    localStorage.removeItem(STORAGE_KEY);
    setAccount(null);
    if (token) {
      authRequest("logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  return <AccountContext.Provider value={{ account, authError, isAuthenticating, orders, isLoadingOrders, loadOrders, register, login, forgotPassword, resetPassword, verifyEmail, logout }}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within AccountProvider");
  return context;
}
