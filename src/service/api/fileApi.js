import {POST_FILE} from "@/utils/axios.js";
import fileUrl from "../urls/fileUrl.js";



export function UPLOAD_IMAGE(data){
    return POST_FILE(fileUrl.uploadImage,data)
}


