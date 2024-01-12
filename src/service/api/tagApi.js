import {POST} from "../../utils/axios.js";

/**
 * 获取标签列表
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function GET_TAG_LIST(data) {
    return POST("/tag/list",data)
}