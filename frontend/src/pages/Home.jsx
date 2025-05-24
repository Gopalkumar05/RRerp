import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { useState, useEffect } from "react";

const Home = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [notifications, setNotifications] = useState(0);

  // Check if the notification has been clicked before
  useEffect(() => {
    const fetchNotifications = async () => {
      // Simulate an API call to fetch notifications
      const newNotifications = await new Promise((resolve) =>
        setTimeout(() => resolve(1), 1000)
      );

      // Only show notifications if not previously clicked
      const notificationClicked = localStorage.getItem("notificationClicked");

      if (!notificationClicked) {
        setNotifications(newNotifications);
      }
    };

    fetchNotifications();
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setDropdownOpen(false);
  };

  const handleHomeClick = () => {
    window.location.reload();
  };

  const handleCircularClick = () => {
    setNotifications(0); // Clear notification on click
    localStorage.setItem("notificationClicked", "true"); // Store the click state

    // After clearing, reset the flag when new notifications come in
    setTimeout(() => {
      localStorage.removeItem("notificationClicked"); // Reset the flag when a new notification arrives
    }, 3000); // After 3 seconds, allow new notifications to show
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white relative overflow-hidden">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md py-2 px-4 flex justify-between items-center z-20 relative">
        <div
          onClick={handleHomeClick}
          className="text-2xl font-bold text-blue-800 cursor-pointer"
        >
          R.R. Group of Institutions
        </div>
        <ul className="flex items-center space-x-6">
          <li>
            <Link
              to="/"
              className="text-blue-800 hover:text-blue-600 font-medium"
              onClick={handleHomeClick}
            >
              Home
            </Link>
          </li>

          {/* Dropdown for Login */}
          <li className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-blue-800 hover:text-blue-600 font-medium focus:outline-none"
            >
              Login ▾
            </button>
            {dropdownOpen && (
              <ul className="absolute mt-2 bg-white shadow-lg rounded-md py-2 w-40 z-50">
                <li>
                  <button
                    onClick={() => handleRoleSelect("student")}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-800"
                  >
                    Student
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoleSelect("teacher")}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-800"
                  >
                    Teacher
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* RR Circular with Notification */}
          <li className="relative">
            <Link
              to="/act"
              className="text-blue-800 hover:text-blue-600 font-medium"
              onClick={handleCircularClick}
            >
              RR circular
            </Link>
            {notifications > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {notifications}
              </span>
            )}
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center p-6 pt-20 relative z-10">
        <img
          src="/rrlogo.png"
          alt="RR Group Logo"
          className="absolute left-1/2 top-1/3 w-72 opacity-20 blur-[1px] transform -translate-x-1/2 -translate-y-1/2 z-0"
        />

        <div className="text-center mb-10 z-10">
          <img src="/rrlogo.png" alt="RR Group Logo" className="w-24 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2 drop-shadow">
            Welcome to Attendance Portal
          </h1>
          <p className="text-gray-600 text-md">R.R. Group of Institutions</p>
        </div>

        {selectedRole && (
          <div className="z-10 mt-6 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 flex flex-col items-center w-80 sm:w-96 hover:scale-105 transition-transform duration-300">
            {selectedRole === "teacher" ? (
              <>
                <FaChalkboardTeacher className="text-blue-700 text-5xl mb-3" />
                <h2 className="text-2xl font-bold text-blue-700 mb-4">Teacher Portal</h2>
                <Link
                  to="/signup-teacher"
                  className="text-blue-600 hover:text-blue-800 font-medium underline mb-3"
                >
                  Signup as Teacher
                </Link>
                <Link
                  to="/login-teacher"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
                >
                  Login as Teacher
                </Link>
              </>
            ) : (
              <>
                <FaUserGraduate className="text-green-700 text-5xl mb-3" />
                <h2 className="text-2xl font-bold text-green-700 mb-4">Student Portal</h2>
                <Link
                  to="/signup-student"
                  className="text-green-600 hover:text-green-800 font-medium underline mb-3"
                >
                  Signup as Student
                </Link>
                <Link
                  to="/login-student"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
                >
                  Login as Student
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Developer Credit */}
      <div className="absolute bottom-2 right-4 z-10">
        <button className="text-xs sm:text-sm bg-black text-white px-2 py-1 rounded-full shadow-md hover:bg-gray-800 transition">
          Developed by Gopal Kumar
        </button>
      </div>
    </div>
  );
};

export default Home;
