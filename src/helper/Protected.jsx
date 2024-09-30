// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const ProtectedRoute2 = ({ token, children }) => {
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
