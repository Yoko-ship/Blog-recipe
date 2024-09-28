import React, { useContext, useState } from "react";
import axios from "axios";
import "./registration.css";
import ConfirmImage from "./assets/confirmation.png";

function Register() {
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
  const buttonHanlder = ()=>{
    setState(token)
    console.log(state)
  }
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

        <button onClick={buttonHanlder}>Показать</button>
      </form>
    </div>

    <div className="show">
        {show?(
            <p style={{color:"green"}}>Вы успешно авторизовались.Теперь можете войти в свой аккаунт</p>
        ):(
            <p style={{color:"red"}}>Вы ещё не авторизовались. Пожалуйста, выполните авторизацию, чтобы продолжить.</p>
        )}
    </div>
    </>


    
  );
}

export default Register;
