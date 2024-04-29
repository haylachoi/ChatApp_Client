import { BASE_WS_URL } from "@/libs/constant";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getAccessToken } from "./authService";
import { userConnection } from "./hubConnection";


userConnection.start();
const searchUser = async (searchTerm: string) => {
    return userConnection
      .invoke('SearchUser', searchTerm);      
}

const getEmotions = async () => {
    return userConnection
      .invoke('GetEmotions');      
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
    getEmotions,
    onConnected,
    onDisconnected
}