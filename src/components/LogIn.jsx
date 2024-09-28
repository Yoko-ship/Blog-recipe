import React, { useEffect, useState } from "react";
import ConfirmImage from "./assets/confirmation.png";
import axios from "axios";
import { Route } from "react-router";
import Menu from "./Menu";
import { useNavigate } from "react-router";


function LogIn({ setToken}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState()
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  const logUser = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/logIn", { email, password })
      .then((response) => {
        console.log("Пользователь успешно вошел в аккаунт", response.data);
        setToken(response.data.token);
        navigate("/menu")
        setEmail("");
        setPassword("");
        setShow(token)
      })
      .catch((err) => {
        console.log(
          "Произошла ошибка",
          err.response ? err.response.data : err.message
        );
      });
  };

  return (
    <>
      <div>
        <form>
          <label htmlFor="email">Почта</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button onClick={logUser}>Confirm</button>
        </form>
      </div>

      <div className="show">

        {show ? (
          <p style={{ color: "green" }}>Вы успешно вошли в свой аккаунт</p>
        ) : (
          <p style={{ color: "red" }}>
            Вы еще не вошли в аккаунт. Пожалуйста, выполните вход, чтобы
            продолжить
          </p>
        )}
      </div>
    </>
  );
}

export default LogIn;
