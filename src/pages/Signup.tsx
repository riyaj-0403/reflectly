import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:4000";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto-login: store token and redirect directly to journaling
        localStorage.setItem("token", data.token);
        navigate("/journal");
      } else {
        setError(data.msg || "Signup failed. Please try again.");
      }
    } catch {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8">

        <h1 className="text-2xl font-semibold text-center mb-2">Create your account</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Start your self-reflection journey</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            required
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}