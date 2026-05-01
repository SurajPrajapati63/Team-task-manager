import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function getErrorMessage(err, fallback) {
  const details = err.response?.data?.details;
  return details?.[0]?.msg || err.response?.data?.message || fallback;
}

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [error, setError] = useState("");

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Signup failed"));
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Create Account</h1>
        {error && <div className="alert">{error}</div>}
        <input name="name" placeholder="Full name" value={form.name} onChange={update} minLength="2" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} minLength="8" required />
        <select name="role" value={form.role} onChange={update}>
          <option>Member</option>
          <option>Admin</option>
        </select>
        <button type="submit">Sign Up</button>
        <Link to="/login">Back to login</Link>
      </form>
    </main>
  );
}
