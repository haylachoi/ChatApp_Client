import { REST_SEGMENT } from "@/libs/constant";

const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const pathname = `${REST_SEGMENT.FILE}`
    return fetch(pathname, {
        method: 'POST',
        body: formData,
        // headers: {
        //     "Content-Type": "multipart/form-data",
      
        // }
    });
}

export const fileService = {
    uploadFile
}