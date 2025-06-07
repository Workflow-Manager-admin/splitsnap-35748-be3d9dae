import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Loader from "../components/Loader";

/**
 * Login page for SplitSnap.
 */
export default function Login() {
  const { login, loginWithProvider } = useAuth();
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
      const { error } = await login(email, password);
      if (error) throw error;
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "Login failed");
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function handleOAuth(provider) {
    try {
      await loginWithProvider(provider);
    } catch (e) {
      setErr(e.message || "Login with provider failed");
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-8 mt-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-5 text-blue-700">Sign in to SplitSnap</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          Email:
          <input
            type="email" value={email} required
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            className="w-full px-3 py-2 border rounded mt-1"
            disabled={loading}
          />
        </label>
        <label className="block text-sm">
          Password:
          <input
            type="password" value={password} required
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-3 py-2 border rounded mt-1"
            disabled={loading}
          />
        </label>
        {err && <div className="text-red-600 text-xs">{err}</div>}
        <button type="submit" className="w-full btn-blue mt-1" disabled={loading}>
          {loading ? <Loader /> : "Sign In"}
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={() => handleOAuth("google")}
          className="w-full border border-gray-200 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-50"
          disabled={loading}
        >
          <span className="material-icons text-blue-500">login</span>
          Sign in with Google
        </button>
      </div>
      <div className="mt-4 text-sm text-center">
        Don't have an account? <Link className="text-blue-600 underline" to="/register">Sign Up</Link>
      </div>
    </div>
  );
}
