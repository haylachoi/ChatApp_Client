import { REST_SEGMENT } from "@/libs/constant";
import { roomConnection } from "./hubConnection"
import { getAccessToken } from "./authService";

const connection = roomConnection;
const createGroup = async (formData: FormData ) => {
    const pathname = `${REST_SEGMENT.GROUP}`;
    return fetch(pathname, {
        method: 'POST',
        body: formData,
        headers: {
          authorization: `Bearer ${getAccessToken()}`,
        },
      });
}
const removeGroupMember = (roomId: string, userId: string) => {
    return connection.invoke("RemoveGroupMember", roomId, userId);
}

const addGroupMember = async (groupId: string,userId: string) => {
    return connection.invoke("AddGroupMember", groupId, userId);
}
export const groupService = {
    createGroup,
    removeGroupMember,
    addGroupMember
}