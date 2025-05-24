import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupTeacher = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [teacherCode, setTeacherCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/v1/user/send-otp", {
        username,
        email,
        password,
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/verify-otp",
        { email, otp }
      );

      setTeacherCode(response.data.code);
      setSuccess(true);

      setTimeout(() => navigate("/login-teacher"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96 transition-transform transform hover:scale-105 hover:shadow-xl">
        <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-6">
          Teacher Signup
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              onClick={handleSignup}
              className={`w-full text-white py-3 rounded-lg font-semibold transition duration-300 ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Signup"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-center text-gray-700 mb-4">
              An OTP has been sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={handleVerifyOtp}
              className={`w-full text-white py-3 rounded-lg font-semibold transition duration-300 ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </>
        )}

        {teacherCode && (
          <div className="mt-6 bg-green-100 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-green-700 font-semibold">Your Access Code:</p>
            <p className="text-lg font-bold text-green-900">{teacherCode}</p>
            <p className="text-sm text-gray-600 mt-1">
              Share this code with students to let them join.
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login-teacher")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupTeacher;
