import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginStudent = () => {
  const [code, setCode] = useState("");
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!roll.trim() || !code.trim()) {
      alert("Please enter both Roll Number and Teacher Code.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roll, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess(true);
      setTimeout(() => navigate("/student"), 1500);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md transition-transform transform hover:scale-[1.02]">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Student Login
        </h2>

        <input
          type="text"
          placeholder="Enter Roll Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />

        <input
          type="text"
          placeholder="Enter Teacher Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || success}
          className={`w-full py-3 text-white font-semibold rounded-xl transition duration-300 ${
            success
              ? "bg-green-500 cursor-default"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {success ? "Login Successful ✅" : loading ? "Logging in..." : "Enter"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/signup-student" className="text-green-600 font-medium hover:underline">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginStudent;
