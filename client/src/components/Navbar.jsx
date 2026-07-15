import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`${
        darkMode ? "bg-gray-900" : "bg-white"
      } shadow-md transition duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-blue-600"
            }`}
          >
            Learning Portal
          </Link>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-2xl"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {user ? (
              <>
                <span
                  className={darkMode ? "text-gray-200" : "text-gray-700"}
                >
                  Welcome, {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={
                    darkMode
                      ? "text-gray-200 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;