import { Toaster, toast } from "sonner";
import { useState } from "react";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Dashboard } from "./components/Dashboard";
import { PollPage } from "./components/PollPage";

// Dynamically resolves to whatever host opened the page, always on port 5000
const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000`;

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.data.token);
      setIsLoggedIn(true);
      toast.success("Logged in!");

    } else {
      toast.error(data.message ?? "Login failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return { isLoggedIn, login, logout };
}

function PollRoute({ isLoggedIn, logout }: { isLoggedIn: boolean; logout: () => void }) {
  const { pollId } = useParams<{ pollId: string }>();
  const navigate = useNavigate();

  return (
    <div>
      {isLoggedIn && (
        <div className="flex justify-end p-4">
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => { logout(); navigate("/"); }}
          >
            Logout
          </button>
        </div>
      )}
      <PollPage pollId={pollId!} onBack={() => navigate(isLoggedIn ? "/dashboard" : "/")} />
    </div>
  );
}

function DashboardRoute({ isLoggedIn, logout }: { isLoggedIn: boolean; logout: () => void }) {
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return <Dashboard logout={logout} />;
}

function AuthRoute({ isLoggedIn, login }: { isLoggedIn: boolean; login: (e: string, p: string) => Promise<void> }) {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isRegister, setisRegister] = useState(false);
  const navigate = useNavigate();

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const register = async () => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Account created! Please log in.");
      resetForm();
      setisRegister(false);
    } else {
      toast.error(data.message ?? "Registration failed.");
    }
  };

  const handleLogin = async () => {
    await login(email, password);
    navigate("/dashboard");
  };

  const resetForm = () => {
    setusername("");
    setemail("");
    setpassword("");
  };
  const toggleMode = () => {
    resetForm();
    setisRegister((prev) => !prev);
  };

  const authProps = { email, setemail, password, setpassword, toggleMode };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      {isRegister ? (
        <RegisterForm {...authProps} username={username} setusername={setusername} register={register} />
      ) : (
        <LoginForm {...authProps} login={handleLogin} />
      )}
    </div>
  );
}

// ── Root App — Toaster lives here ONCE, above all routes ─────────────────────
export function App() {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<AuthRoute isLoggedIn={isLoggedIn} login={login} />} />
        <Route path="/dashboard" element={<DashboardRoute isLoggedIn={isLoggedIn} logout={logout} />} />
        <Route path="/polls/:pollId" element={<PollRoute isLoggedIn={isLoggedIn} logout={logout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;