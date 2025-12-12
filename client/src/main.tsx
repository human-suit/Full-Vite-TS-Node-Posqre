import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Posts from "./pages/Posts/Posts";
import AdminWrapper from "./pages/Admin/Admin";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";
import ProtectedRoute from "./ProtectedRoute";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminWrapper />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);
