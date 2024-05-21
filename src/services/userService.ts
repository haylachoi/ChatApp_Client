import { BASE_WS_URL, REST_SEGMENT } from "@/libs/constant";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getAccessToken } from "./authService";
import { userHub } from "./hubConnection";
import { HubResponse, Profile, User } from "@/libs/types";
import { httpClient } from "@/libs/httpClient";
import { Operation } from "fast-json-patch";


// userConnection.start();
const searchUser = async (searchTerm: string) => {
    return userHub
      .invoke('SearchUser', searchTerm);      
}
const getProfile = async (): Promise<Profile> => {
    const url = `${REST_SEGMENT.USER}`;
    const result = await httpClient.get(url);
    return result.data as Profile;
  };

const getConnectionId = async (): Promise<HubResponse<string>> => {
    return userHub.invoke('GetConnectionId');
}
const changeAvatar = async (file: File): Promise<string> => {
    const url = `${REST_SEGMENT.USER}/change-avatar`;
    const formData = new FormData();
    formData.append('file', file);
    const result = await httpClient.post(url, formData);
    return result.data as string;
}

const changeProfile = async (dif: Operation[]): Promise<HubResponse<Profile>> => {
    return userHub.invoke('ChangeProfile', dif);
}
const searchUserNotInRoom = async (roomId: string, searchTerm: string) => {
    return userHub
      .invoke('SearchUserNotInRoom', roomId, searchTerm);      
}

const getReactions = async () => {
    return userHub
      .invoke('GetReactions');      
}
const onConnected = (eventHandler: (user: User) => void) => {
    userHub.on("OnConnected", user => {  
        eventHandler(user);
    })
}
const onDisconnected = (eventHandler: (message: string) => void) => {
    userHub.on("OnDisconnected", message => {  
        eventHandler(message);
    })
}

export const userService = {
    changeProfile,
    searchUser,
    getProfile,
    getConnectionId,
    changeAvatar,
    searchUserNotInRoom,
    getReactions,
    onConnected,
    onDisconnected
}