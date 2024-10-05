import { useState } from "react"
import React from 'react'
function ReadMore({text,maxLength}) {

    const [isReadMore,setReadMore] = useState(true);

    const toogleRead = ()=>{
        setReadMore(!isReadMore)
    }
  return (
    <>
        <div>
        {isReadMore ? text.slice(0, maxLength) + '...' : text}
            <span onClick={toogleRead} style={{color:"blue",cursor:"pointer"}}>
                {isReadMore? 'Read More': "Show less"}
            </span>
        </div>
    </>
  )
}

export default ReadMore