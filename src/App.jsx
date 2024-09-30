import "./App.css";
import CodeEditor from "./pages/Editor";
import HomePage from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";
import { ProtectedRoute, ProtectedRoute2 } from "./helper/Protected";
import { ThemeProvider } from "./context/Theme";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <ThemeProvider>
      <div className="App w-full h-screen">
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <ProtectedRoute2 token={token}>
                  <Login setToken={setToken} />
                </ProtectedRoute2>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute2 token={token}>
                  <Register />
                </ProtectedRoute2>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute token={token}>
                  <HomePage token={token} setToken={setToken} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:projectId"
              element={
                <ProtectedRoute token={token}>
                  <CodeEditor token={token} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
