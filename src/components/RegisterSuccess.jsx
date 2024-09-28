import React, {useState } from "react";
import axios from "axios";
import "./registration.css";
import ConfirmImage from "./assets/confirmation.png";

function RegisterSuccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show,setShow] = useState(false)
  const [state,setState] = useState("")


  const registerUser = (event) => {
    event.preventDefault();
    axios.post("http://localhost:5000/register", { email, password })
      .then((response) => {
        console.log("Регистрация успешно прошла", response.data);
        setEmail("")
        setPassword("")
        setShow(true)
      })
      .catch((err) => {
        console.log("Приозошла ошибка", err.response ? err.response.data : err.message);
      });

    
  };
  return (
    <>
    <div className="form">
      <form>
        <label htmlFor="email">
          Почта
        </label>
        <input type="email"  onChange={e => setEmail(e.target.value)} value={email}/>
        <label htmlFor="password">
          Пароль
        </label>
        <input type="password" onChange={e => setPassword(e.target.value)} value={password}/>

        <button type="submit" onClick={registerUser}>
          <img src={ConfirmImage} />
        </button>
      </form>
    </div>

    <div className="show">
        <p style={{color:"green"}}>Вы уже вошли в свой аккаунт</p>
    </div>
    </>


    
  );
}

export default RegisterSuccess;
