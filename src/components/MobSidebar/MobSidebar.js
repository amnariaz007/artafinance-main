import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import './mobileside.css'
const MobSidebar = ({mobMenu, setmobMenu}) => {
  return (
    <div className={mobMenu ? "mob__sidebar active__mobsidebar" : "mob__sidebar"} onClick={setmobMenu}>
      <Sidebar/>
    </div>
   
  )
}

export default MobSidebar