import { LucideIcon } from "lucide-react";


export interface AuthToken {
    accessToken: string;
    refreshToken: string
}

export interface User {
    id: string;  
    fullname: string;
    avatar: string | undefined;
    isOnline: boolean;
}
export interface Profile extends User{
    email: string;   
}

// export interface Quote {
//     messageId: string;
//     userId: string;
//     content: string;
// }
// export interface RawMessageData {
//     id: string;
//     content: string;
//     senderId: string;
//     isImage: boolean;
//     roomId: string;
//     createdAt: string | undefined;
//     messageDetails: MessageDetail[]
// }
export interface MessageData {
    id: string ;
    content: string;
    senderId: string;
    isImage: boolean;
    roomId: string;
    createdAt: string | undefined;
    messageDetails: MessageDetail[];
    quote?: MessageData;
}
export interface MessageDetail {
    id: string;
    userId: string;
    messageId: string;
    roomId: string;
    reactionId: string;
    user: User
}

export interface GroupInfo {
    id: string;
    name: string;
    avatar?: string;
    groupOwner: User;
}
export interface RawRoom {  
    id: string;    
    isGroup: boolean;   
    lastMessage?: MessageData;
    firstMessageId?: string;
    roomMemberInfos: RoomMemberInfo[];
    groupInfo?: GroupInfo;
}
export interface Room extends Omit<RawRoom, "roomMemberInfos"> {
    currentRoomMemberInfo: RoomMemberInfo;
    otherRoomMemberInfos: RoomMemberInfo[];
    chats?: MessageData[];
    previousLastMessageId?: string;  
    name?: string;
    avatar?: string;
    isFetched?: boolean;
    viewportTop?: number;
}

export interface RoomMemberInfo {  
    roomId: string;
    user: User;
    firstUnseenMessageId?: string;
    unseenMessageCount: number;
    canDisplayRoom: boolean;
    canShowNotification: boolean;
}
export interface Reaction {
    id: string;
    name: string;
    icon: LucideIcon;
}

export interface NoDataHubResponse {
    isSuccess: boolean;
    error: any;
}

export interface HubResponse<T> {
    isSuccess: boolean;
    data: T;
    error?: any;
}

// export interface MessageFormData {
//     content: string;
//     quote?: Quote
// }
