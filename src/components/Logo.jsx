import React from 'react'
import Logoc from "../assets/share.png"

const Logo = () => {
  return (
    <div className=' w-[8rem] rounded-full overflow-hidden mb-5'>
        <img src={Logoc} alt="logo" className=' w-full'/>
    </div>
  )
}

export default Logo