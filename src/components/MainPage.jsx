import React, { useEffect, useState } from "react";
import axios from "axios";
import "./mainPge.css";
import ReadMore from "./ReadMore";
import deleteImage from "../assets/delete.png";
import editImage from "../assets/free-icon-edit-3597088.png";

function MainPage() {


  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [elements, setElements] = useState([]);
  const [recipeShow, setRecipeShow] = useState(false);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState("");
  const [changedName, setChangedName] = useState("");
  const [changedDescription, setChangedDescription] = useState("");

  const filteredItems = elements.filter((item) =>
    item.content.some((contentItem) =>
      contentItem.value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const createInput = (id, currentName) => {
    setEditMode(id);
    setChangedName(currentName);
  };


  const giveRecipe = (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:5000/recipe",
        { foodName, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Данные успешно записаны", response.data);
        getInfo();

      })
      .catch((err) =>
        console.log(err.response ? err.response.data : err.message)
      );
  };


  const getInfo = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/recipes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Произошла ошибка с получением данных");
    }
    const data = await response.json();
    const objects = Object.values(data);

    const updatedElements = objects.map((obj) => ({
      id: obj.id,
      content: [
        { type: "name", value: obj.name },
        { type: "description", value: obj.description },
        { type: "id", value: obj.id },
      ],
    }));
    setElements(updatedElements);
    setRecipeShow(true);
    setFoodName("")
    setDescription("")
  };

  // Удаляем столбец с помощью ид
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        setElements((prevElements) =>
          prevElements.filter((el) => el.id !== id)
        );
      })
      .catch((err) => {
        console.log("Произошла ошибка", err);
      });
  };

  const handleEdit = (id, newName, newDescription) => {
    if (!newName) {
      const something = "";
      newName = something;
    }
    fetch(`http://localhost:5000/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName, description: newDescription }),
    })
      .then((response) => response.text())
      .then(() => {
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.id === id
              ? {
                  ...el,
                  content: el.content.map((item) =>
                    item.type === "name"
                      ? { ...item, value: newName }
                      : item.type === "description"
                      ? { ...item, value: newDescription }
                      : item
                  ),
                }
              : el
          )
        );
        setChangedName("");
        setEditMode("");
        setChangedDescription("");
      })
      .catch((err) => {
        console.log(err);
      });

    return elements;
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      <div className="main-content">
        <div className="div-recipe">
          <span>Рецепты</span>
        </div>

        <form onSubmit={giveRecipe}>
          <label htmlFor="name">Блюдо</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setFoodName(e.target.value)}
            value={foodName}
          />
          <label htmlFor="description">Описания рецепта</label>
          <textarea
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button type="submit">Confirm</button>
        </form>
      </div>

      <div className="bottom-content">
        <div className="input-search">
          <input
            placeholder="Поиск рецептов"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {recipeShow ? (
          <div className="grids">
            {filteredItems.map((div) => (
              <div className="grid" key={div.id}>
                {div.content.map((item, index) => {
                  if (item.type === "name") {
                    return (
                      <>
                        <h3 key={index}>
                          Название блюда:
                          <p style={{ color: "green" }}>{item.value}</p>
                        </h3>
                      </>
                    );
                  } else if (item.type === "description") {
                    return (
                      <div key={index}>
                        <br />
                        <p>
                          <ReadMore text={item.value} maxLength={20} />
                        </p>
                      </div>
                    );
                  } else if (item.type === "id") {
                    return (
                      <h3 key={index}>
                        Идентификатор: <p>{item.value}</p>
                        <div>
                          {/* // Удаляем столбец с помощью ид получая идентификатор из бз */}
                          <button
                            onClick={() => handleDelete(item.value)}
                            className="button-images"
                          >
                            <img src={deleteImage} />
                          </button>

                          <button
                            onClick={() => createInput(item.value)}
                            className="button-images"
                          >
                            <img src={editImage} />
                          </button>
                          <div>
                            {editMode === item.value ? (
                              <>
                                <div className="div-edits">
                                  <input
                                    type="text"
                                    value={changedName}
                                    onChange={(e) =>
                                      setChangedName(e.target.value)
                                    }
                                    placeholder="Изменить названия"
                                    className="input-change"
                                  />
                                  <input
                                    type="text"
                                    value={changedDescription}
                                    onChange={(e) =>
                                      setChangedDescription(e.target.value)
                                    }
                                    placeholder="Изменить описания"
                                    className="input-change"
                                  />
                                  <button
                                    onClick={() =>
                                      handleEdit(
                                        item.value,
                                        changedName,
                                        changedDescription
                                      )
                                    }
                                    className="button-change"
                                  >
                                    {" "}
                                    Confirm
                                  </button>
                                </div>
                              </>
                            ) : (
                              <p></p>
                            )}
                          </div>
                        </div>
                      </h3>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
}

export default MainPage;
