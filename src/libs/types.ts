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

export interface MessageData {
    id: string ;
    content: string;
    senderId: string;
    isImage: boolean;
    roomId: string;
    createdAt: string | undefined;
    messageDetails: MessageDetail[]
}
export interface MessageDetail {
    id: string;
    userId: string;
    messageId: string;
    reactionId: string;
    user: User
}

export interface GroupInfo {
    id: string;
    name: string;
    avatar?: string;
    groupOnwerId: string;
}
export interface RawRoom {  
    id: string;
    name: string | undefined;
    isGroup: boolean;
    avatar: string | undefined;
    lastMessageId: string;
    firstMessageId: string;
    roomMemberInfos: RoomMemberInfo[];
    groupInfo: GroupInfo;
}
export interface Room extends Omit<RawRoom, "roomMemberInfos"> {
    currentRoomMemberInfo: RoomMemberInfo;
    otherRoomMemberInfos: RoomMemberInfo[];
    chats?: MessageData[];
    previousLastMessageId?: string;  
   
}

export interface RoomMemberInfo {
    userId: string;
    roomId: string;
    user: User;
    firstUnseenMessageId: string;
    lastUnseenMessageId: string;
    unseenMessageCount: string;
    canDisplayRoom: boolean;
    canShowNotification: boolean;
    lastUnseenMessage: MessageData;
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
    error: any;
}

