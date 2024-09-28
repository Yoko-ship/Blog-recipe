import "./App.css";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import MainPage from "./components/MainPage";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import RegisterSuccess from "./components/RegisterSuccess";
import LoginSuccess from "./components/LoginSuccess";
import ProtectedMenu from "./components/ProtectedMenu";

function App() {
  const [token, setToken] = useState(null);
  const storage = localStorage.setItem("token",token)




  useEffect(()=>{
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
  },[])


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
          </ul>
        </header>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/logIn" element={<LogIn setToken={setToken} />} />
          <Route
            path="/menu"
            element={
              <ProtectedMenu token={token}>
                <Menu />
              </ProtectedMenu>
            }
          />
          <Route path="/register" element={<Register/>}/>
          


          
        </Routes>
      </Router>
    </>
  );
}

export default App;
