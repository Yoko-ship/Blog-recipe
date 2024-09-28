import React, { useState } from 'react'
import axios from 'axios'

function MainPage() {

  const [foodName,setFoodName] = useState("")
  const [description,setDescription] = useState("")

  const giveRecipe = ()=>{
    axios.post("http://localhost:5000/recipe",{foodName,description})
    .then((response)=>{
      console.log("Данные успешно записаны",response.data)

    }).catch((err)=> console.log(err))
  }
  return (
    <div> 
    <div className='div-recipe'>
      <span>Рецепты</span>
    </div>

      <form>
        <label htmlFor='name'>Блюдо</label>
        <input type='text' onChange={e => setFoodName(e.target.value)} value={foodName}/>
        <label htmlFor='description' >Описания рецепта</label>
        <textarea onChange={e => setDescription(e.target.value)}></textarea>
        <button onClick={giveRecipe}>Confirm</button>
      </form>
    </div>
  )
}

export default MainPage