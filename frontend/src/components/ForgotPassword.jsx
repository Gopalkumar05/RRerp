import React, { useState } from "react";
import {  Link} from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/v1/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("✅ Reset link sent! Check your email.");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("❌ Failed to send reset link. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-4">Forgot Password</h2>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="Enter your email" required
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button type="submit" className="bg-red-500 text-white p-2 w-full rounded-lg hover:bg-red-600 transition" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-3">
          Remember your password? <Link to="/login-teacher" className="text-red-500 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
