import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import Input from "../components/Input";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const locationState = location.state as
    | { from?: { pathname?: string }; message?: string }
    | null;

  const from = locationState?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (locationState?.message) {
      setMessage(locationState.message);
    }
  }, [locationState?.message]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Login failed. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign in to your account"
      description="Use your work email and password to access a cleaner, high-contrast lead dashboard."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-accent hover:text-accent/80" to="/register">
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
        />

        {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

        <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default Login;
