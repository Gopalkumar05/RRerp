import React, { useState } from "react";
import { useParams, Link ,useNavigate} from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/user/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("✅ Password updated successfully! Redirecting...");
        setTimeout(() => navigate("/login-teacher"), 2000);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("❌ Failed to reset password. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-500 mb-4">Reset Password</h2>

        {message && (
          <div className="text-center mb-2">
            <p className="text-green-500 transition duration-300 ease-in-out">{message}</p>
          
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center transition duration-300 ease-in-out mb-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-sm text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 w-full rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-3">
          Remembered your password?{" "}
          <Link to="/login-teacher" className="text-blue-500 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
