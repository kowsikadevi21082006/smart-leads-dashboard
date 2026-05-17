import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../api/auth";
import { extractErrorMessage, storageKeys } from "../api/axios";
import { LoginCredentials, RegisterPayload, User, UserRole } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface JwtPayload {
  role?: UserRole;
}

const decodeToken = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded)) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
};

const persistAuth = (user: User) => {
  localStorage.setItem(
    storageKeys.auth,
    JSON.stringify({
      token: user.token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  );
};

const buildUser = (token: string, email: string, name = ""): User => {
  const payload = decodeToken(token);

  return {
    name,
    email,
    role: payload?.role ?? "sales",
    token,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(storageKeys.auth);

    if (!raw) {
      setIsAuthLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        token?: string;
        user?: Pick<User, "name" | "email" | "role">;
      };

      if (!parsed.token) {
        localStorage.removeItem(storageKeys.auth);
        setIsAuthLoading(false);
        return;
      }

      setToken(parsed.token);
      setUser({
        name: parsed.user?.name ?? "",
        email: parsed.user?.email ?? "",
        role: parsed.user?.role ?? "sales",
        token: parsed.token,
      });
    } catch {
      localStorage.removeItem(storageKeys.auth);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginRequest({ email, password } as LoginCredentials);
      const nextUser = buildUser(
        response.token,
        response.user?.email ?? email,
        response.user?.name ?? ""
      );

      setUser(nextUser);
      setToken(response.token);
      persistAuth(nextUser);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await registerRequest({ name, email, password } as RegisterPayload);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const logout = () => {
    localStorage.removeItem(storageKeys.auth);
    setUser(null);
    setToken(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isAuthLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
