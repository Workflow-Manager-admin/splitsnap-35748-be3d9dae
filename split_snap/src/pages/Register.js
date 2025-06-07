import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Loader from "../components/Loader";

/**
 * Register page for SplitSnap.
 */
export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { error } = await register(email, password);
      if (error) throw error;
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-8 mt-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-5 text-blue-700">Register for SplitSnap</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          Email:
          <input
            type="email" value={email} required
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded mt-1"
            autoComplete="username"
            disabled={loading}
          />
        </label>
        <label className="block text-sm">
          Password:
          <input
            type="password" value={password} required
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded mt-1"
            autoComplete="new-password"
            disabled={loading}
          />
        </label>
        {err && <div className="text-red-600 text-xs">{err}</div>}
        <button type="submit" className="w-full btn-blue mt-1" disabled={loading}>
          {loading ? <Loader /> : "Register"}
        </button>
      </form>
      <div className="mt-4 text-sm text-center">
        Already have an account? <Link className="text-blue-600 underline" to="/login">Sign In</Link>
      </div>
    </div>
  );
}
