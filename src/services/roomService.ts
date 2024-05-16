import { HubResponse, MessageData, RawRoom, RoomMemberInfo } from '@/libs/types';

import {roomHub} from "./hubConnection";
import { convertRawRoomToRoom, generatePublisher } from '@/libs/utils';
import { REST_SEGMENT } from '@/libs/constant';
import { getAccessToken } from './authService';

const subscribers = {
    createRoom: new Map<string, (room: RawRoom) => void>(),
  }
const getRooms = async (currentUserId: string) => {
    try {
        const result = await roomHub
          .invoke('GetRooms') as HubResponse<RawRoom[]>;  

        if (!result.isSuccess && !result.data) {
            return Promise.reject(result.error);
        }
        return result.data.map((rawRoom) => convertRawRoomToRoom(rawRoom, currentUserId)).filter((room) => !!room);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

const createRoom = async (friendId: string) => {
    return roomHub
      .invoke('CreateRoom', friendId);      
}




const onCreateRoom = generatePublisher(subscribers.createRoom);

const updateCanMessageDisplay = async (roomId: string, canDisplay: boolean): Promise<HubResponse<RoomMemberInfo>> => {
    return roomHub.invoke("UpdateCanRoomDisplay", roomId, canDisplay);
}
const getSomeMessages = async (roomId: string): Promise<HubResponse<MessageData[]>> => {
    return roomHub.invoke("GetSomeMessages", roomId);
}

const getFirstMessage = async (roomId: string): Promise<HubResponse<MessageData>> => {
    return roomHub.invoke("GetFirstMessage", roomId);
}



const getNextMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<MessageData[]>> => {
    return roomHub.invoke("GetNextMessages", roomId, messageId, numberMessage);
}

const getPreviousMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<MessageData[]>> => {
    return roomHub.invoke("GetPreviousMessages", roomId, messageId, numberMessage);
}

roomHub.on("CreateRoom", room => {  
    subscribers.createRoom.forEach(eventHandler=> {
        eventHandler(room);
    })
})
export const roomService = {
    getSomeMessages,
    getRooms,
    createRoom,
    updateCanMessageDisplay,
    onCreateRoom,
    getFirstMessage,
    getNextMessages,
    getPreviousMessages,
}