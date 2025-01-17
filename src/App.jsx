import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Menu } from "./components/Menu";
import { Ordenes } from "./components/Ordenes";
import { LoginForm } from "./components/loginForm";
import { RegisterForm } from "./components/registerForm";
import { logoutUser } from "./services/auth";

const SESSION_DURATION = 3600 * 1000; // Duración de la sesión en milisegundos

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Al montar el componente, verificamos si hay sesión activa
  useEffect(() => {
    const sessionData = localStorage.getItem("sessionData");
    if (sessionData) {
      const { isAdmin, timestamp } = JSON.parse(sessionData);
      const now = Date.now();
      if (now - timestamp < SESSION_DURATION) {
        setIsAuthenticated(true);
        setIsAdmin(isAdmin);
      } else {
        localStorage.removeItem("sessionData"); // Eliminar sesión expirada
      }
    }
  }, []);

  // Temporizador de cierre de sesión cuando el usuario esté autenticado
  useEffect(() => {
    let logoutTimer;
    if (isAuthenticated) {
      logoutTimer = setTimeout(() => {
        handleLogout();
      }, SESSION_DURATION);
    }

    return () => clearTimeout(logoutTimer);
  }, [isAuthenticated]);

  // Maneja el inicio de sesión exitoso
  const handleLoginSuccess = (role) => {
    if (!role) {
      console.error("Rol no definido para el usuario.");
      return;
    }

    setIsAuthenticated(true);
    setIsAdmin(role === "admin");

    const sessionData = {
      isAdmin: role === "admin",
      timestamp: Date.now(),
    };
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
  };

  // Maneja el cierre de sesión
  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("sessionData");
  };

  return (
    <Router>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 max-w-5xl w-full mx-auto shadow-xl rounded-lg">
          {/* Si no está autenticado, muestra Login o Registro */}
          {!isAuthenticated ? (
            <Routes>
              <Route
                path="/"
                element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/register"
                element={
                  <RegisterForm onBackToLogin={() => <Navigate to="/" />} />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          ) : (
            <>
              {/* Botón de cerrar sesión */}
              <button
                onClick={handleLogout}
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Cerrar sesión
              </button>

              {/* Rutas principales basadas en el rol del usuario */}
              <Routes>
                <Route
                  path="/menu"
                  element={isAdmin ? <Navigate to="/ordenes" /> : <Menu />}
                />
                <Route
                  path="/ordenes"
                  element={isAdmin ? <Ordenes /> : <Navigate to="/menu" />}
                />
                <Route
                  path="*"
                  element={<Navigate to={isAdmin ? "/ordenes" : "/menu"} />}
                />
              </Routes>
            </>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
