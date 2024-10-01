import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MdLightMode } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/Theme";
import { Api } from "../helper/Api";

const Login = ({ setToken }) => {
  const { isLightMode, toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${Api}/login`, {
        email,
        password,
      });

      // Handle successful login
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/", { replace: true }); //
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${
        isLightMode ? "bg-gray-100" : "bg-gray-900"
      } transition-colors duration-300`}
    >
      <div className="absolute top-4 right-4">
        <MdLightMode
          onClick={toggleTheme}
          className={`cursor-pointer text-2xl ${
            isLightMode ? "text-gray-900" : "text-white"
          }`}
        />
      </div>
      <div
        className={`w-[90%] max-w-md p-8 shadow-lg ${
          isLightMode ? "bg-white" : "bg-gray-800"
        } rounded-lg transition-colors duration-300`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            isLightMode ? "text-gray-800" : "text-white"
          } text-center`}
        >
          Log In
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={`p-3 rounded-md ${
              isLightMode
                ? "bg-gray-200 text-gray-800"
                : "bg-gray-700 text-white"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`p-3 rounded-md ${
              isLightMode
                ? "bg-gray-200 text-gray-800"
                : "bg-gray-700 text-white"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          <button
            type="submit"
            className="p-3 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 transition-all duration-200"
          >
            Log In
          </button>
        </form>
        <p
          className={`mt-4 text-center ${
            isLightMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Don't have an account?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
