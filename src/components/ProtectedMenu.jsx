import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedMenu({ children, token }) {
  // Проверка наличия токена
  if (!token) {
    return <Navigate to="/logIn" />; // Если токен отсутствует, перенаправляем на логин
  }

  // Если токен есть, отображаем защищенный контент
  return children;
}

export default ProtectedMenu;