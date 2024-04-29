import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "../../ui/addUser/addUser";
import { useUserStore } from "../../../stores/userStore";

import React from "react";
import { useRoomStore } from "@/stores/roomStore";
import { roomService } from "@/services/roomService";
import Modal from "@/components/commons/modal/modal";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const {roomChats, setRoomChats, addRoomChat, setCurrentRoom} = useRoomStore();
  // const { chatId, changeChat } = useChatStore();

  useEffect(() => {

   roomService.getPrivateRooms().then((result: any) => {
    setRoomChats(result.data);
    console.log(result.data)
   })

    roomService.onCreateRoom((result) => {
      console.log("listen create room",result);
      let room = result.data as PrivateRoom;
      addRoomChat(result.data);
    })
  }, [])
  

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {roomChats && roomChats.map((roomChat) => (
         <div
         className="item"
         key={roomChat.id}
         onClick={() => {setCurrentRoom(roomChat); console.log(roomChat.id)} }
        //  style={{
        //    backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
        //  }}
       >
         <img
           src={ roomChat?.friend.avatar || "./avatar.png" } loading="lazy"
           alt=""
         />
         <div className="texts">
           <span>
             {roomChat?.friend.fullname}
           </span>
           {roomChat.lastUnseenMessage && <p>{`(${roomChat.unseenMessageCount})`}{roomChat.lastUnseenMessage?.content}</p>}
         </div>
       </div>
      ))}
      <Modal isOpen={addMode} onClose={() => setAddMode(false)}>
        <AddUser />
       
      </Modal>
      {/* {addMode && <AddUser />} */}
    </div>
  );
};

export default ChatList;
