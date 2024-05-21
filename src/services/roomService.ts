import { HubResponse, MessageData, RawRoom, RoomMemberInfo } from '@/libs/types';
import {clientHub, roomHub} from "./hubConnection";
import { convertRawRoomToRoom, generatePublisher } from '@/libs/utils';

const connection = roomHub;
const eventListener = clientHub;
const subscribers = {
    joinRoom: new Map<string, (room: RawRoom) => void>(),
    leftRoom: new Map<string, (roomId: string) => void>(),
  }
const getRooms = async (currentUserId: string) => {
    try {
        const result = await connection
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
    return connection
      .invoke('CreateRoom', friendId);      
}

const onJoinRoom = generatePublisher(subscribers.joinRoom);
const onLeftRoom = generatePublisher(subscribers.leftRoom);

const updateCanMessageDisplay = async (roomId: string, canDisplay: boolean): Promise<HubResponse<RoomMemberInfo>> => {
    return connection.invoke("UpdateCanRoomDisplay", roomId, canDisplay);
}
const getSomeMessages = async (roomId: string): Promise<HubResponse<MessageData[]>> => {
    return connection.invoke("GetSomeMessages", roomId);
}

const getFirstMessage = async (roomId: string): Promise<HubResponse<MessageData>> => {
    return connection.invoke("GetFirstMessage", roomId);
}



const getNextMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<MessageData[]>> => {
    return connection.invoke("GetNextMessages", roomId, messageId, numberMessage);
}

const getPreviousMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<MessageData[]>> => {
    return connection.invoke("GetPreviousMessages", roomId, messageId, numberMessage);
}

eventListener.on("LeftRoom", (roomId: string) => {  
    subscribers.leftRoom.forEach(eventHandler=> {
        eventHandler(roomId);
    })
})

eventListener.on("JoinRoom", (room: RawRoom) => {  
    subscribers.joinRoom.forEach(eventHandler=> {
        eventHandler(room);
    })
})
export const roomService = {
    getSomeMessages,
    getRooms,
    createRoom,
    updateCanMessageDisplay,
    onJoinRoom,
    onLeftRoom,
    getFirstMessage,
    getNextMessages,
    getPreviousMessages,
}