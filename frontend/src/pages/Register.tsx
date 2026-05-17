import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import Input from "../components/Input";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await register(name, email, password);
      const message = "Registration successful. Redirecting to login...";
      setSuccessMessage(message);
      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Team Onboarding"
      title="Create your account"
      description="Join the workspace and start organizing your leads with a consistent, polished workflow."
      footer={
        <>
          Already registered?{" "}
          <Link className="font-semibold text-accent hover:text-accent/80" to="/login">
            Back to login
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your full name"
        />

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
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
        />

        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        {successMessage ? <StatusMessage tone="success">{successMessage}</StatusMessage> : null}

        <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default Register;
