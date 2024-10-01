import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MdLightMode } from "react-icons/md";
import axios from "axios";
import { ThemeContext } from "../context/Theme";
import { Api } from "../helper/Api";

const Register = () => {
  const { isLightMode, toggleTheme } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${Api}/register`, {
        username,
        email,
        password,
      });

      // Handle successful registration
      console.log(response.data);
      alert("Registration successful!");
      // Clear form fields after successful submission
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      alert("Registration failed. Please check your input.");
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
          Register
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Full Name"
            className={`p-3 rounded-md ${
              isLightMode
                ? "bg-gray-200 text-gray-800"
                : "bg-gray-700 text-white"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
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
            Register
          </button>
        </form>
        <p
          className={`mt-4 text-center ${
            isLightMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
