import React, { useState } from "react";
import { loginUser } from "../services/auth";

export const LoginForm = ({ onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user, role, error } = await loginUser(email, password);

    if (error) {
      setError(error);
    } else {
      setError(null);
      onLoginSuccess(role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-black text-gray-900">
            Iniciar sesion
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error} </span>
            </div>
          )}
          <div className="pt-10 rounded-none shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="mb-2 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo electronico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="mb-20 appearance-none rounded-sm relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Iniciar sesion
              </button>
            </div>
          </div>
        </form>
        <button
          onClick={onRegisterClick}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          ¿No tienes cuenta? Crea una aqui
        </button>
      </div>
    </div>
  );
};
