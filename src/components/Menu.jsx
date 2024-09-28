import React, { useEffect, useState } from "react";
import "./menu.css";
import recipeImage from "./assets/recipe.png";
import leaveIcon from "./assets/logout.png";
import { useNavigate } from "react-router";

function Menu() {
  const [info, setInfo] = useState("");
  const [leave, setLeave] = useState("");
  const [falseShow,setFalseShow] = useState(false)
  const navigate = useNavigate()

  // Получаем данные из базы данных
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    setLeave(token);

    try {
      const response = await fetch("http://localhost:5000/email", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response) {
        throw new Error("Произошла ошибка при получении данных");
      }
      const data = await response.json();
      const objectList = data[0]
      const textInfo = Object.values(objectList)
      setInfo(textInfo);
      setFalseShow(true)
    } catch (error) {
      console.log("Произоша ошибка", error);
    }
  };

  const leaveButton = () => {
    localStorage.removeItem("token");
    setInfo("")
    navigate("/logIn")
    setFalseShow(false)
    setLeave("")
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      {leave && falseShow? (
        <>
          <div className="menu">
            <div>
              <p>Вы успешно вошли в свой аккаунт</p>
              <span>Мои Рецепты:</span>{" "}
              <button>
                <a href="http://localhost:5173/?#/">
                  <img src={recipeImage} alt="Рецепты" />
                </a>
              </button>
              <p>Моя почта: {info}</p>
              <button onClick={leaveButton}>
                <img src={leaveIcon} alt="Выйти" /> Выйти
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
        <div className="menu-if">
        <p>Вы не вошли в аккаунт</p>
        </div>
        </>

      )}
    </>
  );
}

export default Menu;
