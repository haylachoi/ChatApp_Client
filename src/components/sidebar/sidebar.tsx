import React from "react"
import "./sidebar.css"
import Userinfo from "../userInfo/userinfo"
import RoomList from "../room-list/room-list"

const Sidebar = () => {
  return (
    <div className='list'>
      <Userinfo/>
      <RoomList/>
    </div>
  )
}

export default Sidebar