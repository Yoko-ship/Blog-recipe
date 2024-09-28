import React, { useState } from "react";
import ConfirmImage from "./assets/confirmation.png";
import axios from "axios";

function LoginSuccess({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);


  const logUser = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/logIn", { email, password })
      .then((response) => {
        console.log("Пользователь успешно вошел в аккаунт", response.data);
        setToken(response.data.token);
        setShow(true);
        setEmail("");
        setPassword("");
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
          <button>
            <img src={ConfirmImage} onClick={logUser} />
          </button>
        </form>
      </div>

      <div className="show">
        
        <p style={{color:"green"}}>Вы уже вошли в свой аккаунт</p>
        {window.location.href = "http://localhost:5173/?#/menu"}
      </div>
    </>
  );
}

export default LoginSuccess;
