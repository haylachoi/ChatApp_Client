import React from "react"
import "./sidebar.css"
import Userinfo from "../userInfo/userinfo"
import ChatList from "../chatList/chatList"

const Sidebar = () => {
  return (
    <div className='list'>
      <Userinfo/>
      <ChatList/>
    </div>
  )
}

export default Sidebar