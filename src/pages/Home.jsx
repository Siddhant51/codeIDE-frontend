import React, { useState, useEffect, useContext } from "react";
import { Link, replace } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { FaCode } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/Theme";
import { Api } from "../helper/Api";

const HomePage = ({ token, setToken }) => {
  const navigate = useNavigate();
  // const [currentUser, setCurrentUser] = useState("");
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isLightMode, toggleTheme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello!</h1>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(
    "* { padding: 0px; margin: 0px; background-color: rgb(244,244,244); font-family: Arial, Helvetica, sans-serif;}"
  );
  const [jsCode, setJsCode] = useState("// some comment");

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${Api}/projects`, {
        headers: {
          Authorization: token,
        },
      });
      setProjects(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        handleLogout();
      } else {
        console.error("Error fetching projects:", error);
      }
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const projectName = prompt("Enter project name:");
      if (projectName) {
        const response = await axios.post(
          `${Api}/project`,
          {
            name: projectName,
            htmlCode,
            cssCode,
            jsCode,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("New project created:", response.data);
        fetchProjects();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      className={`${
        isLightMode ? "bg-gray-100" : "bg-gray-900"
      } h-screen transition-all duration-300`}
    >
      {/* Primary Navbar */}
      <div
        className={`${
          isLightMode ? "bg-white" : "bg-[#1A1A2E]"
        } h-[10vh] flex items-center justify-between px-10 shadow-md transition-all duration-300`}
      >
        <h1
          className={`${
            isLightMode ? "text-gray-800" : "text-white"
          } text-2xl font-bold`}
        >
          Code IDE
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Logout
          </button>
          <MdLightMode
            className={`text-xl cursor-pointer transition-all duration-300 ${
              isLightMode ? "text-gray-700" : "text-white"
            } hover:text-green-500`}
            onClick={toggleTheme}
          />
        </div>
      </div>

      {/* Secondary Navbar */}
      <div
        className={`${
          isLightMode ? "bg-gray-200" : "bg-[#16213E]"
        } h-[9vh] px-10 text-white flex items-center justify-between gap-2 transition-all duration-300`}
      >
        <input
          type="text"
          placeholder="Search projects..."
          className="border rounded px-4 py-2 w-1/3 mr-4 text-gray-700"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          onClick={handleCreateProject}
          className="bg-green-500 flex items-center px-4 py-2 rounded-lg hover:bg-green-600 transition-transform"
        >
          <MdAdd className="mr-2" /> Create Project
        </button>
      </div>

      {/* Projects Display Area */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading projects...</p>
        ) : (
          projects
            .filter((project) =>
              project.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((project) => (
              <Link
                to={`/editor/${project._id}`}
                key={project._id}
                className={`${
                  isLightMode ? "bg-white" : "bg-gray-800"
                } shadow-md rounded-lg p-4 text-center transition-transform transform hover:scale-105 flex items-center justify-center gap-2`}
              >
                <div className="bg-sky-500 rounded-lg">
                  <FaCode className="text-2xl text-gray-700 m-2" />{" "}
                </div>
                <h2
                  className={`text-lg font-semibold ${
                    isLightMode ? "text-gray-800" : "text-white"
                  }`}
                >
                  {project.name}
                </h2>
              </Link>
            ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
