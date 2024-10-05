import React, { useEffect, useState } from "react";
import "./Recipe.css";
import ReadMore from "./ReadMore";

function Recipe() {
  const [elements, setElements] = useState([]);

  const fetchData = async () => {
    const response = await fetch(
      `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes`,
      {
        headers: {
          "x-rapidapi-key":
            "6922e0f96fmsh8633717c65f19c8p19193djsnf3cc1c046c20",
          "x-rapidapi-host": "tasty.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Произошла ошибка с фетчом");
    }
    const data = await response.json();
    const objects = Object.values(data);
    const improvedElements = objects[1];
    console.log(improvedElements)

    const updatedElements = improvedElements.map((obj) => ({
      id: obj.id,
      content: [
        { type: "name", value: obj.name },
        { type: "description", value: obj.description },
      ],
    }));
    setElements(updatedElements);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="grids">
        {elements.map((div) => (
          <div className="grid" key={div.id}>
            {div.content.map((item, index) => {
              if (item.type === "name") {
                return (
                  <h3 key={index}>
                    Имя:<p key={index}>{item.value}</p>
                  </h3>
                );
              } else if (item.type === "description") {
                return (
                  <p key={index}>
                    Описания:
                    <ReadMore text={item.value} maxLength={20} />
                  </p>
                );
              }
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default Recipe;
