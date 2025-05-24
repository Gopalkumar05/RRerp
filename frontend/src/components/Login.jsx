import React, { useState } from "react";
import { useNavigate ,Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoginSuccess(false);
  
    try {
      const response = await fetch("https://rrerp.onrender.com/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Save User Data
        setLoginSuccess(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Check your connection.");
    }
  
    setLoading(false);
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Login to Your Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="email" type="email" placeholder="Email" required onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500" />

          <input name="password" type="password" placeholder="Password" required onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500" />

          <button
            type="submit"
            className={`p-2 w-full rounded-lg transition ${loginSuccess
                ? "bg-green-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            disabled={loading || loginSuccess}
          >
            {loginSuccess ? "✅ Login Successful!" : loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-3">
          Don't have an account? <Link to="/signup" className="text-green-500 font-medium">Signup</Link>
        </p>
        <p className="text-center text-gray-600 mt-1">
          <Link to="/forgot-password" className="text-blue-500 font-medium">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
