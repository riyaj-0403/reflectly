import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:4000";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/journal");
      } else {
        setError(data.msg || "Login failed. Please try again.");
      }
    } catch {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8">

        <h1 className="text-2xl font-semibold text-center mb-2">Welcome back</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Continue your journaling journey</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}