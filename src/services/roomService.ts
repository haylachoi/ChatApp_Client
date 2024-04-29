import {privateRoomConnection} from "./hubConnection";


privateRoomConnection.start();
const getPrivateRooms = async () => {
    return privateRoomConnection
      .invoke('GetPrivateRooms');      
}

const createPrivateRoom = async (friendId: string) => {
    return privateRoomConnection
      .invoke('CreatePrivateRoom', friendId);      
}

const onCreateRoom = (eventHandler: (room: any) => void) => {
    privateRoomConnection.on("CreatePrivateRoom", room => {  
        eventHandler(room);
    })
}
const getSomePrivateMessages = async (roomId: string): Promise<HubResponse<Message[]>> => {
    return privateRoomConnection.invoke("GetSomePrivateMessages", roomId)
}

const getFirstMessage = async (roomId: string): Promise<HubResponse<Message>> => {
    return privateRoomConnection.invoke("GetFirstMessage", roomId)
}

const getNextPrivateMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<Message[]>> => {
    return privateRoomConnection.invoke("GetNextPrivateMessages", roomId, messageId, numberMessage)
}

const getPreviousPrivateMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<Message[]>> => {
    return privateRoomConnection.invoke("GetPreviousPrivateMessages", roomId, messageId, numberMessage)
}
export const roomService = {
    getSomePrivateMessages,
    getPrivateRooms,
    createPrivateRoom,
    onCreateRoom,
    getFirstMessage: getFirstMessage,
    getNextPrivateMessages,
    getPreviousPrivateMessages,
}