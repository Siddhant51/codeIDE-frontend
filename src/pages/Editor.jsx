import React, { useState, useEffect, useContext, useRef } from "react";
import Editor from "@monaco-editor/react";
import { MdLightMode } from "react-icons/md";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { FiDownload, FiSave, FiTrash } from "react-icons/fi";
import { FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/Theme";
import { Api } from "../helper/Api";
import LoadingBar from "react-top-loading-bar";
import { toast, ToastContainer } from "react-toastify";

const CodeEditor = ({ token }) => {
  const [tab, setTab] = useState("html");
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const { projectId } = useParams();
  const navigate = useNavigate();
  const loadingBar = useRef(null);

  const { isLightMode, toggleTheme } = useContext(ThemeContext);

  const fetchProject = async () => {
    try {
      loadingBar.current.continuousStart();
      const response = await axios.get(`${Api}/project/${projectId}`, {
        headers: {
          Authorization: token,
        },
      });
      loadingBar.current.complete();
      console.log("Project fetched successfully:", response.data);
      const { htmlCode, cssCode, jsCode } = response.data;
      setHtmlCode(htmlCode);
      setCssCode(cssCode);
      setJsCode(jsCode);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  // Fetch project details
  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Update the iframe content only if the iframe is visible
  const run = () => {
    const iframe = document.getElementById("iframe");
    if (iframe) {
      // Ensure iframe exists and is not expanded (visible)
      const html = htmlCode;
      const css = `<style>${cssCode}</style>`;
      const js = `<script>${jsCode}</script>`;

      iframe.srcdoc = html + css + js;
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      run(); // Update iframe content when code changes
    });

    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode, isExpanded]);

  const saveCode = async () => {
    try {
      const response = await axios.put(
        `${Api}/project/${projectId}`,
        {
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
      toast.success("Project saved successfully");
      console.log("Code saved successfully:", response.data);
    } catch (error) {
      toast.error("Failed to save project");
      console.error("Error saving code:", error);
    }
  };

  // Download current code as an HTML file
  const downloadCode = () => {
    toast.success("Download Code Success");
    const blob = new Blob(
      [
        htmlCode +
          "\n" +
          `<style>${cssCode}</style>` +
          "\n" +
          `<script>${jsCode}</script>`,
      ],
      {
        type: "text/html",
      }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "code.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to delete project
  const deleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${Api}/project/${projectId}`, {
          headers: {
            Authorization: token,
          },
        });
        console.log("Project deleted successfully");
        navigate("/", { replace: true }); // Redirect to home after deletion
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <LoadingBar color="#f11946" ref={loadingBar} />
      <div
        className={`${
          isLightMode ? "bg-gray-100" : "bg-gray-900"
        } w-full h-screen transition-all duration-300`}
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
              onClick={() => navigate("/", { replace: true })}
              className="text-white bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Home
            </button>
            <MdLightMode
              className={`text-xl ${
                isLightMode
                  ? "text-black hover:text-green-500"
                  : "text-white hover:text-green-500"
              } cursor-pointer transition-colors duration-300`}
              onClick={toggleTheme}
            />
          </div>
        </div>

        {/* Secondary Navbar with Tabs */}
        <div
          className={`flex items-center justify-between gap-2 ${
            isLightMode ? "bg-[#e8e8e8]" : "bg-gray-900"
          } h-[9vh] px-10 shadow-md`}
        >
          <div className="flex items-center gap-4">
            {/* HTML Tab */}
            <div
              onClick={() => setTab("html")}
              className={`tab flex flex-row items-center gap-2 cursor-pointer py-2 px-4 rounded-lg ${
                tab === "html"
                  ? isLightMode
                    ? "bg-green-400 text-black"
                    : "bg-green-500 text-white"
                  : isLightMode
                  ? "bg-[#d0d0d0] text-[#7a7a7a]"
                  : "bg-gray-800 text-gray-400"
              } transition-colors duration-300`}
            >
              <FaHtml5 className="text-[20px]" />
              <p>HTML</p>
            </div>

            {/* CSS Tab */}
            <div
              onClick={() => setTab("css")}
              className={`tab flex flex-row items-center gap-2 cursor-pointer py-2 px-4 rounded-lg ${
                tab === "css"
                  ? isLightMode
                    ? "bg-green-400 text-black"
                    : "bg-green-500 text-white"
                  : isLightMode
                  ? "bg-[#d0d0d0] text-[#7a7a7a]"
                  : "bg-gray-800 text-gray-400"
              } transition-colors duration-300`}
            >
              <FaCss3Alt className="text-[20px]" />
              <p>CSS</p>
            </div>

            {/* JavaScript Tab */}
            <div
              onClick={() => setTab("js")}
              className={`tab flex flex-row items-center gap-2 cursor-pointer py-2 px-4 rounded-lg ${
                tab === "js"
                  ? isLightMode
                    ? "bg-green-400 text-black"
                    : "bg-green-500 text-white"
                  : isLightMode
                  ? "bg-[#d0d0d0] text-[#7a7a7a]"
                  : "bg-gray-800 text-gray-400"
              } transition-colors duration-300`}
            >
              <FaJs className="text-[20px]" />
              <p>JavaScript</p>
            </div>
          </div>

          {/* Save and Download Buttons */}
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
              onClick={saveCode}
            >
              <FiSave className="text-lg" />
              Save
            </button>
            <button
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
              onClick={downloadCode}
            >
              <FiDownload className="text-lg" />
              Download
            </button>
            <button
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
              onClick={deleteProject}
            >
              <FiTrash className="text-lg" />
              Delete
            </button>
            {/* Expand Button */}
            <AiOutlineExpandAlt
              className={`text-xl ${
                isLightMode
                  ? "text-black hover:text-green-500"
                  : "text-white hover:text-green-500"
              } cursor-pointer transition-colors duration-300`}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="flex h-[81vh]">
          <div
            className={`flex-1 ${
              isExpanded ? "w-full" : "w-1/2"
            } transition-all duration-300`}
          >
            {tab === "html" ? (
              <Editor
                height="100%"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="html"
                value={htmlCode}
                onChange={(value) => setHtmlCode(value || "")}
              />
            ) : tab === "css" ? (
              <Editor
                height="100%"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="css"
                value={cssCode}
                onChange={(value) => setCssCode(value || "")}
              />
            ) : (
              <Editor
                height="100%"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="javascript"
                value={jsCode}
                onChange={(value) => setJsCode(value || "")}
              />
            )}
          </div>

          {/* Iframe for Live Preview */}
          <iframe
            id="iframe"
            className={`h-[81vh] bg-white shadow-lg transition-all duration-300 ${
              isExpanded ? "w-0" : "w-1/2"
            }`}
            title="output"
          />
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
