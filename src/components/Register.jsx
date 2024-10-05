import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./registration.css";
import ConfirmImage from "./assets/confirmation.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState(null);
  const [inform, setInform] = useState("");

  const registerUser = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/register", { userName, email, password })
      .then((response) => {
        console.log("Регистрация успешно прошла", response.data);
        setInform(response.data);
        setEmail("");
        setPassword("");
        setUserName("");
      })
      .catch((err) => {
        console.log(
          "Приозошла ошибка",
          err.response ? err.response.data : err.message
        );
      });
  };

  useEffect(() => {
    const tokens = localStorage.getItem("token");
    if (tokens) {
      setToken(tokens);
    }
  }, token);
  return (
    <>
      <div className="bg">
        <div className="form">
          <form>
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
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

            <button type="submit" onClick={registerUser}>
              <img src={ConfirmImage} />
            </button>
          </form>
        </div>

        <div className="show">
          {token ? (
            <p style={{ color: "green" }}>Вы вошли в свой аккаунт</p>
          ) : (
            <p style={{ color: "red" }}></p>
          )}
        </div>

        <div>
          {inform ? (
            <>
              <div className="show">
                <p style={{ color: "green" }}>
                  Вы успешно авторизованы. Пожалуйста, перейдите на вкладку
                  'Войти'.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="show">
                <p style={{ color: "red" }}>
                  Вы ещё не авторизовались. Пожалуйста, выполните авторизацию,
                  чтобы продолжить.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;
