import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function getErrorMessage(err, fallback) {
  const details = err.response?.data?.details;
  return details?.[0]?.msg || err.response?.data?.message || fallback;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@example.com", password: "Password123!" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Team Task Manager</h1>
        <p>Sign in to manage projects, deadlines, and team work.</p>
        {error && <div className="alert">{error}</div>}
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Login</button>
        <Link to="/signup">Create an account</Link>
      </form>
    </main>
  );
}
