import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName,setUserName] = useState("");
  const [token,setToken] = useState("")
  const navigate = useNavigate()


  const logUser = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/logIn", { userName,email, password })
      .then((response) => {
        console.log("Пользователь успешно вошел в аккаунт", response.data);
        const tokens = localStorage.setItem("token",response.data.token)
        navigate("/menu")
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

  useEffect(()=>{
    const takens = localStorage.getItem("token")
    if(takens){
      setToken(takens)
    }
  },[token])

  return (
    <>
      <div>
        <form>
          <label htmlFor="name">
            Имя
          </label>
          <input type="text" onChange={e => setUserName(e.target.value)} value={userName}/>
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

        {token ? (
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
