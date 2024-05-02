import { BASE_WS_URL } from "@/libs/constant";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getAccessToken } from "./authService";
import { userConnection } from "./hubConnection";
import { User } from "@/libs/types";


// userConnection.start();
const searchUser = async (searchTerm: string) => {
    return userConnection
      .invoke('SearchUser', searchTerm);      
}

const getReactions = async () => {
    return userConnection
      .invoke('GetReactions');      
}
const onConnected = (eventHandler: (user: User) => void) => {
    userConnection.on("OnConnected", user => {  
        eventHandler(user);
    })
}
const onDisconnected = (eventHandler: (message: string) => void) => {
    userConnection.on("OnDisconnected", message => {  
        eventHandler(message);
    })
}

export const userService = {
    searchUser,
    getReactions,
    onConnected,
    onDisconnected
}