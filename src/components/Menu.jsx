import React, { useEffect, useState } from "react";
import "./menu.css";
import recipeImage from "./assets/recipe.png";
import leaveIcon from "./assets/logout.png";
import { useNavigate } from "react-router";
import ReadMore from "./ReadMore";

function Menu() {
  const [info, setInfo] = useState("");
  const [leave, setLeave] = useState("");
  const [falseShow, setFalseShow] = useState(false);
  const [usersName, setUsersName] = useState([]);
  const navigate = useNavigate();
  const [othersId, setOthersId] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [naming,setName] = useState('')
  const [search,setSearch] = useState("")
 

  // Поиск по рецептам
  const filteredItems = recipes.filter((item) =>
    item.content.some((contentItem) =>
    contentItem.value.toString().toLowerCase().includes(search.toLowerCase())
    )
  )
 
  const othersNameHandler = (element) => {
    setOthersId(element);
  };
  const nameHandler = (el) =>{
    setName(el)
  }
  // Получаем данные из базы данных
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    setLeave(token);

    try {
      const response = await fetch("http://localhost:5000/name", {
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
      const objectList = data[0];
      const textInfo = Object.values(objectList);
      setInfo(textInfo);
      setFalseShow(true);
    } catch (error) {
      console.log("Произоша ошибка", error);
    }
  };

  const getUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Произошла ошибка");
      }
      const data = await response.json();
      setUsersName(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/user/${othersId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Произошла ошибка при получении данных пользователя");
    }
    const data = await response.json();
    const objects = Object.values(data);

    const updatedElements = objects.map((object) => ({
      id: object.id,
      content: [
        { type: "name", value: object.name },
        { type: "description", value: object.description },
        { type: "id", value: object.id },
      ],
    }));
    setRecipes(updatedElements);
  };

  const leaveButton = () => {
    localStorage.removeItem("token");
    setInfo("");
    navigate("/logIn");
    setFalseShow(false);
    setLeave("");
  };

  useEffect(() => {
    getUserData();
    getUsers();
    getUserInfo();
  }, [leave, othersId]);

  return (
    <>
      {leave && falseShow ? (
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
              <p>Мой Ник: {info}</p>
              <button onClick={leaveButton}>
                <img src={leaveIcon} alt="Выйти" /> Выйти
              </button>
            </div>
            <div>
              <h3>Другие пользователи</h3>
              <ul>
                {usersName.map((user) => {
                  return (
                    <li
                      onClick={() => othersNameHandler(user.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <p onClick={() => nameHandler(user.name)}>{user.name}</p>
                    </li>
                  );
                })}
              </ul>
              <p>Вы выбрали пользователя:{naming}</p>
            </div>
          </div>

          <div className="input-search">
            <input 
              placeholder="поиск-рецептов"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          {othersId ?(
            <div className="grids">
              {filteredItems.map((div)=>{
                return(
                  <div className="grid" key={div.id}>
                    {div.content.map((item,index) =>{
                      if(item.type === "name"){
                        return(
                          <h3 key={index}>Названия блюда:<p style={{color:"green"}}>{item.value}</p></h3>
                        )
                      }else if(item.type === "description"){
                        return <p key={index}>Описания:<ReadMore text={item.value} maxLength={20}/></p>
                      }else if(item.type === "id"){
                        return <h3 key={index}>Идентификатор:<p>{item.value}</p></h3>
                      }
                      
                    })}
                  </div>
                )
              })}
            </div>
          ):(
            <p></p>
          )}
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
