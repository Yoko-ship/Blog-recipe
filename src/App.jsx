import "./App.css";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import MainPage from "./components/MainPage";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import Recipe from "./components/Recipe";


function App() {
  const [token, setToken] = useState(null);



  useEffect(()=>{
    const tokenFromStorage = localStorage.getItem("token");
    if(tokenFromStorage){
      setToken(tokenFromStorage)
    }
  },[token])
  return (
    <>
      <Router>
        <header>
          <div>
            <span>Рецепты</span>
          </div>
          <ul>
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li>
              <Link to="/register">Авторизация</Link>
            </li>
            <li>
              <Link to="/logIn">Войти</Link>
            </li>
            <li>
              <Link to="/menu">Аккаунт</Link>
            </li>
            <li>
              <Link to="/recipe">Рецепты</Link>
            </li>
          </ul>
        </header>
        <div className="app-menu">
            {token ?(
            <p>Добро пожаловать пользователь!</p>
          ):(
            <p>Please log in or register.</p>
          )}
          
        </div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/logIn" element={<LogIn/>} />
          <Route
            path="/menu"
            element={
                <Menu/>
            }
          />
          <Route path="/register" element={<Register/>}/>
          <Route path="/recipe" element={<Recipe/>}/>
        </Routes>
      </Router>
    </>

  );
}

export default App;
